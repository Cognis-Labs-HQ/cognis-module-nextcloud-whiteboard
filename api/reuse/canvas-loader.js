import { sendError } from "./http.js";

export async function loadCanvasElements({
    store,
    log,
    res,
    whiteboardId,
    username,
}) {
    try {
        return await store.getElementsSnapshot(whiteboardId);
    } catch (error) {
        log?.("error", "Whiteboard canvas failed to load.", {
            component: "nextcloud-whiteboard-module",
            operation: "load_whiteboard_canvas",
            whiteboardId,
            username,
            errorName: error?.name ?? "Error",
        });
        sendError(
            res,
            500,
            "canvas_load_failed",
            "Whiteboard canvas could not be loaded.",
        );
        return null;
    }
}
