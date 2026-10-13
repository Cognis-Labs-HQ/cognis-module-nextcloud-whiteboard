import { createOriginRegistrar } from "./origin-registration.js";
import { registerWhiteboardActions } from "./action-store.js";
import { createProfileIdentityCapability, resolveStore } from "./access.js";
import { registerWhiteboardConfigRoutes } from "../routes/config/index.js";
import {
    createWhiteboardEnableTest,
    registerWhiteboardEnableTestRoute,
} from "../configuration/test.js";
import { checkHttpLiveness } from "./http-liveness.js";
import { sendError, sendJson } from "./http.js";

export const WHITEBOARD_LIVENESS_TIMEOUT_MS = 5000;

export function registerWhiteboardConfigurationApi(
    router,
    ctx,
    { enabled = false } = {},
) {
    const dbExecutor = ctx.getCapability("db:executor");
    if (!dbExecutor) {
        const unavailablePayload = (res) =>
            sendError(
                res,
                503,
                "service_unavailable",
                "Nextcloud Whiteboard dependencies are unavailable.",
            );

        for (const method of ["get", "put", "delete"]) {
            router[method](
                "/api/v1/modules/nextcloud-whiteboard/config",
                async (_req, res) => unavailablePayload(res),
                { access: { minRole: "admin" }, allowWhenDisabled: true },
            );
        }
        return null;
    }

    const requireAuth = ctx.getCapability("auth:requireAuth");
    const log = ctx.getCapability("logging:log");
    const profileIdentity = createProfileIdentityCapability(ctx);
    const rawStore = resolveStore(dbExecutor, log, profileIdentity);
    const store = enabled ? registerWhiteboardActions(ctx, rawStore) : rawStore;
    const runEnableTest = createWhiteboardEnableTest({
        store,
        checkHttpLiveness,
        timeoutMs: WHITEBOARD_LIVENESS_TIMEOUT_MS,
    });
    try {
        if (enabled)
            ctx.contributePublicCapability?.(
                "whiteboard:enableTest",
                runEnableTest,
            );
    } catch (error) {
        log?.("error", "Whiteboard capability registration failed.", {
            component: "nextcloud-whiteboard-module",
            operation: "register_public_capability",
            capabilityId: "whiteboard:enableTest",
        });
        throw error;
    }
    registerWhiteboardEnableTestRoute({
        router,
        runEnableTest,
        sendError,
        sendJson,
    });
    const registerScriptOrigins = createOriginRegistrar(ctx);
    registerWhiteboardConfigRoutes(router, {
        requireAuth,
        store,
        registerScriptOrigins,
        log,
    });

    return { store, profileIdentity, log, registerScriptOrigins };
}
