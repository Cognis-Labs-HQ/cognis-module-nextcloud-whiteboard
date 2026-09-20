import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { registerApiRoutes } from "../api/index.js";
import { WHITEBOARD_LIVENESS_TIMEOUT_MS } from "../api/reuse/configuration-api.js";
import { NextcloudWhiteboardStore } from "../api/store.js";

import { issueAccessToken, requireTestAuth } from "./reuse/auth.js";
import { testProfileIdentity } from "./reuse/profile-identity.js";

function createMemoryDb() {
    const tables = new Map();
    const primaryKeys = new Map();
    const applyWhere = (rows, where = []) =>
        rows.filter((row) =>
            where.every((clause) => row[clause.column] === clause.value),
        );
    const db = {
        async ensureTable(definition) {
            if (!tables.has(definition.name)) tables.set(definition.name, []);
            const explicitPrimaryKey = Array.isArray(definition.primaryKey)
                ? definition.primaryKey
                : [];
            const columnPrimaryKey = (definition.columns ?? [])
                .filter((column) => column.primaryKey)
                .map((column) => column.name);
            primaryKeys.set(definition.name, [
                ...explicitPrimaryKey,
                ...columnPrimaryKey,
            ]);
        },
        async executeCommand(command) {
            const rows = tables.get(command.table) ?? [];
            if (command.option === "SELECT") {
                const selected = applyWhere(rows, command.where).slice(
                    0,
                    command.limit ?? rows.length,
                );
                return { rows: selected.map((row) => ({ ...row })) };
            }
            if (command.option === "UPDATE") {
                const selected = applyWhere(rows, command.where);
                for (const row of selected)
                    Object.assign(row, command.set ?? command.values);
                return { rows: [] };
            }
            if (command.option === "INSERT") {
                const values = { ...command.values };
                const conflictColumns =
                    command.conflict?.target ??
                    command.onConflict?.columns ??
                    [];
                const existing = rows.find(
                    (row) =>
                        conflictColumns.length > 0 &&
                        conflictColumns.every(
                            (column) => row[column] === values[column],
                        ),
                );
                if (existing && command.conflict?.action === "update") {
                    Object.assign(existing, command.conflict.update ?? values);
                } else if (existing && command.onConflict) {
                    for (const column of command.onConflict.merge ?? []) {
                        existing[column] = values[column];
                    }
                } else {
                    const primaryKey = primaryKeys.get(command.table) ?? [];
                    const duplicatePrimary = rows.some(
                        (row) =>
                            primaryKey.length > 0 &&
                            primaryKey.every(
                                (column) => row[column] === values[column],
                            ),
                    );
                    if (duplicatePrimary)
                        throw new Error("duplicate key value");
                    rows.push(values);
                }
                tables.set(command.table, rows);
                return { rows: [] };
            }
            if (command.option === "DELETE") {
                tables.set(
                    command.table,
                    command.where
                        ? rows.filter(
                              (row) => !applyWhere([row], command.where).length,
                          )
                        : [],
                );
                return { rows: [] };
            }
            return { rows: [] };
        },
        async transaction(callback) {
            await callback(db);
        },
    };
    return db;
}

function createRouterCapture() {
    const routes = new Map();
    return {
        get(path, handler) {
            routes.set(`GET ${path}`, handler);
        },
        post(path, handler) {
            routes.set(`POST ${path}`, handler);
        },
        put(path, handler) {
            routes.set(`PUT ${path}`, handler);
        },
        delete(path, handler) {
            routes.set(`DELETE ${path}`, handler);
        },
        handler(method, path) {
            const handler = routes.get(`${method} ${path}`);
            assert.ok(handler, `${method} ${path} should be registered`);
            return handler;
        },
    };
}

test("API registration returns its implementation without publishing a private facade", () => {
    const contributions = [];
    const moduleApi = registerApiRoutes(createRouterCapture(), {
        capabilities: {
            contribute(capabilityId, value) {
                contributions.push({ capabilityId, value });
            },
        },
        getCapability(key) {
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return createMemoryDb();
            if (key === "social:profile:identity") return testProfileIdentity;
            return undefined;
        },
    });

    assert.equal(typeof moduleApi.fetchBoardData, "function");
    assert.deepEqual(
        contributions.map(({ capabilityId }) => capabilityId),
        [
            "whiteboard:enableTest",
            "whiteboard:deleteCanvas",
            "whiteboard:spawnWhiteboardWindow",
            "whiteboard:getEmbedUrl",
            "whiteboard:fetchBoardData",
            "whiteboard:membership",
        ],
    );
    assert.equal(
        contributions.find(
            ({ capabilityId }) => capabilityId === "whiteboard:fetchBoardData",
        )?.value,
        moduleApi.fetchBoardData,
    );
    assert.equal(
        contributions.find(
            ({ capabilityId }) => capabilityId === "whiteboard:membership",
        )?.value,
        moduleApi.membership,
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

function decodeJwtPayload(token) {
    const payload = String(token ?? "").split(".")[1] ?? "";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
}

function createJsonResponse() {
    return {
        statusCode: 0,
        payload: "",
        headers: {},
        writeHead(statusCode, headers = {}) {
            this.statusCode = statusCode;
            this.headers = headers;
        },
        end(payload = "") {
            this.payload = String(payload);
        },
        json() {
            return JSON.parse(this.payload);
        },
    };
}

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

test("nextcloud whiteboard registers share hooks on its scoped ctx flow", () => {
    const db = createMemoryDb();
    const router = createRouterCapture();
    const extensions = [];
    const systemCtx = {
        flow: {
            exists(name) {
                return [
                    "mint-share-token",
                    "resolve-share-token",
                    "construct-share-page",
                    "revoke-share-token",
                ].includes(name);
            },
            extend(flowName, stageName, options, handler) {
                extensions.push({
                    flowName,
                    stageName,
                    id: options.id,
                    handler,
                });
            },
        },
    };

    registerApiRoutes(router, {
        flow: systemCtx.flow,
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
            if (key === "system:ctx") return systemCtx;
            return undefined;
        },
    });

    assert.ok(
        extensions.some(
            (item) =>
                item.flowName === "mint-share-token" &&
                item.stageName === "validate-resource" &&
                item.id === "nextcloud-whiteboard:validate-share-resource",
        ),
    );
    assert.ok(
        extensions.some(
            (item) =>
                item.flowName === "revoke-share-token" &&
                item.stageName === "authorize-revocation" &&
                item.id === "nextcloud-whiteboard:authorize-share-revocation",
        ),
    );

    const authorizeHook = extensions.find(
        (item) => item.id === "nextcloud-whiteboard:authorize-share-minter",
    );
    assert.ok(authorizeHook?.handler);
    const authorization = authorizeHook.handler({
        stageResults: {
            "validate-resource": [
                { valid: false, reason: "unsupported_resource_type" },
                {
                    valid: true,
                    resourceType: "whiteboard",
                    resourceId: "board-1",
                    ownerAccountId: "alice",
                },
            ],
        },
    });
    assert.deepEqual(authorization, {
        authorized: true,
        ownerAccountId: "alice",
    });
});

test("nextcloud whiteboard registers scoped share hooks only once", () => {
    const db = createMemoryDb();
    const router = createRouterCapture();
    const extensions = [];
    const flow = {
        exists(name) {
            return ["mint-share-token", "resolve-share-token"].includes(name);
        },
        extend(flowName, stageName, options) {
            extensions.push({ flowName, stageName, id: options.id });
        },
    };
    const ctx = {
        flow,
        getCapability(key) {
            if (key === "social:profile:identity") return testProfileIdentity;
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return db;
            return undefined;
        },
    };

    registerApiRoutes(router, ctx);
    const initialExtensionCount = extensions.length;
    registerApiRoutes(createRouterCapture(), ctx);

    assert.ok(initialExtensionCount > 0);
    assert.equal(extensions.length, initialExtensionCount);
});

test("nextcloud whiteboard share hooks reject share guests managing links", async () => {
    const db = createMemoryDb();
    const store = new NextcloudWhiteboardStore({
        db,
        profileIdentity: testProfileIdentity,
    });
    await store.ensureSchema();
    const board = await store.createWhiteboard({
        title: "Planning",
        createdBy: "alice",
        participants: [],
    });
    const extensions = [];
    const systemCtx = {
        flow: {
            exists(name) {
                return [
                    "mint-share-token",
                    "resolve-share-token",
                    "revoke-share-token",
                ].includes(name);
            },
            extend(flowName, stageName, options, handler) {
                extensions.push({
                    flowName,
                    stageName,
                    id: options.id,
                    handler,
                });
            },
        },
    };

    registerApiRoutes(createRouterCapture(), {
        flow: systemCtx.flow,
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
            if (key === "system:ctx") return systemCtx;
            if (key === "share:resolveGuestId") {
                return (claims) =>
                    String(claims?.sub ?? "").startsWith("share:")
                        ? "share-1"
                        : "";
            }
            return undefined;
        },
    });

    const validateHook = extensions.find(
        (item) => item.id === "nextcloud-whiteboard:validate-share-resource",
    );
    const revokeHook = extensions.find(
        (item) => item.id === "nextcloud-whiteboard:authorize-share-revocation",
    );
    assert.ok(validateHook?.handler);
    assert.ok(revokeHook?.handler);

    assert.deepEqual(
        await validateHook.handler({
            input: {
                resourceType: "whiteboard",
                resourceId: board.id,
                claims: { sub: "share:share-1:guest-1" },
            },
        }),
        { valid: false, reason: "account_owner_required" },
    );
    assert.deepEqual(
        await revokeHook.handler({
            input: {
                resourceType: "whiteboard",
                resourceId: board.id,
                shareId: "share-1",
                claims: { sub: "share:share-1:guest-1" },
            },
        }),
        { authorized: false, reason: "account_owner_required" },
    );
});

test("nextcloud whiteboard share hooks preserve direct participant sessions without reusing minter sessions", async () => {
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
    const extensions = [];
    const systemCtx = {
        flow: {
            exists(name) {
                return ["mint-share-token", "resolve-share-token"].includes(
                    name,
                );
            },
            extend(flowName, stageName, options, handler) {
                extensions.push({
                    flowName,
                    stageName,
                    id: options.id,
                    handler,
                });
            },
        },
    };

    registerApiRoutes(createRouterCapture(), {
        flow: systemCtx.flow,
        getCapability(key) {
            if (key === "social:profile:identity") return testProfileIdentity;
            if (key === "auth:requireAuth") return requireTestAuth;
            if (key === "db:executor") return db;
            if (key === "social:profileStore") {
                return {
                    async getProfile(accountId) {
                        const handles = {
                            "alice-account": "alice",
                            "bob-account": "bob",
                            "carol-account": "carol",
                        };
                        return { handle: handles[accountId] ?? accountId };
                    },
                };
            }
            if (key === "system:ctx") return systemCtx;
            return undefined;
        },
    });

    const checkHook = extensions.find(
        (item) => item.id === "nextcloud-whiteboard:check-share-access",
    );
    assert.ok(checkHook?.handler);
    const stageResults = {
        "validate-token": [
            {
                valid: true,
                tokenRecord: { ownerAccountId: "alice-account" },
            },
        ],
        "resolve-resource": [
            {
                resolved: true,
                resourceType: "whiteboard",
                resourceId: board.id,
            },
        ],
    };

    assert.deepEqual(
        await checkHook.handler({
            input: { requesterClaims: { sub: "alice-account" } },
            stageResults,
        }),
        { allowed: true },
    );
    assert.deepEqual(
        await checkHook.handler({
            input: { requesterClaims: { sub: "bob-account" } },
            stageResults,
        }),
        { allowed: true, directAccess: true },
    );
    assert.deepEqual(
        await checkHook.handler({
            input: { requesterClaims: { sub: "carol-account" } },
            stageResults,
        }),
        { allowed: true },
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
