import { readJson, sendJson, sendError } from "../../reuse/http.js";
import { diagnoseCanvases } from "../../administration/canvases.js";

export function registerAdminCanvasRoutes(
    router,
    { requireAuth, store, deleteCanvasRecords, log },
) {
    router.get(
        "/api/v1/modules/nextcloud-whiteboard/admin/canvases",
        async (req, res) => {
            if (!requireAuth(req, res, "admin")) return;
            const boards = await store.listWhiteboards();
            const diagnose = diagnoseCanvases(boards);
            const rows = await Promise.all(
                boards.map(async (board) => {
                    const presence = await store.listPresence(board.id);
                    const members = await store.listParticipants(board.id);
                    return {
                        id: board.id,
                        title: board.title,
                        createdBy: board.createdBy,
                        updatedAt: board.updatedAt,
                        sourceType: board.sourceType,
                        sourceId: board.sourceId,
                        issues: diagnose(board, members),
                        activeUsers: presence
                            .filter(
                                (entry) =>
                                    entry.active &&
                                    Date.now() -
                                        new Date(entry.lastSeenAt).getTime() <
                                        15000,
                            )
                            .map((entry) => entry.username),
                    };
                }),
            );
            sendJson(res, 200, { data: rows });
        },
        { access: { minRole: "admin" } },
    );
    router.post(
        "/api/v1/modules/nextcloud-whiteboard/admin/canvases/delete",
        async (req, res) => {
            const claims = requireAuth(req, res, "admin");
            if (!claims) return;
            let body;
            try {
                body = await readJson(req);
            } catch (error) {
                log?.("error", "Canvas deletion received malformed JSON.", {
                    operation: "admin_delete_canvas",
                    errorName: error?.name,
                });
                sendError(
                    res,
                    400,
                    "invalid_json",
                    "Request body must be valid JSON.",
                );
                return;
            }
            const board = await store.getWhiteboardById(
                typeof body?.whiteboardId === "string" ? body.whiteboardId : "",
            );
            if (!board) {
                sendError(res, 404, "not_found", "Canvas not found.");
                return;
            }
            await deleteCanvasRecords(board.id);
            log?.("info", "Administrator deleted a whiteboard canvas.", {
                operation: "admin_delete_canvas",
                whiteboardId: board.id,
                accountId: claims.sub,
            });
            sendJson(res, 200, { data: { deleted: true } });
        },
        { access: { minRole: "admin" } },
    );
}
