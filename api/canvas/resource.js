export function resourceCanvasPath(resourceType, resourceId) {
    const normalizedType = String(resourceType ?? "")
        .trim()
        .toLowerCase();
    const normalizedId = String(resourceId ?? "").trim();
    if (
        !/^[a-z][a-z0-9_-]{0,63}$/.test(normalizedType) ||
        !normalizedId ||
        normalizedId.length > 200
    ) {
        return "";
    }
    return `/integrations/${normalizedType}/${encodeURIComponent(normalizedId)}.whiteboard`;
}

export async function resolveResourceCanvas({
    store,
    resourceType,
    resourceId,
    title,
    username,
    participants,
    disposable = false,
}) {
    if (typeof resourceType !== "string" || typeof resourceId !== "string")
        return { error: "invalid_resource", status: 422 };
    const externalPath = resourceCanvasPath(resourceType, resourceId);
    if (!externalPath) return { error: "invalid_resource", status: 422 };
    const referenceKey = JSON.stringify([
        String(resourceType).trim().toLowerCase(),
        String(resourceId).trim(),
    ]);
    let existing = await store.getWhiteboardByReferenceKey(referenceKey);
    let assignReference = false;
    if (!existing) {
        const candidates =
            await store.listWhiteboardsByExternalPath(externalPath);
        if (candidates.length > 1)
            return { error: "resource_conflict", status: 409 };
        existing = candidates[0];
        assignReference = Boolean(existing);
    }
    if (existing && existing.disposable !== disposable) {
        return { error: "resource_conflict", status: 409 };
    }
    if (existing) {
        const authorized = await store.canAccessWhiteboard(
            existing.id,
            username,
        );
        if (!authorized) return { error: "forbidden", status: 403 };
        if (assignReference) {
            try {
                existing = await store.assignWhiteboardReference(
                    existing.id,
                    referenceKey,
                );
            } catch (error) {
                if (error?.code === "resource_conflict")
                    return { error: "resource_conflict", status: 409 };
                throw error;
            }
        }
        return { whiteboard: existing };
    }
    const whiteboard = await store.createWhiteboard({
        title,
        createdBy: username,
        participants,
        externalPath,
        disposable,
        referenceKey,
    });
    if (whiteboard.disposable !== disposable)
        return { error: "resource_conflict", status: 409 };
    return (await store.canAccessWhiteboard(whiteboard.id, username))
        ? { whiteboard }
        : { error: "forbidden", status: 403 };
}
