import { createProviderScope } from "./reuse/provider-scope.js";
import assert from "node:assert/strict";
import test from "node:test";

const requests = [];
const launches = [];
const capabilities = new Map([
    [
        "ui:reuse",
        {
            loadStylesheets() {},
            importModule: async () => ({
                apiFetch: async (path, options) => {
                    requests.push({ path, options });
                    return {
                        ok: true,
                        json: async () => ({
                            data: { whiteboard: { id: "canvas-1" } },
                        }),
                    };
                },
            }),
        },
    ],
    [
        "component-pages:request",
        async (options) => {
            launches.push(options);
            return { ready: true };
        },
    ],
    [
        "component-pages:spawn",
        async (options) => {
            launches.push(options);
            return { borderless: options.borderless === true, discard() {} };
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
const gateway = capabilities.get("whiteboard:uiGateway");

test("provider registers complete creation and presentation methods", async () => {
    for (const name of [
        "createCanvas",
        "createDisposableCanvas",
        "requestCanvasPage",
        "openCanvas",
    ])
        assert.equal(typeof gateway[name], "function");
    const result = await gateway.createCanvas({
        title: "Shared board",
        participantHandles: ["alice", "bob"],
    });
    assert.deepEqual(result, { whiteboardId: "canvas-1" });
    assert.deepEqual(JSON.parse(requests.at(-1).options.body), {
        title: "Shared board",
        participants: ["alice", "bob"],
    });
});

test("integration callers need only a canvas ID and their own mount target", async () => {
    const signal = new AbortController().signal;
    await gateway.requestCanvasPage({ signal });
    const window = await gateway.openCanvas({
        whiteboardId: "canvas-1",
        elementId: "integration-stage",
        signal,
    });
    assert.equal(typeof window.discard, "function");
    assert.equal(window.borderless, true);
    assert.equal(launches.at(-1).borderless, true);
    assert.equal(launches.at(-1).elementId, "integration-stage");
    assert.equal(launches.at(-1).context.whiteboardId, "canvas-1");
    assert.equal(launches.at(-1).routeId, "module.nextcloud.whiteboard.canvas");
    assert.equal(
        launches.at(-1).componentUuid,
        "5bb6105d-14d2-5d9d-a284-b2969fb4e35d",
    );
    assert.deepEqual(launches.at(-1).context, {
        whiteboardId: "canvas-1",
        instantCanvas: true,
    });
    assert.equal(launches.at(-1).signal, signal);
});

test("aborted presentation makes no component-page request", async () => {
    const controller = new AbortController();
    controller.abort();
    const count = launches.length;
    await assert.rejects(
        () =>
            gateway.openCanvas({
                whiteboardId: "canvas-1",
                elementId: "stage",
                signal: controller.signal,
            }),
        { name: "AbortError" },
    );
    assert.equal(launches.length, count);
});

test("same cached provider remounts and stale handles reject after disable", async () => {
    providerScope.dispose();
    assert.equal(capabilities.has("whiteboard:uiGateway"), false);
    await assert.rejects(gateway.createCanvas({ title: "Disabled" }), {
        name: "AbortError",
    });
    const nextScope = createProviderScope(capabilities);
    mountProvider(nextScope);
    assert.equal(nextScope.flows.size, 4);
    assert.deepEqual(
        await capabilities
            .get("whiteboard:uiGateway")
            .createCanvas({ title: "Enabled" }),
        { whiteboardId: "canvas-1" },
    );
    nextScope.dispose();
});
