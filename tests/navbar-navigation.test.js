import assert from "node:assert/strict";
import test from "node:test";
import { captureUiRegistration } from "./reuse/ui-registration.js";

let collect;
let searchActive = false;
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get: () => ({
            loadStylesheets() {},
            importModule: async () => ({
                apiFetch: async () => ({
                    ok: true,
                    json: async () => ({ data: [] }),
                }),
                registerSearchIndex(_id, provider) {
                    collect = provider;
                    searchActive = true;
                    return () => {
                        searchActive = false;
                    };
                },
            }),
        }),
    },
};
const { mountProvider } = await import("../ui/navbar.js");

test("Whiteboards has no menu contribution while direct URLs and search remain available", async () => {
    const dispose = await mountProvider({
        signal: new AbortController().signal,
        capabilities: {
            get: () =>
                assert.fail("No navbar link capability may be requested"),
        },
    });
    assert.equal(searchActive, true);
    const groups = await collect();
    assert.equal(groups[0].items[0].url, "/whiteboards");
    const { spaRoutes } = captureUiRegistration();
    for (const pathname of ["/whiteboards", "/whiteboard"])
        assert.ok(
            spaRoutes.some((route) => new RegExp(route.pattern).test(pathname)),
        );
    dispose();
    assert.equal(searchActive, false);
});
