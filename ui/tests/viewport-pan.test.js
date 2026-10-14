import test from "node:test";
import assert from "node:assert/strict";

globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get: () => ({
            loadStylesheets() {},
            importModule: async () => ({
                parseSavedFont: () => ({}),
                toFontFamilyValue: () => "sans-serif",
                loadFontsCatalog: async () => [],
            }),
        }),
    },
};
globalThis.document = new EventTarget();
document.documentElement = {};
globalThis.getComputedStyle = () => ({ getPropertyValue: () => "sans-serif" });
globalThis.requestAnimationFrame = () => 1;
globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
};
const { createWhiteboardCanvas } = await import("../canvas/index.js");

test("middle-button panning moves the local viewport without publishing scene changes", () => {
    const canvas = new EventTarget();
    canvas.style = {};
    canvas.getContext = () => ({});
    canvas.parentElement = {
        getBoundingClientRect: () => ({ width: 800, height: 600 }),
        querySelector: () => null,
    };
    canvas.getBoundingClientRect = () => ({ left: 0, top: 0 });
    canvas.setPointerCapture = () => {};
    canvas.releasePointerCapture = () => {};
    const view = createWhiteboardCanvas(canvas);
    const changes = [];
    view.onChange((elements, metadata) => changes.push(metadata));
    for (const [type, x, y] of [
        ["pointerdown", 20, 30],
        ["pointermove", 80, 90],
        ["pointerup", 80, 90],
    ]) {
        const event = new Event(type, { cancelable: true });
        Object.assign(event, {
            button: 1,
            buttons: 4,
            pointerId: 1,
            clientX: x,
            clientY: y,
        });
        canvas.dispatchEvent(event);
    }
    assert.deepEqual(view.getViewportOffset(), { x: -60, y: -60 });
    assert.deepEqual(changes, []);
    view.destroy();
});
