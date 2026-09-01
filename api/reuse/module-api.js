import { buildCognisWhiteboardUrl } from "../access.js";
import { createCanvasMembershipCapability } from "./canvas-membership.js";

export function createWhiteboardModuleApi({
    store,
    profileStore,
    profileIdentity,
    log,
}) {
    return {
        membership: createCanvasMembershipCapability({
            store,
            profileStore,
            profileIdentity,
            log,
        }),
        async spawnWhiteboardWindow(options = {}) {
            await store.ensureSchema();
            const createdBy = profileIdentity.normalizeHandleKey(
                options.createdBy,
            );
            if (!createdBy) {
                throw new Error(
                    "createdBy is required to spawn a whiteboard window.",
                );
            }
            const config = await store.getConfig();
            if (!config.serverUrl || !config.apiKeyConfigured) {
                throw new Error(
                    "Nextcloud Whiteboard server URL and API key must be configured.",
                );
            }
            const whiteboard = await store.createWhiteboard({
                title: options.title,
                createdBy,
                participants: options.participants,
                externalPath: options.externalPath,
                disposable: options.disposable === true,
            });
            const launchUrl = buildCognisWhiteboardUrl(whiteboard.id, {
                instantCanvas:
                    options.instantCanvas === true ||
                    options.disposable === true,
            });
            log?.("info", "Nextcloud Whiteboard window spawned.", {
                component: "nextcloud-whiteboard-module",
                operation: "spawn_whiteboard_window",
                whiteboardId: whiteboard.id,
                createdBy,
            });
            return {
                whiteboardId: whiteboard.id,
                launchUrl,
                windowFeatures:
                    "popup,width=1280,height=900,noopener,noreferrer",
                access: {
                    owner: createdBy,
                    participants: [
                        createdBy,
                        ...(Array.isArray(options.participants)
                            ? options.participants
                            : []),
                    ],
                },
                disposable: whiteboard.disposable,
            };
        },
        async fetchBoardData(whiteboardId) {
            await store.ensureSchema();
            const whiteboard = await store.getWhiteboardById(
                String(whiteboardId ?? ""),
            );
            if (!whiteboard) return null;
            return {
                id: whiteboard.id,
                title: whiteboard.title,
                embedUrl: buildCognisWhiteboardUrl(whiteboard.id),
                createdBy: whiteboard.createdBy,
                createdAt: whiteboard.createdAt,
                updatedAt: whiteboard.updatedAt,
            };
        },
    };
}
