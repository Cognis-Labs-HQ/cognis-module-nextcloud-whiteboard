export class CanvasRequestError extends Error {}

export async function resolveVisibleAccountHandle(
    profileStore,
    profileIdentity,
    accountId,
    fieldName,
) {
    const normalizedAccountId = String(accountId ?? "").trim();
    if (!normalizedAccountId) {
        throw new CanvasRequestError(`${fieldName} is required.`);
    }
    const profile = await profileStore.getProfile(normalizedAccountId);
    if (!profile?.handle || profile.visibility === "hidden") {
        throw new CanvasRequestError(
            `${fieldName} must identify a visible profile.`,
        );
    }
    if (typeof profileIdentity?.resolveAccountHandle !== "function") {
        throw new Error("Profile identity capability is unavailable.");
    }
    return profileIdentity.resolveAccountHandle(normalizedAccountId, fieldName);
}
