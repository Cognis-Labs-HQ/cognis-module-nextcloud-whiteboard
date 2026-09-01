import { reuse } from "../reuse/host-resources.js";

const [{ formatDateTime }, { escapeHtml }] = await Promise.all([
    reuse.importModule("timestamp.js"),
    reuse.importModule("escape-html.js"),
]);

export function renderCanvasElement({
    activeBoard,
    activeSession,
    boards,
    canRenameActiveBoard,
    preflightStatus,
    syncStatus,
    syncStatusMessage,
    translate,
    integrationCanvasMode = false,
    disposable = false,
    embedded = false,
    showShare = true,
    saved = false,
}) {
    const icon = (name) => {
        const paths = {
            new: '<path d="M12 5v14M5 12h14"/>',
            history:
                '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
            lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
            select: '<path d="m5 3 14 9-6 2-3 6z"/>',
            pen: '<path d="m4 20 4.5-1 10-10-3.5-3.5-10 10zM13.5 6.5 17 10"/>',
            rectangle: '<rect x="4" y="5" width="16" height="14" rx="1"/>',
            diamond: '<path d="m12 3 9 9-9 9-9-9z"/>',
            ellipse: '<ellipse cx="12" cy="12" rx="9" ry="7"/>',
            arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
            line: '<path d="M4 18 20 6"/>',
            text: '<path d="M5 5h14M12 5v14M8 19h8"/>',
            eraser: '<path d="m4 15 9-10 7 7-7 8H8zM10 20h10"/>',
            undo: '<path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/>',
            redo: '<path d="m15 7 5 5-5 5M19 12h-8a6 6 0 0 0-6 6"/>',
            clear: '<path d="M6 6l12 12M18 6 6 18"/>',
        };
        return `<svg class="whiteboard-tool-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
    };
    const hasActiveBoard = Boolean(activeBoard);
    const overlayHidden = hasActiveBoard && preflightStatus === "passed";
    const overlayMessage = hasActiveBoard
        ? translate("module.nextcloud_whiteboard.connecting_ellipsis")
        : translate("module.nextcloud_whiteboard.canvas_placeholder");
    const boardList = boards
        .map(
            (board) =>
                `<button type="button" class="whiteboard-overlay-board" data-board-id="${escapeHtml(board.id)}"><span class="whiteboard-overlay-board-title">${escapeHtml(board.title)}</span><span class="whiteboard-overlay-board-updated">${escapeHtml(formatDateTime(board.updatedAt, ""))}</span></button>`,
        )
        .join("");
    const toolButton = (tool, labelKey, icon) =>
        `<button type="button" data-tool="${tool}" class="whiteboard-tool${tool === "select" ? " active" : ""}" title="${escapeHtml(translate(labelKey))}" aria-label="${escapeHtml(translate(labelKey))}">${icon}</button>`;

    return `
    <div class="whiteboard-canvas-wrap${embedded ? " whiteboard-canvas-wrap--embedded" : ""}">
      <div id="whiteboard-toolbar" class="whiteboard-toolbar" role="toolbar" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.toolbar_label"))}">
        <div class="whiteboard-toolbar-tools">
        <div class="whiteboard-toolbar-group">
          ${integrationCanvasMode || embedded ? "" : `<button type="button" id="whiteboard-new" class="whiteboard-tool whiteboard-new-tool" title="${escapeHtml(translate("module.nextcloud_whiteboard.new_board"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.new_board"))}">${icon("new")} <span>${escapeHtml(translate("module.nextcloud_whiteboard.new"))}</span></button>`}
          ${embedded ? "" : `<button type="button" id="whiteboard-history" class="whiteboard-tool" title="${escapeHtml(translate("module.nextcloud_whiteboard.history_title"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.history_title"))}">${icon("history")}</button>`}
          ${hasActiveBoard ? `<button type="button" id="whiteboard-tool-lock" class="whiteboard-tool" aria-pressed="false" title="${escapeHtml(translate("module.nextcloud_whiteboard.tool_lock"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.tool_lock"))}">${icon("lock")}</button>` : ""}
        </div>
        <div class="whiteboard-toolbar-group" ${hasActiveBoard ? "" : "hidden"}>
          ${["select", "pen", "rectangle", "diamond", "ellipse", "arrow", "line", "text", "eraser"].map((tool) => toolButton(tool, `module.nextcloud_whiteboard.tool_${tool}`, icon(tool))).join("")}
        </div>
        <div class="whiteboard-toolbar-group" ${hasActiveBoard ? "" : "hidden"}>
          <button type="button" id="whiteboard-undo" class="whiteboard-tool" title="${escapeHtml(translate("module.nextcloud_whiteboard.undo"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.undo"))}">${icon("undo")}</button>
          <button type="button" id="whiteboard-redo" class="whiteboard-tool" title="${escapeHtml(translate("module.nextcloud_whiteboard.redo"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.redo"))}">${icon("redo")}</button>
        </div>
        <div class="whiteboard-toolbar-group" ${hasActiveBoard ? "" : "hidden"}>
          <input type="color" id="whiteboard-color" value="#111827" title="${escapeHtml(translate("module.nextcloud_whiteboard.stroke_color"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.stroke_color"))}" />
          <select id="whiteboard-stroke-width" class="whiteboard-tool theme-select" title="${escapeHtml(translate("module.nextcloud_whiteboard.stroke_width"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.stroke_width"))}">
            <option value="2">${escapeHtml(translate("module.nextcloud_whiteboard.stroke_thin"))}</option>
            <option value="4" selected>${escapeHtml(translate("module.nextcloud_whiteboard.stroke_medium"))}</option>
            <option value="8">${escapeHtml(translate("module.nextcloud_whiteboard.stroke_thick"))}</option>
          </select>
        </div>
        <div id="whiteboard-text-controls" class="whiteboard-toolbar-group whiteboard-text-controls" hidden>
          <input type="number" id="whiteboard-font-size" class="whiteboard-tool" min="8" max="96" step="1" value="28" title="${escapeHtml(translate("module.nextcloud_whiteboard.font_size"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.font_size"))}" />
          <select id="whiteboard-font-family" class="whiteboard-tool theme-select" title="${escapeHtml(translate("module.nextcloud_whiteboard.font_family"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.font_family"))}"></select>
        </div>
        <div class="whiteboard-toolbar-group" ${hasActiveBoard ? "" : "hidden"}>
          ${disposable || !showShare ? "" : `<span id="whiteboard-share-slot"></span>`}
        </div>
        ${integrationCanvasMode ? "" : `<span class="whiteboard-board-identity"><span id="whiteboard-board-title" class="whiteboard-board-title" title="${escapeHtml(canRenameActiveBoard() ? translate("module.nextcloud_whiteboard.rename_hint") : "")}">${escapeHtml(activeSession?.title ?? activeBoard?.title ?? "")}</span>${hasActiveBoard ? `<a href="#" id="whiteboard-clear" class="whiteboard-tool btn-cancel" role="button" title="${escapeHtml(translate("module.nextcloud_whiteboard.clear_board"))}" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.clear_board"))}">${icon("clear")}</a>` : ""}</span>`}
        <div id="page-presence-section" class="whiteboard-toolbar-group whiteboard-presence" aria-live="polite"></div>
        </div>
        <span class="whiteboard-save-state"><span id="whiteboard-saved-pill" class="whiteboard-saved-pill">${escapeHtml(translate("module.nextcloud_whiteboard.saved"))}</span>${disposable ? `<button type="button" id="whiteboard-save-copy" class="whiteboard-save-copy" data-dirty="${String(!saved)}">${escapeHtml(translate("module.nextcloud_whiteboard.save_canvas"))}</button>` : ""}<span id="whiteboard-sync-status" class="whiteboard-sync-status" data-status="${escapeHtml(syncStatus)}" title="${escapeHtml(syncStatusMessage || translate("module.nextcloud_whiteboard.status_idle"))}"></span></span>
      </div>
      <div class="whiteboard-canvas-stage">
        <canvas id="whiteboard-canvas" tabindex="0" aria-label="${escapeHtml(translate("module.nextcloud_whiteboard.canvas_label"))}"></canvas>
        <div id="whiteboard-canvas-overlay" class="whiteboard-canvas-overlay" ${overlayHidden ? "hidden" : ""} aria-live="polite">
          <div class="whiteboard-start-panel">
            <p class="whiteboard-overlay-message">${escapeHtml(overlayMessage)}</p>
            ${hasActiveBoard ? "" : `<div class="whiteboard-start-actions">${integrationCanvasMode || embedded ? "" : `<button type="button" id="whiteboard-start-new">${escapeHtml(translate("module.nextcloud_whiteboard.new_board"))}</button>`}${embedded ? "" : `<button type="button" id="whiteboard-start-history">${escapeHtml(translate("module.nextcloud_whiteboard.history_title"))}</button>`}</div><div class="whiteboard-overlay-board-list" data-count="${boards.length}">${boardList || `<p>${escapeHtml(translate("module.nextcloud_whiteboard.empty"))}</p>`}</div>`}
          </div>
        </div>
      </div>
    </div>`;
}
