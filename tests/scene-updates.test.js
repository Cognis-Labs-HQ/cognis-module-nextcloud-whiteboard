import assert from "node:assert/strict";
import test from "node:test";

import { applyRemoteSceneUpdate } from "../ui/app/reuse/scene-updates.js";

test("in-flight drawing updates stay out of persistence and save state", () => {
    const applied = [];
    let persistCalls = 0;
    let dirtyCalls = 0;
    const handled = applyRemoteSceneUpdate({
        message: {
            type: "SCENE_UPDATE",
            payload: {
                transient: true,
                elements: [{ id: "remote-draft", isTransient: true }],
            },
        },
        canvas: {
            applyElements(elements) {
                applied.push(...elements);
            },
            getElements: () => [],
        },
        session: {},
        canWrite: true,
        persistChanges: () => {
            persistCalls += 1;
        },
        setDisposableSaveDirty: () => {
            dirtyCalls += 1;
        },
    });

    assert.equal(handled, true);
    assert.deepEqual(applied, [{ id: "remote-draft", isTransient: true }]);
    assert.equal(persistCalls, 0);
    assert.equal(dirtyCalls, 0);
});
