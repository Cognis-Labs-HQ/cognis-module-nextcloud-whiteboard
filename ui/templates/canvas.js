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
    const icon = (name) =>
        `<span class="whiteboard-tool-icon whiteboard-tool-icon--${name}" aria-hidden="true"></span>`;
    const hasActiveBoard = Boolean(activeBoard);
    const overlayHidden = hasActiveBoard && preflightStatus === "passed";
    const overlayMessage = hasActiveBoard
        ? translate("module.nextcloud.whiteboard.connecting.ellipsis")
        : translate("module.nextcloud.whiteboard.canvas.placeholder");
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
      <div id="whiteboard-toolbar" class="whiteboard-toolbar" role="toolbar" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.toolbar.label"))}">
        <div class="whiteboard-toolbar-tools">
        <div class="whiteboard-toolbar-group">
          ${integrationCanvasMode || embedded ? "" : `<button type="button" id="whiteboard-new" class="whiteboard-tool whiteboard-new-tool" title="${escapeHtml(translate("module.nextcloud.whiteboard.new.board"))}" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.new.board"))}">${icon("new")} <span>${escapeHtml(translate("module.nextcloud.whiteboard.new"))}</span></button>`}
          ${hasActiveBoard ? `<button type="button" id="whiteboard-tool-lock" class="whiteboard-tool" aria-pressed="false" title="${escapeHtml(translate("module.nextcloud.whiteboard.tool.lock"))}" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.tool.lock"))}">${icon("lock")}</button>` : ""}
        </div>
        <div class="whiteboard-toolbar-group" ${hasActiveBoard ? "" : "hidden"}>
          ${["select", "pen", "rectangle", "diamond", "ellipse", "arrow", "line", "text", "eraser"].map((tool) => toolButton(tool, `module.nextcloud.whiteboard.tool.${tool}`, icon(tool))).join("")}
        </div>
        <div class="whiteboard-toolbar-group" ${hasActiveBoard ? "" : "hidden"}>
          <button type="button" id="whiteboard-undo" class="whiteboard-tool" title="${escapeHtml(translate("module.nextcloud.whiteboard.undo"))}" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.undo"))}">${icon("undo")}</button>
          <button type="button" id="whiteboard-redo" class="whiteboard-tool" title="${escapeHtml(translate("module.nextcloud.whiteboard.redo"))}" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.redo"))}">${icon("redo")}</button>
        </div>
        <div class="whiteboard-toolbar-group" ${hasActiveBoard ? "" : "hidden"}>
          <input type="color" id="whiteboard-color" value="#111827" title="${escapeHtml(translate("module.nextcloud.whiteboard.stroke.color"))}" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.stroke.color"))}" />
          <select id="whiteboard-stroke-width" class="whiteboard-tool theme-select" title="${escapeHtml(translate("module.nextcloud.whiteboard.stroke.width"))}" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.stroke.width"))}">
            <option value="2">${escapeHtml(translate("module.nextcloud.whiteboard.stroke.thin"))}</option>
            <option value="4" selected>${escapeHtml(translate("module.nextcloud.whiteboard.stroke.medium"))}</option>
            <option value="8">${escapeHtml(translate("module.nextcloud.whiteboard.stroke.thick"))}</option>
          </select>
        </div>
        <div id="whiteboard-text-controls" class="whiteboard-toolbar-group whiteboard-text-controls" hidden>
          <input type="number" id="whiteboard-font-size" class="whiteboard-tool" min="8" max="96" step="1" value="28" title="${escapeHtml(translate("module.nextcloud.whiteboard.font.size"))}" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.font.size"))}" />
          <select id="whiteboard-font-family" class="whiteboard-tool theme-select" title="${escapeHtml(translate("module.nextcloud.whiteboard.font.family"))}" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.font.family"))}"></select>
        </div>
        <div class="whiteboard-toolbar-group" ${hasActiveBoard ? "" : "hidden"}>
          ${disposable || !showShare ? "" : `<span id="whiteboard-share-slot"></span>`}
        </div>
        ${integrationCanvasMode ? "" : `<span class="whiteboard-board-identity"><span id="whiteboard-board-title" class="whiteboard-board-title" title="${escapeHtml(canRenameActiveBoard() ? translate("module.nextcloud.whiteboard.rename.hint") : "")}">${escapeHtml(activeSession?.title ?? activeBoard?.title ?? "")}</span>${hasActiveBoard ? `<button type="button" id="whiteboard-clear" class="whiteboard-tool whiteboard-tool--cancel" title="${escapeHtml(translate("module.nextcloud.whiteboard.clear.board"))}" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.clear.board"))}">${icon("clear")}</button>` : ""}</span>`}
        <div id="page-presence-section" class="whiteboard-toolbar-group whiteboard-presence" aria-live="polite"></div>
        </div>
        <span class="whiteboard-save-state"><span id="whiteboard-saved-pill" class="whiteboard-saved-pill"><span>${escapeHtml(translate("module.nextcloud.whiteboard.saved"))}</span></span>${disposable ? `<button type="button" id="whiteboard-save-copy" class="whiteboard-save-copy" data-dirty="${String(!saved)}">${escapeHtml(translate("module.nextcloud.whiteboard.save.canvas"))}</button>` : ""}<span id="whiteboard-sync-status" class="whiteboard-sync-status" data-status="${escapeHtml(syncStatus)}" title="${escapeHtml(syncStatusMessage || translate("module.nextcloud.whiteboard.status.idle"))}"></span></span>
      </div>
      <div class="whiteboard-canvas-stage">
        <canvas id="whiteboard-canvas" tabindex="0" aria-label="${escapeHtml(translate("module.nextcloud.whiteboard.canvas.label"))}"></canvas>
        <div id="whiteboard-canvas-overlay" class="whiteboard-canvas-overlay" ${overlayHidden ? "hidden" : ""} aria-live="polite">
          <div class="whiteboard-start-panel">
            <p class="whiteboard-overlay-message">${escapeHtml(overlayMessage)}</p>
            ${hasActiveBoard ? "" : `<div class="whiteboard-start-actions">${integrationCanvasMode || embedded ? "" : `<button type="button" id="whiteboard-start-new">${escapeHtml(translate("module.nextcloud.whiteboard.new.board"))}</button>`}</div><div class="whiteboard-overlay-board-list" data-count="${boards.length}">${boardList || `<p>${escapeHtml(translate("module.nextcloud.whiteboard.empty"))}</p>`}</div>`}
          </div>
        </div>
      </div>
    </div>`;
}
