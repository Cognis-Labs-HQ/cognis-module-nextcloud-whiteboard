import { publicConfig } from "./config-values.js";
import { registerConfiguredOrigin } from "./access.js";
import { readJson, sendError, sendJson } from "./reuse/http.js";
import { normalizeHttpUrl } from "./reuse/url-parts.js";

export function registerWhiteboardConfigRoutes(
    router,
    { requireAuth, store, registerScriptOrigins, log },
) {
    router.get(
        "/api/v1/modules/nextcloud-whiteboard/config",
        async (req, res) => {
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            await store.ensureSchema();
            sendJson(res, 200, { data: publicConfig(await store.getConfig()) });
        },
        { access: { minRole: "user" }, allowWhenDisabled: true },
    );

    router.put(
        "/api/v1/modules/nextcloud-whiteboard/config",
        async (req, res) => {
            const claims = requireAuth(req, res, "admin");
            if (!claims) return;
            await store.ensureSchema();
            const body = await readJson(req);
            const serverUrl = normalizeHttpUrl(body.serverUrl);
            const existingConfig = await store.getConfig();
            const apiKey =
                String(body.apiKey ?? "").trim() || existingConfig.apiKey;
            const imageUploadMaxBytes = Number(
                body.imageUploadMaxBytes ?? 1048576,
            );
            if (!serverUrl) {
                sendError(
                    res,
                    400,
                    "bad_request",
                    "A valid Whiteboard server URL is required.",
                    { fieldId: "nextcloud-whiteboard-server-url" },
                );
                return;
            }
            if (apiKey && apiKey.length < 16) {
                sendError(
                    res,
                    400,
                    "bad_request",
                    "API key must be at least 16 characters for sufficient security.",
                    { fieldId: "nextcloud-whiteboard-api-key" },
                );
                return;
            }
            const saved = await store.saveConfig({
                serverUrl,
                apiKey,
                imageUploadMaxBytes,
            });
            registerConfiguredOrigin(registerScriptOrigins, saved);
            log?.("info", "Nextcloud Whiteboard configuration updated.", {
                component: "nextcloud-whiteboard-module",
                operation: "save_config",
                hasServerUrl: Boolean(saved.serverUrl),
                hasApiKey: saved.apiKeyConfigured,
                imageUploadMaxBytes: saved.imageUploadMaxBytes,
                updatedBy: claims.sub,
            });
            sendJson(res, 200, { data: publicConfig(saved) });
        },
        { access: { minRole: "admin" }, allowWhenDisabled: true },
    );

    router.delete(
        "/api/v1/modules/nextcloud-whiteboard/config",
        async (req, res) => {
            const claims = requireAuth(req, res, "admin");
            if (!claims) return;
            await store.ensureSchema();
            await store.deleteConfig();
            log?.("info", "Nextcloud Whiteboard configuration deleted.", {
                component: "nextcloud-whiteboard-module",
                operation: "delete_config",
                deletedBy: claims.sub,
            });
            res.writeHead(204);
            res.end();
        },
        { access: { minRole: "admin" }, allowWhenDisabled: true },
    );
}
