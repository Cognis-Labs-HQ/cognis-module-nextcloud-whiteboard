import { reuse } from "../reuse/host-resources.js";

const { apiFetch } = await reuse.importModule("api-client.js");

const API_BASE = "/api/v1/modules/nextcloud-whiteboard";
const BOARD_NUMBER_MAX = 1000000;

export function createRandomWhiteboardTitle() {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return `Board #${String(values[0] % BOARD_NUMBER_MAX).padStart(6, "0")}`;
}

export async function apiFetchJson(path, options = {}) {
    const response = await apiFetch(`${API_BASE}${path}`, options);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw Object.assign(
            new Error(payload?.error?.message ?? "Request failed."),
            { status: response.status, code: payload?.error?.code },
        );
    }
    return payload.data;
}

export async function fetchWhiteboardList() {
    return apiFetchJson("/whiteboards");
}

export async function renameWhiteboard(boardId, title, failureMessage) {
    const normalizedTitle = String(title ?? "").trim();
    const normalizedBoardId = String(boardId ?? "").trim();
    if (!normalizedBoardId || !normalizedTitle) {
        throw new Error(failureMessage);
    }
    return apiFetchJson("/whiteboards/rename", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: normalizedBoardId, title: normalizedTitle }),
    });
}

export async function spawnWhiteboard(
    { title, participants = [], resourceType, resourceId, disposable } = {},
    { signal } = {},
) {
    return apiFetchJson("/whiteboards/spawn", {
        method: "POST",
        body: JSON.stringify({
            title,
            participants,
            resourceType,
            resourceId,
            disposable,
        }),
        signal,
    });
}

export async function fetchWhiteboardSession(
    boardId,
    { signal, recoverMissing = false, title } = {},
) {
    const readSession = (id) =>
        apiFetchJson(`/whiteboards/session?id=${encodeURIComponent(id)}`, {
            signal,
        });
    try {
        return await readSession(boardId);
    } catch (error) {
        if (
            !recoverMissing ||
            error.status !== 404 ||
            error.code !== "not_found"
        )
            throw error;
        signal?.throwIfAborted();
        const result = await spawnWhiteboard(
            { resourceType: "canvas", resourceId: boardId, title },
            { signal },
        );
        const replacementId = result?.whiteboard?.id;
        if (!replacementId)
            throw new Error("Canvas recovery did not return an identifier.");
        signal?.throwIfAborted();
        return { ...(await readSession(replacementId)), recreated: true };
    }
}

export async function uploadWhiteboardImage(boardId, dataUrl) {
    return apiFetchJson("/whiteboards/images", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: boardId, dataUrl }),
    });
}

export async function saveWhiteboardElements(
    boardId,
    elements,
    { explicitSave = false } = {},
) {
    return apiFetchJson("/whiteboards/elements", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: boardId, elements, explicitSave }),
    });
}

export { API_BASE };
