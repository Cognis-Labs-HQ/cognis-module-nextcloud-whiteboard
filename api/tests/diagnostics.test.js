import test from "node:test";
import assert from "node:assert/strict";
import { diagnoseCanvases } from "../administration/canvases.js";

const board = {
    id: "canvas",
    createdBy: "alice",
    sourceType: "provider",
    sourceId: "item",
    resourceReference: { resourceType: "resource", resourceId: "identifier" },
};

test("canvas diagnostics reports missing owner access and incomplete bindings", () => {
    assert.deepEqual(diagnoseCanvases([board])(board, ["alice"]), []);
    assert.deepEqual(diagnoseCanvases([board])(board, ["bob"]), [
        "ownerAccessMissing",
    ]);
    const incomplete = { ...board, createdBy: "", sourceId: null };
    assert.deepEqual(diagnoseCanvases([incomplete])(incomplete, []), [
        "missingOwner",
        "incompleteSource",
    ]);
});

test("canvas diagnostics identifies every duplicate generic source and reference", () => {
    const second = { ...board, id: "other" };
    const diagnose = diagnoseCanvases([board, second]);
    for (const row of [board, second])
        assert.deepEqual(diagnose(row, ["alice"]), [
            "duplicateSource",
            "duplicateReference",
        ]);
    const distinct = {
        ...second,
        sourceId: "other",
        resourceReference: { resourceType: "resource", resourceId: "other" },
    };
    assert.deepEqual(diagnoseCanvases([board, distinct])(board, ["alice"]), []);
    const unbound = {
        ...board,
        sourceType: null,
        sourceId: null,
        resourceReference: null,
    };
    assert.deepEqual(
        diagnoseCanvases([unbound, { ...unbound, id: "other" }])(unbound, [
            "alice",
        ]),
        [],
    );
});
