import {
    CanvasRequestError,
    resolveVisibleAccountHandle,
} from "./account-handle.js";

export function createCanvasDeletionCapability({
    store,
    profileStore,
    profileIdentity,
    log,
}) {
    return async function deleteCanvas(input = {}) {
        const whiteboardId = String(input.whiteboardId ?? "").trim();
        const actorAccountId = String(input.actorAccountId ?? "").trim();
        if (!whiteboardId) {
            throw new CanvasRequestError("whiteboardId is required.");
        }
        if (!actorAccountId) {
            throw new CanvasRequestError("actorAccountId is required.");
        }
        try {
            await store.ensureSchema();
            const actorHandle = await resolveVisibleAccountHandle(
                profileStore,
                profileIdentity,
                actorAccountId,
                "actorAccountId",
            );
            const whiteboard = await store.getWhiteboardById(whiteboardId);
            if (!whiteboard) {
                throw new CanvasRequestError("Whiteboard not found.");
            }
            const actorOwnsCanvas = whiteboard.createdBy === actorHandle;
            const participants = actorOwnsCanvas
                ? []
                : await store.listParticipants(whiteboard.id);
            const actorIsSoleParticipant =
                participants.length === 1 && participants[0] === actorHandle;
            if (!actorOwnsCanvas && !actorIsSoleParticipant) {
                throw new CanvasRequestError(
                    "Only the whiteboard owner or sole participant can delete the canvas.",
                );
            }
            await store.deleteWhiteboard(whiteboard.id);
            log?.("info", "Whiteboard canvas deleted.", {
                component: "nextcloud-whiteboard-module",
                operation: "delete_canvas",
                whiteboardId: whiteboard.id,
                actorAccountId,
            });
        } catch (error) {
            if (error instanceof CanvasRequestError) throw error;
            log?.("error", "Whiteboard canvas deletion failed.", {
                component: "nextcloud-whiteboard-module",
                operation: "delete_canvas",
                whiteboardId,
            });
            throw new Error("Whiteboard canvas could not be deleted.");
        }
    };
}
