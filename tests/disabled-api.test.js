import assert from "node:assert/strict";
import test from "node:test";
import { registerDisabledApiRoutes } from "../api/disabled.js";

test("disabled lifecycle registers only pre-enablement routes", () => {
    const routes = [];
    const router = Object.fromEntries(
        ["get", "post", "put", "delete"].map((method) => [
            method,
            (path, _handler, options) => routes.push({ method, path, options }),
        ]),
    );
    const requestedCapabilities = [];
    const db = {};
    const systemCtx = { contributePublicCapability() {} };

    registerDisabledApiRoutes({
        router,
        getCapability(capability) {
            requestedCapabilities.push(capability);
            if (capability === "db:executor") return db;
            if (capability === "auth:requireAuth") return () => null;
            if (capability === "logging:log") return () => {};
            if (capability === "system:ctx") return systemCtx;
            return undefined;
        },
    });

    assert.deepEqual(
        routes.map(({ method, path }) => `${method.toUpperCase()} ${path}`),
        [
            "POST /api/v1/modules/nextcloud-whiteboard/admin/enable-test",
            "GET /api/v1/modules/nextcloud-whiteboard/config",
            "PUT /api/v1/modules/nextcloud-whiteboard/config",
            "DELETE /api/v1/modules/nextcloud-whiteboard/config",
        ],
    );
    assert.ok(routes.every(({ options }) => options.allowWhenDisabled));
    assert.equal(requestedCapabilities.includes("files:namespace"), false);
    assert.equal(requestedCapabilities.includes("share:listByResource"), false);
});
