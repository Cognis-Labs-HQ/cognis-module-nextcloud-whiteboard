import { uiCtx } from "../reuse/host-resources.js";

const profileAvatars = () => {
    const capability = uiCtx.capabilities.get("ui:profileAvatarRenderer");
    if (!capability) throw new Error("Profile avatar capability unavailable");
    return capability;
};
const buildProfileAvatarMarkup = (options) =>
    profileAvatars().buildMarkup(options);
const pickInitialsColor = (seed) => profileAvatars().getInitialsColor(seed);
const hydrateProfileAvatars = (container) =>
    profileAvatars().hydrate(container);

export function getPointerOffset(canvasInstance) {
    return canvasInstance?.getViewportOffset?.() ?? { x: 0, y: 0 };
}

export function getPresenceDisplayName(entry) {
    return entry?.displayName || entry?.handle || "Guest";
}

export function getPresenceColor(entry) {
    return entry?.color || pickInitialsColor(getPresenceDisplayName(entry));
}

export function getSelectionPayload(canvasInstance) {
    return {
        elementIds: canvasInstance?.getSelectedElementIds?.() ?? [],
        interaction: canvasInstance?.getPresenceInteraction?.() ?? "idle",
    };
}

export function applyRemotePresenceSelections({
    canvasInstance,
    entries = [],
    sessionId = "",
}) {
    const selections = entries
        .filter((entry) => String(entry?.sessionId ?? "") !== sessionId)
        .filter((entry) => entry?.active !== false)
        .map((entry) => ({
            color: getPresenceColor(entry),
            elementIds: entry.selection?.elementIds ?? [],
            interaction: entry.selection?.interaction ?? "idle",
            label: getPresenceDisplayName(entry),
        }))
        .filter((selection) => selection.elementIds.length > 0);
    canvasInstance?.setRemoteSelections?.(selections);
}

export function renderWhiteboardPresenceEntry(entry) {
    const displayName =
        String(entry.displayName || entry.handle || "Guest")
            .replace(/^#+/, "")
            .trim() || "Guest";
    const handle = String(entry.handle || "").replace(/^[@#]+/, "");
    const active = Boolean(entry.active);
    const label =
        entry.guest || !handle ? displayName : `${displayName} (@${handle})`;
    return buildProfileAvatarMarkup({
        avatarKey: String(entry.avatarKey || "").trim(),
        label,
        colorSeed: handle || displayName,
        avatarClass: "whiteboard-presence-avatar",
        imageClass: [
            "whiteboard-presence-avatar-image",
            active ? "is-active" : "",
        ]
            .filter(Boolean)
            .join(" "),
        fallbackClass: [
            "whiteboard-presence-avatar-fallback",
            active ? "is-active" : "",
        ]
            .filter(Boolean)
            .join(" "),
        profileHandle: entry.guest || !handle ? null : handle,
    });
}

export function hydratePresenceAvatars(container) {
    return hydrateProfileAvatars(container);
}
