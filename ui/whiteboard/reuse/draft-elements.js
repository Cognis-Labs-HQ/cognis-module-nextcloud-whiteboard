import { buildFreedrawElement, buildShapeElement } from "../elements.js";

const SHAPE_TOOLS = new Set([
    "rectangle",
    "diamond",
    "ellipse",
    "line",
    "arrow",
]);

export const REMOTE_DRAFT_TTL_MS = 15_000;

export function createRemoteDraftStore({
    ttl = REMOTE_DRAFT_TTL_MS,
    schedule = setTimeout,
    cancel = clearTimeout,
    onExpire = () => {},
} = {}) {
    const elements = new Map();
    const expirations = new Map();

    function remove(id) {
        const expiration = expirations.get(id);
        if (expiration !== undefined) cancel(expiration);
        expirations.delete(id);
        return elements.delete(id);
    }

    function set(element) {
        remove(element.id);
        elements.set(element.id, element);
        expirations.set(
            element.id,
            schedule(() => {
                expirations.delete(element.id);
                if (elements.delete(element.id)) onExpire();
            }, ttl),
        );
    }

    function clear() {
        for (const expiration of expirations.values()) cancel(expiration);
        expirations.clear();
        elements.clear();
    }

    function reconcile(remoteElements, stableElements) {
        const previewIds = new Set();
        const stableById = new Map(
            stableElements.map((item) => [item.id, item]),
        );
        for (const element of remoteElements) {
            if (!element?.id) continue;
            const stable = stableById.get(element.id);
            if (
                element.isTransient === true ||
                !stable ||
                (element.version ?? 0) > (stable.version ?? 0)
            ) {
                previewIds.add(element.id);
                set(element);
            }
        }
        for (const draft of elements.values()) {
            if (!previewIds.has(draft.id)) remove(draft.id);
        }
    }

    return {
        clear,
        delete: remove,
        get: (id) => elements.get(id),
        has: (id) => elements.has(id),
        reconcile,
        set,
        values: () => elements.values(),
    };
}

export function createDrawingDraft({
    activeTool,
    currentPoints,
    dragStartPoint,
    strokeColor,
    strokeWidth,
}) {
    if (activeTool === "pen") {
        return buildFreedrawElement(currentPoints, strokeColor, strokeWidth);
    }
    if (!dragStartPoint || !SHAPE_TOOLS.has(activeTool)) return null;
    return buildShapeElement(
        activeTool,
        dragStartPoint,
        currentPoints.at(-1),
        strokeColor,
        strokeWidth,
    );
}

export function preserveDraftIdentity(currentDraft, nextDraft) {
    if (!nextDraft) return null;
    if (!currentDraft) return { ...nextDraft, isTransient: true };
    return {
        ...nextDraft,
        id: currentDraft.id,
        seed: currentDraft.seed,
        version: currentDraft.version + 1,
        versionNonce: nextDraft.versionNonce,
        isTransient: true,
    };
}

export function canFinalizeDrawing({
    activeTool,
    currentPoints,
    dragStartPoint,
    draftElement,
}) {
    if (!draftElement) return false;
    if (activeTool === "pen") return currentPoints.length >= 2;
    return (
        Boolean(dragStartPoint) &&
        currentPoints.length >= 1 &&
        SHAPE_TOOLS.has(activeTool)
    );
}
