import assert from "node:assert/strict";
import test from "node:test";
import { mergeElementsSnapshots } from "../api/reuse/elements-snapshot.js";

test("snapshot merge preserves concurrent changes from different users", () => {
    const aliceShape = { id: "alice", version: 1, versionNonce: 1 };
    const bobShape = { id: "bob", version: 1, versionNonce: 1 };

    assert.deepEqual(mergeElementsSnapshots([aliceShape], [bobShape]), [
        aliceShape,
        bobShape,
    ]);
});

test("snapshot merge keeps the newest update and deletion tombstones", () => {
    const original = {
        id: "shared",
        version: 1,
        versionNonce: 5,
        isDeleted: false,
    };
    const stale = { ...original, versionNonce: 4 };
    const deleted = {
        ...original,
        version: 2,
        versionNonce: 1,
        isDeleted: true,
    };

    assert.deepEqual(mergeElementsSnapshots([original], [stale]), [original]);
    assert.deepEqual(mergeElementsSnapshots([original], [deleted]), [deleted]);
});
