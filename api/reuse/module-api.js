import { createCanvasRecordDeletion } from "./canvas-record-deletion.js";
import { createCanvasSourceBinding } from "./canvas-source-binding.js";
import { buildCognisWhiteboardUrl } from "./access.js";
import { createCanvasMembershipCapability } from "./canvas-membership.js";
import { createCanvasDeletionCapability } from "./canvas-deletion.js";
import { resolveResourceCanvas } from "./resource-canvas.js";

export function createWhiteboardModuleApi({
    store,
    profileStore,
    profileIdentity,
    log,
    listSharesByResource,
    deleteResourceShares,
    resolveActorRole,
}) {
    const deleteCanvasRecords = createCanvasRecordDeletion({
        store,
        listSharesByResource,
        deleteResourceShares,
    });
    return {
        deleteCanvasRecords,
        sourceBinding: createCanvasSourceBinding({
            resolveActorRole,
            store,
            profileStore,
            profileIdentity,
            log,
        }),
        deleteCanvas: createCanvasDeletionCapability({
            resolveActorRole,
            deleteCanvasRecords,
            store,
            profileStore,
            profileIdentity,
            log,
        }),
        membership: createCanvasMembershipCapability({
            store,
            profileStore,
            profileIdentity,
            log,
        }),
        getEmbedUrl(whiteboardId, options = {}) {
            if (!whiteboardId) return null;
            return buildCognisWhiteboardUrl(whiteboardId, options);
        },
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
            const input = {
                title: options.title,
                createdBy,
                participants: options.participants,
                externalPath: options.externalPath,
                disposable: options.disposable === true,
            };
            let whiteboard;
            if (
                options.resourceType !== undefined ||
                options.resourceId !== undefined
            ) {
                const resolved = await resolveResourceCanvas({
                    ...input,
                    username: createdBy,
                    store,
                    resourceType: options.resourceType,
                    resourceId: options.resourceId,
                });
                if (!resolved.whiteboard)
                    throw Object.assign(
                        new Error("Canvas reference could not be resolved."),
                        { code: resolved.error, status: resolved.status },
                    );
                whiteboard = resolved.whiteboard;
            } else {
                whiteboard = await store.createWhiteboard(input);
            }
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
                    owner: whiteboard.createdBy,
                    participants: await store.listParticipants(whiteboard.id),
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
            const createdByAccountId = await profileIdentity.resolveAccountId(
                whiteboard.createdBy,
            );
            return {
                id: whiteboard.id,
                title: whiteboard.title,
                embedUrl: buildCognisWhiteboardUrl(whiteboard.id),
                createdBy: whiteboard.createdBy,
                createdByAccountId,
                createdAt: whiteboard.createdAt,
                updatedAt: whiteboard.updatedAt,
            };
        },
    };
}
