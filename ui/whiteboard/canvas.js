import {
    boxContainsElementContent,
    buildDragBox,
    buildTextElement,
    bumpElementVersion,
    bumpElementVersionPast,
    getElementBounds,
    getElementAnchorPoints,
    elementContainsPoint,
    isStrokeWidthApplicable,
    scaleElementToBounds,
} from "./elements.js";
import { renderWhiteboardScene } from "./render-scene.js";
import { parseSavedFont, toFontFamilyValue } from "../reuse/font-resources.js";
import { createWhiteboardTextTools } from "./text-tools.js";
import { createClipboardImageHandler } from "./clipboard-images.js";
import { bindWhiteboardCanvasEvents } from "./canvas-events.js";
import * as drafts from "./reuse/draft-elements.js";
import { buildRemoteSelections } from "./reuse/remote-selections.js";

export function createWhiteboardCanvas(
    canvasElement,
    { readOnly = false } = {},
) {
    const context = canvasElement.getContext("2d");
    let elements = [];
    const remoteDraftElements = drafts.createRemoteDraftStore({
        onExpire: scheduleRender,
    });
    let currentPoints = [];
    let draftElement = null;
    let isDrawing = false;
    let strokeColor = "auto";
    let strokeWidth = 4;
    let activeTool = "select";
    let imageUploadMaxBytes = 1048576;
    let imageUploader = null;
    let selectedElementId = null;
    let selectedElementIds = new Set();
    let eraserSelectionIds = new Set();
    let activeAnchorIndex = null;
    let dragStartPoint = null;
    let dragSelectBox = null;
    let selectDragMode = null;
    let originalElement = null;
    let originalSelection = new Map();
    let changeCallback = null;
    let selectionCallback = null;
    let historyCallback = null;
    let toolCallback = null;
    let pendingRender = false;
    let historyPast = [];
    let historyFuture = [];
    let historySnapshot = null;
    let textFormatMenu = null;
    let panState = null;
    let viewportOffsetX = 0;
    let viewportOffsetY = 0;
    let remoteSelections = new Map();
    let keepToolActive = false;
    if (readOnly) canvasElement.style.cursor = "pointer";
    function scheduleRender() {
        if (pendingRender) return;
        pendingRender = true;
        requestAnimationFrame(() => {
            pendingRender = false;
            redraw();
        });
    }

    function redraw() {
        renderWhiteboardScene({
            activeTool,
            canvasElement,
            context,
            currentPoints,
            dragSelectBox,
            dragStartPoint,
            draftElement,
            elements: [...elements, ...remoteDraftElements.values()],
            eraserSelectionIds,
            isDrawing,
            remoteSelections,
            selectedElementId,
            selectedElementIds,
            viewportOffsetX,
            viewportOffsetY,
        });
    }

    function cloneElements(items = elements) {
        return items.map((element) => ({
            ...element,
            points: element.points?.map((point) => [...point]),
        }));
    }

    function resizeCanvas() {
        if (!isDrawing) updateCanvasSize();
        scheduleRender();
    }

    function updateCanvasSize() {
        const parent = canvasElement.parentElement;
        const rect = parent?.getBoundingClientRect();
        if (!rect) return;
        const width = Math.ceil(rect.width);
        const height = Math.ceil(rect.height);
        if (canvasElement.width !== width) canvasElement.width = width;
        if (canvasElement.height !== height) canvasElement.height = height;
        canvasElement.style.width = `${width}px`;
        canvasElement.style.height = `${height}px`;
    }

    function getCanvasPoint(event) {
        const rect = canvasElement.getBoundingClientRect();
        return [
            event.clientX - rect.left + viewportOffsetX,
            event.clientY - rect.top + viewportOffsetY,
        ];
    }

    function findAnchorAt(element, x, y) {
        if (!element) return -1;
        return getElementAnchorPoints(element).findIndex(
            ([anchorX, anchorY]) => Math.hypot(anchorX - x, anchorY - y) <= 10,
        );
    }

    function selectedElement() {
        return (
            elements.find((element) => element.id === selectedElementId) ?? null
        );
    }

    function syncPrimarySelection() {
        if (selectedElementId && selectedElementIds.has(selectedElementId))
            return;
        selectedElementId = selectedElementIds.values().next().value ?? null;
    }

    function getSelectedElementBounds() {
        return elements
            .filter((element) => selectedElementIds.has(element.id))
            .map((element) => ({
                id: element.id,
                ...getElementBounds(element),
            }));
    }

    function getSelectedElementIds() {
        return [...selectedElementIds].filter((id) =>
            elements.some((element) => element.id === id),
        );
    }

    function setRemoteSelections(selections = []) {
        remoteSelections = buildRemoteSelections(selections);
        scheduleRender();
    }

    function notifySelection() {
        syncPrimarySelection();
        const element = selectedElement();
        selectionCallback?.(
            element
                ? {
                      ...element,
                      strokeWidthApplicable: isStrokeWidthApplicable(element),
                  }
                : null,
        );
        textTools.syncTextFormatMenu();
    }

    function findElementAt(x, y) {
        return [...elements]
            .reverse()
            .find(
                (element) =>
                    !element.isDeleted && elementContainsPoint(element, x, y),
            );
    }

    function notifyTransientChange() {
        changeCallback?.(
            draftElement ? [...elements, draftElement] : [...elements],
            { transient: true },
        );
    }

    function updateDraftElement(nextElement) {
        if (!nextElement) return;
        draftElement = drafts.preserveDraftIdentity(draftElement, nextElement);
        scheduleRender();
        notifyTransientChange();
    }

    function updateDrawingDraft() {
        updateDraftElement(
            drafts.createDrawingDraft({
                activeTool,
                currentPoints,
                dragStartPoint,
                strokeColor,
                strokeWidth,
            }),
        );
    }

    function createHistoryEntry(beforeSnapshot, afterSnapshot) {
        const beforeById = new Map(
            beforeSnapshot.map((item) => [item.id, item]),
        );
        const afterById = new Map(afterSnapshot.map((item) => [item.id, item]));
        const changedIds = new Set([...beforeById.keys(), ...afterById.keys()]);
        return {
            before: beforeSnapshot,
            after: afterSnapshot,
            changedIds: [...changedIds].filter((id) => {
                const before = beforeById.get(id);
                const after = afterById.get(id);
                return (
                    JSON.stringify(before ?? null) !==
                    JSON.stringify(after ?? null)
                );
            }),
        };
    }

    function pushHistoryEntry(beforeSnapshot, afterSnapshot) {
        const entry = createHistoryEntry(beforeSnapshot, afterSnapshot);
        if (entry.changedIds.length === 0) return false;
        historyPast.push(entry);
        historyPast = historyPast.slice(-100);
        historyFuture = [];
        notifyHistoryChange();
        return true;
    }

    function applyHistorySnapshot(snapshot, changedIds) {
        const snapshotById = new Map(snapshot.map((item) => [item.id, item]));
        const currentById = new Map(elements.map((item) => [item.id, item]));
        const changed = new Set(changedIds);
        elements = [
            ...elements
                .filter((element) => !changed.has(element.id))
                .map((element) => ({
                    ...element,
                    points: element.points?.map((point) => [...point]),
                })),
            ...[...changed]
                .map((id) => snapshotById.get(id))
                .filter(Boolean)
                .map((element) =>
                    bumpElementVersionPast(
                        element,
                        currentById.get(element.id),
                        {
                            points: element.points?.map((point) => [...point]),
                        },
                    ),
                ),
            ...[...changed]
                .filter((id) => !snapshotById.has(id) && currentById.has(id))
                .map((id) =>
                    bumpElementVersion(currentById.get(id), {
                        isDeleted: true,
                    }),
                ),
        ];
        updateCanvasSize();
        scheduleRender();
        changeCallback?.([...elements]);
        notifySelection();
    }

    function commitElements(nextElements, { record = true } = {}) {
        const before = cloneElements();
        if (record) {
            pushHistoryEntry(before, cloneElements(nextElements));
        }
        elements = nextElements;
        updateCanvasSize();
        scheduleRender();
        changeCallback?.([...elements]);
    }

    function notifyHistoryChange() {
        historyCallback?.({
            canUndo: historyPast.length > 0,
            canRedo: historyFuture.length > 0,
        });
    }

    function restoreElements(snapshot) {
        elements = cloneElements(snapshot);
        updateCanvasSize();
        scheduleRender();
        changeCallback?.([...elements]);
        notifySelection();
    }

    function undo() {
        const entry = historyPast.pop();
        if (!entry) return false;
        historyFuture.push(entry);
        applyHistorySnapshot(entry.before, entry.changedIds);
        notifyHistoryChange();
        return true;
    }

    function redo() {
        const entry = historyFuture.pop();
        if (!entry) return false;
        historyPast.push(entry);
        applyHistorySnapshot(entry.after, entry.changedIds);
        notifyHistoryChange();
        return true;
    }

    function updateEraserSelection(endPoint) {
        if (!dragStartPoint) return;
        const box = buildDragBox(dragStartPoint, endPoint);
        eraserSelectionIds = new Set(
            elements
                .filter(
                    (element) =>
                        !element.isDeleted &&
                        boxContainsElementContent(box, element),
                )
                .map((element) => element.id),
        );
        scheduleRender();
    }

    function setActiveTool(tool) {
        activeTool = tool;
        eraserSelectionIds = new Set();
        if (tool !== "select" && selectedElementIds.size > 0) {
            selectedElementIds = new Set();
            selectedElementId = null;
            notifySelection();
        }
        canvasElement.style.cursor = readOnly
            ? "pointer"
            : tool === "select"
              ? "pointer"
              : tool === "eraser"
                ? "cell"
                : "crosshair";
        toolCallback?.(tool);
        scheduleRender();
    }

    function selectOnlyElement(elementId) {
        selectedElementIds = elementId ? new Set([elementId]) : new Set();
        selectedElementId = elementId ?? null;
        notifySelection();
        scheduleRender();
    }

    function deleteSelectedElements() {
        if (selectedElementIds.size === 0) return false;
        const idsToDelete = new Set(selectedElementIds);
        commitElements(
            elements.map((element) =>
                idsToDelete.has(element.id)
                    ? bumpElementVersion(element, { isDeleted: true })
                    : element,
            ),
        );
        selectedElementIds = new Set();
        selectedElementId = null;
        notifySelection();
        scheduleRender();
        return true;
    }

    function toggleElementSelection(elementId) {
        if (!elementId) return;
        selectedElementIds = new Set(selectedElementIds);
        if (selectedElementIds.has(elementId)) {
            selectedElementIds.delete(elementId);
        } else {
            selectedElementIds.add(elementId);
        }
        if (!selectedElementIds.has(selectedElementId)) {
            selectedElementId = elementId;
        }
        notifySelection();
        scheduleRender();
    }

    function currentAppFont() {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue("--app-font")
            .trim();
        return parseSavedFont(value);
    }

    function textElement() {
        const selected = selectedElement();
        return selected?.type === "text" ? selected : null;
    }

    function positionTextOverlay(overlay, element, yOffset = 0) {
        overlay.style.left = `${element.x - viewportOffsetX}px`;
        overlay.style.top = `${element.y - viewportOffsetY + yOffset}px`;
        overlay.style.width = `${Math.max(180, element.width ?? 180)}px`;
    }

    const textTools = createWhiteboardTextTools({
        canvasElement,
        commitElements,
        currentAppFont,
        getElements: () => elements,
        getTextElement: textElement,
        getTextFormatMenu: () => textFormatMenu,
        positionTextOverlay,
        selectOnlyElement,
        setTextFormatMenu: (nextMenu) => {
            textFormatMenu = nextMenu;
        },
        updateTransientElement: (elementId, patch) => {
            elements = elements.map((item) =>
                item.id === elementId ? bumpElementVersion(item, patch) : item,
            );
            scheduleRender();
            notifyTransientChange();
        },
    });

    function commitCreatedElement(element) {
        commitElements([...elements, element]);
        selectOnlyElement(element.id);
        if (!keepToolActive) setActiveTool("select");
    }

    function onPointerDown(event) {
        if (event.button === 1) {
            event.preventDefault();
            const parent = canvasElement.parentElement;
            if (!parent) return;
            canvasElement.setPointerCapture(event.pointerId);
            panState = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                offsetX: viewportOffsetX,
                offsetY: viewportOffsetY,
            };
            canvasElement.style.cursor = "grabbing";
            return;
        }
        if (event.button !== 0) return;
        event.preventDefault();
        const [x, y] = getCanvasPoint(event);
        canvasElement.setPointerCapture(event.pointerId);
        canvasElement.focus({ preventScroll: true });
        isDrawing = true;
        if (activeTool !== "select" && selectedElementIds.size > 0) {
            selectedElementIds = new Set();
            selectedElementId = null;
            notifySelection();
        }
        dragStartPoint = [x, y];
        historySnapshot = cloneElements();
        if (activeTool === "select") {
            const selected = selectedElement();
            activeAnchorIndex = findAnchorAt(selected, x, y);
            const target =
                activeAnchorIndex >= 0 ? selected : findElementAt(x, y);
            if (event.shiftKey && target) {
                toggleElementSelection(target.id);
                isDrawing = false;
                return;
            }
            if (activeAnchorIndex >= 0 && selected) {
                selectDragMode = "resize";
                originalElement = {
                    ...selected,
                    points: selected.points?.map((point) => [...point]),
                };
            } else if (target) {
                if (!selectedElementIds.has(target.id))
                    selectOnlyElement(target.id);
                selectDragMode = "move";
                originalSelection = new Map(
                    elements
                        .filter((element) => selectedElementIds.has(element.id))
                        .map((element) => [
                            element.id,
                            {
                                ...element,
                                points: element.points?.map((point) => [
                                    ...point,
                                ]),
                            },
                        ]),
                );
            } else {
                selectOnlyElement(null);
                selectDragMode = "box";
                dragSelectBox = buildDragBox(dragStartPoint, [x, y]);
            }
            notifySelection();
            scheduleRender();
            return;
        }
        if (activeTool === "eraser") {
            currentPoints = [[x, y]];
            updateEraserSelection([x, y]);
            return;
        }
        if (activeTool === "text") {
            const existingText = findElementAt(x, y);
            if (existingText?.type === "text") {
                selectOnlyElement(existingText.id);
                textTools.openTextEditor(existingText);
                isDrawing = false;
                setActiveTool("select");
                return;
            }
            const element = bumpElementVersion(
                buildTextElement([x, y], "Text", strokeColor),
                {
                    fontFamily: `${toFontFamilyValue(currentAppFont())}, Arial, sans-serif`,
                },
            );
            commitCreatedElement(element);
            textTools.openTextEditor(element);
            isDrawing = false;
            return;
        }
        currentPoints = [[x, y]];
        updateDrawingDraft();
        scheduleRender();
    }

    function onPointerMove(event) {
        if (panState?.pointerId === event.pointerId) {
            event.preventDefault();
            const parent = canvasElement.parentElement;
            if (!parent) return;
            viewportOffsetX =
                panState.offsetX - (event.clientX - panState.startX);
            viewportOffsetY =
                panState.offsetY - (event.clientY - panState.startY);
            scheduleRender();
            textTools.syncTextFormatMenu();
            notifyTransientChange();
            return;
        }
        if (isDrawing) event.preventDefault();
        const [x, y] = getCanvasPoint(event);
        if (!isDrawing) {
            if (activeTool === "select") {
                const anchorIndex = findAnchorAt(selectedElement(), x, y);
                const hoveredElement = findElementAt(x, y);
                canvasElement.style.cursor =
                    anchorIndex >= 0 || hoveredElement ? "grab" : "pointer";
            }
            return;
        }
        if (activeTool === "select" && dragStartPoint) {
            const dx = x - dragStartPoint[0];
            const dy = y - dragStartPoint[1];
            if (selectDragMode === "box") {
                dragSelectBox = buildDragBox(dragStartPoint, [x, y]);
                selectedElementIds = new Set(
                    elements
                        .filter((element) =>
                            boxContainsElementContent(dragSelectBox, element),
                        )
                        .map((element) => element.id),
                );
                notifySelection();
                scheduleRender();
                return;
            }
            if (selectDragMode === "move" && originalSelection.size > 0) {
                elements = elements.map((element) => {
                    const original = originalSelection.get(element.id);
                    if (!original) return element;
                    return bumpElementVersion(element, {
                        x: original.x + dx,
                        y: original.y + dy,
                    });
                });
                scheduleRender();
                textTools.syncTextFormatMenu();
                notifyTransientChange();
                return;
            }
            if (
                selectDragMode === "resize" &&
                selectedElementId &&
                originalElement &&
                activeAnchorIndex >= 0
            ) {
                elements = elements.map((element) => {
                    if (element.id !== selectedElementId) return element;
                    if (element.type === "line" || element.type === "arrow") {
                        const points = (originalElement.points ?? []).map(
                            (point) => [...point],
                        );
                        points[activeAnchorIndex] = [
                            (points[activeAnchorIndex]?.[0] ?? 0) + dx,
                            (points[activeAnchorIndex]?.[1] ?? 0) + dy,
                        ];
                        const absolutePoints = points.map(([px, py]) => [
                            originalElement.x + px,
                            originalElement.y + py,
                        ]);
                        const minX = Math.min(
                            ...absolutePoints.map(([px]) => px),
                        );
                        const minY = Math.min(
                            ...absolutePoints.map(([, py]) => py),
                        );
                        const maxX = Math.max(
                            ...absolutePoints.map(([px]) => px),
                        );
                        const maxY = Math.max(
                            ...absolutePoints.map(([, py]) => py),
                        );
                        return bumpElementVersion(element, {
                            x: minX,
                            y: minY,
                            width: Math.max(1, maxX - minX),
                            height: Math.max(1, maxY - minY),
                            points: absolutePoints.map(([px, py]) => [
                                px - minX,
                                py - minY,
                            ]),
                        });
                    }
                    const leftAnchors = new Set([0, 3]);
                    const topAnchors = new Set([0, 1]);
                    const right = originalElement.x + originalElement.width;
                    const bottom = originalElement.y + originalElement.height;
                    const nextX = leftAnchors.has(activeAnchorIndex)
                        ? originalElement.x + dx
                        : originalElement.x;
                    const nextY = topAnchors.has(activeAnchorIndex)
                        ? originalElement.y + dy
                        : originalElement.y;
                    const nextRight = leftAnchors.has(activeAnchorIndex)
                        ? right
                        : right + dx;
                    const nextBottom = topAnchors.has(activeAnchorIndex)
                        ? bottom
                        : bottom + dy;
                    return scaleElementToBounds(element, {
                        x: Math.min(nextX, nextRight),
                        y: Math.min(nextY, nextBottom),
                        width: Math.max(1, Math.abs(nextRight - nextX)),
                        height: Math.max(1, Math.abs(nextBottom - nextY)),
                        flipX: nextRight < nextX,
                        flipY: nextBottom < nextY,
                    });
                });
                scheduleRender();
                textTools.syncTextFormatMenu();
                notifyTransientChange();
                return;
            }
        }
        if (activeTool === "eraser") {
            currentPoints.push([x, y]);
            updateEraserSelection([x, y]);
            return;
        }
        currentPoints.push([x, y]);
        updateDrawingDraft();
    }

    function onPointerUp(event) {
        if (panState && (!event || panState.pointerId === event.pointerId)) {
            panState = null;
            canvasElement.style.cursor = readOnly
                ? "pointer"
                : activeTool === "select"
                  ? "pointer"
                  : activeTool === "eraser"
                    ? "cell"
                    : "crosshair";
            return;
        }
        if (!isDrawing) return;
        isDrawing = false;
        if (activeTool === "select") {
            if (selectDragMode) {
                const didChange = pushHistoryEntry(
                    historySnapshot ?? cloneElements(),
                    cloneElements(),
                );
                updateCanvasSize();
                if (didChange) changeCallback?.([...elements]);
            }
        } else if (activeTool === "eraser") {
            if (eraserSelectionIds.size > 0) {
                commitElements(
                    elements.map((element) =>
                        eraserSelectionIds.has(element.id)
                            ? bumpElementVersion(element, { isDeleted: true })
                            : element,
                    ),
                );
                selectedElementIds = new Set();
                selectedElementId = null;
                notifySelection();
            }
        } else if (
            drafts.canFinalizeDrawing({
                activeTool,
                currentPoints,
                dragStartPoint,
                draftElement,
            })
        ) {
            commitCreatedElement(
                bumpElementVersion(draftElement, { isTransient: false }),
            );
        }
        const abandonedDraft = draftElement?.id;
        currentPoints = [];
        draftElement = null;
        dragStartPoint = null;
        originalElement = null;
        originalSelection = new Map();
        activeAnchorIndex = null;
        historySnapshot = null;
        eraserSelectionIds = new Set();
        dragSelectBox = null;
        selectDragMode = null;
        scheduleRender();
        if (abandonedDraft && !elements.some(({ id }) => id === abandonedDraft))
            notifyTransientChange();
    }

    function onDoubleClick(event) {
        const [x, y] = getCanvasPoint(event);
        const element = findElementAt(x, y);
        if (activeTool === "select" && element?.type === "text") {
            selectOnlyElement(element.id);
            textTools.openTextEditor(element);
        }
    }

    function onKeyDown(event) {
        const modifierPressed = event.ctrlKey || event.metaKey;
        if (modifierPressed && !event.altKey) {
            const normalizedKey = event.key.toLowerCase();
            if (normalizedKey === "z" && !event.shiftKey) {
                event.preventDefault();
                event.stopPropagation();
                undo();
                return;
            }
            if (
                normalizedKey === "y" ||
                (normalizedKey === "z" && event.shiftKey)
            ) {
                event.preventDefault();
                event.stopPropagation();
                redo();
                return;
            }
        }
        if (event.key !== "Delete" && event.key !== "Backspace") return;
        if (deleteSelectedElements()) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    const onPaste = createClipboardImageHandler({
        commitCreatedElement,
        getImageUploadMaxBytes: () => imageUploadMaxBytes,
        uploadImage: (dataUrl) => imageUploader?.(dataUrl),
        notifyImageRejected: () => {
            changeCallback?.([...elements], {
                type: "image_rejected",
                limit: imageUploadMaxBytes,
            });
        },
    });

    const unbindCanvasEvents = bindWhiteboardCanvasEvents({
        canvasElement,
        onDoubleClick,
        onKeyDown,
        onPaste,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        scheduleRender,
        shouldPreventContextMenu: (event) => {
            if (panState) event.preventDefault();
        },
        readOnly,
    });
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvasElement.parentElement ?? document.body);
    resizeCanvas();
    return {
        setTool(tool) {
            setActiveTool(tool);
        },
        setStrokeColor(color) {
            strokeColor = color;
            if (selectedElementId) {
                commitElements(
                    elements.map((element) =>
                        element.id === selectedElementId
                            ? bumpElementVersion(element, {
                                  strokeColor: color,
                              })
                            : element,
                    ),
                );
                notifySelection();
            }
        },
        setStrokeWidth(width) {
            strokeWidth = Number(width);
            if (
                selectedElementId &&
                isStrokeWidthApplicable(selectedElement())
            ) {
                commitElements(
                    elements.map((element) =>
                        element.id === selectedElementId
                            ? bumpElementVersion(element, { strokeWidth })
                            : element,
                    ),
                );
                notifySelection();
            }
        },
        setImageUploadMaxBytes(maxBytes) {
            imageUploadMaxBytes = Number(maxBytes);
        },
        setImageUploader(uploader) {
            imageUploader = typeof uploader === "function" ? uploader : null;
        },
        setKeepToolActive(keepActive) {
            keepToolActive = Boolean(keepActive);
        },
        getElements() {
            return [...elements];
        },
        getSelectionBounds() {
            return getSelectedElementBounds();
        },
        getSelectedElementIds() {
            return getSelectedElementIds();
        },
        setRemoteSelections(selections) {
            setRemoteSelections(selections);
        },
        getViewportOffset() {
            return { x: viewportOffsetX, y: viewportOffsetY };
        },
        applyElements(
            remoteElements,
            { replace = false, transient = false } = {},
        ) {
            if (transient) {
                remoteDraftElements.reconcile(remoteElements, elements);
                scheduleRender();
                return;
            }
            const stableRemoteElements = remoteElements.filter(
                (element) => element?.isTransient !== true,
            );
            for (const element of stableRemoteElements) {
                if (element?.id) remoteDraftElements.delete(element.id);
            }
            if (replace) {
                remoteDraftElements.clear();
                elements = cloneElements(stableRemoteElements);
                updateCanvasSize();
                selectedElementIds = new Set(
                    [...selectedElementIds].filter((id) =>
                        elements.some((element) => element.id === id),
                    ),
                );
                if (selectedElementId && !selectedElement())
                    selectedElementId = null;
                remoteSelections = new Map(
                    [...remoteSelections].filter(([id]) =>
                        elements.some((element) => element.id === id),
                    ),
                );
                notifySelection();
                scheduleRender();
                return;
            }
            const remoteById = new Map(
                stableRemoteElements.map((element) => [element.id, element]),
            );
            const localById = new Map(
                elements.map((element) => [element.id, element]),
            );
            for (const [remoteId, remoteElement] of remoteById) {
                const local = localById.get(remoteId);
                if (!local) {
                    localById.set(remoteId, remoteElement);
                    continue;
                }
                const remoteVersion = remoteElement.version ?? 0;
                const localVersion = local.version ?? 0;
                if (remoteVersion > localVersion) {
                    localById.set(remoteId, remoteElement);
                } else if (
                    remoteVersion === localVersion &&
                    (remoteElement.versionNonce ?? 0) >
                        (local.versionNonce ?? 0)
                ) {
                    localById.set(remoteId, remoteElement);
                }
            }
            elements = [...localById.values()];
            updateCanvasSize();
            const currentIds = new Set(elements.map((element) => element.id));
            selectedElementIds = new Set(
                [...selectedElementIds].filter((id) => currentIds.has(id)),
            );
            if (selectedElementId && !selectedElement())
                selectedElementId = null;
            remoteSelections = new Map(
                [...remoteSelections].filter(([id]) => currentIds.has(id)),
            );
            notifySelection();
            scheduleRender();
        },
        clearAll() {
            const visibleElements = elements.filter(
                (element) => !element.isDeleted,
            );
            const clearedElements = elements.map((element) =>
                element.isDeleted
                    ? element
                    : bumpElementVersion(element, { isDeleted: true }),
            );
            if (visibleElements.length > 0) {
                pushHistoryEntry(cloneElements(), clearedElements);
            }
            elements = clearedElements;
            currentPoints = [];
            eraserSelectionIds = new Set();
            selectedElementIds = new Set();
            scheduleRender();
            selectedElementId = null;
            notifySelection();
            changeCallback?.([...elements]);
        },
        onSelectionChange(callback) {
            selectionCallback = callback;
            notifySelection();
        },
        onToolChange(callback) {
            toolCallback = callback;
            toolCallback?.(activeTool);
        },
        onHistoryChange(callback) {
            historyCallback = callback;
            notifyHistoryChange();
        },
        canUndo() {
            return historyPast.length > 0;
        },
        canRedo() {
            return historyFuture.length > 0;
        },
        onChange(callback) {
            changeCallback = callback;
        },
        undo,
        redo,
        destroy() {
            textFormatMenu?.remove();
            resizeObserver.disconnect();
            unbindCanvasEvents();
            canvasElement.parentElement
                ?.querySelector(".wb-text-editor")
                ?.remove();
        },
    };
}
