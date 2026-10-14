import test from "node:test";
import assert from "node:assert/strict";

const toasts = [];
let loading = async () => {
    throw new Error("Service unavailable");
};
const root = { isConnected: true };
const reuse = {
    "popup.js": { openPopup: () => assert.fail("No popup expected") },
    "timestamp.js": { formatDateTime: String },
    "page-styles.js": { ensurePageStylesheet: async () => {} },
};
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get: (id) =>
            id === "ui:reuse"
                ? {
                      importModule: async (path) => reuse[path],
                      loadStylesheets: async () =>
                          assert.fail("No stylesheet list expected"),
                  }
                : id === "whiteboard:uiGateway"
                  ? {
                        listAdminCanvases: () => loading(),
                        deleteAdminCanvas: () =>
                            assert.fail("No deletion expected"),
                    }
                  : undefined,
    },
};
const { createAdminSection } = await import("../administration/canvases.js");
const section = createAdminSection({
    i18n: { t: (key) => key },
    escapeHtml: String,
    showToast: (...args) => toasts.push(args),
});
const settle = () => new Promise((resolve) => setImmediate(resolve));

test("canvas administration still reports failures when optional UI logging is unavailable", async () => {
    section.subComposerOptions.onRender({ querySelector: () => root });
    await settle();
    assert.equal(toasts.length, 1);
    assert.equal(
        toasts[0][0],
        "module.nextcloud.whiteboard.admin.canvases.failed",
    );
    assert.equal(toasts[0][1].variant, "error");
    section.subComposerOptions.onUnmount();
});

test("an unmounted canvas administration section ignores a delayed failure", async () => {
    let reject;
    loading = () =>
        new Promise((_, fail) => {
            reject = fail;
        });
    section.subComposerOptions.onRender({ querySelector: () => root });
    section.subComposerOptions.onUnmount();
    reject(new Error("Late failure"));
    await settle();
    assert.equal(toasts.length, 1);
});
