import assert from "node:assert/strict";
import test from "node:test";
import { NextcloudWhiteboardStore } from "../store.js";
import { testProfileIdentity } from "../../tests/reuse/profile-identity.js";

function fixture() {
    const board = {
        id: "board",
        title: "Canvas",
        created_by: "owner",
        source_type: null,
        source_id: null,
    };
    const databaseExecutor = {
        async executeCommand(command) {
            if (command.option === "SELECT") return { rows: [{ ...board }] };
            if (
                command.where.every(({ column, operator, value }) =>
                    operator === "IS NULL"
                        ? board[column] == null
                        : board[column] === value,
                )
            )
                Object.assign(board, command.set);
            return {};
        },
    };
    return {
        board,
        store: new NextcloudWhiteboardStore({
            db: databaseExecutor,
            profileIdentity: testProfileIdentity,
        }),
    };
}
const input = {
    whiteboardId: "board",
    sourceType: "meeting",
    sourceId: "first",
};

test("canvas binding rejects a second source and preserves the first claim", async () => {
    const { store, board } = fixture();
    await store.bindWhiteboardSource(input);
    await store.bindWhiteboardSource(input);
    await assert.rejects(
        store.bindWhiteboardSource({ ...input, sourceId: "second" }),
        { code: "source_conflict" },
    );
    assert.equal(board.source_id, "first");
});

test("concurrent canvas claims have one winner; unrelated releases cannot unbind it", async () => {
    const { store, board } = fixture();
    const outcomes = await Promise.allSettled([
        store.bindWhiteboardSource(input),
        store.bindWhiteboardSource({ ...input, sourceId: "second" }),
    ]);
    assert.equal(
        outcomes.filter((entry) => entry.status === "fulfilled").length,
        1,
    );
    await store.releaseWhiteboardSource({ ...input, sourceId: "second" });
    assert.equal(board.source_id, "first");
    await store.releaseWhiteboardSource(input);
    await store.bindWhiteboardSource({ ...input, sourceId: "second" });
    assert.equal(board.source_id, "second");
});

test("canvas source capability authorizes its owner before changing bindings", async () => {
    const { createCanvasSourceBinding } =
        await import("../canvas/source-binding.js");
    let changes = 0;
    const binding = createCanvasSourceBinding({
        profileStore: {
            getProfile: async (accountId) => ({ handle: accountId }),
        },
        profileIdentity: {
            resolveAccountHandle: async (accountId) => accountId,
        },
        store: {
            getWhiteboardById: async () => ({ createdBy: "owner" }),
            bindWhiteboardSource: async () => {
                changes += 1;
            },
        },
    });
    await assert.rejects(
        binding.bind({ ...input, actorAccountId: "outsider" }),
        /owner/,
    );
    assert.equal(changes, 0);
    await binding.bind({ ...input, actorAccountId: "owner" });
    assert.equal(changes, 1);
});

test("a verified administrator can release an exact binding without impersonating its creator", async () => {
    const { createCanvasSourceBinding } =
        await import("../canvas/source-binding.js");
    let released;
    const binding = createCanvasSourceBinding({
        resolveActorRole: async (id) => (id === "admin" ? "admin" : "user"),
        profileStore: {
            getProfile: async () =>
                assert.fail(
                    "Administrative access does not need creator profile impersonation",
                ),
        },
        store: {
            getWhiteboardById: async () => ({ createdBy: "other" }),
            releaseWhiteboardSource: async (input) => {
                released = input;
            },
        },
    });
    await binding.release({ ...input, actorAccountId: "admin" });
    assert.equal(released.sourceId, "first");
});
