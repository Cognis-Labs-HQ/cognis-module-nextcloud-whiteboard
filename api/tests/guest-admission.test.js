import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import {
    createMemoryDb,
    createRouterCapture,
    createJsonResponse,
    registerApiRoutes,
} from "../../tests/reuse/api-runtime.js";
import { testProfileIdentity } from "../../tests/reuse/profile-identity.js";
import { NextcloudWhiteboardStore } from "../store.js";

const base = "/api/v1/modules/nextcloud-whiteboard";

async function fixture() {
    const database = createMemoryDb();
    const store = new NextcloudWhiteboardStore({
        db: database,
        profileIdentity: testProfileIdentity,
    });
    await store.ensureSchema();
    await store.saveConfig({
        serverUrl: "https://whiteboard.example.test",
        apiKey: "synthetic-session-key-at-least-16-chars",
    });
    const board = await store.createWhiteboard({
        title: "Fixture",
        createdBy: "owner",
        participants: [],
    });
    const claims = Object.freeze({
        sub: "share:grant:guest",
        role: "user",
        providerId: "fixture",
        purpose: "share",
        setupPending: false,
    });
    const state = {
        credential: true,
        grant: true,
        write: false,
        guestCalls: 0,
        requests: [],
        revokeAfterAdmission: false,
    };
    const router = createRouterCapture();
    const policies = new Map();
    for (const method of ["get", "post", "put", "delete"]) {
        const register = router[method];
        router[method] = (path, handler, options) => {
            policies.set(`${method.toUpperCase()} ${path}`, options?.access);
            register(path, handler);
        };
    }
    registerApiRoutes(router, {
        getCapability(key) {
            const capabilities = {
                "db:executor": database,
                "social:profile:identity": testProfileIdentity,
                "social:profileStore": {
                    async getProfile() {
                        return { handle: "owner" };
                    },
                },
                "logging:log": () => {},
                "auth:requireAuth": (req, res) => {
                    if (
                        req.session?.purpose === "session" &&
                        !req.session.setupPending
                    )
                        return req.session;
                    res.writeHead(401);
                    res.end(JSON.stringify({ error: "unauthorized" }));
                    return null;
                },
                "share:getGuestClaims": async (req) => {
                    state.guestCalls++;
                    const admitted =
                        req.guest && state.credential && state.grant;
                    if (state.revokeAfterAdmission) state.grant = false;
                    return admitted ? claims : null;
                },
                "share:resolveUserAccess": async (input) => ({
                    authorized:
                        state.accountReadOnly === true &&
                        input.requiredCapability === "whiteboard:read",
                }),
                "share:resolveGuestAccess": async (input) => {
                    state.requests.push(input);
                    if (input.claims.purpose !== "share")
                        return { shareGuest: false, authorized: false };
                    assert.equal(input.claims, claims);
                    return {
                        shareGuest: true,
                        authorized:
                            state.grant &&
                            input.resourceId === board.id &&
                            (input.requiredCapability === "whiteboard:read" ||
                                state.write),
                        username: "guest:guest",
                    };
                },
                "files:namespace": () => ({
                    async get() {
                        return Buffer.from("fixture-image");
                    },
                }),
            };
            return capabilities[key];
        },
    });
    async function request(
        method,
        path,
        { guest = true, session, body = {}, id = board.id } = {},
    ) {
        const response = createJsonResponse();
        if (
            guest &&
            [
                "/whiteboards/session",
                "/whiteboards/presence",
                "/whiteboards/elements",
                "/whiteboards/images",
                "/whiteboards/launch",
            ].includes(path)
        ) {
            assert.equal(
                policies.get(`${method} ${base}${path}`),
                undefined,
                "host session-only policy must not preempt explicit guest admission",
            );
        }
        await router.handler(method, `${base}${path}`)(
            {
                guest,
                session,
                headers: {},
                url: `${base}${path}?id=${id}&pageId=${id}&key=fixture.png`,
                async *[Symbol.asyncIterator]() {
                    yield Buffer.from(
                        JSON.stringify({
                            id,
                            pageId: id,
                            sessionId: "presence",
                            ...body,
                        }),
                    );
                },
            },
            response,
        );
        return response;
    }
    return { board, store, state, request };
}

test("registered resource routes admit verified guests and retain read/write scope", async () => {
    const { request, state } = await fixture();
    assert.equal(
        (await request("GET", "/whiteboards/session")).statusCode,
        200,
    );
    assert.equal(
        (await request("GET", "/whiteboards/presence")).statusCode,
        200,
    );
    assert.equal(
        (await request("POST", "/whiteboards/presence")).statusCode,
        200,
    );
    assert.equal((await request("GET", "/whiteboards/images")).statusCode, 200);
    assert.equal(
        (await request("POST", "/whiteboards/elements")).statusCode,
        403,
    );
    assert.equal(
        (await request("POST", "/whiteboards/images")).statusCode,
        403,
    );
    assert.equal((await request("GET", "/whiteboards/launch")).statusCode, 403);
    state.write = true;
    assert.equal((await request("GET", "/whiteboards/launch")).statusCode, 302);
    assert.ok(state.guestCalls >= 7);
});

test("unrelated resources and revoked grants remain inaccessible", async () => {
    const { request, state, store } = await fixture();
    const other = await store.createWhiteboard({
        title: "Other",
        createdBy: "owner",
        participants: [],
    });
    assert.equal(
        (await request("GET", "/whiteboards/presence", { id: other.id }))
            .statusCode,
        403,
    );
    state.grant = false;
    assert.equal(
        (await request("GET", "/whiteboards/presence")).statusCode,
        401,
    );
    state.grant = true;
    state.credential = false;
    assert.equal(
        (await request("GET", "/whiteboards/presence")).statusCode,
        401,
    );
});

test("ordinary and share-prefixed accounts remain accounts; pending sessions stay denied", async () => {
    const { request } = await fixture();
    for (const sub of ["ordinary-account", "share:ordinary-account"]) {
        const session = {
            sub,
            purpose: "session",
            role: "user",
            setupPending: false,
        };
        assert.equal(
            (
                await request("GET", "/whiteboards/presence", {
                    guest: false,
                    session,
                })
            ).statusCode,
            200,
        );
        assert.equal(
            (
                await request("GET", "/whiteboards/presence", {
                    guest: false,
                    session: { ...session, setupPending: true },
                })
            ).statusCode,
            401,
        );
    }
});

test("guest admission never grants account or management routes", async () => {
    const { request, state } = await fixture();
    for (const [method, path] of [
        ["GET", "/whiteboards"],
        ["POST", "/whiteboards/rename"],
        ["POST", "/whiteboards/spawn"],
        ["GET", "/share"],
        ["POST", "/share"],
        ["PUT", "/config"],
    ]) {
        assert.equal((await request(method, path)).statusCode, 401);
    }
    assert.equal(state.guestCalls, 0);
});

test("grant revocation between admission and authorization cannot fall through to account access", async () => {
    const { request, state } = await fixture();
    state.revokeAfterAdmission = true;
    assert.equal(
        (await request("GET", "/whiteboards/presence")).statusCode,
        403,
    );
});

test("unavailable guest authorization cannot become account membership", async () => {
    const { resolveWhiteboardUserAccess } = await import("../reuse/access.js");
    for (const resolveShareGuestAccess of [
        undefined,
        async () => null,
        async () => {
            throw new Error("fixture-unavailable");
        },
    ]) {
        const result = await resolveWhiteboardUserAccess({
            claims: {
                sub: "share:grant:guest",
                purpose: "share",
                role: "user",
                setupPending: false,
            },
            whiteboardId: "board",
            resolveShareGuestAccess,
            profileStore: {
                getProfile() {
                    assert.fail("guest must not resolve an account profile");
                },
            },
            store: {
                canAccessWhiteboard() {
                    assert.fail("guest must not resolve account membership");
                },
            },
        });
        assert.equal(result.authorized, false);
        assert.equal(result.status, 403);
    }
});

test("session tokens enforce the authorized board write scope", async () => {
    const { request, state } = await fixture();
    const session = {
        sub: "ordinary-account",
        purpose: "session",
        role: "user",
        setupPending: false,
    };
    for (const scenario of [
        { guest: true, write: false, readOnly: true },
        { guest: true, write: true, readOnly: false },
        { guest: false, accountReadOnly: true, readOnly: true },
    ]) {
        state.write = scenario.write;
        state.accountReadOnly = scenario.accountReadOnly;
        const response = await request("GET", "/whiteboards/session", {
            guest: scenario.guest,
            session,
        });
        assert.equal(response.statusCode, 200);
        const data = response.json().data;
        const [header, payload, signature] = data.token.split(".");
        assert.equal(
            signature,
            createHmac("sha256", "synthetic-session-key-at-least-16-chars")
                .update(`${header}.${payload}`)
                .digest("base64url"),
        );
        const claims = JSON.parse(Buffer.from(payload, "base64url"));
        assert.equal(claims.fileId, data.roomId);
        assert.equal(claims.isFileReadOnly, scenario.readOnly);
        assert.equal(data.canWrite, !scenario.readOnly);
    }
});
