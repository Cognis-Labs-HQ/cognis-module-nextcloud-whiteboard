import assert from "node:assert/strict";
import test from "node:test";

import { bootstrapModule } from "../bootstrap.js";
import { testProfileIdentity } from "./reuse/profile-identity.js";

test("bootstrap exposes the initialized API through the Jitsi contracts", () => {
    const capabilities = new Map([
        ["auth:requireAuth", () => null],
        ["db:executor", {}],
        ["social:profile:identity", testProfileIdentity],
    ]);
    const publicCapabilities = new Map();
    const registerRoute = () => {};
    const ctx = {
        moduleRoot: "/modules/nextcloud-whiteboard",
        capabilities: {
            contribute(capabilityId, value) {
                capabilities.set(capabilityId, value);
            },
        },
        contributePublicCapability(capabilityId, value) {
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
        registerAdminSection() {},
        registerCapabilityProvider() {},
        registerNavbarPlugin() {},
        registerSpaRoute() {},
        registerStaticDir() {},
    };

    bootstrapModule(ctx);

    const moduleApi = capabilities.get("nextcloud-whiteboard:api");
    assert.ok(moduleApi);
    assert.equal(
        publicCapabilities.get("whiteboard:fetchBoardData"),
        moduleApi.fetchBoardData,
    );
    assert.equal(
        publicCapabilities.get("whiteboard:membership"),
        moduleApi.membership,
    );
});
