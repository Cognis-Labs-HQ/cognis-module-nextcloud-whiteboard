import assert from "node:assert/strict";
import test from "node:test";

const requests = [];
let execute;
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get: () => ({
            loadStylesheets() {},
            importModule: async () => ({
                apiFetch: async (path, input) => {
                    requests.push({ path, input });
                    return execute(path, input);
                },
            }),
        }),
    },
};
const { fetchWhiteboardSession } = await import("../app/api.js");

test("a deleted standalone canvas resolves one blank replacement by its generic identifier", async () => {
    requests.length = 0;
    execute = (path) =>
        path.includes("session?id=deleted")
            ? Response.json({ error: { code: "not_found" } }, { status: 404 })
            : path.endsWith("/spawn")
              ? Response.json({ data: { whiteboard: { id: "replacement" } } })
              : Response.json({
                    data: { roomId: "replacement", elements: [] },
                });
    const session = await fetchWhiteboardSession("deleted", {
        recoverMissing: true,
        title: "Notes",
    });
    assert.equal(session.roomId, "replacement");
    assert.equal(session.recreated, true);
    assert.deepEqual(session.elements, []);
    assert.deepEqual(JSON.parse(requests[1].input.body), {
        title: "Notes",
        participants: [],
        resourceType: "canvas",
        resourceId: "deleted",
    });
    assert.equal(requests.length, 3);
});

for (const [status, code] of [
    [403, "forbidden"],
    [503, "unavailable"],
    [404, "access_denied"],
]) {
    test(`canvas recovery does not replace ${status}/${code} failures`, async () => {
        requests.length = 0;
        execute = () => Response.json({ error: { code } }, { status });
        await assert.rejects(
            fetchWhiteboardSession("existing", { recoverMissing: true }),
            { status, code },
        );
        assert.equal(requests.length, 1);
    });
}

test("guest/embedded reads do not create replacements and recreation has one bounded attempt", async () => {
    requests.length = 0;
    execute = () =>
        Response.json({ error: { code: "not_found" } }, { status: 404 });
    await assert.rejects(fetchWhiteboardSession("deleted"), { status: 404 });
    assert.equal(requests.length, 1);
    requests.length = 0;
    execute = (path) =>
        path.endsWith("/spawn")
            ? Response.json({ data: { whiteboard: { id: "replacement" } } })
            : Response.json({ error: { code: "not_found" } }, { status: 404 });
    await assert.rejects(
        fetchWhiteboardSession("deleted", { recoverMissing: true }),
        { status: 404 },
    );
    assert.equal(requests.length, 3);
});
