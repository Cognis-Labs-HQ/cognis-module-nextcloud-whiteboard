import assert from "node:assert/strict";
import { EventEmitter, getEventListeners } from "node:events";
import test from "node:test";
import { probeWebsocketAuthorization } from "../app/reuse/websocket-probe.js";
import { createWhiteboardPreflightController } from "../app/preflight.js";
import { debounce, throttleLatest } from "../app/realtime.js";

function socketRuntime() {
    const socket = new EventEmitter();
    let disconnects = 0;
    let disposals = 0;
    socket.disconnect = () => {
        disconnects += 1;
    };
    return {
        socket,
        runtime: {
            io: () => socket,
            dispose: () => {
                disposals += 1;
            },
        },
        counts: () => ({ disconnects, disposals }),
    };
}

for (const completion of ["connect", "connect_error", "abort", "timeout"]) {
    test(`websocket probe releases every owned resource after ${completion}`, async () => {
        const runtime = socketRuntime();
        const controller = new AbortController();
        const result = probeWebsocketAuthorization(
            runtime.runtime,
            {
                serverUrl: "https://whiteboard.example",
                websocketAuthToken: "token",
            },
            { signal: controller.signal, timeoutMs: 0 },
        );
        if (completion === "abort") controller.abort();
        else if (completion !== "timeout") runtime.socket.emit(completion);
        assert.equal(await result, completion === "connect");
        runtime.socket.emit("connect_error");
        assert.deepEqual(runtime.counts(), { disconnects: 1, disposals: 1 });
        assert.equal(runtime.socket.listenerCount("connect"), 0);
        assert.equal(getEventListeners(controller.signal, "abort").length, 0);
    });
}

test("preflight ignores a response after its mount was aborted", async () => {
    let finishRequest;
    const toasts = [];
    const controller = new AbortController();
    const preflight = createWhiteboardPreflightController({
        fetchPreflight: () =>
            new Promise((resolve) => {
                finishRequest = resolve;
            }),
        getMountRoot: () => "root",
        setOverlayVisible() {},
        showToast: (message) => toasts.push(message),
        translate: (key) => key,
        loadSocketIo: () =>
            assert.fail("Cancelled mount cannot load transport"),
    });
    const running = preflight.run({ signal: controller.signal });
    controller.abort();
    finishRequest({ alive: true, serverUrl: "https://whiteboard.example" });
    assert.equal(await running, false);
    assert.deepEqual(toasts, []);
});

test("cancelled scene callbacks cannot save or emit after canvas teardown", async () => {
    const calls = [];
    const persist = debounce(() => calls.push("save"), 0);
    const emit = throttleLatest((value) => calls.push(value), 0);
    persist();
    emit("initial");
    emit("trailing");
    persist.cancel();
    emit.cancel();
    await new Promise((resolve) => setTimeout(resolve, 5));
    assert.deepEqual(calls, ["initial"]);
});

test("socket construction failure still releases the loaded runtime", async () => {
    let disposals = 0;
    const failure = new Error("transport unavailable");
    await assert.rejects(
        probeWebsocketAuthorization(
            {
                io() {
                    throw failure;
                },
                dispose() {
                    disposals += 1;
                },
            },
            {},
        ),
        failure,
    );
    assert.equal(disposals, 1);
});

test("a replaced preflight releases late script handles without opening a socket", async () => {
    let finishLoad;
    let disposals = 0;
    const preflight = createWhiteboardPreflightController({
        fetchPreflight: async () => ({
            alive: true,
            serverUrl: "https://whiteboard.example",
        }),
        getMountRoot: () => "root",
        getResourceLoader: () => ({}),
        setOverlayVisible() {},
        showToast: () =>
            assert.fail("Superseded preflight cannot show a toast"),
        translate: (key) => key,
        loadSocketIo: () =>
            new Promise((resolve) => {
                finishLoad = resolve;
            }),
    });
    const running = preflight.run();
    await Promise.resolve();
    preflight.setStatus("idle");
    finishLoad({
        io: () => assert.fail("Superseded preflight cannot open transport"),
        dispose() {
            disposals += 1;
        },
    });
    assert.equal(await running, false);
    assert.equal(disposals, 1);
});
