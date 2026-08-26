import { reuse, uiCtx } from "./host-resources.js";

const { apiFetch } = await reuse.importModule("api-client.js");

const CREATE_DISPOSABLE_URL =
    "/api/v1/modules/nextcloud-whiteboard/whiteboards/spawn";

const capabilityName = "whiteboard:uiGateway";
const preparedCanvasIds = new Map();
let latestPreparedCanvasId = "";

function resourceKey(resourceType, resourceId) {
    return `${String(resourceType ?? "").trim()}:${String(resourceId ?? "").trim()}`;
}

export function getPreparedDisposableCanvasId({
    resourceType,
    resourceId,
    allowLatest = false,
} = {}) {
    return (
        preparedCanvasIds.get(resourceKey(resourceType, resourceId)) ??
        (allowLatest ? latestPreparedCanvasId : "")
    );
}

const gateway = {
    async createDisposableCanvas({
        resourceType,
        resourceId,
        title,
        participantHandles,
    }) {
        const response = await apiFetch(CREATE_DISPOSABLE_URL, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                resourceType,
                resourceId,
                title,
                participants: participantHandles,
                disposable: true,
            }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(
                payload?.error?.message ??
                    "Disposable canvas could not be created.",
            );
        }
        const whiteboardId = String(payload?.data?.whiteboard?.id ?? "").trim();
        if (!whiteboardId) {
            throw new Error("Disposable canvas response was invalid.");
        }
        preparedCanvasIds.set(
            resourceKey(resourceType, resourceId),
            whiteboardId,
        );
        latestPreparedCanvasId = whiteboardId;
        return { whiteboardId };
    },
};

uiCtx.capabilities.contribute(capabilityName, gateway);
