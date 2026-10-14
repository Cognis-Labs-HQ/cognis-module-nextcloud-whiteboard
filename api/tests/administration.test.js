import assert from "node:assert/strict";
import test from "node:test";
import { Readable } from "node:stream";
import { registerAdminCanvasRoutes } from "../routes/administration/index.js";

function fixture() {
    const handlers = new Map();
    let authorized = false;
    const calls = [];
    registerAdminCanvasRoutes(
        {
            get: (path, handler, options) => {
                assert.equal(options.access.minRole, "admin");
                handlers.set(path, handler);
            },
            post: (path, handler, options) => {
                assert.equal(options.access.minRole, "admin");
                handlers.set(path, handler);
            },
        },
        {
            requireAuth: () => (authorized ? { sub: "admin" } : null),
            store: {
                listWhiteboards: async () => {
                    calls.push("list");
                    return [
                        {
                            id: "board",
                            title: "Canvas",
                            createdBy: "owner",
                            sourceType: "meeting",
                            sourceId: "meeting",
                            accessToken: "secret",
                        },
                    ];
                },
                listPresence: async () => [
                    { username: "owner", active: true, lastSeenAt: new Date() },
                    {
                        username: "departed",
                        active: false,
                        lastSeenAt: new Date(),
                    },
                ],
                listParticipants: async () => ["owner"],
                getWhiteboardById: async () => ({
                    id: "board",
                    createdBy: "owner",
                }),
                deleteWhiteboard: async (id) => calls.push(["delete", id]),
            },
            profileStore: {
                getProfileByHandle: async () => ({ accountId: "owner-id" }),
            },
            deleteCanvasRecords: async (id) => {
                calls.push(["shares", id]);
                calls.push(["delete", id]);
            },
            log() {},
        },
    );
    const response = {
        status: 0,
        body: null,
        writeHead(status) {
            this.status = status;
        },
        end(body) {
            this.body = JSON.parse(body);
        },
    };
    return {
        handlers,
        calls,
        response,
        authorize: () => {
            authorized = true;
        },
    };
}

test("canvas administration authenticates before reads and hides access tokens", async () => {
    const harness = fixture();
    const list = harness.handlers.get(
        "/api/v1/modules/nextcloud-whiteboard/admin/canvases",
    );
    await list({}, harness.response);
    assert.deepEqual(harness.calls, []);
    harness.authorize();
    await list({}, harness.response);
    assert.equal(harness.response.body.data[0].accessToken, undefined);
    assert.deepEqual(harness.response.body.data[0].activeUsers, ["owner"]);
    assert.deepEqual(harness.response.body.data[0].issues, []);
});

test("administrator deletion revokes canvas shares before removing saved canvas data", async () => {
    const harness = fixture();
    harness.authorize();
    await harness.handlers.get(
        "/api/v1/modules/nextcloud-whiteboard/admin/canvases/delete",
    )(
        Readable.from([JSON.stringify({ whiteboardId: "board" })]),
        harness.response,
    );
    assert.equal(harness.response.status, 200);
    assert.equal(harness.calls[0][0], "shares");
    assert.deepEqual(harness.calls[1], ["delete", "board"]);
});

test("malformed canvas deletion JSON returns a stable client error without deleting data", async () => {
    const harness = fixture();
    harness.authorize();
    await harness.handlers.get(
        "/api/v1/modules/nextcloud-whiteboard/admin/canvases/delete",
    )(Readable.from(["{invalid"]), harness.response);
    assert.equal(harness.response.status, 400);
    assert.equal(harness.response.body.error.code, "invalid_json");
    assert.deepEqual(harness.calls, []);
});
