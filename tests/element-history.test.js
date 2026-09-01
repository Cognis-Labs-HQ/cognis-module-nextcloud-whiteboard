import assert from "node:assert/strict";
import test from "node:test";

import { createElementHistory } from "../ui/whiteboard/reuse/element-history.js";

test("element history records, undoes, and redoes changed elements", () => {
    const applied = [];
    const states = [];
    const history = createElementHistory({
        applySnapshot: (snapshot, changedIds) =>
            applied.push({ snapshot, changedIds }),
        onChange: (state) => states.push(state),
    });
    const before = [{ id: "shape", x: 1 }];
    const after = [{ id: "shape", x: 2 }];

    assert.equal(history.record(before, after), true);
    assert.equal(history.canUndo(), true);
    assert.equal(history.undo(), true);
    assert.deepEqual(applied.at(-1), {
        snapshot: before,
        changedIds: ["shape"],
    });
    assert.equal(history.canRedo(), true);
    assert.equal(history.redo(), true);
    assert.deepEqual(applied.at(-1), {
        snapshot: after,
        changedIds: ["shape"],
    });
    assert.deepEqual(states.at(-1), { canUndo: true, canRedo: false });
});

test("element history ignores unchanged snapshots", () => {
    const history = createElementHistory({ applySnapshot() {} });
    const snapshot = [{ id: "shape", x: 1 }];

    assert.equal(history.record(snapshot, structuredClone(snapshot)), false);
    assert.equal(history.canUndo(), false);
});
