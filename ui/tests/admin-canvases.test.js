import test from "node:test";
import assert from "node:assert/strict";
import {
    renderCanvasRows,
    renderCanvasTable,
} from "../templates/admin-canvases.js";

const row = {
    id: "board",
    title: "Board",
    createdBy: "owner",
    activeUsers: [],
    updatedAt: "now",
    issues: [],
};
const render = (rows, filter) =>
    renderCanvasRows(rows, filter, (key) => key, String, String);

for (const filter of ["all", "active", "troubled"]) {
    test(`${filter} canvas filter has a meaningful distinct empty message`, () => {
        assert.match(render([], filter), new RegExp(`empty.${filter}`));
    });
}

test("troubled canvases lists diagnosed records and renders their issue pills", () => {
    const troubled = {
        ...row,
        id: "troubled",
        issues: ["ownerAccessMissing", "duplicateSource"],
    };
    const html = render([row, troubled], "troubled");
    assert.match(html, /data-delete-canvas="troubled"/);
    assert.match(html, /whiteboard-admin-issue-pill/);
    assert.match(html, /issue.owneraccessmissing/);
    assert.equal((html.match(/data-delete-canvas=/g) ?? []).length, 1);
    assert.match(
        renderCanvasTable("troubled", (key) => key, String),
        /data-canvas-filter="troubled" aria-pressed="true"/,
    );
});

test("active canvases are selected by live users, independently of source bindings", () => {
    const active = { ...row, id: "active", activeUsers: ["owner"] };
    const html = render([row, active], "active");
    assert.match(html, /data-delete-canvas="active"/);
    assert.equal((html.match(/data-delete-canvas=/g) ?? []).length, 1);
});
