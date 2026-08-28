import test from "node:test";
import assert from "node:assert/strict";
import {
    canFinalizeDrawing,
    createRemoteDraftStore,
    createDrawingDraft,
    preserveDraftIdentity,
} from "../ui/whiteboard/reuse/draft-elements.js";
import { decodeSceneMessage, encodeSceneMessage } from "../ui/app/realtime.js";

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

test("scene messages identify in-flight drawing updates", () => {
    const elements = [{ id: "draft", isTransient: true }];
    const message = decodeSceneMessage(
        encodeSceneMessage("SCENE_UPDATE", elements, { transient: true }),
    );

    assert.equal(message.payload.transient, true);
    assert.deepEqual(message.payload.elements, elements);
});

test("remote drafts expire if their creator abandons the update", () => {
    let expiration;
    let expired = 0;
    const store = createRemoteDraftStore({
        schedule(callback) {
            expiration = callback;
            return 1;
        },
        cancel() {},
        onExpire() {
            expired += 1;
        },
    });

    store.set({ id: "abandoned-draft" });
    assert.equal(store.has("abandoned-draft"), true);

    expiration();
    assert.equal(store.has("abandoned-draft"), false);
    assert.equal(expired, 1);
});

test("transient edits remain previews without replacing stable elements", () => {
    const store = createRemoteDraftStore({
        schedule: () => 1,
        cancel() {},
    });
    const stable = [{ id: "shape", version: 2, x: 10 }];

    store.reconcile([{ id: "shape", version: 3, x: 20 }], stable);
    assert.deepEqual(store.get("shape"), {
        id: "shape",
        version: 3,
        x: 20,
    });
    assert.deepEqual(stable, [{ id: "shape", version: 2, x: 10 }]);
    assert.deepEqual(store.compose(stable), [
        { id: "shape", version: 3, x: 20 },
    ]);

    store.reconcile(stable, stable);
    assert.equal(store.has("shape"), false);
});

test("remote drafts without stable counterparts remain visible", () => {
    const store = createRemoteDraftStore({
        schedule: () => 1,
        cancel() {},
    });
    store.set({ id: "new-shape", version: 1 });

    assert.deepEqual(store.compose([{ id: "stable-shape", version: 1 }]), [
        { id: "stable-shape", version: 1 },
        { id: "new-shape", version: 1 },
    ]);
});
