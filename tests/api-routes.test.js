import {
    createMemoryDb,
    createRouterCapture,
    createJsonResponse,
    decodeJwtPayload,
    registerApiRoutes,
} from "./reuse/api-runtime.js";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { WHITEBOARD_LIVENESS_TIMEOUT_MS } from "../api/reuse/configuration-api.js";
import { NextcloudWhiteboardStore } from "../api/store.js";

import { issueAccessToken, requireTestAuth } from "./reuse/auth.js";
import { testProfileIdentity } from "./reuse/profile-identity.js";

test("API registration returns its implementation without publishing a facade", () => {
    const privateContributions = [];
    const publicContributions = [];
    const moduleApi = registerApiRoutes(createRouterCapture(), {
        capabilities: {
            contribute(capabilityId, value) {
                privateContributions.push({ capabilityId, value });
            },
        },
        contributePublicCapability(capabilityId, value) {
            publicContributions.push({ capabilityId, value });
        },
        getCapability(key) {
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return createMemoryDb();
            if (key === "social:profile:identity") return testProfileIdentity;
            return undefined;
        },
    });

    assert.equal(typeof moduleApi.fetchBoardData, "function");
    assert.deepEqual(privateContributions, []);
    assert.deepEqual(
        publicContributions.map(({ capabilityId }) => capabilityId),
        ["whiteboard:enableTest"],
    );
    assert.equal(
        moduleApi.getEmbedUrl("canvas-1", {
            instantCanvas: true,
            disposable: true,
        }),
        "/whiteboard?id=canvas-1&instantCanvas=1&disposable=1",
    );
});

test("nextcloud whiteboard config endpoint reads and persists configuration", async () => {
    const db = createMemoryDb();
    const router = createRouterCapture();
    registerApiRoutes(router, {
        getCapability(key) {
            if (key === "social:profile:identity") return testProfileIdentity;
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return db;
            if (key === "logging:log") return () => {};
            return undefined;
        },
    });
    const headers = {
        authorization: `Bearer ${issueAccessToken("alice", "admin", 60)}`,
    };
    const putResponse = createJsonResponse();

    await router.handler("PUT", "/api/v1/modules/nextcloud-whiteboard/config")(
        {
            headers,
            async *[Symbol.asyncIterator]() {
                yield Buffer.from(
                    JSON.stringify({
                        serverUrl: "https://whiteboard.example.test",
                        apiKey: "configuration-secret-at-least-16-chars",
                        imageUploadMaxBytes: 2097152,
                    }),
                );
            },
        },
        putResponse,
    );

    assert.equal(putResponse.statusCode, 200);
    assert.deepEqual(putResponse.json().data, {
        serverUrl: "https://whiteboard.example.test",
        imageUploadMaxBytes: 2097152,
        apiKeyConfigured: true,
        updatedAt: putResponse.json().data.updatedAt,
    });

    const getResponse = createJsonResponse();
    await router.handler("GET", "/api/v1/modules/nextcloud-whiteboard/config")(
        { headers },
        getResponse,
    );

    assert.equal(getResponse.statusCode, 200);
    assert.deepEqual(getResponse.json().data, putResponse.json().data);
    assert.equal(getResponse.json().data.apiKey, undefined);

    const deleteResponse = createJsonResponse();
    await router.handler(
        "DELETE",
        "/api/v1/modules/nextcloud-whiteboard/config",
    )({ headers }, deleteResponse);
    assert.equal(deleteResponse.statusCode, 204);

    const emptyResponse = createJsonResponse();
    await router.handler("GET", "/api/v1/modules/nextcloud-whiteboard/config")(
        { headers },
        emptyResponse,
    );
    assert.equal(emptyResponse.json().data.serverUrl, "");
    assert.equal(emptyResponse.json().data.apiKeyConfigured, false);
});

test("nextcloud whiteboard preflight uses the shared liveness timeout", () => {
    const apiSource = readFileSync(
        new URL("../api/index.js", import.meta.url),
        "utf8",
    );

    assert.equal(WHITEBOARD_LIVENESS_TIMEOUT_MS, 5000);
    assert.match(apiSource, /timeoutMs: WHITEBOARD_LIVENESS_TIMEOUT_MS/);
    assert.doesNotMatch(apiSource, /\bLIVENESS_TIMEOUT_MS\b/);
});

test("nextcloud whiteboard admin listing does not require a profile handle", async () => {
    const db = createMemoryDb();
    const store = new NextcloudWhiteboardStore({
        db,
        profileIdentity: testProfileIdentity,
    });
    await store.ensureSchema();
    const board = await store.createWhiteboard({
        title: "Operations",
        createdBy: "alice",
        participants: ["bob"],
    });
    const router = createRouterCapture();
    registerApiRoutes(router, {
        getCapability(key) {
            if (key === "social:profile:identity") return testProfileIdentity;
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return db;
            if (key === "social:profileStore") {
                return {
                    async getProfile() {
                        return null;
                    },
                };
            }
            if (key === "logging:log") return () => {};
            return undefined;
        },
    });

    const req = {
        url: "/api/v1/modules/nextcloud-whiteboard/whiteboards?scope=all",
        headers: {
            authorization: `Bearer ${issueAccessToken("system:cognis-cli", "admin", 60)}`,
        },
    };
    const res = createJsonResponse();

    await router.handler(
        "GET",
        "/api/v1/modules/nextcloud-whiteboard/whiteboards",
    )(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json().data, [board]);
});

test("nextcloud whiteboard session route works without share capabilities", async () => {
    const db = createMemoryDb();
    const store = new NextcloudWhiteboardStore({
        db,
        profileIdentity: testProfileIdentity,
    });
    await store.ensureSchema();
    await store.saveConfig({
        serverUrl: "https://whiteboard.example.test",
        apiKey: "session-token-secret-at-least-16-chars",
    });
    const board = await store.createWhiteboard({
        title: "Planning",
        createdBy: "alice",
        participants: [],
    });
    const router = createRouterCapture();
    registerApiRoutes(router, {
        getCapability(key) {
            if (key === "social:profile:identity") return testProfileIdentity;
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return db;
            if (key === "social:profileStore") {
                return {
                    async getProfile(accountId) {
                        return { handle: accountId };
                    },
                };
            }
            if (key === "logging:log") return () => {};
            return undefined;
        },
    });

    const token = issueAccessToken("alice", "user", 60);
    const req = {
        url: `/api/v1/modules/nextcloud-whiteboard/whiteboards/session?id=${board.id}`,
        headers: { authorization: `Bearer ${token}` },
    };
    const res = createJsonResponse();

    await router.handler(
        "GET",
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/session",
    )(req, res);

    assert.equal(res.statusCode, 200);
    const body = res.json();
    assert.equal(body.data.roomId, board.id);
    assert.equal(body.data.serverUrl, "https://whiteboard.example.test");
    assert.equal(body.data.canRename, true);
    assert.ok(body.data.token);
});

test("whiteboard canvas load failures are explicit in server logs and responses", async () => {
    const db = createMemoryDb();
    const store = new NextcloudWhiteboardStore({
        db,
        profileIdentity: testProfileIdentity,
    });
    await store.ensureSchema();
    await store.saveConfig({
        serverUrl: "https://whiteboard.example.test",
        apiKey: "session-token-secret-at-least-16-chars",
    });
    const board = await store.createWhiteboard({
        title: "Unavailable canvas",
        createdBy: "alice",
        participants: [],
    });
    const executeCommand = db.executeCommand.bind(db);
    db.executeCommand = async (command) => {
        if (
            command.option === "SELECT" &&
            command.table === "nextcloud_whiteboard_snapshots"
        ) {
            throw new Error("database details must remain private");
        }
        return executeCommand(command);
    };
    const logs = [];
    const router = createRouterCapture();
    registerApiRoutes(router, {
        getCapability(key) {
            if (key === "social:profile:identity") return testProfileIdentity;
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return db;
            if (key === "social:profileStore") {
                return {
                    async getProfile(accountId) {
                        return { handle: accountId };
                    },
                };
            }
            if (key === "logging:log") {
                return (level, message, details) =>
                    logs.push({ level, message, details });
            }
            return undefined;
        },
    });
    const res = createJsonResponse();

    await router.handler(
        "GET",
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/session",
    )(
        {
            url: `/api/v1/modules/nextcloud-whiteboard/whiteboards/session?id=${board.id}`,
            headers: {
                authorization: `Bearer ${issueAccessToken("alice", "user", 60)}`,
            },
        },
        res,
    );

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.json(), {
        error: {
            code: "canvas_load_failed",
            message: "Whiteboard canvas could not be loaded.",
        },
    });
    assert.equal(logs.at(-1)?.level, "error");
    assert.equal(logs.at(-1)?.message, "Whiteboard canvas failed to load.");
    assert.deepEqual(logs.at(-1)?.details, {
        component: "nextcloud-whiteboard-module",
        operation: "load_whiteboard_canvas",
        whiteboardId: board.id,
        username: "alice",
        errorName: "Error",
    });
    assert.doesNotMatch(JSON.stringify(logs), /database details/);
});

test("nextcloud whiteboard rename route allows only the owner", async () => {
    const db = createMemoryDb();
    const store = new NextcloudWhiteboardStore({
        db,
        profileIdentity: testProfileIdentity,
    });
    await store.ensureSchema();
    const board = await store.createWhiteboard({
        title: "Planning",
        createdBy: "alice",
        participants: ["bob"],
    });
    const router = createRouterCapture();
    registerApiRoutes(router, {
        getCapability(key) {
            if (key === "social:profile:identity") return testProfileIdentity;
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return db;
            if (key === "social:profileStore") {
                return {
                    async getProfile(accountId) {
                        return { handle: accountId };
                    },
                };
            }
            if (key === "logging:log") return () => {};
            return undefined;
        },
    });

    const participantRes = createJsonResponse();
    await router.handler(
        "POST",
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/rename",
    )(
        {
            headers: {
                authorization: `Bearer ${issueAccessToken("bob", "user", 60)}`,
            },
            async *[Symbol.asyncIterator]() {
                yield Buffer.from(
                    JSON.stringify({ id: board.id, title: "Bob title" }),
                );
            },
        },
        participantRes,
    );
    assert.equal(participantRes.statusCode, 403);

    const ownerRes = createJsonResponse();
    await router.handler(
        "POST",
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/rename",
    )(
        {
            headers: {
                authorization: `Bearer ${issueAccessToken("alice", "user", 60)}`,
            },
            async *[Symbol.asyncIterator]() {
                yield Buffer.from(
                    JSON.stringify({ id: board.id, title: "Owner title" }),
                );
            },
        },
        ownerRes,
    );
    assert.equal(ownerRes.statusCode, 200);
    assert.equal(ownerRes.json().data.title, "Owner title");
});

test("nextcloud whiteboard presence route handles store failures without server-level 400", async () => {
    const db = {
        async ensureTable() {
            throw new Error("schema unavailable");
        },
        async executeCommand() {
            return { rows: [] };
        },
        async transaction(callback) {
            await callback(db);
        },
    };
    const router = createRouterCapture();
    const logs = [];
    registerApiRoutes(router, {
        getCapability(key) {
            if (key === "social:profile:identity") return testProfileIdentity;
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return db;
            if (key === "social:profileStore") {
                return {
                    async getProfile(accountId) {
                        return { handle: accountId };
                    },
                };
            }
            if (key === "logging:log") {
                return (level, message, details) =>
                    logs.push({ level, message, details });
            }
            return undefined;
        },
    });

    const res = createJsonResponse();
    await router.handler(
        "POST",
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/presence",
    )(
        {
            headers: {
                authorization: `Bearer ${issueAccessToken("alice", "user", 60)}`,
            },
            async *[Symbol.asyncIterator]() {
                yield Buffer.from(
                    JSON.stringify({
                        pageId: "board-1",
                        sessionId: "session-1",
                        active: true,
                    }),
                );
            },
        },
        res,
    );

    assert.equal(res.statusCode, 503);
    assert.equal(res.json().error.code, "presence_unavailable");
    assert.ok(
        logs.some((entry) => entry.details?.operation === "upsert_presence"),
    );
});

test("nextcloud whiteboard elements persist through session reload", async () => {
    const db = createMemoryDb();
    const store = new NextcloudWhiteboardStore({
        db,
        profileIdentity: testProfileIdentity,
    });
    await store.ensureSchema();
    await store.saveConfig({
        serverUrl: "https://whiteboard.example.test",
        apiKey: "session-token-secret-at-least-16-chars",
    });
    const board = await store.createWhiteboard({
        title: "Planning",
        createdBy: "alice",
        participants: [],
    });
    const router = createRouterCapture();
    registerApiRoutes(router, {
        getCapability(key) {
            if (key === "social:profile:identity") return testProfileIdentity;
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return db;
            if (key === "social:profileStore") {
                return {
                    async getProfile(accountId) {
                        return { handle: accountId };
                    },
                };
            }
            if (key === "logging:log") return () => {};
            return undefined;
        },
    });
    const token = issueAccessToken("alice", "user", 60);
    const elements = [
        {
            id: "shape-1",
            type: "rectangle",
            x: 20,
            y: 30,
            width: 40,
            height: 50,
        },
    ];
    const saveReq = {
        url: "/api/v1/modules/nextcloud-whiteboard/whiteboards/elements",
        headers: { authorization: `Bearer ${token}` },
        async *[Symbol.asyncIterator]() {
            yield Buffer.from(JSON.stringify({ id: board.id, elements }));
        },
    };
    const saveRes = createJsonResponse();
    await router.handler(
        "POST",
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/elements",
    )(saveReq, saveRes);
    assert.equal(saveRes.statusCode, 200);
    const secondSaveRes = createJsonResponse();
    await router.handler(
        "POST",
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/elements",
    )(saveReq, secondSaveRes);
    assert.equal(secondSaveRes.statusCode, 200);

    const sessionReq = {
        url: `/api/v1/modules/nextcloud-whiteboard/whiteboards/session?id=${board.id}`,
        headers: { authorization: `Bearer ${token}` },
    };
    const sessionRes = createJsonResponse();
    await router.handler(
        "GET",
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/session",
    )(sessionReq, sessionRes);

    assert.equal(sessionRes.statusCode, 200);
    assert.deepEqual(sessionRes.json().data.elements, elements);
});

test("saved shared canvases reopen from one synchronized snapshot", async () => {
    const db = createMemoryDb();
    const store = new NextcloudWhiteboardStore({
        db,
        profileIdentity: testProfileIdentity,
    });
    await store.ensureSchema();
    await store.saveConfig({
        serverUrl: "https://whiteboard.example.test",
        apiKey: "session-token-secret-at-least-16-chars",
    });
    const board = await store.createWhiteboard({
        title: "Meeting notes",
        createdBy: "alice",
        participants: ["bob"],
        disposable: true,
    });
    const router = createRouterCapture();
    registerApiRoutes(router, {
        getCapability(key) {
            if (key === "social:profile:identity") return testProfileIdentity;
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return db;
            if (key === "social:profileStore") {
                return {
                    async getProfile(accountId) {
                        return { handle: accountId };
                    },
                };
            }
            if (key === "logging:log") return () => {};
            return undefined;
        },
    });
    const aliceToken = issueAccessToken("alice", "user", 60);
    const bobToken = issueAccessToken("bob", "user", 60);
    const aliceElements = [{ id: "alice-shape", version: 1 }];
    const bobElements = [{ id: "bob-shape", version: 1 }];
    const sharedElements = [
        { id: "alice-shape", version: 1 },
        { id: "bob-shape", version: 1 },
    ];
    const save = async (token, elements) => {
        const response = createJsonResponse();
        await router.handler(
            "POST",
            "/api/v1/modules/nextcloud-whiteboard/whiteboards/elements",
        )(
            {
                url: "/api/v1/modules/nextcloud-whiteboard/whiteboards/elements",
                headers: { authorization: `Bearer ${token}` },
                async *[Symbol.asyncIterator]() {
                    yield Buffer.from(
                        JSON.stringify({
                            id: board.id,
                            elements,
                            explicitSave: true,
                        }),
                    );
                },
            },
            response,
        );
        assert.equal(response.statusCode, 200);
    };
    const open = async (token) => {
        const response = createJsonResponse();
        await router.handler(
            "GET",
            "/api/v1/modules/nextcloud-whiteboard/whiteboards/session",
        )(
            {
                url: `/api/v1/modules/nextcloud-whiteboard/whiteboards/session?id=${board.id}`,
                headers: { authorization: `Bearer ${token}` },
            },
            response,
        );
        assert.equal(response.statusCode, 200);
        return response.json().data;
    };

    await save(aliceToken, aliceElements);
    await save(bobToken, bobElements);

    assert.deepEqual((await open(aliceToken)).elements, sharedElements);
    assert.deepEqual((await open(bobToken)).elements, sharedElements);
    assert.deepEqual(
        await store.getUserCopy(board.id, "alice"),
        sharedElements,
    );
    assert.deepEqual(await store.getUserCopy(board.id, "bob"), sharedElements);
});

test("nextcloud whiteboard reuses its registered file namespace after re-enablement", () => {
    const db = createMemoryDb();
    let namespaceRegistered = false;
    let registrationCount = 0;
    const namespaceClient = {};
    const capabilities = {
        "auth:requireAuth": requireTestAuth,
        "db:executor": db,
        "files:registerNamespace": () => {
            if (namespaceRegistered) throw new Error("duplicate namespace");
            namespaceRegistered = true;
            registrationCount += 1;
        },
        "files:namespace": () => {
            if (!namespaceRegistered) throw new Error("namespace unavailable");
            return namespaceClient;
        },
        "social:profile:identity": testProfileIdentity,
    };
    const createContext = () => ({
        getCapability(key) {
            return capabilities[key];
        },
    });

    registerApiRoutes(createRouterCapture(), createContext());
    registerApiRoutes(createRouterCapture(), createContext());

    assert.equal(registrationCount, 1);
});
