class MembershipRequestError extends Error {}

async function resolveVisibleAccountHandle(
    profileStore,
    profileIdentity,
    accountId,
    fieldName,
) {
    const normalizedAccountId = String(accountId ?? "").trim();
    if (!normalizedAccountId) {
        throw new MembershipRequestError(`${fieldName} is required.`);
    }
    const profile = await profileStore.getProfile(normalizedAccountId);
    if (!profile?.handle || profile.visibility === "hidden") {
        throw new MembershipRequestError(
            `${fieldName} must identify a visible profile.`,
        );
    }
    if (typeof profileIdentity?.resolveAccountHandle !== "function") {
        throw new Error("Profile identity capability is unavailable.");
    }
    return profileIdentity.resolveAccountHandle(normalizedAccountId, fieldName);
}

export function createCanvasMembershipCapability({
    store,
    profileStore,
    profileIdentity,
    log,
}) {
    const resolveMutation = async (input) => {
        const whiteboardId = String(input?.whiteboardId ?? "").trim();
        if (!whiteboardId) {
            throw new MembershipRequestError("whiteboardId is required.");
        }
        await store.ensureSchema();
        const actorHandle = await resolveVisibleAccountHandle(
            profileStore,
            profileIdentity,
            input?.actorAccountId,
            "actorAccountId",
        );
        const whiteboard = await store.getWhiteboardById(whiteboardId);
        if (!whiteboard) {
            throw new MembershipRequestError("Whiteboard not found.");
        }
        if (whiteboard.createdBy !== actorHandle) {
            throw new MembershipRequestError(
                "Only the whiteboard owner can change membership.",
            );
        }
        if (whiteboard.disposable) {
            throw new MembershipRequestError(
                "Disposable whiteboard membership cannot be changed.",
            );
        }
        const userHandle = await resolveVisibleAccountHandle(
            profileStore,
            profileIdentity,
            input?.userAccountId,
            "userAccountId",
        );
        return { whiteboard, userHandle };
    };

    const runMutation = async (operation, input, mutate) => {
        try {
            return await mutate();
        } catch (error) {
            if (error instanceof MembershipRequestError) throw error;
            const whiteboardId = String(input?.whiteboardId ?? "").trim();
            log?.("error", "Whiteboard membership mutation failed.", {
                component: "nextcloud-whiteboard-module",
                operation: `membership_${operation}`,
                ...(whiteboardId ? { whiteboardId } : {}),
            });
            throw new Error("Whiteboard membership could not be changed.");
        }
    };

    return {
        async add(input) {
            return runMutation("add", input, async () => {
                const { whiteboard, userHandle } = await resolveMutation(input);
                await store.addWhiteboardMember(whiteboard.id, userHandle);
                return {
                    whiteboardId: whiteboard.id,
                    participants: await store.listParticipants(whiteboard.id),
                };
            });
        },
        async remove(input) {
            return runMutation("remove", input, async () => {
                const { whiteboard, userHandle } = await resolveMutation(input);
                if (userHandle === whiteboard.createdBy) {
                    throw new MembershipRequestError(
                        "The whiteboard owner cannot be removed.",
                    );
                }
                await store.removeWhiteboardMember(whiteboard.id, userHandle);
            });
        },
    };
}
