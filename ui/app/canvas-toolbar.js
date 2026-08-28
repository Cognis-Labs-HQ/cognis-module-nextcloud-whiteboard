import { confirmClearCanvas } from "./clear-canvas.js";

export function bindWhiteboardCanvasToolbar({
    canvas,
    canRename,
    escapeHtml,
    mountRoot,
    onBindShareButton,
    onClear,
    onCreateBoard,
    onHistory,
    onRename,
    onSelectionChange,
    translate,
    withinMount,
}) {
    const toolbar = withinMount("#whiteboard-toolbar");
    if (!toolbar || toolbar.dataset.bound === "true") return;
    toolbar.dataset.bound = "true";
    if (!withinMount("#whiteboard-tool-lock")) {
        const historyButton = withinMount("#whiteboard-history");
        historyButton?.insertAdjacentHTML(
            "afterend",
            `<button type="button" id="whiteboard-tool-lock" class="whiteboard-tool" aria-pressed="false" title="${escapeHtml(translate("module.nextcloud_whiteboard.tool_lock"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.tool_lock"))}">🔒</button>`,
        );
    }
    toolbar
        .querySelectorAll(".whiteboard-toolbar-group[hidden]")
        .forEach((element) => {
            element.hidden = false;
        });
    const strokeTools = new Set([
        "pen",
        "rectangle",
        "diamond",
        "ellipse",
        "line",
        "arrow",
    ]);
    let selectedElement = null;
    let activeTool = "select";
    let keepToolActive = false;
    function activateTool(tool) {
        activeTool = tool;
        toolbar.querySelectorAll("[data-tool]").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.tool === tool);
        });
        updateStyleControls();
    }
    function selectedCanUseStrokeWidth() {
        return Boolean(selectedElement?.strokeWidthApplicable);
    }
    function activeToolCanUseStrokeWidth() {
        return strokeTools.has(activeTool);
    }
    function updateStyleControls() {
        const strokeSelect = withinMount("#whiteboard-stroke-width");
        if (strokeSelect) {
            strokeSelect.disabled = !(
                selectedCanUseStrokeWidth() || activeToolCanUseStrokeWidth()
            );
            if (selectedCanUseStrokeWidth()) {
                strokeSelect.value = String(selectedElement.strokeWidth ?? 4);
            }
        }
    }
    const undoButton = withinMount("#whiteboard-undo");
    const redoButton = withinMount("#whiteboard-redo");
    function updateHistoryControls() {
        if (undoButton) undoButton.disabled = !canvas.canUndo?.();
        if (redoButton) redoButton.disabled = !canvas.canRedo?.();
    }
    toolbar.querySelectorAll("[data-tool]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const tool = button.dataset.tool;
            activateTool(tool);
            canvas.setTool(tool);
        });
    });
    canvas.onToolChange?.((tool) => activateTool(tool));
    canvas.onHistoryChange?.(updateHistoryControls);
    const lockButton = withinMount("#whiteboard-tool-lock");
    lockButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        keepToolActive = !keepToolActive;
        lockButton.classList.toggle("active", keepToolActive);
        lockButton.setAttribute("aria-pressed", String(keepToolActive));
        canvas.setKeepToolActive?.(keepToolActive);
    });
    withinMount("#whiteboard-new")?.addEventListener(
        "click",
        () => void onCreateBoard(),
    );
    withinMount("#whiteboard-history")?.addEventListener(
        "click",
        () => void onHistory(),
    );
    undoButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        canvas.undo?.();
        updateHistoryControls();
    });
    redoButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        canvas.redo?.();
        updateHistoryControls();
    });
    onBindShareButton(toolbar);
    if (canRename()) {
        withinMount("#whiteboard-board-title")?.addEventListener(
            "dblclick",
            () => void onRename(),
        );
    }
    const colorInput = withinMount("#whiteboard-color");
    const themeStrokeColor = () =>
        getComputedStyle(mountRoot).getPropertyValue("--text").trim() ||
        "#111827";
    if (colorInput) {
        colorInput.value = themeStrokeColor();
        canvas.setStrokeColor("auto");
    }
    colorInput?.addEventListener("input", () => {
        canvas.setStrokeColor(colorInput.value);
    });
    const strokeSelect = withinMount("#whiteboard-stroke-width");
    strokeSelect?.addEventListener("change", () => {
        canvas.setStrokeWidth(strokeSelect.value);
    });
    canvas.onSelectionChange?.((element) => {
        selectedElement = element;
        if (colorInput && element?.strokeColor) {
            colorInput.value =
                element.strokeColor === "auto"
                    ? themeStrokeColor()
                    : element.strokeColor;
        }
        updateStyleControls();
        onSelectionChange();
    });
    updateStyleControls();
    withinMount("#whiteboard-clear")?.addEventListener(
        "click",
        async (event) => {
            event.preventDefault();
            if (!(await confirmClearCanvas(translateModuleString))) return;
            canvas.clearAll();
            onClear();
        },
    );
}
