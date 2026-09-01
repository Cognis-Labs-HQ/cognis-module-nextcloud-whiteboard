import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createProfileIdentityCapability } from "../api/access.js";
import { createCanvasMembershipCapability } from "../api/reuse/canvas-membership.js";
import { createWhiteboardModuleApi } from "../api/reuse/module-api.js";

function createHarness() {
    const participants = new Set(["alice", "bob"]);
    const calls = [];
    const logs = [];
    const store = {
        async ensureSchema() {
            calls.push("ensureSchema");
        },
        async getWhiteboardById(whiteboardId) {
            calls.push("getWhiteboardById");
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
            return {
                handle: String(accountId).replace(/^account:/, ""),
                visibility: "visible",
            };
        },
    };
    const profileIdentity = {
        async resolveAccountHandle(accountId) {
            return String(accountId)
                .replace(/^account:/, "")
                .toLowerCase();
        },
    };
    return {
        membership: createCanvasMembershipCapability({
            store,
            profileStore,
            profileIdentity,
            log(level, message, metadata) {
                logs.push({ level, message, metadata });
            },
        }),
        participants,
        calls,
        logs,
        profileStore,
        store,
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

test("canvas membership initializes storage before looking up a canvas", async () => {
    const { membership, calls } = createHarness();

    await membership.add({
        whiteboardId: "canvas-1",
        actorAccountId: "account:alice",
        userAccountId: "account:carol",
    });

    assert.ok(
        calls.indexOf("ensureSchema") < calls.indexOf("getWhiteboardById"),
    );
});

test("canvas membership rejects hidden profiles", async () => {
    const harness = createHarness();
    harness.profileStore.getProfile = async (accountId) => ({
        handle: String(accountId).replace(/^account:/, ""),
        visibility: accountId === "account:carol" ? "hidden" : "visible",
    });

    await assert.rejects(
        harness.membership.add({
            whiteboardId: "canvas-1",
            actorAccountId: "account:alice",
            userAccountId: "account:carol",
        }),
        /userAccountId must identify a visible profile/,
    );
    assert.equal(harness.participants.has("carol"), false);
});

test("canvas membership sanitizes and logs dependency failures", async () => {
    const harness = createHarness();
    harness.store.addWhiteboardMember = async () => {
        throw new Error("database connection password=secret");
    };

    await assert.rejects(
        harness.membership.add({
            whiteboardId: "canvas-1",
            actorAccountId: "account:alice",
            userAccountId: "account:carol",
        }),
        /^Error: Whiteboard membership could not be changed\.$/,
    );
    assert.deepEqual(harness.logs, [
        {
            level: "error",
            message: "Whiteboard membership mutation failed.",
            metadata: {
                component: "nextcloud-whiteboard-module",
                operation: "membership_add",
                whiteboardId: "canvas-1",
            },
        },
    ]);
    assert.doesNotMatch(JSON.stringify(harness.logs), /password|secret/);
});

test("profile identity resolution follows late capability registration", async () => {
    let registeredIdentity;
    const profileIdentity = createProfileIdentityCapability({
        getCapability(capability) {
            return capability === "social:profile:identity"
                ? registeredIdentity
                : undefined;
        },
    });

    assert.throws(
        () => profileIdentity.normalizeHandleKey("@Alice"),
        /Profile identity capability is unavailable/,
    );
    registeredIdentity = {
        normalizeHandleKey(handle) {
            return String(handle).replace(/^@/, "").toLowerCase();
        },
    };
    assert.equal(profileIdentity.normalizeHandleKey("@Alice"), "alice");
});

test("whiteboard spawning uses the host profile identity normalizer", async () => {
    const normalizedHandles = [];
    const moduleApi = createWhiteboardModuleApi({
        store: {
            async ensureSchema() {},
            async getConfig() {
                return {
                    serverUrl: "https://whiteboard.example",
                    apiKeyConfigured: true,
                };
            },
            async createWhiteboard(options) {
                return {
                    id: "canvas-1",
                    createdBy: options.createdBy,
                    disposable: false,
                };
            },
        },
        profileStore: {},
        profileIdentity: {
            normalizeHandleKey(handle) {
                normalizedHandles.push(handle);
                return "canonical-alice";
            },
        },
    });

    const result = await moduleApi.spawnWhiteboardWindow({
        createdBy: "@Alice",
    });

    assert.deepEqual(normalizedHandles, ["@Alice"]);
    assert.equal(result.access.owner, "canonical-alice");
});

test("legacy canvas membership controls are removed", async () => {
    const sources = await Promise.all(
        [
            "../api/index.js",
            "../api/store.js",
            "../ui/reuse/whiteboard-ui-gateway.js",
        ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
    );
    const combinedSource = sources.join("\n");

    assert.doesNotMatch(combinedSource, /expandCanvasAccess/);
    assert.doesNotMatch(combinedSource, /expandWhiteboardAccess/);
    assert.doesNotMatch(combinedSource, /whiteboards\/access\/expand/);
});
