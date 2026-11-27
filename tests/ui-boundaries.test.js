import assert from "node:assert/strict";
import test from "node:test";

test("whiteboard obtains shared UI resources through the host capability", async () => {
    const [resourcesSource, appSource, shellSource] = await Promise.all(
        [
            "../ui/reuse/host-resources.js",
            "../ui/app/index.js",
            "../ui/index.html",
        ].map((path) =>
            import("node:fs/promises").then((fileSystem) =>
                fileSystem.readFile(new URL(path, import.meta.url), "utf8"),
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
    const stylesSource = await import("node:fs/promises").then((fileSystem) =>
        fileSystem.readFile(
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
    const appSource = await import("node:fs/promises").then((fileSystem) =>
        fileSystem.readFile(
            new URL("../ui/app/index.js", import.meta.url),
            "utf8",
        ),
    );
    assert.match(appSource, /contentScrolling:\s*!embeddedComponentMode/);
});

test("whiteboard UI does not reach into page-shell-owned elements", async () => {
    const sources = await Promise.all(
        [
            "../ui/styles/whiteboards.css",
            "../ui/app/index.js",
            "../ui/canvas/reuse/pointers.js",
        ].map((path) =>
            import("node:fs/promises").then((fileSystem) =>
                fileSystem.readFile(new URL(path, import.meta.url), "utf8"),
            ),
        ),
    );

    assert.doesNotMatch(
        sources.join("\n"),
        /main-window|content-grid|widget-card/,
    );
});
