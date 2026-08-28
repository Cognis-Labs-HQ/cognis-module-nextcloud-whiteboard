import { reuse, uiCtx } from "../reuse/host-resources.js";
import { createWhiteboardCanvas } from "../whiteboard/canvas.js";
import { confirmClearCanvas } from "./clear-canvas.js";
import { createWhiteboardSearchCollector } from "./search-index.js";
import { createWhiteboardStatusController } from "./status.js";
import { openWhiteboardSharePopup } from "./share-popup.js";
import { bindOverlayBoardSelection, setOverlayVisible } from "./overlay.js";
import { openWhiteboardHistoryPopup } from "./history-popup.js";
import { renderCanvasElement as renderWhiteboardCanvasElement } from "./render.js";
import {
    API_BASE,
    apiFetchJson,
    createRandomWhiteboardTitle,
    fetchWhiteboardList,
    fetchWhiteboardSession,
    renameWhiteboard,
    saveWhiteboardElements,
    spawnWhiteboard,
    uploadWhiteboardImage,
} from "./api.js";
import {
    debounce,
    decodeSceneMessage,
    encodeSceneMessage,
    encodeSyncMessage,
    loadSocketIo,
    throttleLatest,
} from "./realtime.js";
import { applyRemoteSceneUpdate } from "./reuse/scene-updates.js";
import {
    applyRemotePresenceSelections,
    getPointerOffset,
    getSelectionPayload,
    hydratePresenceAvatars,
    renderWhiteboardPresenceEntry,
} from "./presence.js";
import { getPreparedDisposableCanvasId } from "../reuse/whiteboard-ui-gateway.js";
import { syncBoardUrl } from "../reuse/board-navigation.js";
import { createWhiteboardPreflightController } from "./preflight.js";

const [
    { applyDocumentTitle, createI18n },
    { createPageComposer },
    { mountWhenDirect },
    { registerSearchIndex },
    { showToast },
    { escapeHtml },
] = await Promise.all([
    reuse.importModule("i18n.js"),
    reuse.importModule("page-composer/index.js"),
    reuse.importModule("page-entry.js"),
    reuse.importModule("search-util/popup.js"),
    reuse.importModule("toast.js"),
    reuse.importModule("escape-html.js"),
]);
await reuse.loadStylesheets(["page-sections.css"]);
const EMIT_DEBOUNCE_MS = 80;
const RECONNECT_MAX_DELAY_MS = 30000;
const SYNC_MESSAGE_SCENE_INIT = "SCENE_INIT";
const SYNC_MESSAGE_SCENE_UPDATE = "SCENE_UPDATE";
const SYNC_MESSAGE_SCENE_REQUEST = "SCENE_REQUEST";
const SYNC_MESSAGE_BOARD_RENAMED = "BOARD_RENAMED";
const DIRECT_WHITEBOARD_PATHS = new Set(["/whiteboard", "/whiteboards"]);
let i18n = null;
let composer = null;
let boards = [];
let activeBoard = null;
let activeSession = null;
let activeShareContext = null;
let canvasInstance = null;
let socketInstance = null;
let savedElements = [];
let lastConnectionToast = "";
let imageUploadMaxBytes = 1048576;
let integrationCanvasMode = false;
let disposableCanvasMode = false;
let embeddedComponentMode = false;
let hostNavigationAllowed = true;
/** @type {Element | null} */
let pageMountRoot = null;
let runtimeDispose = null;
let shareControlDispose = null;
const withinMount = (selector) =>
    pageMountRoot?.querySelector(selector) ?? null;
const {
    buildConnectionErrorMessage,
    canManageShares,
    getSyncStatus,
    reportClientError,
    setSyncStatus,
    setSyncStatusMessage,
    sharePageFlag,
    translate: translateModuleString,
} = createWhiteboardStatusController({
    getI18n: () => i18n,
    getIntegrationCanvasMode: () => integrationCanvasMode,
    getShareContext: () => activeShareContext,
    showToast,
});
const preflightController = createWhiteboardPreflightController({
    fetchPreflight: () =>
        apiFetchJson("/whiteboards/preflight", { method: "POST" }),
    getMountRoot: () => pageMountRoot,
    getResourceLoader: () => uiCtx.capabilities.get("ui:resourceLoader"),
    loadSocketIo,
    setOverlayVisible,
    showToast,
    translate: translateModuleString,
});
const collectWhiteboardSearchGroups = createWhiteboardSearchCollector({
    getActiveBoard: () => activeBoard,
    getBoards: () => boards,
    getSavedElements: () => savedElements,
    translate: translateModuleString,
});
async function loadBoards() {
    boards = await fetchWhiteboardList();
}
function teardownCanvas() {
    shareControlDispose?.();
    shareControlDispose = null;
    if (socketInstance) {
        try {
            socketInstance.cognisCleanup?.();
            socketInstance.disconnect();
        } catch (error) {
            console.warn(
                "[nextcloud-whiteboard] socket disconnect failed:",
                error,
            );
        }
        socketInstance = null;
    }
    if (canvasInstance) {
        try {
            canvasInstance.destroy();
        } catch (error) {
            console.warn(
                "[nextcloud-whiteboard] canvas destroy failed:",
                error,
            );
        }
        canvasInstance = null;
    }
    activeSession = null;
    runtimeDispose?.();
    runtimeDispose = null;
}
function canRenameActiveBoard() {
    return Boolean(
        !integrationCanvasMode && activeSession?.canRename && activeBoard?.id,
    );
}
function applyBoardTitle(title) {
    const normalizedTitle = String(title ?? "").trim();
    if (!normalizedTitle) return;
    activeBoard = {
        ...(activeBoard ?? {}),
        title: normalizedTitle,
    };
    if (activeSession) activeSession.title = normalizedTitle;
    const titleEl = withinMount("#whiteboard-board-title");
    if (titleEl && titleEl.dataset.renaming !== "true") {
        titleEl.textContent = normalizedTitle;
    }
}
function emitBoardRenamed(title) {
    if (!socketInstance?.connected || !activeSession?.roomId) return;
    socketInstance.emit(
        "server-broadcast",
        activeSession.roomId,
        encodeSyncMessage(SYNC_MESSAGE_BOARD_RENAMED, { title }),
        [],
    );
}

function setDisposableSaveDirty(session, dirty) {
    if (!session?.disposable) return;
    const saveButton = withinMount("#whiteboard-save-copy");
    if (!saveButton) return;
    saveButton.dataset.dirty = String(dirty);
    saveButton.hidden = false;
}

function bindDisposableSaveButton(session, canvas) {
    if (!session?.disposable) return;
    const statusBox = withinMount("#whiteboard-sync-status");
    if (!statusBox) return;
    if (!withinMount("#whiteboard-save-copy")) {
        statusBox.insertAdjacentHTML(
            "beforebegin",
            `<button type="button" id="whiteboard-save-copy" class="whiteboard-save-copy" aria-label="${escapeHtml(translateModuleString("module.nextcloud_whiteboard.save_canvas"))}">${escapeHtml(translateModuleString("module.nextcloud_whiteboard.save_canvas"))}</button>`,
        );
    }
    const saveButton = withinMount("#whiteboard-save-copy");
    if (!saveButton || saveButton.dataset.bound === "true") return;
    saveButton.dataset.bound = "true";
    saveButton.dataset.dirty = String(!session.saved);
    saveButton.addEventListener("click", async () => {
        saveButton.disabled = true;
        try {
            setSyncStatus(
                "syncing",
                "module.nextcloud_whiteboard.status_syncing",
            );
            const saved = await saveWhiteboardElements(
                session.roomId,
                canvas.getElements(),
                { explicitSave: true },
            );
            if (Array.isArray(saved?.elements)) {
                canvas.applyElements(saved.elements);
            }
            savedElements = canvas.getElements();
            session.saved = true;
            setDisposableSaveDirty(session, false);
            setSyncStatus(
                "synced",
                "module.nextcloud_whiteboard.status_synced",
            );
        } catch (error) {
            reportClientError(
                error,
                "module.nextcloud_whiteboard.status_sync_failed",
            );
        } finally {
            saveButton.disabled = false;
        }
    });
}

function connectSocket(io, session, canvas) {
    const { serverUrl, roomId, token } = session;
    const canWrite = session.canWrite === true;
    const socket = io(serverUrl, {
        auth: { token },
        transports: ["websocket"],
        reconnectionDelay: 1000,
        reconnectionDelayMax: RECONNECT_MAX_DELAY_MS,
        closeOnBeforeunload: true,
    });
    const handleVisibilityChange = () => {
        if (document.hidden) {
            socket.disconnect();
        } else if (!socket.connected) {
            socket.connect();
        }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    socket.cognisCleanup = () =>
        document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange,
        );
    let joinedRoom = false;
    let isDedicatedSyncer = false;
    const emitSceneSnapshot = () => {
        if (!socket.connected || !joinedRoom) return;
        socket.emit(
            "server-broadcast",
            roomId,
            encodeSceneMessage(SYNC_MESSAGE_SCENE_INIT, canvas.getElements()),
            [],
        );
    };
    const requestScene = () => {
        if (!socket.connected || !joinedRoom) return;
        socket.emit(
            "server-broadcast",
            roomId,
            encodeSyncMessage(SYNC_MESSAGE_SCENE_REQUEST),
            [],
        );
    };
    const persistChanges = debounce(async (elements) => {
        if (session.disposable) return;
        try {
            const saved = await saveWhiteboardElements(roomId, elements);
            if (Array.isArray(saved?.elements)) {
                canvas.applyElements(saved.elements);
            }
            savedElements = canvas.getElements();
            setSyncStatus(
                "synced",
                "module.nextcloud_whiteboard.status_synced",
            );
        } catch (error) {
            reportClientError(
                error,
                "module.nextcloud_whiteboard.status_sync_failed",
            );
        }
    }, EMIT_DEBOUNCE_MS);
    const emitChanges = throttleLatest(
        (elements, type = SYNC_MESSAGE_SCENE_INIT, transient = false) => {
            if (!canWrite) return;
            if (!socket.connected || !joinedRoom) {
                setSyncStatus(
                    "error",
                    "module.nextcloud_whiteboard.status_sync_failed",
                );
                return;
            }
            setSyncStatus(
                "syncing",
                "module.nextcloud_whiteboard.status_syncing",
            );
            socket.emit(
                "server-broadcast",
                roomId,
                encodeSceneMessage(type, elements, { transient }),
                [],
            );
            if (session.disposable) {
                setSyncStatus(
                    "idle",
                    "module.nextcloud_whiteboard.status_unsaved",
                );
            }
        },
        EMIT_DEBOUNCE_MS,
    );
    canvas.onChange((elements, meta) => {
        if (meta?.type === "image_rejected") {
            showToast(
                translateModuleString(
                    "module.nextcloud_whiteboard.image_too_large",
                ).replace("{limit}", String(meta.limit)),
                { variant: "error" },
            );
            return;
        }
        savedElements = elements;
        composer?.refreshPresence?.();
        if (meta?.transient !== true) setDisposableSaveDirty(session, true);
        if (canWrite && meta?.transient !== true) persistChanges(elements);
        if (canWrite) {
            emitChanges(
                elements,
                SYNC_MESSAGE_SCENE_UPDATE,
                meta?.transient === true,
            );
        }
    });
    socket.on("connect", () => {
        lastConnectionToast = "";
        joinedRoom = false;
    });
    socket.on("init-room", () => {
        socket.emit("join-room", roomId);
    });
    socket.on("room-user-change", () => {
        joinedRoom = true;
        setSyncStatus(
            session.disposable && !session.saved ? "idle" : "synced",
            session.disposable && !session.saved
                ? "module.nextcloud_whiteboard.status_unsaved"
                : "module.nextcloud_whiteboard.status_synced",
        );
        if (isDedicatedSyncer) emitSceneSnapshot();
        requestScene();
    });
    socket.on("sync-designate", ({ isSyncer } = {}) => {
        isDedicatedSyncer = Boolean(isSyncer);
        if (joinedRoom && isDedicatedSyncer) {
            emitSceneSnapshot();
        } else if (joinedRoom) {
            setSyncStatus(
                session.disposable && !session.saved ? "idle" : "synced",
                session.disposable && !session.saved
                    ? "module.nextcloud_whiteboard.status_unsaved"
                    : "module.nextcloud_whiteboard.status_synced",
            );
        }
    });
    socket.on("user-joined", () => {
        if (joinedRoom) emitSceneSnapshot();
    });
    socket.on("connect_error", (error) => {
        const message = buildConnectionErrorMessage(error, serverUrl);
        setSyncStatusMessage("error", message);
        if (message !== lastConnectionToast) {
            lastConnectionToast = message;
            showToast(message, { variant: "error" });
        }
    });
    socket.on("client-broadcast", (payload) => {
        try {
            const message = decodeSceneMessage(payload);
            if (message.type === SYNC_MESSAGE_BOARD_RENAMED) {
                applyBoardTitle(message.payload?.title);
                return;
            }
            if (message.type === SYNC_MESSAGE_SCENE_REQUEST) {
                emitSceneSnapshot();
                return;
            }
            if (
                (message.type === SYNC_MESSAGE_SCENE_INIT ||
                    message.type === SYNC_MESSAGE_SCENE_UPDATE) &&
                applyRemoteSceneUpdate({
                    message,
                    canvas,
                    session,
                    canWrite,
                    persistChanges,
                    setDisposableSaveDirty,
                })
            ) {
                savedElements = canvas.getElements();
            }
        } catch (error) {
            console.warn(
                "[nextcloud-whiteboard] ignored remote sync payload",
                error,
            );
        }
    });
    return socket;
}

async function createAndOpenBoard() {
    const passed = await runPreflightCheck();
    if (!passed) return;
    let spawnResult;
    try {
        spawnResult = await spawnWhiteboard({
            title: createRandomWhiteboardTitle(),
        });
    } catch (error) {
        reportClientError(error, "module.nextcloud_whiteboard.spawn_failed");
        return;
    }
    savedElements = [];
    showToast(
        translateModuleString("module.nextcloud_whiteboard.created_success"),
        {
            variant: "success",
        },
    );
    await openBoard(spawnResult.whiteboard);
}

function bindCanvasToolbar(canvas) {
    const toolbar = withinMount("#whiteboard-toolbar");
    if (!toolbar || toolbar.dataset.bound === "true") return;
    toolbar.dataset.bound = "true";
    if (!withinMount("#whiteboard-tool-lock")) {
        const historyButton = withinMount("#whiteboard-history");
        historyButton?.insertAdjacentHTML(
            "afterend",
            `<button type="button" id="whiteboard-tool-lock" class="whiteboard-tool" aria-pressed="false" title="${escapeHtml(translateModuleString("module.nextcloud_whiteboard.tool_lock"))}" aria-label="${escapeHtml(translateModuleString("module.nextcloud_whiteboard.tool_lock"))}">🔒</button>`,
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
        () => void createAndOpenBoard(),
    );
    withinMount("#whiteboard-history")?.addEventListener(
        "click",
        () => void openHistoryPopup(),
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
    bindShareButton(toolbar);
    if (canRenameActiveBoard()) {
        withinMount("#whiteboard-board-title")?.addEventListener(
            "dblclick",
            () => void renameActiveBoard(),
        );
    }
    const colorInput = withinMount("#whiteboard-color");
    const themeStrokeColor = () =>
        getComputedStyle(pageMountRoot).getPropertyValue("--text").trim() ||
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
        composer?.refreshPresence?.();
    });
    updateStyleControls();
    withinMount("#whiteboard-clear")?.addEventListener(
        "click",
        async (event) => {
            event.preventDefault();
            if (!(await confirmClearCanvas(translateModuleString))) return;
            canvas.clearAll();
            savedElements = [];
        },
    );
}

async function bindShareButton(toolbar) {
    const slot = toolbar.querySelector("#whiteboard-share-slot");
    if (!(slot instanceof HTMLElement) || !activeBoard?.id) return;
    const shareGateway = uiCtx.capabilities.get("share:uiGateway");
    if (typeof shareGateway?.mountTrigger !== "function") return;
    shareControlDispose?.();
    const mounted = await shareGateway.mountTrigger(slot, {
        onActivate: openSharePopup,
        variant: "toolbar",
    });
    shareControlDispose = () => mounted?.destroy?.();
}

function openSharePopup() {
    return openWhiteboardSharePopup({
        board: activeBoard,
        canManageShares,
        openPopup: uiCtx.capabilities.get("share:openPopup"),
        reportError: reportClientError,
        translate: translateModuleString,
    });
}

async function openHistoryPopup() {
    try {
        await loadBoards();
    } catch (error) {
        reportClientError(
            error,
            "module.nextcloud_whiteboard.load_boards_failed",
        );
        return;
    }
    await openWhiteboardHistoryPopup({
        boards,
        escapeHtml,
        openPopup,
        translate: translateModuleString,
    });
}

async function renameActiveBoard() {
    if (!activeBoard || !canRenameActiveBoard()) return;
    const titleEl = withinMount("#whiteboard-board-title");
    if (!titleEl || titleEl.dataset.renaming === "true") return;
    titleEl.dataset.renaming = "true";
    titleEl.contentEditable = "true";
    titleEl.focus();
    document.getSelection()?.selectAllChildren(titleEl);
    let finishing = false;
    const cleanup = () => {
        titleEl.contentEditable = "false";
        delete titleEl.dataset.renaming;
        titleEl.removeEventListener("blur", finish);
        titleEl.removeEventListener("keydown", onKeydown);
    };
    const finish = async () => {
        if (finishing) return;
        finishing = true;
        const nextTitle = titleEl.textContent?.trim() || activeBoard.title;
        cleanup();
        if (nextTitle === activeBoard.title) {
            titleEl.textContent = activeBoard.title;
            return;
        }
        try {
            const boardId =
                activeBoard.id ||
                activeSession?.roomId ||
                new URLSearchParams(window.location.search).get("id");
            const renamed = await renameWhiteboard(boardId, nextTitle);
            activeBoard = {
                ...activeBoard,
                ...renamed,
                id: renamed.id || boardId,
            };
            applyBoardTitle(activeBoard.title);
            emitBoardRenamed(activeBoard.title);
            showToast(
                translateModuleString(
                    "module.nextcloud_whiteboard.rename_success",
                ),
                {
                    variant: "success",
                },
            );
        } catch (error) {
            reportClientError(
                error,
                "module.nextcloud_whiteboard.rename_failed",
            );
            titleEl.textContent = activeBoard.title;
        }
    };
    const onKeydown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            titleEl.blur();
        } else if (event.key === "Escape") {
            event.preventDefault();
            cleanup();
            titleEl.textContent = activeBoard.title;
        }
    };
    titleEl.addEventListener("blur", finish);
    titleEl.addEventListener("keydown", onKeydown);
}

async function runPreflightCheck() {
    return preflightController.run();
}

async function openBoard(board) {
    activeBoard = board;
    syncBoardUrl({
        boardId: board?.id,
        hostNavigationAllowed,
        integrationCanvasMode,
        shareContext: activeShareContext,
    });
    teardownCanvas();
    composer.refresh(buildElements());
    const passed = await runPreflightCheck();
    if (!passed) return;
    setOverlayVisible(
        pageMountRoot,
        true,
        translateModuleString("module.nextcloud_whiteboard.connecting"),
    );
    let session;
    try {
        session = await fetchWhiteboardSession(board.id);
    } catch (error) {
        setOverlayVisible(pageMountRoot, true, error.message);
        showToast(error.message, { variant: "error" });
        return;
    }
    activeSession = session;
    imageUploadMaxBytes = Number(
        session.imageUploadMaxBytes ?? imageUploadMaxBytes,
    );
    applyBoardTitle(session.title);
    preflightController.setStatus("rendering");
    composer.refresh(buildElements());
    preflightController.setStatus("passed");
    let io;
    try {
        const runtime = await loadSocketIo(
            session.serverUrl,
            uiCtx.capabilities.get("ui:resourceLoader"),
        );
        io = runtime.io;
        runtimeDispose?.();
        runtimeDispose = runtime.dispose;
    } catch (error) {
        setOverlayVisible(pageMountRoot, true, error.message);
        showToast(error.message, { variant: "error" });
        return;
    }
    const canvasElement = withinMount("#whiteboard-canvas");
    if (!canvasElement) return;
    canvasInstance = createWhiteboardCanvas(canvasElement, {
        readOnly: session.canWrite !== true,
    });
    if (session.canWrite === true) {
        canvasInstance.setImageUploader((dataUrl) =>
            uploadWhiteboardImage(session.roomId, dataUrl),
        );
    }
    canvasInstance.setImageUploadMaxBytes(imageUploadMaxBytes);
    savedElements = Array.isArray(session.elements) ? session.elements : [];
    if (savedElements.length > 0) {
        canvasInstance.applyElements(savedElements);
    }
    setSyncStatus("syncing", "module.nextcloud_whiteboard.status_syncing");
    socketInstance = connectSocket(io, session, canvasInstance);
    composer?.refreshPresence?.();
    bindCanvasToolbar(canvasInstance);
    bindDisposableSaveButton(session, canvasInstance);
    if (session.canWrite !== true) {
        pageMountRoot
            .querySelectorAll(
                "#whiteboard-toolbar button, #whiteboard-toolbar select, #whiteboard-toolbar input",
            )
            .forEach((control) => {
                if (control.closest("#whiteboard-share-slot")) return;
                control.disabled = true;
            });
    }
    setOverlayVisible(pageMountRoot, false);
}

function renderCanvasElement() {
    const syncState = getSyncStatus();
    return renderWhiteboardCanvasElement({
        activeBoard,
        activeSession,
        boards,
        canRenameActiveBoard,
        preflightStatus: preflightController.getStatus(),
        syncStatus: syncState.status,
        syncStatusMessage: syncState.message,
        translate: translateModuleString,
        integrationCanvasMode,
        disposable: disposableCanvasMode || activeSession?.disposable === true,
        embedded: embeddedComponentMode,
        showShare: !embeddedComponentMode,
        saved: activeSession?.saved === true,
    });
}

function onCanvasRender() {
    withinMount("#whiteboard-start-new")?.addEventListener(
        "click",
        () => void createAndOpenBoard(),
    );
    withinMount("#whiteboard-start-history")?.addEventListener(
        "click",
        () => void openHistoryPopup(),
    );
    bindOverlayBoardSelection(pageMountRoot, boards, (board) => {
        void openBoard(board);
    });
    const canvasElement = withinMount("#whiteboard-canvas");
    if (!canvasElement || canvasInstance || !activeBoard || !activeSession)
        return;
    if (preflightController.getStatus() !== "passed") return;
    canvasInstance = createWhiteboardCanvas(canvasElement, {
        readOnly: activeSession.canWrite !== true,
    });
    if (activeSession.canWrite === true) {
        canvasInstance.setImageUploader((dataUrl) =>
            uploadWhiteboardImage(activeSession.roomId, dataUrl),
        );
    }
    canvasInstance.setImageUploadMaxBytes(imageUploadMaxBytes);
    if (savedElements.length > 0) {
        canvasInstance.applyElements(savedElements);
    }
    canvasInstance.onChange((elements) => {
        savedElements = elements;
        composer?.refreshPresence?.();
    });
    bindCanvasToolbar(canvasInstance);
}

function buildElements() {
    return [
        {
            id: "whiteboard-canvas",
            label: translateModuleString(
                "module.nextcloud_whiteboard.canvas_window",
            ),
            pinned: true,
            gridSize: { default: [12, 5], min: [4, 4], max: "full" },
            render: renderCanvasElement,
            onRender: onCanvasRender,
            onUnmount: teardownCanvas,
        },
    ];
}

export async function mount(
    root,
    {
        signal,
        shareContext,
        focusState,
        navigationAllowed: allowNavigation = true,
        layout: mountLayout,
    } = {},
) {
    if (!(root instanceof Element)) {
        throw new TypeError("Whiteboard mount root must be an Element");
    }
    pageMountRoot = root;
    registerSearchIndex("nextcloud-whiteboard", collectWhiteboardSearchGroups);
    i18n = await createI18n({
        componentStringBaseUrls: [
            "/static/modules/nextcloud-whiteboard/languages",
        ],
    });
    applyDocumentTitle(i18n, "module.nextcloud_whiteboard.page_title");
    activeShareContext =
        shareContext?.directAccess === true ? null : (shareContext ?? null);
    const componentFocusState = focusState?.context ?? focusState ?? null;
    embeddedComponentMode =
        mountLayout?.fillParent === true ||
        allowNavigation === false ||
        Boolean(componentFocusState);
    hostNavigationAllowed = allowNavigation && !embeddedComponentMode;
    integrationCanvasMode =
        Boolean(
            componentFocusState?.instantCanvas ||
            componentFocusState?.disposable,
        ) ||
        Boolean(shareContext?.page?.instantCanvas) ||
        new URLSearchParams(window.location.search).get("instantCanvas") ===
            "1";
    disposableCanvasMode = Boolean(componentFocusState?.disposable);
    if (!activeShareContext) {
        await loadBoards().catch((error) =>
            reportClientError(
                error,
                "module.nextcloud_whiteboard.load_boards_failed",
            ),
        );
    }
    if (signal?.aborted) return;
    const initialBoardId =
        String(componentFocusState?.whiteboardId ?? "").trim() ||
        getPreparedDisposableCanvasId({
            resourceType: "meeting",
            resourceId: componentFocusState?.meetingId,
            allowLatest: embeddedComponentMode,
        }) ||
        activeShareContext?.payload?.whiteboardId ||
        new URLSearchParams(window.location.search).get("id");
    if (initialBoardId) {
        activeBoard = {
            id: initialBoardId,
            title: translateModuleString(
                "module.nextcloud_whiteboard.canvas_window",
            ),
        };
    }
    const mountedComposer = createPageComposer(root, {
        allowCustomization: false,
        borderless: false,
        contentScrolling: false,
        elements: buildElements(),
        frameless: embeddedComponentMode,
        preferenceKey: "nextcloud-whiteboard-layout",
        persistLayoutPreferences: false,
        presenceTracker: {
            endpoint: `${API_BASE}/whiteboards/presence`,
            pointerThrottleMs: 50,
            refreshIntervalMs: 250,
            pageId: () => activeBoard?.id ?? "",
            storageKey: "nextcloud_whiteboard_presence_session",
            getSelectionPayload: () => getSelectionPayload(canvasInstance),
            getPointerOffset: () => getPointerOffset(canvasInstance),
            onPresenceUpdate: (entries, sessionId) =>
                applyRemotePresenceSelections({
                    canvasInstance,
                    entries,
                    sessionId,
                }),
            renderPresenceEntry: renderWhiteboardPresenceEntry,
            hydratePresenceEntries: hydratePresenceAvatars,
        },
        pageManifest: {
            features: {
                pointerTracking: true,
            },
        },
        i18n,
        pageContext: {
            title: translateModuleString(
                "module.nextcloud_whiteboard.page_title",
            ),
            subtitle: translateModuleString(
                "module.nextcloud_whiteboard.page_subtitle",
            ),
        },
        showNavbar: !embeddedComponentMode && sharePageFlag("showNavbar", true),
        showTopbar: !embeddedComponentMode && sharePageFlag("showTopbar", true),
        showFooter: !embeddedComponentMode && sharePageFlag("showFooter", true),
        showThemeToggle:
            !embeddedComponentMode && sharePageFlag("showThemeToggle", true),
        requireAccountSession: !activeShareContext,
        signal,
    });
    composer = mountedComposer;
    let destroyed = false;
    const destroy = () => {
        if (destroyed) return;
        destroyed = true;
        signal?.removeEventListener("abort", destroy);
        mountedComposer.destroy();
        if (composer !== mountedComposer) return;
        composer = null;
        teardownCanvas();
        activeBoard = null;
        activeShareContext = null;
        savedElements = [];
        preflightController.setStatus("idle");
        integrationCanvasMode = false;
        disposableCanvasMode = false;
        embeddedComponentMode = false;
        hostNavigationAllowed = true;
        if (pageMountRoot === root) pageMountRoot = null;
    };
    signal?.addEventListener("abort", destroy, { once: true });
    await mountedComposer.init();
    if (signal?.aborted) return;

    if (activeBoard) {
        await openBoard(activeBoard);
        if (!signal?.aborted) mountedComposer.refreshPresence?.();
    } else if (integrationCanvasMode) {
        void createAndOpenBoard();
    }
    return { destroy };
}

if (
    typeof window !== "undefined" &&
    DIRECT_WHITEBOARD_PATHS.has(window.location.pathname)
) {
    await mountWhenDirect(mount);
}
