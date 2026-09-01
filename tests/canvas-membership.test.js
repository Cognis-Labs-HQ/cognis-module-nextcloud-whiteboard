import assert from "node:assert/strict";
import test from "node:test";
import { createCanvasMembershipCapability } from "../api/reuse/canvas-membership.js";

function createHarness() {
    const participants = new Set(["alice", "bob"]);
    const store = {
        async getWhiteboardById(whiteboardId) {
            return whiteboardId === "canvas-1"
                ? {
                      id: whiteboardId,
                      createdBy: "alice",
                      disposable: false,
                  }
                : null;
        },
        async addWhiteboardMember(_whiteboardId, username) {
            participants.add(username);
        },
        async removeWhiteboardMember(_whiteboardId, username) {
            participants.delete(username);
        },
        async listParticipants() {
            return Array.from(participants);
        },
    };
    const profileStore = {
        async getProfile(accountId) {
            return { handle: String(accountId).replace(/^account:/, "") };
        },
    };
    return {
        membership: createCanvasMembershipCapability(store, profileStore),
        participants,
    };
}

test("canvas membership adds and removes a user by canonical account ID", async () => {
    const { membership, participants } = createHarness();

    const added = await membership.add({
        whiteboardId: "canvas-1",
        actorAccountId: "account:alice",
        userAccountId: "account:carol",
    });

    assert.deepEqual(added, {
        whiteboardId: "canvas-1",
        participants: ["alice", "bob", "carol"],
    });
    assert.equal(participants.has("carol"), true);

    const removed = await membership.remove({
        whiteboardId: "canvas-1",
        actorAccountId: "account:alice",
        userAccountId: "account:carol",
    });

    assert.equal(removed, undefined);
    assert.equal(participants.has("carol"), false);
});

test("canvas membership authorizes the owner before changing access", async () => {
    const { membership, participants } = createHarness();

    await assert.rejects(
        membership.add({
            whiteboardId: "canvas-1",
            actorAccountId: "account:bob",
            userAccountId: "account:carol",
        }),
        /Only the whiteboard owner/,
    );
    await assert.rejects(
        membership.remove({
            whiteboardId: "canvas-1",
            actorAccountId: "account:alice",
            userAccountId: "account:alice",
        }),
        /owner cannot be removed/,
    );
    assert.equal(participants.has("carol"), false);
    assert.equal(participants.has("alice"), true);
});
