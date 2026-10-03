import assert from "node:assert/strict";
import test from "node:test";
import { registerApiRoutes } from "../api/index.js";
import { registerWhiteboardConfigurationApi } from "../api/reuse/configuration-api.js";
import { registerWhiteboardShareFlowHooks } from "../api/share-hooks.js";
import { testProfileIdentity } from "./reuse/profile-identity.js";

function createRouter() {
    return {
        delete() {},
        get() {},
        post() {},
        put() {},
    };
}

function createShareHookOptions(flow, installedFlowIds) {
    return {
        ctx: { flow },
        store: {},
        profileStore: undefined,
        resolveWhiteboardUserAccess: async () => ({ authorized: false }),
        resolveShareGuestId: () => "",
        whiteboardStylesheets: [],
        installedFlowIds,
    };
}

test("share hooks install late flows without duplicating existing hooks", () => {
    const availableFlows = new Set(["mint-share-token", "resolve-share-token"]);
    const extensions = [];
    const flow = {
        exists(flowId) {
            return availableFlows.has(flowId);
        },
        extend(flowId, stageId, options) {
            extensions.push({ flowId, stageId, hookId: options.id });
        },
    };
    const installedFlowIds = new Set();
    const options = createShareHookOptions(flow, installedFlowIds);

    registerWhiteboardShareFlowHooks(options);
    registerWhiteboardShareFlowHooks(options);
    availableFlows.add("construct-share-page");
    availableFlows.add("revoke-share-token");
    registerWhiteboardShareFlowHooks(options);

    assert.equal(
        extensions.filter(({ flowId }) => flowId === "mint-share-token").length,
        2,
    );
    assert.equal(
        extensions.filter(({ flowId }) => flowId === "resolve-share-token")
            .length,
        2,
    );
    assert.equal(
        extensions.filter(({ flowId }) => flowId === "construct-share-page")
            .length,
        1,
    );
    assert.equal(
        extensions.filter(({ flowId }) => flowId === "revoke-share-token")
            .length,
        1,
    );
});

test("runtime initialization retries after namespace setup fails", () => {
    let namespaceRegistered = false;
    let registrationAttempts = 0;
    const extensions = [];
    const ctx = {
        flow: {
            exists(flowId) {
                return ["mint-share-token", "resolve-share-token"].includes(
                    flowId,
                );
            },
            extend(flowId, stageId, options) {
                extensions.push({ flowId, stageId, hookId: options.id });
            },
        },
        getCapability(capabilityId) {
            if (capabilityId === "db:executor") return {};
            if (capabilityId === "social:profile:identity")
                return testProfileIdentity;
            if (capabilityId === "files:registerNamespace") {
                return () => {
                    registrationAttempts += 1;
                    if (registrationAttempts === 1)
                        throw new Error("namespace setup failed");
                    namespaceRegistered = true;
                };
            }
            if (capabilityId === "files:namespace") {
                return () => {
                    if (!namespaceRegistered)
                        throw new Error("namespace unavailable");
                    return {};
                };
            }
            return undefined;
        },
    };

    assert.throws(
        () => registerApiRoutes(createRouter(), ctx),
        /namespace setup failed/,
    );
    registerApiRoutes(createRouter(), ctx);

    assert.equal(registrationAttempts, 2);
    assert.equal(extensions.length, 4);
});

test("capability registration failures are logged with safe context", () => {
    const logs = [];
    const registrationError = new Error("sensitive registration details");
    const ctx = {
        contributePublicCapability() {
            throw registrationError;
        },
        getCapability(capabilityId) {
            if (capabilityId === "db:executor") return {};
            if (capabilityId === "logging:log") {
                return (level, message, metadata) =>
                    logs.push({ level, message, metadata });
            }
            if (capabilityId === "social:profile:identity")
                return testProfileIdentity;
            return undefined;
        },
    };

    assert.throws(
        () => registerWhiteboardConfigurationApi(createRouter(), ctx),
        (error) => error === registrationError,
    );
    assert.deepEqual(logs, [
        {
            level: "error",
            message: "Whiteboard capability registration failed.",
            metadata: {
                component: "nextcloud-whiteboard-module",
                operation: "register_public_capability",
                capabilityId: "whiteboard:enableTest",
            },
        },
    ]);
});
