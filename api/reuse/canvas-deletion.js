class CanvasDeletionRequestError extends Error {}

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
            throw new CanvasDeletionRequestError("whiteboardId is required.");
        }
        if (!actorAccountId) {
            throw new CanvasDeletionRequestError("actorAccountId is required.");
        }
        try {
            await store.ensureSchema();
            const profile = await profileStore.getProfile(actorAccountId);
            if (!profile?.handle || profile.visibility === "hidden") {
                throw new CanvasDeletionRequestError(
                    "actorAccountId must identify a visible profile.",
                );
            }
            const actorHandle = await profileIdentity.resolveAccountHandle(
                actorAccountId,
                "actorAccountId",
            );
            const whiteboard = await store.getWhiteboardById(whiteboardId);
            if (!whiteboard) {
                throw new CanvasDeletionRequestError("Whiteboard not found.");
            }
            if (whiteboard.createdBy !== actorHandle) {
                throw new CanvasDeletionRequestError(
                    "Only the whiteboard owner can delete the canvas.",
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
            if (error instanceof CanvasDeletionRequestError) throw error;
            log?.("error", "Whiteboard canvas deletion failed.", {
                component: "nextcloud-whiteboard-module",
                operation: "delete_canvas",
                whiteboardId,
            });
            throw new Error("Whiteboard canvas could not be deleted.");
        }
    };
}
