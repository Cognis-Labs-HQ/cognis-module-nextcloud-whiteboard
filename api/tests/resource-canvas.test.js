import assert from "node:assert/strict";
import test from "node:test";
import { NextcloudWhiteboardStore } from "../store.js";
import { resolveResourceCanvas } from "../reuse/resource-canvas.js";
import { createWhiteboardModuleApi } from "../reuse/module-api.js";
import { registerWhiteboardActions } from "../reuse/action-store.js";
import { createMemoryDb } from "../../tests/reuse/api-runtime.js";
import { createFlowRuntime } from "../../tests/reuse/flow-runtime.js";
import { testProfileIdentity } from "../../tests/reuse/profile-identity.js";

function fixture() {
    const database = createMemoryDb();
    const runtime = { ...createFlowRuntime(), log() {} };
    const raw = new NextcloudWhiteboardStore({
        db: database,
        profileIdentity: testProfileIdentity,
    });
    const store = registerWhiteboardActions(runtime, raw);
    const resolve = (input = {}) =>
        resolveResourceCanvas({
            store,
            username: "alice",
            resourceType: "workspace",
            resourceId: "stable-id",
            title: "Planning",
            participants: ["bob"],
            ...input,
        });
    return { database, store, runtime, resolve };
}

for (const disposable of [false, true]) {
    test(`a generic reference reuses its ${disposable ? "disposable" : "persistent"} canvas across requests and store instances`, async () => {
        const { database, store, runtime, resolve } = fixture();
        const first = await resolve({ disposable });
        assert.ok(first.whiteboard.id);
        const elements = [{ id: "shape", type: "rectangle", x: 20, y: 30 }];
        await store.saveElementsSnapshot(first.whiteboard.id, elements);
        const second = await resolve({
            disposable,
            title: "Renamed caller",
            participants: ["outsider"],
        });
        assert.equal(second.whiteboard.id, first.whiteboard.id);
        assert.equal(second.whiteboard.title, "Planning");
        assert.equal(
            await store.canAccessWhiteboard(first.whiteboard.id, "outsider"),
            false,
        );
        const freshStore = new NextcloudWhiteboardStore({
            db: database,
            profileIdentity: testProfileIdentity,
        });
        const reopened = await resolveResourceCanvas({
            store: freshStore,
            username: "bob",
            resourceType: "workspace",
            resourceId: "stable-id",
            disposable,
        });
        assert.equal(reopened.whiteboard.id, first.whiteboard.id);
        assert.deepEqual(
            await freshStore.getElementsSnapshot(reopened.whiteboard.id),
            elements,
        );
        assert.ok(
            runtime.executions.includes(
                "nextcloud-whiteboard:getWhiteboardByReferenceKey:execute-action",
            ),
        );
        const conflict = await resolve({ disposable: !disposable });
        assert.equal(conflict.status, 409);
        const denied = await resolve({ disposable, username: "outsider" });
        assert.equal(denied.status, 403);
    });
}

test("concurrent reference requests create one canvas without adding a losing caller's membership", async () => {
    const { resolve, store, database } = fixture();
    const results = await Promise.all([
        resolve(),
        resolve(),
        resolve({ username: "outsider", participants: ["outsider"] }),
    ]);
    assert.ok(results[0].whiteboard);
    assert.equal(results[1].whiteboard.id, results[0].whiteboard.id);
    assert.equal(results[2].status, 403);
    const rows = await database.executeCommand({
        option: "SELECT",
        table: "nextcloud_whiteboards",
    });
    assert.equal(rows.rows.length, 1);
    assert.equal(
        await store.canAccessWhiteboard(results[0].whiteboard.id, "outsider"),
        false,
    );
});

test("references are distinct by resource type and ID and are released by deletion", async () => {
    const { resolve, store } = fixture();
    const first = await resolve();
    const otherId = await resolve({ resourceId: "other" });
    const otherType = await resolve({ resourceType: "document" });
    assert.equal(
        new Set([
            first.whiteboard.id,
            otherId.whiteboard.id,
            otherType.whiteboard.id,
        ]).size,
        3,
    );
    await store.deleteWhiteboard(first.whiteboard.id);
    const replacement = await resolve();
    assert.notEqual(replacement.whiteboard.id, first.whiteboard.id);
});

test("incomplete and invalid references never create a canvas", async () => {
    const { resolve, database } = fixture();
    for (const input of [
        { resourceId: "" },
        { resourceType: "../escape" },
        { resourceId: {} },
        { resourceId: "x".repeat(201) },
    ]) {
        assert.equal((await resolve(input)).status, 422);
    }
    assert.equal(
        (
            await database.executeCommand({
                option: "SELECT",
                table: "nextcloud_whiteboards",
            })
        ).rows.length,
        0,
    );
});

test("the public spawn contract reuses references and returns the stored owner and membership", async () => {
    const { store } = fixture();
    await store.saveConfig({
        serverUrl: "https://whiteboard.example",
        apiKey: "secret-at-least-sixteen-characters",
    });
    const api = createWhiteboardModuleApi({
        store,
        profileIdentity: testProfileIdentity,
    });
    const first = await api.spawnWhiteboardWindow({
        createdBy: "alice",
        participants: ["bob"],
        resourceType: "document",
        resourceId: "doc-1",
    });
    const second = await api.spawnWhiteboardWindow({
        createdBy: "bob",
        participants: ["outsider"],
        resourceType: "document",
        resourceId: "doc-1",
    });
    assert.equal(second.whiteboardId, first.whiteboardId);
    assert.equal(second.access.owner, "alice");
    assert.deepEqual(second.access.participants, ["alice", "bob"]);
});
