import test from "node:test";
import assert from "node:assert/strict";

import { buildRemoteSelections } from "../ui/whiteboard/reuse/remote-selections.js";

test("remote selections preserve live collaborator interaction states", () => {
    const selections = buildRemoteSelections([
        {
            color: "#123456",
            elementIds: ["shape-1"],
            interaction: "typing",
            label: "Ada",
        },
    ]);

    assert.deepEqual(selections.get("shape-1"), {
        color: "#123456",
        interaction: "typing",
        label: "Ada",
    });
});

test("remote selections reject unknown collaborator interaction states", () => {
    const selections = buildRemoteSelections([
        { elementIds: ["shape-1"], interaction: "unknown" },
    ]);

    assert.equal(selections.get("shape-1").interaction, "idle");
});
