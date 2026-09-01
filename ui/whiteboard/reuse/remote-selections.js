export function buildRemoteSelections(selections = []) {
    const remoteSelections = new Map();
    for (const selection of selections) {
        const color = String(selection?.color || "#5e81f4");
        const label = String(selection?.label || "").trim();
        const interaction = ["idle", "pressing", "typing"].includes(
            selection?.interaction,
        )
            ? selection.interaction
            : "idle";
        const elementIds = Array.isArray(selection?.elementIds)
            ? selection.elementIds
            : [];
        for (const elementId of elementIds) {
            const normalizedId = String(elementId ?? "").trim();
            if (!normalizedId) continue;
            remoteSelections.set(normalizedId, {
                color,
                interaction,
                label,
            });
        }
    }
    return remoteSelections;
}
