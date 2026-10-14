import { hasMinRole, readJson, sendError, sendJson } from "../../reuse/http.js";
import { getFirstStageResult } from "../../reuse/flow-helpers.js";
import { checkHttpLiveness } from "../../reuse/http-liveness.js";
import { resolveExpiry } from "../../configuration/values.js";
import { resolveResourceCanvas } from "../../canvas/resource.js";
import { loadCanvasElements } from "../../canvas/loader.js";
import { registerWhiteboardImageRoutes } from "../image/index.js";
import {
    buildCognisWhiteboardUrl,
    resolveParticipantHandles,
    resolveRequesterUsername,
} from "../../reuse/access.js";
import { WHITEBOARD_LIVENESS_TIMEOUT_MS } from "../../configuration/index.js";

const PRESENCE_ACTIVE_WINDOW_MS = 15_000;

export function registerBoardRoutes(
    router,
    {
        requireAuth,
        store,
        profileStore,
        profileIdentity,
        resolveAccess,
        resolveShareGuestAccess,
        resolveShareUserAccess,
        resolveShareDelegatedAccess,
        whiteboardFiles,
        log,
        listSharesByResource,
        ensureShareFlowHooks,
        flow,
    },
) {
    router.get(
        "/api/v1/modules/nextcloud-whiteboard/ping",
        async (_req, res) => {
            await store.ensureSchema();
            const config = await store.getConfig();
            sendJson(res, 200, {
                data: {
                    ready: true,
                    configComplete: Boolean(
                        config.serverUrl && config.apiKeyConfigured,
                    ),
                },
            });
        },
        { access: { minRole: "user" } },
    );

    router.post(
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/preflight",
        async (req, res) => {
            await store.ensureSchema();
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            const config = await store.getConfig();
            if (!config.serverUrl || !config.apiKeyConfigured) {
                sendError(
                    res,
                    409,
                    "config_required",
                    "The whiteboard server URL and API key must be configured before use.",
                );
                return;
            }
            const liveness = await checkHttpLiveness(config.serverUrl, {
                timeoutMs: WHITEBOARD_LIVENESS_TIMEOUT_MS,
            });
            const websocketAuthToken = await store.mintSessionToken(
                config,
                { id: `cognis-preflight-${claims.sub}` },
                { id: claims.sub, name: claims.sub, readOnly: true },
            );
            log?.("info", "Nextcloud Whiteboard preflight check completed.", {
                component: "nextcloud-whiteboard-module",
                operation: "preflight",
                alive: liveness.alive,
                serverUrl: config.serverUrl,
            });
            sendJson(res, 200, {
                data: {
                    alive: liveness.alive,
                    serverUrl: config.serverUrl,
                    websocketAuthToken,
                },
            });
        },
        { access: { minRole: "user" } },
    );

    router.get(
        "/api/v1/modules/nextcloud-whiteboard/whiteboards",
        async (req, res) => {
            await store.ensureSchema();
            const requestUrl = new URL(req.url, "http://localhost");
            if (requestUrl.searchParams.get("scope") === "all") {
                const claims = requireAuth(req, res, "admin");
                if (!claims) return;
                const data = await store.listWhiteboards();
                sendJson(res, 200, { data });
                return;
            }
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            const username = await resolveRequesterUsername(
                profileStore,
                profileIdentity,
                claims.sub,
            ).catch((error) => {
                sendError(res, 409, "profile_required", error.message);
                return null;
            });
            if (!username) return;
            const data = await store.listAccessibleWhiteboards(username);
            sendJson(res, 200, { data });
        },
        { access: { minRole: "user" } },
    );

    registerWhiteboardImageRoutes(router, {
        requireAuth,
        store,
        profileStore,
        resolveShareGuestAccess,
        resolveShareUserAccess,
        resolveShareDelegatedAccess,
        resolveWhiteboardUserAccess: resolveAccess,
        whiteboardFiles,
    });

    router.get(
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/session",
        async (req, res) => {
            await store.ensureSchema();
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            const url = new URL(req.url, "http://localhost");
            const whiteboardId = url.searchParams.get("id") ?? "";
            const whiteboard = await store.getWhiteboardById(whiteboardId);
            if (!whiteboard) {
                sendError(res, 404, "not_found", "Whiteboard not found.");
                return;
            }
            const access = await resolveAccess({
                claims,
                profileStore,
                store,
                whiteboardId: whiteboard.id,
                requireWrite: false,
            });
            if (!access.authorized) {
                sendError(res, access.status, access.code, access.message);
                return;
            }
            const username = access.username;
            const displayName = access.displayName || username;
            const config = await store.getConfig();
            if (!config.serverUrl || !config.apiKeyConfigured) {
                sendError(
                    res,
                    409,
                    "config_required",
                    "Nextcloud Whiteboard must be configured before use.",
                );
                return;
            }
            const token = await store.mintSessionToken(config, whiteboard, {
                id: username,
                name: displayName,
            });
            log?.("info", "Nextcloud Whiteboard session token issued.", {
                component: "nextcloud-whiteboard-module",
                operation: "issue_session_token",
                whiteboardId: whiteboard.id,
                username,
            });
            const elements = await loadCanvasElements({
                store,
                log,
                res,
                whiteboardId: whiteboard.id,
                username,
            });
            if (!elements) return;
            const saved = await store.hasUserCopy(whiteboard.id, username);
            sendJson(res, 200, {
                data: {
                    roomId: whiteboard.id,
                    title: whiteboard.title,
                    canRename: access.username === whiteboard.createdBy,
                    canWrite: access.canWrite === true,
                    serverUrl: config.serverUrl,
                    imageUploadMaxBytes: config.imageUploadMaxBytes,
                    elements,
                    disposable: whiteboard.disposable,
                    saved,
                    token,
                },
            });
        },
        { access: { minRole: "user" } },
    );

    router.post(
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/elements",
        async (req, res) => {
            await store.ensureSchema();
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            const body = await readJson(req);
            const whiteboardId = String(body.id ?? "").trim();
            const whiteboard = await store.getWhiteboardById(whiteboardId);
            if (!whiteboard) {
                sendError(res, 404, "not_found", "Whiteboard not found.");
                return;
            }
            const access = await resolveAccess({
                claims,
                profileStore,
                store,
                whiteboardId: whiteboard.id,
                requireWrite: true,
            });
            if (!access.authorized) {
                sendError(res, access.status, access.code, access.message);
                return;
            }
            if (whiteboard.disposable && body.explicitSave !== true) {
                sendError(
                    res,
                    409,
                    "explicit_save_required",
                    "Disposable canvases are only stored when Save is pressed.",
                );
                return;
            }
            const saved = await store.saveMergedElementsSnapshot(
                whiteboard.id,
                body.elements,
            );
            const copyOwners = whiteboard.disposable
                ? [
                      ...(await store.listUserCopyOwners(whiteboard.id)),
                      access.username,
                  ]
                : await store.listParticipants(whiteboard.id);
            await store.saveUserCopies(
                whiteboard.id,
                saved.elements,
                copyOwners,
            );
            sendJson(res, 200, { data: saved });
        },
        { access: { minRole: "user" } },
    );

    router.get(
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/presence",
        async (req, res) => {
            await store.ensureSchema();
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            const url = new URL(req.url, "http://localhost");
            const whiteboardId = url.searchParams.get("pageId") ?? "";
            const whiteboard = await store.getWhiteboardById(whiteboardId);
            if (!whiteboard) {
                sendError(res, 404, "not_found", "Whiteboard not found.");
                return;
            }
            const access = await resolveAccess({
                claims,
                profileStore,
                store,
                whiteboardId: whiteboard.id,
                requireWrite: false,
            });
            if (!access.authorized) {
                sendError(res, access.status, access.code, access.message);
                return;
            }
            const rows = await store.listPresence(whiteboard.id);
            const profileCache = new Map();
            const presence = [];
            const activeCutoff = Date.now() - PRESENCE_ACTIVE_WINDOW_MS;
            for (const entry of rows) {
                const lastSeenAt = Date.parse(entry.lastSeenAt || 0);
                if (
                    !entry.active ||
                    !Number.isFinite(lastSeenAt) ||
                    lastSeenAt < activeCutoff
                )
                    continue;
                let handle = "";
                let avatarKey = null;
                if (!entry.guest && !entry.username.startsWith("guest:")) {
                    handle = entry.username;
                    if (!profileCache.has(handle)) {
                        profileCache.set(
                            handle,
                            profileStore
                                .getProfileByHandle(handle)
                                .catch(() => null),
                        );
                    }
                    const profile = await profileCache.get(handle);
                    avatarKey = profile?.avatarKey ?? null;
                }
                presence.push({
                    id: entry.username,
                    sessionId: entry.sessionId,
                    displayName: entry.displayName,
                    handle,
                    avatarKey,
                    guest: entry.guest || entry.username.startsWith("guest:"),
                    active: entry.active,
                    pointer: entry.pointer,
                    selection: entry.selection,
                    lastSeenAt: entry.lastSeenAt,
                });
            }
            sendJson(res, 200, { data: { presence } });
        },
        { access: { minRole: "user" } },
    );

    router.post(
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/presence",
        async (req, res) => {
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            let body;
            try {
                await store.ensureSchema();
                body = await readJson(req);
                const whiteboardId = String(body.pageId ?? "").trim();
                const sessionId = String(body.sessionId ?? "").trim();
                const whiteboard = await store.getWhiteboardById(whiteboardId);
                if (!whiteboard || !sessionId) {
                    sendError(res, 404, "not_found", "Whiteboard not found.");
                    return;
                }
                const access = await resolveAccess({
                    claims,
                    profileStore,
                    store,
                    whiteboardId: whiteboard.id,
                    requireWrite: false,
                });
                if (!access.authorized) {
                    sendError(res, access.status, access.code, access.message);
                    return;
                }
                await store.upsertPresence({
                    whiteboardId: whiteboard.id,
                    username: access.username,
                    sessionId,
                    displayName: access.displayName || access.username,
                    guest: access.username.startsWith("guest:"),
                    active: body.active !== false,
                    pointer: body.pointer,
                    selection: body.selection,
                });
                sendJson(res, 200, { data: { ok: true } });
            } catch (error) {
                log?.("error", "Nextcloud Whiteboard presence update failed.", {
                    component: "nextcloud-whiteboard-module",
                    operation: "upsert_presence",
                    error:
                        error instanceof Error ? error.message : String(error),
                });
                sendError(
                    res,
                    503,
                    "presence_unavailable",
                    "Whiteboard presence could not be updated.",
                );
            }
        },
        { access: { minRole: "user" } },
    );

    router.post(
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/rename",
        async (req, res) => {
            await store.ensureSchema();
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            let body;
            try {
                body = await readJson(req);
            } catch {
                sendError(
                    res,
                    400,
                    "invalid_json",
                    "Rename request body must be valid JSON.",
                );
                return;
            }
            const whiteboardId = String(body.id ?? "").trim();
            const title = String(body.title ?? "").trim();
            if (!whiteboardId || !title) {
                sendError(
                    res,
                    422,
                    "invalid_rename",
                    "Whiteboard id and title are required.",
                );
                return;
            }
            const username = await resolveRequesterUsername(
                profileStore,
                profileIdentity,
                claims.sub,
            ).catch((error) => {
                sendError(res, 409, "profile_required", error.message);
                return null;
            });
            if (!username) return;
            const whiteboard = await store.getWhiteboardById(whiteboardId);
            if (!whiteboard) {
                sendError(res, 404, "not_found", "Whiteboard was not found.");
                return;
            }
            if (whiteboard.createdBy !== username) {
                sendError(
                    res,
                    403,
                    "forbidden",
                    "Only the whiteboard owner can rename this whiteboard.",
                );
                return;
            }
            const renamed = await store.renameWhiteboard(whiteboardId, title);
            if (!renamed) {
                sendError(res, 404, "not_found", "Whiteboard was not found.");
                return;
            }
            sendJson(res, 200, { data: renamed });
        },
        { access: { minRole: "user" } },
    );

    router.get(
        "/api/v1/modules/nextcloud-whiteboard/share",
        async (req, res) => {
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            if (typeof listSharesByResource !== "function") {
                sendError(
                    res,
                    503,
                    "service_unavailable",
                    "Share capabilities are unavailable.",
                );
                return;
            }
            await store.ensureSchema();
            const url = new URL(req.url, "http://localhost");
            const whiteboardId = String(
                url.searchParams.get("whiteboardId") ?? "",
            ).trim();
            const whiteboard = await store.getWhiteboardById(whiteboardId);
            if (!whiteboard) {
                sendError(res, 404, "not_found", "Whiteboard not found.");
                return;
            }
            const access = await resolveAccess({
                claims,
                profileStore,
                store,
                whiteboardId: whiteboard.id,
                resolveShareGuestAccess,
                resolveShareUserAccess,
            });
            if (!access.authorized) {
                sendError(res, access.status, access.code, access.message);
                return;
            }
            const shares = await listSharesByResource({
                resourceType: "whiteboard",
                resourceId: whiteboard.id,
            });
            sendJson(res, 200, { data: shares });
        },
        { access: { minRole: "user" } },
    );

    router.post(
        "/api/v1/modules/nextcloud-whiteboard/share",
        async (req, res) => {
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            ensureShareFlowHooks();
            if (!flow?.exists?.("mint-share-token")) {
                sendError(
                    res,
                    503,
                    "service_unavailable",
                    "Share capabilities are unavailable.",
                );
                return;
            }
            const body = await readJson(req);
            const whiteboardId = String(body.whiteboardId ?? "").trim();
            const expiresAt = resolveExpiry(body.expiresInHours);
            if (expiresAt === null) {
                sendError(
                    res,
                    400,
                    "bad_request",
                    "expiresInHours must be a positive number.",
                );
                return;
            }
            const result = await flow.run("mint-share-token", {
                resourceType: "whiteboard",
                resourceId: whiteboardId,
                claims,
                label: body.label,
                expiresAt,
                grantedCapabilities: ["whiteboard:read", "whiteboard:write"],
            });
            const issued =
                getFirstStageResult(result.stageResults, "issue-token") ??
                getFirstStageResult(result.stageResults, "emit-event");
            if (!issued?.minted && !issued?.emitted) {
                sendError(
                    res,
                    403,
                    "forbidden",
                    "Whiteboard cannot be shared.",
                );
                return;
            }
            sendJson(res, 200, { data: issued.shareRecord ?? null });
        },
        { access: { minRole: "user" } },
    );

    router.post(
        "/api/v1/modules/nextcloud-whiteboard/share/delete",
        async (req, res) => {
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            ensureShareFlowHooks();
            if (!flow?.exists?.("revoke-share-token")) {
                sendError(
                    res,
                    503,
                    "service_unavailable",
                    "Share capabilities are unavailable.",
                );
                return;
            }
            const body = await readJson(req);
            const result = await flow.run("revoke-share-token", {
                resourceType: "whiteboard",
                resourceId: String(body.whiteboardId ?? "").trim(),
                shareId: String(body.shareId ?? "").trim(),
                ownerAccountId: claims.sub,
                claims,
            });
            const revoked = getFirstStageResult(
                result.stageResults,
                "delete-token",
            );
            if (!revoked?.revoked) {
                sendError(
                    res,
                    403,
                    "forbidden",
                    "Share link cannot be revoked.",
                );
                return;
            }
            await store.deleteUserCopy(
                String(body.whiteboardId ?? "").trim(),
                `share:${String(body.shareId ?? "").trim()}`,
            );
            sendJson(res, 200, { data: { deleted: true } });
        },
        { access: { minRole: "user" } },
    );

    router.get(
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/launch",
        async (req, res) => {
            await store.ensureSchema();
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            const url = new URL(req.url, "http://localhost");
            const whiteboardId = url.searchParams.get("id") ?? "";
            const whiteboard = await store.getWhiteboardById(whiteboardId);
            if (!whiteboard) {
                sendError(res, 404, "not_found", "Whiteboard not found.");
                return;
            }
            const access = await resolveAccess({
                claims,
                profileStore,
                store,
                whiteboardId: whiteboard.id,
                requireWrite: true,
            });
            if (!access.authorized) {
                sendError(res, access.status, access.code, access.message);
                return;
            }
            res.writeHead(302, {
                location: buildCognisWhiteboardUrl(whiteboardId),
            });
            res.end();
        },
        { access: { minRole: "user" } },
    );

    router.post(
        "/api/v1/modules/nextcloud-whiteboard/whiteboards/spawn",
        async (req, res) => {
            await store.ensureSchema();
            const claims = requireAuth(req, res, "user");
            if (!claims) return;
            const body = await readJson(req);
            const username = await resolveRequesterUsername(
                profileStore,
                profileIdentity,
                claims.sub,
            ).catch((error) => {
                sendError(res, 409, "profile_required", error.message);
                return null;
            });
            if (!username) return;
            const config = await store.getConfig();
            if (!config.serverUrl || !config.apiKeyConfigured) {
                sendError(
                    res,
                    409,
                    "config_required",
                    "Nextcloud Whiteboard must be configured before use.",
                );
                return;
            }
            const participants = await resolveParticipantHandles(
                profileStore,
                profileIdentity,
                body.participants,
                hasMinRole(claims.role, "admin"),
            );
            let whiteboard;
            if (
                body.disposable ||
                body.resourceType !== undefined ||
                body.resourceId !== undefined
            ) {
                const resolved = await resolveResourceCanvas({
                    store,
                    disposable: body.disposable === true,
                    resourceType: body.resourceType,
                    resourceId: body.resourceId,
                    title: body.title,
                    username,
                    participants,
                });
                if (!resolved.whiteboard) {
                    sendError(
                        res,
                        resolved.status,
                        resolved.error,
                        "Canvas reference could not be resolved.",
                    );
                    return;
                }
                whiteboard = resolved.whiteboard;
            } else {
                whiteboard = await store.createWhiteboard({
                    title: body.title,
                    createdBy: username,
                    participants,
                    externalPath: body.externalPath,
                });
            }
            log?.("info", "Whiteboard canvas reference resolved.", {
                component: "nextcloud-whiteboard-module",
                operation: "resolve_canvas_reference",
                whiteboardId: whiteboard.id,
            });
            sendJson(res, 200, {
                data: {
                    whiteboard,
                    launchUrl: buildCognisWhiteboardUrl(whiteboard.id),
                    windowFeatures:
                        "popup,width=1280,height=900,noopener,noreferrer",
                },
            });
        },
        { access: { minRole: "user" } },
    );
}
