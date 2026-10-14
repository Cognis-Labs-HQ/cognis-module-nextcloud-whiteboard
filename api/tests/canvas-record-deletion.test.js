import assert from "node:assert/strict";
import test from "node:test";
import { createCanvasRecordDeletion } from "../reuse/canvas-record-deletion.js";

test("canvas deletion clears shares from every owner before deleting provider records", async () => {
    const calls = [];
    const remove = createCanvasRecordDeletion({
        store: { deleteWhiteboard: async (id) => calls.push(["canvas", id]) },
        listSharesByResource: async (input) => {
            assert.equal(input.resourceId, "canvas");
            return [
                { ownerAccountId: "first" },
                { ownerAccountId: "second" },
                { ownerAccountId: "first" },
            ];
        },
        deleteResourceShares: async (input) =>
            calls.push(["shares", input.ownerAccountId]),
    });
    await remove("canvas");
    assert.deepEqual(calls, [
        ["shares", "first"],
        ["shares", "second"],
        ["canvas", "canvas"],
    ]);
});

test("a failed share cleanup retains the canvas for a retry", async () => {
    const remove = createCanvasRecordDeletion({
        store: {
            deleteWhiteboard: async () =>
                assert.fail("Do not delete the canvas before its shares"),
        },
        listSharesByResource: async () => [{ ownerAccountId: "owner" }],
        deleteResourceShares: async () => {
            throw new Error("Unavailable");
        },
    });
    await assert.rejects(remove("canvas"), /Unavailable/);
});
