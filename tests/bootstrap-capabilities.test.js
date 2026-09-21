import assert from "node:assert/strict";
import test from "node:test";

import { bootstrapModule } from "../bootstrap.js";
import { testProfileIdentity } from "./reuse/profile-identity.js";

function createRuntime({ conflictingCapabilityId } = {}) {
    const capabilities = new Map([
        ["auth:requireAuth", () => null],
        ["db:executor", {}],
        ["social:profile:identity", testProfileIdentity],
    ]);
    const events = [];
    const publicCapabilities = new Map();
    const registerRoute = () => {};
    const registerUi = () => events.push("ui");
    const ctx = {
        moduleRoot: "/modules/nextcloud-whiteboard",
        contributePublicCapability(capabilityId, value) {
            if (capabilityId === conflictingCapabilityId) {
                throw new Error("module_capability_conflict");
            }
            events.push(capabilityId);
            capabilities.set(capabilityId, value);
            publicCapabilities.set(capabilityId, value);
        },
        getCapability(capabilityId) {
            return capabilities.get(capabilityId);
        },
        flow: { exists: () => false },
        router: {
            delete: registerRoute,
            get: registerRoute,
            post: registerRoute,
            put: registerRoute,
        },
        registerAdminSection: registerUi,
        registerCapabilityProvider: registerUi,
        registerNavbarPlugin: registerUi,
        registerSpaRoute: registerUi,
        registerStaticDir: registerUi,
    };
    return { ctx, events, publicCapabilities };
}

test("bootstrap verifies Jitsi contracts before exposing the UI", () => {
    const runtime = createRuntime();

    bootstrapModule(runtime.ctx);

    assert.equal(
        typeof runtime.publicCapabilities.get("whiteboard:fetchBoardData"),
        "function",
    );
    assert.equal(
        typeof runtime.publicCapabilities.get("whiteboard:membership")?.add,
        "function",
    );
    assert.ok(
        runtime.events.indexOf("whiteboard:fetchBoardData") <
            runtime.events.indexOf("ui"),
    );
});

test("bootstrap withholds UI when a server capability conflicts", () => {
    const runtime = createRuntime({
        conflictingCapabilityId: "whiteboard:fetchBoardData",
    });

    assert.throws(
        () => bootstrapModule(runtime.ctx),
        /module_capability_conflict/,
    );
    assert.equal(runtime.events.includes("ui"), false);
});
