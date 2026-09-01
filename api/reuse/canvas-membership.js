import { normalizeHandleKey } from "./normalize-handle.js";

async function resolveAccountHandle(profileStore, accountId, fieldName) {
    const normalizedAccountId = String(accountId ?? "").trim();
    if (!normalizedAccountId) {
        throw new Error(`${fieldName} is required.`);
    }
    const profile = await profileStore.getProfile(normalizedAccountId);
    const handle = normalizeHandleKey(profile?.handle);
    if (!handle) {
        throw new Error(`${fieldName} must identify a visible profile.`);
    }
    return handle;
}

export function createCanvasMembershipCapability(store, profileStore) {
    const resolveMutation = async (input) => {
        const whiteboardId = String(input?.whiteboardId ?? "").trim();
        if (!whiteboardId) {
            throw new Error("whiteboardId is required.");
        }
        const actorHandle = await resolveAccountHandle(
            profileStore,
            input?.actorAccountId,
            "actorAccountId",
        );
        const whiteboard = await store.getWhiteboardById(whiteboardId);
        if (!whiteboard) {
            throw new Error("Whiteboard not found.");
        }
        if (whiteboard.createdBy !== actorHandle) {
            throw new Error("Only the whiteboard owner can change membership.");
        }
        if (whiteboard.disposable) {
            throw new Error(
                "Disposable whiteboard membership cannot be changed.",
            );
        }
        const userHandle = await resolveAccountHandle(
            profileStore,
            input?.userAccountId,
            "userAccountId",
        );
        return { whiteboard, userHandle };
    };

    return {
        async add(input) {
            const { whiteboard, userHandle } = await resolveMutation(input);
            await store.addWhiteboardMember(whiteboard.id, userHandle);
            return {
                whiteboardId: whiteboard.id,
                participants: await store.listParticipants(whiteboard.id),
            };
        },
        async remove(input) {
            const { whiteboard, userHandle } = await resolveMutation(input);
            if (userHandle === whiteboard.createdBy) {
                throw new Error("The whiteboard owner cannot be removed.");
            }
            await store.removeWhiteboardMember(whiteboard.id, userHandle);
        },
    };
}
