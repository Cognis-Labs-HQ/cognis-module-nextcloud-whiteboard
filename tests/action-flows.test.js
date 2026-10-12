import assert from "node:assert/strict";
import test from "node:test";
import { NextcloudWhiteboardStore } from "../api/store.js";
import { registerWhiteboardActions } from "../api/reuse/action-store.js";
import { createMemoryDb } from "./reuse/api-runtime.js";
import { createFlowRuntime } from "./reuse/flow-runtime.js";
import { testProfileIdentity } from "./reuse/profile-identity.js";

function createActions() {
    const ctx = createFlowRuntime();
    const db = createMemoryDb();
    const store = new NextcloudWhiteboardStore({
        db,
        profileIdentity: testProfileIdentity,
    });
    const actions = registerWhiteboardActions(ctx, store);
    return { ctx, db, store, actions };
}

test("all supported store operations execute declared owned stages", async () => {
    const { ctx, store, actions } = createActions();
    const methods = Object.getOwnPropertyNames(
        NextcloudWhiteboardStore.prototype,
    ).filter(
        (method) =>
            method !== "createSchema" &&
            NextcloudWhiteboardStore.prototype[method].constructor.name ===
                "AsyncFunction",
    );
    for (const method of [...methods, "mintSessionToken"])
        assert.ok(Object.hasOwn(actions, method), method);
    const config = await actions.getConfig();
    assert.equal(config.apiKeyConfigured, false);
    assert.deepEqual(ctx.executions, [
        "nextcloud-whiteboard:get-config:initialize-store",
        "nextcloud-whiteboard:get-config:execute-action",
    ]);
    const board = await actions.createWhiteboard({
        title: "Shared board",
        createdBy: "alice",
        participants: ["bob"],
    });
    assert.equal(board.title, "Shared board");
    assert.deepEqual(await store.listParticipants(board.id), ["alice", "bob"]);
});

test("initialization failure and disabled flows cannot bypass the owner runner", async () => {
    const { ctx, store, actions } = createActions();
    store.ensureSchema = async () => {
        ctx.flows.clear();
    };
    await assert.rejects(actions.createWhiteboard({}), /no longer active/);
    const next = createActions();
    next.ctx.flow.run = async () => ({ stageResults: {} });
    await assert.rejects(next.actions.getConfig(), /did not execute/);
});

test("full content deletion rolls back if a dependent table cannot be cleared", async () => {
    const { db, store } = createActions();
    await store.ensureSchema();
    const board = await store.createWhiteboard({
        title: "Keep on failure",
        createdBy: "alice",
    });
    const execute = db.executeCommand;
    db.executeCommand = async (command) => {
        if (
            command.option === "DELETE" &&
            command.table === "nextcloud_whiteboards"
        )
            throw new Error("delete failed");
        return execute(command);
    };
    await assert.rejects(store.deleteAllData(), /delete failed/);
    assert.deepEqual(await store.listParticipants(board.id), ["alice"]);
    assert.equal(
        (await store.getWhiteboardById(board.id)).title,
        "Keep on failure",
    );
});
