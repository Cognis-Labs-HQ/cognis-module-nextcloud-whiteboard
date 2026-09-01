import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { registerUi } from "../api/index.js";

function captureUiRegistration() {
    const spaRoutes = [];
    const staticDirs = [];
    const pageExtensions = [];
    const navbarPlugins = [];
    const adminSections = [];
    registerUi({
        moduleRoot: "/tmp/nextcloud-whiteboard",
        registerStaticDir(prefix, dir) {
            staticDirs.push({ prefix, dir });
        },
        registerNavbarPlugin(plugin) {
            navbarPlugins.push(plugin);
        },
        registerSpaRoute(route) {
            spaRoutes.push(route);
        },
        registerPageExtension(pageId, element) {
            pageExtensions.push({ pageId, element });
        },
        registerAdminSection(section) {
            adminSections.push(section);
        },
    });
    return {
        spaRoutes,
        staticDirs,
        pageExtensions,
        navbarPlugins,
        adminSections,
    };
}

test("nextcloud whiteboard registers full SPA routing and boilerplate styles", () => {
    const { spaRoutes, pageExtensions } = captureUiRegistration();
    const routesByBase = new Map(spaRoutes.map((route) => [route.base, route]));

    assert.deepEqual(pageExtensions, []);

    for (const base of ["/whiteboards", "/whiteboard"]) {
        const route = routesByBase.get(base);
        assert.ok(route, `${base} should be registered as a SPA route`);
        assert.equal(
            route.scriptUrl,
            "/static/modules/nextcloud-whiteboard/app/index.js",
        );
        assert.deepEqual(route.stylesheets, [
            "/static/styles/page-builder.css",
            "/static/modules/nextcloud-whiteboard/styles/whiteboards.css",
        ]);
    }
});

test("nextcloud whiteboard exposes its canvas as a component page", () => {
    const { spaRoutes } = captureUiRegistration();
    const canvasRoute = spaRoutes.find(
        (route) => route.id === "module.nextcloud.whiteboard.canvas",
    );

    assert.deepEqual(canvasRoute?.componentPage, {
        labelKey: "module.nextcloud_whiteboard.name",
        descriptionKey: "module.nextcloud_whiteboard.description",
        modes: ["overlay", "fullscreen", "pip"],
    });
    assert.equal(
        spaRoutes.find((route) => route.id === "module.nextcloud.whiteboard")
            ?.componentPage,
        undefined,
    );
});

test("nextcloud whiteboard does not reload shared layout styles", async () => {
    const shellSource = await import("node:fs/promises").then((fs) =>
        fs.readFile(new URL("../ui/index.html", import.meta.url), "utf8"),
    );
    assert.match(shellSource, /\/static\/styles\/page-builder\.css/);
    assert.doesNotMatch(shellSource, /\/static\/styles\/reuse\/layout\.css/);
});

test("nextcloud whiteboard share permissions use explicit access labels", async () => {
    const strings = await import("node:fs/promises").then((fs) =>
        fs.readFile(
            new URL("../ui/languages/en/strings.xml", import.meta.url),
            "utf8",
        ),
    );
    assert.match(strings, />Read-Only<\/string>/);
    assert.match(strings, />Read \+ Write<\/string>/);
    assert.doesNotMatch(strings, />Can edit<\/string>/);
});

test("nextcloud whiteboard disables page layout editing", async () => {
    const appSource = await import("node:fs/promises").then((fs) =>
        fs.readFile(new URL("../ui/app/index.js", import.meta.url), "utf8"),
    );
    assert.match(appSource, /allowCustomization:\s*false/);
    assert.match(appSource, /contentScrolling:\s*true/);
    assert.match(appSource, /borderless:\s*false/);
    assert.doesNotMatch(appSource, /borderless:\s*embeddedComponentMode/);
    assert.match(appSource, /frameless:\s*embeddedComponentMode/);
});

test("nextcloud whiteboard canvas fills its widget without stage scrolling", async () => {
    const styles = await import("node:fs/promises").then((fs) =>
        fs.readFile(
            new URL("../ui/styles/whiteboards.css", import.meta.url),
            "utf8",
        ),
    );
    const wrap = styles.match(/\.whiteboard-canvas-wrap\s*\{([^}]*)\}/)?.[1];
    const stage = styles.match(
        /\.whiteboard-canvas-wrap \.whiteboard-canvas-stage\s*\{([^}]*)\}/,
    )?.[1];

    assert.match(wrap ?? "", /height:\s*100%/);
    assert.match(wrap ?? "", /width:\s*100%/);
    assert.match(wrap ?? "", /min-height:\s*0/);
    assert.match(stage ?? "", /min-height:\s*0/);
    assert.doesNotMatch(stage ?? "", /overflow:\s*auto/);
});

test("direct-account SPA shares mount the full Whiteboard page", async () => {
    const appSource = await import("node:fs/promises").then((fs) =>
        fs.readFile(new URL("../ui/app/index.js", import.meta.url), "utf8"),
    );
    assert.match(
        appSource,
        /shareContext\?\.directAccess === true \? null : \(shareContext \?\? null\)/,
    );
});

test("nextcloud whiteboard app loads module strings and omits inline status element", async () => {
    const [
        source,
        toolbarSource,
        canvasSource,
        presenceSource,
        realtimeSource,
        renderSource,
        sharePopupSource,
        textToolsSource,
        styles,
    ] = await Promise.all([
        import("node:fs/promises").then((fs) =>
            fs.readFile(new URL("../ui/app/index.js", import.meta.url), "utf8"),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/app/canvas-toolbar.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/whiteboard/canvas.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/app/presence.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/app/realtime.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/app/render.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/app/share-popup.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/whiteboard/text-tools.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/styles/whiteboards.css", import.meta.url),
                "utf8",
            ),
        ),
    ]);
    assert.match(
        source,
        /componentStringBaseUrls:\s*\[\s*['"]\/static\/modules\/nextcloud-whiteboard\/languages['"]/,
    );
    assert.doesNotMatch(source, /whiteboard-connection-status/);
    assert.match(source, /uiCtx\.capabilities\.get\(['"]share:openPopup['"]\)/);
    assert.match(sharePopupSource, /resourceType:\s*['"]whiteboard['"]/);
    assert.match(sharePopupSource, /resourceId:\s*board\.id/);
    assert.match(sharePopupSource, /supportsReadOnly:\s*true/);
    assert.match(source, /readOnly:\s*session\.canWrite !== true/);
    assert.match(source, /mountedComposer\.destroy\(\)/);
    assert.match(source, /shareGateway\.mountTrigger\(slot/);
    assert.doesNotMatch(source, /document\.createElement\(["']button["']\)/);
    assert.match(renderSource, /<span id="whiteboard-share-slot"><\/span>/);
    assert.doesNotMatch(
        renderSource,
        /canManageShares\(\).*whiteboard-share-slot/,
    );
    assert.match(
        source,
        /if \(control\.closest\(["']#whiteboard-share-slot["']\)\) return;/,
    );
    assert.match(
        sharePopupSource,
        /title:\s*translate\(["']module\.nextcloud_whiteboard\.share_popup_title["']\)/,
    );
    assert.match(sharePopupSource, /labels:\s*\{/);
    assert.match(
        source,
        /showNavbar:\s*!embeddedComponentMode\s*&&\s*sharePageFlag\(['"]showNavbar['"],\s*true\)/,
    );
    assert.match(source, /requireAccountSession:\s*!activeShareContext/);
    assert.match(
        source,
        /requireAccountSession:\s*!activeShareContext,\s*signal/,
    );
    assert.match(source, /pageManifest:\s*\{/);
    assert.match(source, /pointerTracking:\s*true/);
    assert.match(
        source,
        /const canvasElement = withinMount\(['"]#whiteboard-canvas['"]\);/,
    );
    assert.match(presenceSource, /function getPointerOffset\(canvasInstance\)/);
    assert.match(
        source,
        /getPointerOffset:\s*\(\) => getPointerOffset\(canvasInstance\)/,
    );
    assert.match(presenceSource, /function applyRemotePresenceSelections\(/);
    assert.match(
        source,
        /onPresenceUpdate:\s*\(entries, sessionId\) =>\s*applyRemotePresenceSelections/,
    );
    assert.match(textToolsSource, /loadFontsCatalog/);
    assert.match(textToolsSource, /whiteboard-text-menu/);
    assert.match(textToolsSource, /parentNode\?\.removeChild\(editor\)/);
    assert.match(canvasSource, /function getSelectedElementIds\(\)/);
    assert.match(canvasSource, /function setRemoteSelections\(/);
    assert.match(
        await import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/whiteboard/render-scene.js", import.meta.url),
                "utf8",
            ),
        ),
        /remoteSelections\.get\(element\.id\)/,
    );
    assert.match(canvasSource, /createElementHistory/);
    assert.match(canvasSource, /function applyHistorySnapshot\(/);
    assert.match(renderSource, /id="page-presence-section"/);
    assert.match(
        renderSource,
        /class="whiteboard-toolbar-group whiteboard-presence" aria-live="polite"/,
    );
    assert.match(realtimeSource, /function throttleLatest\(callback, delay\)/);
    assert.match(realtimeSource, /callback\(\.\.\.args\)/);
    assert.match(source, /pointerThrottleMs:\s*16/);
    assert.match(source, /refreshIntervalMs:\s*250/);
    assert.match(textToolsSource, /addEventListener\(["']input["']/);
    assert.match(canvasSource, /flipX:\s*nextRight < nextX/);
    assert.match(canvasSource, /flipY:\s*nextBottom < nextY/);
    assert.match(canvasSource, /function updateDraftElement\(nextElement\)/);
    assert.match(canvasSource, /\[\.\.\.elements, draftElement\]/);
    assert.match(canvasSource, /preserveDraftIdentity/);
    assert.match(canvasSource, /isTransient:\s*false/);
    assert.match(canvasSource, /function updateCanvasSize\(\)/);
    assert.doesNotMatch(canvasSource, /viewportOffsetX \+=/);
    assert.doesNotMatch(
        canvasSource,
        /elements = elements\.map\(\(element\) =>\s*bumpElementVersion\(element, \{\s*x: element\.x \+ dx/s,
    );
    assert.match(toolbarSource, /function updateHistoryControls\(\)/);
    assert.match(toolbarSource, /whiteboard-toolbar-group\[hidden\]/);
    assert.match(toolbarSource, /insertAdjacentHTML\(\s*['"]afterend['"]/);
    assert.match(
        toolbarSource,
        /canvas\.onHistoryChange\?\.\(updateHistoryControls\)/,
    );
    assert.match(
        toolbarSource,
        /redoButton\?\.addEventListener\(['"]click['"]/,
    );
    assert.match(
        source,
        /if \(canWrite && meta\?\.transient !== true\) persistChanges\(elements\)/,
    );
    assert.match(
        styles,
        /\.whiteboard-canvas-wrap \.whiteboard-presence\s*\{[^}]*flex:\s*0 0 auto;/s,
    );
    assert.doesNotMatch(styles, /\.page-presence/);
    assert.match(presenceSource, /avatarClass: "whiteboard-presence-avatar"/);
    assert.match(styles, /\.whiteboard-text-menu/);
    assert.doesNotMatch(source, /share-adapter\.js/);
});

test("nextcloud whiteboard canvas deletes selected objects via keyboard", async () => {
    const [source, canvasEventsSource] = await Promise.all([
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/whiteboard/canvas.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/whiteboard/canvas-events.js", import.meta.url),
                "utf8",
            ),
        ),
    ]);
    assert.match(source, /function deleteSelectedElements\(\)/);
    assert.match(
        source,
        /bumpElementVersion\(element, \{ isDeleted: true \}\)/,
    );
    assert.match(source, /getElementAnchorPoints,/);
    assert.match(source, /toFontFamilyValue/);
    assert.match(source, /getCurrentAppFont/);
    assert.match(source, /getTextStyle\(\)/);
    assert.match(source, /bumpElementVersion\(element, patch\)/);
    assert.match(source, /function notifyTransientChange\(\)/);
    assert.match(source, /transient:\s*true/);
    assert.doesNotMatch(source, /canvasElement\.width \|\| 0/);
    assert.match(source, /viewportOffsetX/);
    assert.match(source, /getViewportOffset\(\)/);
    assert.match(source, /history\.notifyChange\(\)/);
    assert.match(source, /canRedo\(\)/);
    assert.doesNotMatch(source, /parent\.scrollLeft =/);
    assert.match(
        source,
        /event\.key !== ['"]Delete['"] && event\.key !== ['"]Backspace['"]/,
    );
    assert.match(
        canvasEventsSource,
        /canvasElement\.addEventListener\(['"]keydown['"], onKeyDown\)/,
    );
    assert.match(
        canvasEventsSource,
        /canvasElement\.removeEventListener\(['"]keydown['"], onKeyDown\)/,
    );
});

test("drawing starts before canvas focus can move the viewport", async () => {
    const source = await import("node:fs/promises").then((fs) =>
        fs.readFile(
            new URL("../ui/whiteboard/canvas.js", import.meta.url),
            "utf8",
        ),
    );
    const pointerDownSource = source.slice(
        source.indexOf("function onPointerDown(event)"),
        source.indexOf("function onPointerMove(event)"),
    );

    assert.match(
        pointerDownSource,
        /canvasElement\.focus\(\{ preventScroll: true \}\)/,
    );
    assert.ok(
        pointerDownSource.indexOf("getCanvasPoint(event)") <
            pointerDownSource.indexOf("canvasElement.focus"),
    );
});

test("collaborative scenes merge remote edits before saving", async () => {
    const [appSource, canvasSource, sceneUpdatesSource] = await Promise.all(
        [
            "../ui/app/index.js",
            "../ui/whiteboard/canvas.js",
            "../ui/app/reuse/scene-updates.js",
        ].map((relativePath) =>
            import("node:fs/promises").then((fs) =>
                fs.readFile(new URL(relativePath, import.meta.url), "utf8"),
            ),
        ),
    );
    assert.match(sceneUpdatesSource, /transient: transientUpdate/);
    assert.match(
        sceneUpdatesSource,
        /const mergedElements = canvas\.getElements\(\)/,
    );
    assert.match(sceneUpdatesSource, /persistChanges\(mergedElements\)/);
    assert.match(canvasSource, /element\.isDeleted/);
    assert.match(canvasSource, /createRemoteDraftStore/);
    assert.match(
        canvasSource,
        /elements: remoteDraftElements\.compose\(elements\)/,
    );
    assert.match(
        canvasSource,
        /stableRemoteElements = remoteElements\.filter\(/,
    );
    assert.match(
        sceneUpdatesSource,
        /const transientUpdate = message\.payload\.transient/,
    );
    assert.match(sceneUpdatesSource, /if \(canWrite && !transientUpdate\)/);
    assert.doesNotMatch(
        appSource,
        /message\.type === SYNC_MESSAGE_SCENE_UPDATE[\s\S]{0,180}emitSceneSnapshot\(\)/,
    );
});

test("joining collaborators request a scene from peers after reconnecting", async () => {
    const appSource = await import("node:fs/promises").then((fs) =>
        fs.readFile(new URL("../ui/app/index.js", import.meta.url), "utf8"),
    );
    assert.match(
        appSource,
        /const SYNC_MESSAGE_SCENE_REQUEST = "SCENE_REQUEST"/,
    );
    assert.match(
        appSource,
        /socket\.on\("room-user-change",[\s\S]*requestScene\(\)/,
    );
    assert.match(
        appSource,
        /message\.type === SYNC_MESSAGE_SCENE_REQUEST[\s\S]*emitSceneSnapshot\(\)/,
    );
    assert.match(
        appSource,
        /socket\.on\("user-joined",[\s\S]*if \(joinedRoom\) emitSceneSnapshot\(\)/,
    );
    const snapshotSource = appSource.slice(
        appSource.indexOf("const emitSceneSnapshot"),
        appSource.indexOf("const requestScene"),
    );
    assert.doesNotMatch(snapshotSource, /canWrite/);
});

test("nextcloud whiteboard image paste saves and selects resizable image objects", async () => {
    const [canvasSource, clipboardSource, canvasEventsSource, elementsSource] =
        await Promise.all([
            import("node:fs/promises").then((fs) =>
                fs.readFile(
                    new URL("../ui/whiteboard/canvas.js", import.meta.url),
                    "utf8",
                ),
            ),
            import("node:fs/promises").then((fs) =>
                fs.readFile(
                    new URL(
                        "../ui/whiteboard/clipboard-images.js",
                        import.meta.url,
                    ),
                    "utf8",
                ),
            ),
            import("node:fs/promises").then((fs) =>
                fs.readFile(
                    new URL(
                        "../ui/whiteboard/canvas-events.js",
                        import.meta.url,
                    ),
                    "utf8",
                ),
            ),
            import("node:fs/promises").then((fs) =>
                fs.readFile(
                    new URL("../ui/whiteboard/elements.js", import.meta.url),
                    "utf8",
                ),
            ),
        ]);
    assert.match(
        clipboardSource,
        /function createImageElementFromDataUrl\(dataUrl\)/,
    );
    assert.match(clipboardSource, /commitCreatedElement\(\s*buildImageElement/);
    assert.match(
        canvasEventsSource,
        /document\.addEventListener\(['"]paste['"], onPaste\)/,
    );
    assert.match(clipboardSource, /if \(event\.defaultPrevented\) return/);
    assert.match(clipboardSource, /findClipboardImageFile\(event\)/);
    assert.doesNotMatch(
        canvasSource,
        /commitElements\(\[\s*\.\.\.elements,\s*buildImageElement/,
    );
    assert.match(elementsSource, /const imageElementCache = new Map\(\)/);
    assert.match(elementsSource, /whiteboard:image-loaded/);
    assert.match(
        canvasEventsSource,
        /addEventListener\(['"]whiteboard:image-loaded['"], scheduleRender\)/,
    );
    assert.match(
        elementsSource,
        /export function buildImageElement\(point, dataUrl, dimensions = \{\}\)/,
    );
});

test("nextcloud whiteboard defaults to select after canvas refresh", async () => {
    const [
        canvasSource,
        appSource,
        renderSource,
        elementsSource,
        stylesSource,
    ] = await Promise.all([
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/whiteboard/canvas.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(new URL("../ui/app/index.js", import.meta.url), "utf8"),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/app/render.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/whiteboard/elements.js", import.meta.url),
                "utf8",
            ),
        ),
        import("node:fs/promises").then((fs) =>
            fs.readFile(
                new URL("../ui/styles/whiteboards.css", import.meta.url),
                "utf8",
            ),
        ),
    ]);
    assert.match(canvasSource, /let activeTool = ['"]select['"]/);
    assert.match(
        canvasSource,
        /normalizedKey === ['"]z['"] && !event\.shiftKey/,
    );
    assert.match(canvasSource, /normalizedKey === ['"]y['"]/);
    assert.match(canvasSource, /undo\(\)/);
    assert.match(canvasSource, /redo\(\)/);
    assert.match(
        canvasSource,
        /if \(readOnly\) canvasElement\.style\.cursor = ['"]pointer['"]/,
    );
    assert.match(
        renderSource,
        /tool === ['"]select['"] \? ['"] active['"] : ['"]['"]/,
    );
    assert.match(
        appSource + renderSource,
        /data-tool="\$\{tool\}" class="whiteboard-tool/,
    );
    assert.match(
        renderSource,
        /toolButton\(tool, `module.nextcloud_whiteboard.tool_\$\{tool\}`, icon\(tool\)\)/,
    );
    assert.match(
        renderSource,
        /whiteboard-tool-icon whiteboard-tool-icon--\$\{name\}/,
    );
    assert.doesNotMatch(renderSource, /<svg class="whiteboard-tool-icon"/);
    assert.match(renderSource, /<button type="button" id="whiteboard-clear"/);
    assert.match(stylesSource, /reuse\/assets\/pen-light\.svg/);
    assert.match(stylesSource, /reuse\/assets\/pen-dark\.svg/);
    assert.match(stylesSource, /body\[data-theme="dark"\]/);
    assert.match(
        appSource,
        /const SYNC_MESSAGE_BOARD_RENAMED = ['"]BOARD_RENAMED['"]/,
    );
    assert.match(appSource, /function canRenameActiveBoard\(\)/);
    assert.match(appSource, /function emitBoardRenamed\(title\)/);
    const navigationSource = await import("node:fs/promises").then((fs) =>
        fs.readFile(
            new URL("../ui/reuse/board-navigation.js", import.meta.url),
            "utf8",
        ),
    );
    assert.match(navigationSource, /function syncBoardUrl\(/);
    assert.match(
        navigationSource,
        /searchParams\.set\(['"]instantCanvas['"], ['"]1['"]\)/,
    );
    assert.match(
        navigationSource,
        /window\.history\.replaceState\(null, ['"]['"], nextUrl\)/,
    );
    assert.match(elementsSource, /ensureVisibleStrokeColor/);
    assert.match(elementsSource, /contrastRatio/);
    assert.match(stylesSource, /--whiteboard-auto-stroke: var\(--text/);
    assert.match(
        stylesSource,
        /\.whiteboard-canvas-wrap \.whiteboard-presence/,
    );
});
test("nextcloud whiteboard entrusts its internal URL to the share popup", async () => {
    const appSource = await import("node:fs/promises").then((fs) =>
        fs.readFile(
            new URL("../ui/app/share-popup.js", import.meta.url),
            "utf8",
        ),
    );
    assert.match(
        appSource,
        /contentUrl: `\/whiteboard\?id=\$\{encodeURIComponent\(board\.id\)\}`/,
    );
});

test("whiteboard suspends realtime work while its tab is hidden", async () => {
    const [appSource, realtimeSource] = await Promise.all(
        ["../ui/app/index.js", "../ui/app/realtime.js"].map((relativePath) =>
            import("node:fs/promises").then((fs) =>
                fs.readFile(new URL(relativePath, import.meta.url), "utf8"),
            ),
        ),
    );
    assert.match(appSource, /document\.hidden[\s\S]*socket\.disconnect\(\)/);
    assert.match(appSource, /socket\.connect\(\)/);
    assert.match(appSource, /socketInstance\.cognisCleanup\?\.\(\)/);
    assert.match(realtimeSource, /resourceLoader\.loadScript/);
    assert.match(realtimeSource, /resource\?\.dispose/);
    assert.doesNotMatch(realtimeSource, /document\.head/);
    assert.match(
        appSource,
        /const mountedComposer = createPageComposer[\s\S]*mountedComposer\.destroy\(\)[\s\S]*signal\?\.addEventListener\(/,
    );
    assert.match(appSource, /if \(signal\?\.aborted\) return/);
});

test("whiteboard navbar registers the canvas UI gateway", async () => {
    const [navbarSource, gatewaySource, apiSource, providerSource] =
        await Promise.all(
            [
                "../ui/navbar.js",
                "../ui/reuse/whiteboard-ui-gateway.js",
                "../api/index.js",
                "../api/reuse/ui-provider.js",
            ].map((relativePath) =>
                import("node:fs/promises").then((fs) =>
                    fs.readFile(new URL(relativePath, import.meta.url), "utf8"),
                ),
            ),
        );
    assert.match(navbarSource, /whiteboard-ui-gateway\.js/);
    assert.match(
        apiSource + providerSource,
        /providesCapabilities: \["whiteboard:uiGateway"\]/,
    );
    assert.match(
        providerSource,
        /registerCapabilityProvider\?\.\(\{[\s\S]*scriptUrl: GATEWAY_SCRIPT/,
    );
    assert.match(providerSource, /whiteboard-ui-gateway\.js/);
    assert.match(
        gatewaySource,
        /const capabilityName = "whiteboard:uiGateway"/,
    );
    assert.match(gatewaySource, /async createDisposableCanvas\(\{/);
    assert.match(gatewaySource, /async createCanvas\(\{/);
    assert.match(gatewaySource, /participantHandles/);
    assert.match(gatewaySource, /participants: participantHandles/);
    assert.match(gatewaySource, /"Canvas could not be created\."/);
    assert.match(gatewaySource, /return \{ whiteboardId \}/);
    assert.match(
        gatewaySource,
        /uiCtx\.capabilities\.contribute\(capabilityName, gateway\)/,
    );
    assert.doesNotMatch(gatewaySource, /uiCtx\.capabilities\.set\(/);
});

test("whiteboard component mounts the disposable canvas from focus state", async () => {
    const [appSource, navigationSource, renderSource] = await Promise.all(
        [
            "../ui/app/index.js",
            "../ui/reuse/board-navigation.js",
            "../ui/app/render.js",
        ].map((path) =>
            import("node:fs/promises").then((fs) =>
                fs.readFile(new URL(path, import.meta.url), "utf8"),
            ),
        ),
    );
    assert.match(appSource, /navigationAllowed: allowNavigation = true/);
    assert.match(
        appSource,
        /const componentFocusState = focusState\?\.context \?\? focusState \?\? null/,
    );
    assert.match(
        appSource,
        /String\(componentFocusState\?\.whiteboardId \?\? ""\)\.trim\(\)/,
    );
    assert.match(
        appSource,
        /embeddedComponentMode =\s*mountLayout\?\.fillParent === true \|\|\s*allowNavigation === false \|\|\s*Boolean\(componentFocusState\)/,
    );
    assert.match(appSource, /showShare:\s*!embeddedComponentMode/);
    assert.match(appSource, /embedded:\s*embeddedComponentMode/);
    assert.match(
        renderSource,
        /disposable \|\| !showShare \? "" : `<span id="whiteboard-share-slot"/,
    );
    assert.match(
        renderSource,
        /whiteboard-canvas-wrap\$\{embedded \? " whiteboard-canvas-wrap--embedded" : ""\}/,
    );
    assert.match(
        appSource,
        /showNavbar:\s*!embeddedComponentMode[\s\S]*showTopbar:\s*!embeddedComponentMode[\s\S]*showFooter:\s*!embeddedComponentMode/,
    );
    assert.match(appSource, /await openBoard\(activeBoard\)/);
    assert.match(
        appSource,
        /hostNavigationAllowed = allowNavigation && !embeddedComponentMode/,
    );
    assert.match(
        navigationSource,
        /if \(!hostNavigationAllowed \|\| shareContext \|\| !boardId\) return/,
    );
    assert.match(appSource, /return \{ destroy \}/);
    assert.match(appSource, /if \(destroyed\) return/);
    assert.match(
        appSource,
        /signal\?\.removeEventListener\("abort", destroy\)/,
    );
    assert.match(appSource, /if \(composer !== mountedComposer\) return/);
    assert.match(
        appSource,
        /if \(pageMountRoot === root\) pageMountRoot = null/,
    );
    assert.match(appSource, /getPreparedDisposableCanvasId\(\{/);
    assert.match(appSource, /allowLatest: embeddedComponentMode/);
});

test("whiteboard gateway remembers prepared disposable canvases for component mounts", async () => {
    const gatewaySource = await import("node:fs/promises").then((fs) =>
        fs.readFile(
            new URL("../ui/reuse/whiteboard-ui-gateway.js", import.meta.url),
            "utf8",
        ),
    );
    assert.match(gatewaySource, /const preparedCanvasIds = new Map\(\)/);
    assert.match(gatewaySource, /preparedCanvasIds\.set\(/);
    assert.match(gatewaySource, /latestPreparedCanvasId = whiteboardId/);
    assert.match(
        gatewaySource,
        /export function getPreparedDisposableCanvasId/,
    );
});

test("whiteboard direct entry mounts only on declared whiteboard routes", async () => {
    const appSource = await import("node:fs/promises").then((fs) =>
        fs.readFile(new URL("../ui/app/index.js", import.meta.url), "utf8"),
    );
    assert.match(
        appSource,
        /const DIRECT_WHITEBOARD_PATHS = new Set\(\["\/whiteboard", "\/whiteboards"\]\)/,
    );
    assert.match(
        appSource,
        /DIRECT_WHITEBOARD_PATHS\.has\(window\.location\.pathname\)[\s\S]*await mountWhenDirect\(mount\)/,
    );
    assert.doesNotMatch(appSource, /^await mountWhenDirect\(mount\);$/m);
});

test("whiteboard toolbar wraps tools and keeps disposable save controls visible", async () => {
    const [appSource, disposableSaveSource, renderSource, stylesSource] =
        await Promise.all(
            [
                "../ui/app/index.js",
                "../ui/app/disposable-save.js",
                "../ui/app/render.js",
                "../ui/styles/whiteboards.css",
            ].map((relativePath) =>
                import("node:fs/promises").then((fs) =>
                    fs.readFile(new URL(relativePath, import.meta.url), "utf8"),
                ),
            ),
        );
    assert.match(renderSource, /class="whiteboard-toolbar-tools"/);
    assert.match(
        stylesSource,
        /\.whiteboard-toolbar-tools\s*\{[^}]*flex-wrap: wrap/s,
    );
    assert.match(
        stylesSource,
        /\.whiteboard-toolbar\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\) auto/s,
    );
    assert.doesNotMatch(
        stylesSource,
        /\.whiteboard-toolbar-tools\s*\{[^}]*overflow-x: auto/s,
    );
    assert.match(stylesSource, /@container \(max-width: 44rem\)/);
    assert.match(
        stylesSource,
        /\.whiteboard-saved-pill\s*\{[^}]*display: inline-block[^}]*visibility: hidden/s,
    );
    assert.match(
        stylesSource,
        /:has\(\.whiteboard-save-confirmed\)[^{]*\.whiteboard-saved-pill\s*\{[^}]*visibility: visible/s,
    );
    assert.match(
        disposableSaveSource,
        /function bindDisposableSaveButton\(session, canvas\)/,
    );
    assert.match(appSource, /setDisposableSaveDirty\(session, true\)/);
    assert.match(
        disposableSaveSource,
        /saveButton\.dataset\.dirty = String\(!session\.saved\)/,
    );
    assert.match(renderSource, /data-dirty="\$\{String\(!saved\)\}"/);
    assert.match(
        renderSource,
        /\$\{disposable \|\| !showShare \? "" : `<span id="whiteboard-share-slot"/,
    );
});

test("canvas selection clicks do not report content changes", async () => {
    const source = await readFile(
        new URL("../ui/whiteboard/canvas.js", import.meta.url),
        "utf8",
    );
    assert.match(source, /const didChange = history\.record\(/);
    assert.match(
        source,
        /if \(didChange\) changeCallback\?\.\(\[\.\.\.elements\]\)/,
    );
});

test("canvas source keeps readable spacing between top-level sections", async () => {
    const source = await readFile(
        new URL("../ui/whiteboard/canvas.js", import.meta.url),
        "utf8",
    );

    assert.match(source, /remote-selections\.js";\n\nexport function/);
    assert.doesNotMatch(
        source,
        /^    }\n    (?:function|const (?:history|textTools|onPaste|unbindCanvasEvents|resizeObserver)|return \{)/gm,
    );
});

test("whiteboard obtains shared UI resources through the host capability", async () => {
    const [resourcesSource, appSource, shellSource] = await Promise.all(
        [
            "../ui/reuse/host-resources.js",
            "../ui/app/index.js",
            "../ui/index.html",
        ].map((path) =>
            import("node:fs/promises").then((fs) =>
                fs.readFile(new URL(path, import.meta.url), "utf8"),
            ),
        ),
    );

    assert.match(resourcesSource, /capabilities\.get\("ui:reuse"\)/);
    assert.match(
        appSource,
        /reuse\.importModule\("page-composer\/index\.js"\)/,
    );
    assert.match(
        appSource,
        /reuse\.loadStylesheets\(\["page-sections\.css"\]\)/,
    );
    assert.doesNotMatch(shellSource, /styles\/reuse\/page-sections\.css/);
});

test("component whiteboards clamp the canvas grid to their parent height", async () => {
    const stylesSource = await import("node:fs/promises").then((fs) =>
        fs.readFile(
            new URL("../ui/styles/whiteboards.css", import.meta.url),
            "utf8",
        ),
    );

    assert.match(
        stylesSource,
        /\.whiteboard-canvas-wrap\s*\{[^}]*grid-template-rows:\s*auto minmax\(0, 1fr\);/s,
    );
    assert.match(
        stylesSource,
        /\.whiteboard-canvas-wrap--embedded\s*\{[^}]*max-height:\s*100%;/s,
    );
    assert.doesNotMatch(
        stylesSource,
        /\.(main-window|content-grid|widget-card)/,
    );
    const appSource = await import("node:fs/promises").then((fs) =>
        fs.readFile(new URL("../ui/app/index.js", import.meta.url), "utf8"),
    );
    assert.match(appSource, /contentScrolling:\s*true/);
});

test("whiteboard UI does not reach into page-shell-owned elements", async () => {
    const sources = await Promise.all(
        [
            "../ui/styles/whiteboards.css",
            "../ui/app/index.js",
            "../ui/whiteboard/reuse/remote-pointers.js",
        ].map((path) =>
            import("node:fs/promises").then((fs) =>
                fs.readFile(new URL(path, import.meta.url), "utf8"),
            ),
        ),
    );

    assert.doesNotMatch(
        sources.join("\n"),
        /main-window|content-grid|widget-card/,
    );
});

test("clear canvas uses delegated toolbar confirmation handling", async () => {
    const toolbarSource = await import("node:fs/promises").then((fs) =>
        fs.readFile(
            new URL("../ui/app/canvas-toolbar.js", import.meta.url),
            "utf8",
        ),
    );

    assert.match(toolbarSource, /toolbar\.addEventListener\(["']click["']/);
    assert.match(toolbarSource, /closest\(["']#whiteboard-clear["']\)/);
    assert.match(toolbarSource, /await confirmClearCanvas\(translate\)/);
});
