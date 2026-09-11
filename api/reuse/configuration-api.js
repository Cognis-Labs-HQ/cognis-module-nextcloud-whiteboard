import { createProfileIdentityCapability, resolveStore } from "../access.js";
import { registerWhiteboardConfigRoutes } from "../config-routes.js";
import {
    createWhiteboardEnableTest,
    registerWhiteboardEnableTestRoute,
} from "../enable-test.js";
import { checkHttpLiveness } from "./http-liveness.js";
import { sendError, sendJson } from "./http.js";

export const WHITEBOARD_LIVENESS_TIMEOUT_MS = 5000;

export function registerWhiteboardConfigurationApi(router, ctx) {
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
    const store = resolveStore(dbExecutor, log, profileIdentity);
    const runEnableTest = createWhiteboardEnableTest({
        store,
        checkHttpLiveness,
        timeoutMs: WHITEBOARD_LIVENESS_TIMEOUT_MS,
    });
    ctx.getCapability("system:ctx")?.contributePublicCapability?.(
        "module:nextcloud-whiteboard:enableTest",
        runEnableTest,
    );
    registerWhiteboardEnableTestRoute({
        router,
        runEnableTest,
        sendError,
        sendJson,
    });
    registerWhiteboardConfigRoutes(router, {
        requireAuth,
        store,
        registerScriptOrigins: ctx.getCapability(
            "auth:registerPageScriptOrigins",
        ),
        log,
    });

    return { store, profileIdentity, log };
}
