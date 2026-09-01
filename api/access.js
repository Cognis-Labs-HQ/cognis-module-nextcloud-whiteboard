import { NextcloudWhiteboardStore } from "./store.js";

const PAGE_RESOURCE_ORIGIN_OWNER_ID = "module:nextcloud-whiteboard";

const storeByExecutor = new WeakMap();

export function resolveStore(dbExecutor, log, profileIdentity) {
    const existingStore = storeByExecutor.get(dbExecutor);
    if (existingStore) return existingStore;
    const store = new NextcloudWhiteboardStore({
        db: dbExecutor,
        log,
        profileIdentity,
    });
    storeByExecutor.set(dbExecutor, store);
    return store;
}

export function createProfileStoreCapability(ctx) {
    const requireProfileStore = () => {
        const profileStore = ctx.getCapability("social:profileStore");
        if (!profileStore) {
            throw new Error("Profile store capability is unavailable.");
        }
        return profileStore;
    };
    return {
        getProfile(...args) {
            return requireProfileStore().getProfile(...args);
        },
        getProfileByHandle(...args) {
            return requireProfileStore().getProfileByHandle(...args);
        },
    };
}

export function createProfileIdentityCapability(ctx) {
    const requireProfileIdentity = () => {
        const profileIdentity = ctx.getCapability("social:profile:identity");
        if (!profileIdentity) {
            throw new Error("Profile identity capability is unavailable.");
        }
        return profileIdentity;
    };
    return {
        normalizeHandleKey(...args) {
            return requireProfileIdentity().normalizeHandleKey(...args);
        },
        normalizeHandleKeys(...args) {
            return requireProfileIdentity().normalizeHandleKeys(...args);
        },
        resolveAccountHandle(...args) {
            return requireProfileIdentity().resolveAccountHandle(...args);
        },
    };
}

export async function resolveRequesterUsername(
    profileStore,
    profileIdentity,
    accountId,
) {
    const profile = await profileStore.getProfile(accountId);
    const username = profileIdentity.normalizeHandleKey(profile?.handle ?? "");
    if (!username) {
        throw new Error(
            "A visible profile handle is required to use Whiteboards.",
        );
    }
    return username;
}

export async function resolveParticipantHandles(
    profileStore,
    profileIdentity,
    requestedHandles,
    includeHidden,
) {
    const usernames = [];
    for (const candidate of Array.isArray(requestedHandles)
        ? requestedHandles
        : []) {
        const normalizedHandle = profileIdentity.normalizeHandleKey(candidate);
        if (!normalizedHandle) continue;
        const profile = await profileStore.getProfileByHandle(normalizedHandle);
        if (!profile?.handle) continue;
        if (!includeHidden && profile.visibility === "hidden") continue;
        usernames.push(profileIdentity.normalizeHandleKey(profile.handle));
    }
    return usernames;
}

export function buildCognisWhiteboardUrl(
    whiteboardId,
    { instantCanvas = false } = {},
) {
    const params = new URLSearchParams({ id: whiteboardId });
    if (instantCanvas) params.set("instantCanvas", "1");
    return `/whiteboard?${params.toString()}`;
}

export async function resolveWhiteboardUserAccess({
    claims,
    profileStore,
    profileIdentity,
    store,
    whiteboardId,
    resolveShareGuestAccess,
    resolveShareUserAccess,
    resolveShareDelegatedAccess,
    requireWrite = false,
}) {
    if (typeof resolveShareGuestAccess === "function") {
        const shareAccess = await resolveShareGuestAccess({
            claims,
            resourceType: "whiteboard",
            resourceId: whiteboardId,
            requiredCapability: requireWrite
                ? "whiteboard:write"
                : "whiteboard:read",
        }).catch(() => null);
        if (shareAccess?.shareGuest) {
            if (shareAccess.authorized) {
                const writeAccess = requireWrite
                    ? shareAccess
                    : await resolveShareGuestAccess({
                          claims,
                          resourceType: "whiteboard",
                          resourceId: whiteboardId,
                          requiredCapability: "whiteboard:write",
                      }).catch(() => null);
                return {
                    authorized: true,
                    canWrite: writeAccess?.authorized === true,
                    username: shareAccess.username,
                    displayName: shareAccess.displayName,
                };
            }
            const delegatedAccess = await resolveDelegatedAccess({
                claims,
                whiteboardId,
                requiredCapability: requireWrite
                    ? "whiteboard:write"
                    : "whiteboard:read",
                resolveShareDelegatedAccess,
            });
            if (delegatedAccess.authorized) return delegatedAccess;
            return {
                authorized: false,
                status: 403,
                code: "forbidden",
                message:
                    "This share link cannot access the requested whiteboard.",
            };
        }
    }
    if (typeof resolveShareUserAccess === "function") {
        const userShareAccess = await resolveShareUserAccess({
            accountId: claims.sub,
            resourceType: "whiteboard",
            resourceId: whiteboardId,
            requiredCapability: requireWrite
                ? "whiteboard:write"
                : "whiteboard:read",
        }).catch(() => null);
        if (userShareAccess?.authorized) {
            const writeAccess = requireWrite
                ? userShareAccess
                : await resolveShareUserAccess({
                      accountId: claims.sub,
                      resourceType: "whiteboard",
                      resourceId: whiteboardId,
                      requiredCapability: "whiteboard:write",
                  }).catch(() => null);
            const username = await resolveRequesterUsername(
                profileStore,
                profileIdentity,
                claims.sub,
            ).catch(() => "");
            return username
                ? {
                      authorized: true,
                      canWrite: writeAccess?.authorized === true,
                      username,
                  }
                : {
                      authorized: false,
                      status: 409,
                      code: "profile_required",
                      message:
                          "A visible profile handle is required to use Whiteboards.",
                  };
        }
    }
    const username = await resolveRequesterUsername(
        profileStore,
        profileIdentity,
        claims.sub,
    ).catch((error) => ({ error }));
    if (username?.error)
        return {
            authorized: false,
            status: 409,
            code: "profile_required",
            message: username.error.message,
        };
    const authorized = await store.canAccessWhiteboard(whiteboardId, username);
    return authorized
        ? { authorized: true, canWrite: true, username }
        : {
              authorized: false,
              status: 403,
              code: "forbidden",
              message:
                  "You are not listed as an allowed whiteboard participant.",
          };
}

async function resolveDelegatedAccess({
    claims,
    whiteboardId,
    requiredCapability,
    resolveShareDelegatedAccess,
}) {
    if (typeof resolveShareDelegatedAccess !== "function")
        return { authorized: false };
    const resolveCapability = async (capability) => {
        const result = await resolveShareDelegatedAccess({
            claims,
            resourceType: "whiteboard",
            resourceId: whiteboardId,
            requiredCapability: capability,
        }).catch(() => null);
        return result?.shareGuest === true &&
            result?.authorized === true &&
            result?.resourceType === "whiteboard" &&
            result?.resourceId === whiteboardId &&
            result?.requiredCapability === capability
            ? result
            : null;
    };
    const delegatedAccess = await resolveCapability(requiredCapability);
    if (!delegatedAccess) return { authorized: false };
    const writeAccess =
        requiredCapability === "whiteboard:write"
            ? delegatedAccess
            : await resolveCapability("whiteboard:write");
    return {
        authorized: true,
        canWrite: Boolean(writeAccess),
        username: delegatedAccess.username,
        displayName: delegatedAccess.displayName,
    };
}

export function registerConfiguredOrigin(registerScriptOrigins, config) {
    if (typeof registerScriptOrigins === "function") {
        registerScriptOrigins(PAGE_RESOURCE_ORIGIN_OWNER_ID, [
            config?.serverUrl,
        ]);
    }
}

export async function registerStoredOrigin({
    store,
    registerScriptOrigins,
    log,
}) {
    try {
        await store.ensureSchema();
        registerConfiguredOrigin(
            registerScriptOrigins,
            await store.getConfig(),
        );
    } catch (error) {
        log?.(
            "error",
            "Failed to register stored Nextcloud Whiteboard CSP origin.",
            {
                component: "nextcloud-whiteboard-module",
                operation: "register_stored_origin",
                error: error instanceof Error ? error.message : String(error),
            },
        );
    }
}
