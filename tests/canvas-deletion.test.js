import assert from "node:assert/strict";
import test from "node:test";

import { createCanvasDeletionCapability } from "../api/reuse/canvas-deletion.js";
import { NextcloudWhiteboardStore } from "../api/store.js";

function createHarness() {
    const calls = [];
    const logs = [];
    const store = {
        async ensureSchema() {
            calls.push("ensureSchema");
        },
        async getWhiteboardById(id) {
            calls.push("getWhiteboardById");
            return id === "canvas-1"
                ? { id, createdBy: "alice", disposable: false }
                : null;
        },
        async deleteWhiteboard(id) {
            calls.push(["deleteWhiteboard", id]);
        },
        async listParticipants() {
            calls.push("listParticipants");
            return ["alice", "bob"];
        },
    };
    const profileStore = {
        async getProfile(accountId) {
            return {
                handle: accountId.replace(/^account:/, ""),
                visibility: "visible",
            };
        },
    };
    const deleteCanvas = createCanvasDeletionCapability({
        store,
        profileStore,
        profileIdentity: {
            async resolveAccountHandle(accountId) {
                return accountId.replace(/^account:/, "");
            },
        },
        log(level, message, metadata) {
            logs.push({ level, message, metadata });
        },
    });
    return { calls, deleteCanvas, logs, store };
}

test("canvas deletion authorizes the owner and removes the canvas", async () => {
    const harness = createHarness();
    await harness.deleteCanvas({
        actorAccountId: "account:alice",
        whiteboardId: "canvas-1",
    });
    assert.deepEqual(harness.calls, [
        "ensureSchema",
        "getWhiteboardById",
        ["deleteWhiteboard", "canvas-1"],
    ]);
    assert.equal(harness.logs[0].metadata.operation, "delete_canvas");
});

test("canvas deletion rejects non-owners", async () => {
    const harness = createHarness();
    await assert.rejects(
        harness.deleteCanvas({
            actorAccountId: "account:bob",
            whiteboardId: "canvas-1",
        }),
        /Only the whiteboard owner or sole participant can delete the canvas/,
    );
    assert.equal(
        harness.calls.some((call) => Array.isArray(call)),
        false,
    );
});

test("canvas deletion allows a sole participant when ownership is stale", async () => {
    const harness = createHarness();
    harness.store.listParticipants = async () => {
        harness.calls.push("listParticipants");
        return ["bob"];
    };

    await harness.deleteCanvas({
        actorAccountId: "account:bob",
        whiteboardId: "canvas-1",
    });

    assert.deepEqual(harness.calls, [
        "ensureSchema",
        "getWhiteboardById",
        "listParticipants",
        ["deleteWhiteboard", "canvas-1"],
    ]);
});

test("canvas deletion removes dependent records transactionally", async () => {
    const commands = [];
    const executor = {
        async executeCommand(command) {
            commands.push(command);
        },
    };
    const store = new NextcloudWhiteboardStore({
        db: {
            async transaction(callback) {
                await callback(executor);
            },
        },
        profileIdentity: {},
    });
    await store.deleteWhiteboard("canvas-1");
    assert.deepEqual(
        commands.map(({ table }) => table),
        [
            "nextcloud_whiteboard_presence",
            "nextcloud_whiteboard_snapshots",
            "nextcloud_whiteboard_user_copies",
            "nextcloud_whiteboard_access",
            "nextcloud_whiteboards",
        ],
    );
    assert.ok(commands.every(({ option }) => option === "DELETE"));
});

test("canvas deletion capability is published for orchestrators", async () => {
    const source = await import("node:fs/promises").then((fs) =>
        fs.readFile(new URL("../api/index.js", import.meta.url), "utf8"),
    );
    assert.match(
        source,
        /"whiteboard:deleteCanvas",\s*moduleApi\.deleteCanvas/,
    );
});

test("canvas deletion sanitizes and logs storage failures", async () => {
    const harness = createHarness();
    harness.store.deleteWhiteboard = async () => {
        throw new Error("database password=secret");
    };
    await assert.rejects(
        harness.deleteCanvas({
            actorAccountId: "account:alice",
            whiteboardId: "canvas-1",
        }),
        /^Error: Whiteboard canvas could not be deleted\.$/,
    );
    assert.equal(harness.logs[0].message, "Whiteboard canvas deletion failed.");
    assert.doesNotMatch(JSON.stringify(harness.logs), /password|secret/);
});
