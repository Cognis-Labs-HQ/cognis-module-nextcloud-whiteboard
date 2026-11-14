import assert from "node:assert/strict";
import test from "node:test";

const requests = [];
const probes = [];
const errors = [];
let denied = false;
let accountMode = false;
let abortSession;
let runtimeLoads = 0;
const session = {
    roomId: "shared-board",
    title: "Shared fixture",
    canWrite: false,
    serverUrl: "https://whiteboard.example.test",
    token: "scoped-read-only-token",
    elements: [],
};
class MountRoot {
    querySelector() {
        return null;
    }
}
globalThis.Element = MountRoot;
globalThis.window = { location: { pathname: "/share/fixture", search: "" } };
globalThis.document = { getElementById: () => null };
const hostModules = {
    "api-client.js": {
        async apiFetch(path, options) {
            requests.push(path);
            if (accountMode && !path.includes("/session?")) {
                const data = path.endsWith("/preflight")
                    ? {
                          alive: true,
                          serverUrl: session.serverUrl,
                          websocketAuthToken: "account-preflight-token",
                      }
                    : [];
                return {
                    ok: true,
                    async json() {
                        return { data };
                    },
                };
            }
            assert.ok(
                path.includes("/whiteboards/session?id=shared-board"),
                "shared board must not call account-only preflight or list routes",
            );
            abortSession?.();
            return {
                ok: !denied,
                status: denied ? 403 : 200,
                async json() {
                    return denied
                        ? {
                              error: {
                                  code: "forbidden",
                                  message: "fixture-denied",
                              },
                          }
                        : { data: session };
                },
            };
        },
    },
    "i18n.js": {
        applyDocumentTitle() {},
        async createI18n() {
            return { t: (key) => key };
        },
    },
    "page-composer/index.js": {
        createPageComposer() {
            return {
                async init() {},
                refresh() {},
                refreshPresence() {},
                destroy() {},
            };
        },
    },
    "page-entry.js": {
        mountWhenDirect() {
            assert.fail("share mount must remain explicit");
        },
    },
    "search-util/popup.js": { registerSearchIndex: () => () => {} },
    "toast.js": { showToast: (message) => errors.push(message) },
    "escape-html.js": { escapeHtml: String },
    "timestamp.js": { formatDateTime: String },
    "font-prefs.js": {},
    "popup.js": {},
};
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get(name) {
            if (name === "ui:reuse")
                return {
                    async importModule(id) {
                        assert.ok(hostModules[id], id);
                        return hostModules[id];
                    },
                    async loadStylesheets() {},
                };
            if (name === "ui:resourceLoader")
                return {
                    async loadScript() {
                        runtimeLoads++;
                        return {
                            value: (serverUrl, options) => {
                                probes.push({
                                    serverUrl,
                                    token: options.auth.token,
                                });
                                return {
                                    on(event, callback) {
                                        if (event === "connect")
                                            queueMicrotask(callback);
                                    },
                                    removeAllListeners() {},
                                    disconnect() {},
                                };
                            },
                            dispose() {},
                        };
                    },
                };
        },
    },
};
const { mount } = await import("../app/index.js");

function reset() {
    requests.length = 0;
    probes.length = 0;
    errors.length = 0;
    runtimeLoads = 0;
    denied = false;
    accountMode = false;
    abortSession = undefined;
}
const options = {
    shareContext: { payload: { whiteboardId: "shared-board" }, page: {} },
    navigationAllowed: false,
};

test("actual shared mount/openBoard probes the authorized target session without global preflight", async () => {
    reset();
    const mounted = await mount(new MountRoot(), options);
    assert.equal(requests.length, 1);
    assert.deepEqual(probes, [
        { serverUrl: session.serverUrl, token: session.token },
    ]);
    assert.equal(
        runtimeLoads,
        2,
        "target probe completes before normal canvas runtime setup",
    );
    assert.deepEqual(errors, []);
    mounted.destroy();
});

test("shared session denial never starts readiness or canvas transport", async () => {
    reset();
    denied = true;
    const originalError = console.error;
    console.error = () => {};
    try {
        const mounted = await mount(new MountRoot(), options);
        assert.equal(requests.length, 1);
        assert.equal(runtimeLoads, 0);
        assert.equal(errors.length, 1);
        mounted.destroy();
    } finally {
        console.error = originalError;
    }
});

test("aborted shared session never starts readiness or canvas transport", async () => {
    reset();
    const controller = new AbortController();
    abortSession = () => controller.abort();
    await mount(new MountRoot(), { ...options, signal: controller.signal });
    assert.equal(runtimeLoads, 0);
    assert.equal(probes.length, 0);
    assert.deepEqual(errors, []);
});

test("ordinary account mount keeps account preflight before its target session", async () => {
    reset();
    accountMode = true;
    const mounted = await mount(new MountRoot(), {
        navigationAllowed: false,
        focusState: { whiteboardId: "shared-board" },
    });
    assert.deepEqual(
        requests.map((path) => path.split("/nextcloud-whiteboard")[1]),
        [
            "/whiteboards",
            "/whiteboards/preflight",
            "/whiteboards/session?id=shared-board",
        ],
    );
    assert.equal(probes[0].token, "account-preflight-token");
    assert.deepEqual(errors, []);
    mounted.destroy();
});
