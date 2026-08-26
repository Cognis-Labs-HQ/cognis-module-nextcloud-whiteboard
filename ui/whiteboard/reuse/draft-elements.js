import { buildFreedrawElement, buildShapeElement } from "../elements.js";

const SHAPE_TOOLS = new Set([
    "rectangle",
    "diamond",
    "ellipse",
    "line",
    "arrow",
]);

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
