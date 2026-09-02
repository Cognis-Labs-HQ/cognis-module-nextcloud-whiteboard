import assert from "node:assert/strict";
import test from "node:test";
import { mergeElementsSnapshots } from "../api/reuse/elements-snapshot.js";
import {
    bumpElementVersionPast,
    scaleElementToBounds,
} from "../ui/whiteboard/elements.js";

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

test("history revisions advance past the synchronized element", () => {
    const restored = bumpElementVersionPast(
        { id: "shared", version: 2, versionNonce: 1 },
        { id: "shared", version: 7, versionNonce: 9 },
    );

    assert.equal(restored.version, 8);
    assert.equal(Number.isInteger(restored.versionNonce), true);
});

test("resizing a text box scales its rendered font with its height", () => {
    const resized = scaleElementToBounds(
        {
            id: "text",
            type: "text",
            x: 10,
            y: 20,
            width: 160,
            height: 56,
            fontSize: 28,
            version: 1,
        },
        { x: 10, y: 20, width: 320, height: 112 },
    );

    assert.equal(resized.fontSize, 56);
    assert.equal(resized.width, 320);
    assert.equal(resized.height, 112);
});
