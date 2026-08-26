import test from "node:test";
import assert from "node:assert/strict";
import {
    canFinalizeDrawing,
    createDrawingDraft,
    preserveDraftIdentity,
} from "../ui/whiteboard/reuse/draft-elements.js";

test("drawing drafts keep one collaborative identity through pointer movement", () => {
    const initial = preserveDraftIdentity(
        null,
        createDrawingDraft({
            activeTool: "rectangle",
            currentPoints: [[10, 20]],
            dragStartPoint: [10, 20],
            strokeColor: "#123456",
            strokeWidth: 4,
        }),
    );
    const moved = preserveDraftIdentity(
        initial,
        createDrawingDraft({
            activeTool: "rectangle",
            currentPoints: [
                [10, 20],
                [80, 100],
            ],
            dragStartPoint: [10, 20],
            strokeColor: "#123456",
            strokeWidth: 4,
        }),
    );

    assert.equal(moved.id, initial.id);
    assert.equal(moved.seed, initial.seed);
    assert.equal(moved.version, initial.version + 1);
    assert.equal(moved.isTransient, true);
    assert.deepEqual(
        { x: moved.x, y: moved.y, width: moved.width, height: moved.height },
        { x: 10, y: 20, width: 70, height: 80 },
    );
    assert.equal(
        canFinalizeDrawing({
            activeTool: "rectangle",
            currentPoints: [
                [10, 20],
                [80, 100],
            ],
            dragStartPoint: [10, 20],
            draftElement: moved,
        }),
        true,
    );
});
