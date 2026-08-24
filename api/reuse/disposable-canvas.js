export function disposableResourcePath(resourceType, resourceId) {
    const normalizedType = String(resourceType ?? "")
        .trim()
        .toLowerCase();
    const normalizedId = String(resourceId ?? "").trim();
    if (!/^[a-z][a-z0-9_-]{0,63}$/.test(normalizedType) || !normalizedId) {
        return "";
    }
    return `/integrations/${normalizedType}/${encodeURIComponent(normalizedId)}.whiteboard`;
}

export async function resolveDisposableCanvas({
    store,
    resourceType,
    resourceId,
    title,
    username,
    participants,
}) {
    const externalPath = disposableResourcePath(resourceType, resourceId);
    if (!externalPath) return { error: "invalid_resource", status: 422 };
    const existing = await store.getWhiteboardByExternalPath(externalPath);
    if (existing && !existing.disposable) {
        return { error: "resource_conflict", status: 409 };
    }
    if (existing) {
        const authorized = await store.canAccessWhiteboard(
            existing.id,
            username,
        );
        return authorized
            ? { whiteboard: existing }
            : { error: "forbidden", status: 403 };
    }
    return {
        whiteboard: await store.createWhiteboard({
            title,
            createdBy: username,
            participants,
            externalPath,
            disposable: true,
        }),
    };
}
