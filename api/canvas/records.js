/** Remove every share of a canvas before deleting its provider-owned records. */
export function createCanvasRecordDeletion({
    store,
    listSharesByResource,
    deleteResourceShares,
}) {
    return async (whiteboardId) => {
        if (
            typeof listSharesByResource !== "function" ||
            typeof deleteResourceShares !== "function"
        )
            throw new Error("Canvas share cleanup is unavailable.");
        const shares = await listSharesByResource({
            resourceType: "whiteboard",
            resourceId: whiteboardId,
        });
        for (const ownerAccountId of new Set(
            shares.map((share) => share.ownerAccountId),
        )) {
            if (!ownerAccountId)
                throw new Error("Canvas share owner is unavailable.");
            await deleteResourceShares({
                ownerAccountId,
                resourceType: "whiteboard",
                resourceId: whiteboardId,
            });
        }
        await store.deleteWhiteboard(whiteboardId);
    };
}
