import {
    buildDragBox,
    drawAnchor,
    getElementAnchorPoints,
    getElementBounds,
    renderElement,
} from "./elements.js";
import { renderRemotePointers } from "./reuse/remote-pointers.js";

export function renderWhiteboardScene({
    activeTool,
    canvasElement,
    context,
    currentPoints,
    dragSelectBox,
    dragStartPoint,
    draftElement,
    elements,
    eraserSelectionIds,
    isDrawing,
    remoteSelections,
    remotePointers,
    selectedElementId,
    selectedElementIds,
    viewportOffsetX,
    viewportOffsetY,
}) {
    const style = getComputedStyle(canvasElement);
    context.fillStyle =
        style.getPropertyValue("--whiteboard-canvas-bg").trim() || "#ffffff";
    context.fillRect(0, 0, canvasElement.width, canvasElement.height);
    context.save();
    context.translate(-viewportOffsetX, -viewportOffsetY);
    for (const element of elements) {
        renderElement(context, element);
        renderElementSelection({
            context,
            element,
            eraserSelectionIds,
            remoteSelections,
            selectedElementId,
            selectedElementIds,
            style,
        });
    }
    context.restore();
    renderDragSelectBox({
        context,
        dragSelectBox,
        viewportOffsetX,
        viewportOffsetY,
    });
    renderActiveToolPreview({
        activeTool,
        context,
        currentPoints,
        draftElement,
        dragStartPoint,
        isDrawing,
        viewportOffsetX,
        viewportOffsetY,
    });
    renderRemotePointers({ canvasElement, context, pointers: remotePointers });
}

function renderElementSelection({
    context,
    element,
    eraserSelectionIds,
    remoteSelections,
    selectedElementId,
    selectedElementIds,
    style,
}) {
    const remoteSelection = remoteSelections.get(element.id);
    if (
        !selectedElementIds.has(element.id) &&
        !eraserSelectionIds.has(element.id) &&
        !remoteSelection
    ) {
        return;
    }
    const bounds = getElementBounds(element);
    const localSelection = selectedElementIds.has(element.id);
    const eraserSelection = eraserSelectionIds.has(element.id);
    const selectionColor = eraserSelection
        ? style.getPropertyValue("--whiteboard-selection-erase").trim() ||
          "#c0392b"
        : localSelection
          ? style.getPropertyValue("--whiteboard-selection-local").trim() ||
            "#2d9e5c"
          : remoteSelection?.color || "#5e81f4";
    context.save();
    context.setLineDash([6, 4]);
    context.strokeStyle = selectionColor;
    context.lineWidth = remoteSelection && !localSelection ? 2.5 : 1;
    context.strokeRect(
        bounds.x - 4,
        bounds.y - 4,
        bounds.width + 8,
        bounds.height + 8,
    );
    if (remoteSelection?.label && !localSelection && !eraserSelection) {
        context.font = "600 12px system-ui, sans-serif";
        const activityIcon =
            remoteSelection.interaction === "typing"
                ? "⌨ "
                : remoteSelection.interaction === "pressing"
                  ? "● "
                  : "";
        const activityLabel = `${activityIcon}${remoteSelection.label}`;
        const labelWidth = context.measureText(activityLabel).width + 12;
        const labelX = bounds.x - 4;
        const labelY = Math.max(4, bounds.y - 22);
        context.setLineDash([]);
        context.fillStyle = selectionColor;
        context.fillRect(labelX, labelY, labelWidth, 18);
        context.fillStyle =
            style.getPropertyValue("--whiteboard-selection-label").trim() ||
            "#ffffff";
        context.fillText(activityLabel, labelX + 6, labelY + 13);
    }
    context.restore();
    if (element.id === selectedElementId) {
        for (const [anchorX, anchorY] of getElementAnchorPoints(element)) {
            drawAnchor(context, anchorX, anchorY);
        }
    }
}

function renderDragSelectBox({
    context,
    dragSelectBox,
    viewportOffsetX,
    viewportOffsetY,
}) {
    if (!dragSelectBox) return;
    context.save();
    context.translate(-viewportOffsetX, -viewportOffsetY);
    context.save();
    context.setLineDash([4, 4]);
    context.strokeStyle = "#2563eb";
    context.strokeRect(
        dragSelectBox.x,
        dragSelectBox.y,
        dragSelectBox.width,
        dragSelectBox.height,
    );
    context.restore();
    context.restore();
}

function renderActiveToolPreview({
    activeTool,
    context,
    currentPoints,
    draftElement,
    dragStartPoint,
    isDrawing,
    viewportOffsetX,
    viewportOffsetY,
}) {
    context.save();
    context.translate(-viewportOffsetX, -viewportOffsetY);
    if (isDrawing && draftElement) {
        renderElement(context, draftElement);
    } else if (
        isDrawing &&
        dragStartPoint &&
        currentPoints.length >= 1 &&
        activeTool === "eraser"
    ) {
        const box = buildDragBox(dragStartPoint, currentPoints.at(-1));
        context.save();
        context.setLineDash([4, 4]);
        context.strokeStyle = "#c0392b";
        context.strokeRect(box.x, box.y, box.width, box.height);
        context.restore();
    }
    context.restore();
}
