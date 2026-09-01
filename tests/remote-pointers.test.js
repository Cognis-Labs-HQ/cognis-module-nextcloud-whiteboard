import test from "node:test";
import assert from "node:assert/strict";

import { renderRemotePointers } from "../ui/whiteboard/reuse/remote-pointers.js";

function createHarness() {
    const calls = [];
    const root = {
        getBoundingClientRect: () => ({
            height: 100,
            left: 0,
            top: 0,
            width: 100,
        }),
        scrollHeight: 100,
        scrollLeft: 0,
        scrollTop: 0,
        scrollWidth: 100,
    };
    const canvasElement = {
        closest: () => root,
        getBoundingClientRect: () => ({
            height: 100,
            left: 0,
            top: 0,
            width: 100,
        }),
    };
    const context = new Proxy(
        { measureText: (text) => ({ width: text.length * 6 }) },
        {
            get(target, property) {
                if (property in target) return target[property];
                return (...args) => calls.push([property, ...args]);
            },
            set(target, property, value) {
                target[property] = value;
                return true;
            },
        },
    );
    return { calls, canvasElement, context };
}

test("idle collaborators render a regular cursor at their live position", () => {
    const harness = createHarness();
    renderRemotePointers({
        ...harness,
        pointers: [
            {
                color: "#123",
                interaction: "idle",
                label: "Ada",
                x: 0.5,
                y: 0.5,
            },
        ],
    });
    assert.ok(harness.calls.some(([name]) => name === "beginPath"));
});

test("typing collaborators hide the cursor and render a typing label", () => {
    const harness = createHarness();
    renderRemotePointers({
        ...harness,
        pointers: [
            {
                color: "#123",
                interaction: "typing",
                label: "Ada",
                x: 0.5,
                y: 0.5,
            },
        ],
    });
    assert.ok(!harness.calls.some(([name]) => name === "beginPath"));
    assert.ok(
        harness.calls.some(
            ([name, text]) => name === "fillText" && text === "⌨ Ada",
        ),
    );
});
