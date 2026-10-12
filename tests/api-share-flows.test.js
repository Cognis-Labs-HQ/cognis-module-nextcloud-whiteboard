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
