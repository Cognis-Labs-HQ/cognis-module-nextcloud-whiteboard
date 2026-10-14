import {
    createProviderScope,
    registerScopedUiActions,
} from "./reuse/provider-scope.js";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { openChromium } from "./reuse/chromium.js";

let spawnRequest;
const capabilities = new Map([
    ["ui:scopedActions", registerScopedUiActions],
    [
        "ui:reuse",
        {
            loadStylesheets: () =>
                assert.fail("The renderer should not load stylesheets"),
            importModule: async () => ({
                escapeHtml: String,
                formatDateTime: String,
            }),
        },
    ],
    [
        "component-pages:spawn",
        async (request) => {
            spawnRequest = request;
            return { borderless: request.borderless === true };
        },
    ],
]);
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get: (name) => capabilities.get(name),
        contribute: (name, value) => capabilities.set(name, value),
    },
};
const { mountProvider } = await import("../reuse/whiteboard-ui-gateway.js");
const providerScope = createProviderScope(capabilities);
mountProvider(providerScope);
const { renderCanvasElement } = await import("../templates/canvas.js");
await capabilities
    .get("whiteboard:uiGateway")
    .openCanvas({ whiteboardId: "board", elementId: "meeting-host" });
const resources = await readFile(
    new URL("../languages/en/strings.xml", import.meta.url),
    "utf8",
);
const labels = new Map(
    [...resources.matchAll(/<string name="([^"]+)">([^<]*)<\/string>/g)].map(
        (match) => [match[1], match[2]],
    ),
);
const markup = renderCanvasElement({
    activeBoard: { id: "board" },
    activeSession: { canWrite: true },
    boards: [],
    canRenameActiveBoard: () => false,
    preflightStatus: "passed",
    syncStatus: "synced",
    translate: (key) => labels.get(key) ?? key,
    embedded: true,
    integrationCanvasMode: true,
    showShare: false,
});
const browser = await openChromium();
try {
    const page = await browser.newPage();
    const styles = await readFile(
        new URL("../styles/whiteboards.css", import.meta.url),
        "utf8",
    );
    await page.setContent(`<!doctype html><style>
        * { box-sizing: border-box; }
        .host { display: grid; grid-template-rows: minmax(min-content, 1fr); }
        .mounted-page[data-fill-parent] { height: 100%; min-height: 100%; display: grid; grid-template-rows: minmax(min-content, 1fr); }
        .mounted-page[data-fill-parent] .page-body { height: 100%; min-height: 0; }
        ${styles}
    </style><div class="host"><div class="mounted-page" ${spawnRequest.borderless === true ? "data-fill-parent" : ""}><div class="page-body">${markup}</div></div></div>`);
    await page.evaluate(() => {
        const canvas = document.querySelector("canvas");
        canvas.height = 2000;
        canvas.style.height = "2000px";
    });
    for (const [width, height] of [
        [900, 400],
        [420, 280],
        [900, 600],
        [900, 350],
    ]) {
        const bounds = await page.evaluate(
            ({ width, height }) => {
                const host = document.querySelector(".host");
                host.style.width = `${width}px`;
                host.style.height = `${height}px`;
                const canvas = document.querySelector("canvas");
                for (let iteration = 0; iteration < 6; iteration++) {
                    const rect = canvas.parentElement.getBoundingClientRect();
                    canvas.width = Math.ceil(rect.width);
                    canvas.height = Math.ceil(rect.height);
                    canvas.style.width = `${canvas.width}px`;
                    canvas.style.height = `${canvas.height}px`;
                }
                return {
                    height: host.clientHeight,
                    scrollHeight: host.scrollHeight,
                    surfaceHeight: document.querySelector(
                        ".whiteboard-canvas-wrap",
                    ).clientHeight,
                    canvasHeight: canvas.clientHeight,
                    toolbarHeight: document
                        .querySelector(".whiteboard-toolbar")
                        .getBoundingClientRect().height,
                };
            },
            { width, height },
        );
        assert.equal(
            bounds.scrollHeight,
            height,
            "Embedded content must not enlarge its host",
        );
        assert.equal(bounds.surfaceHeight, height);
        assert.ok(
            Math.abs(bounds.canvasHeight + bounds.toolbarHeight - height) <= 1,
            "The toolbar and canvas must fit within pixel rounding, without clipping",
        );
        assert.ok(bounds.canvasHeight > 0);
    }
    console.log(
        "Embedded canvas fits its host after mounting, shrinking and expanding.",
    );
} finally {
    await browser.close();
}
