import { reuse, uiCtx } from "./host-resources.js";

const { apiFetch } = await reuse.importModule("api-client.js");

const CREATE_CANVAS_URL =
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

async function createCanvasRequest(body, failureMessage) {
    const response = await apiFetch(CREATE_CANVAS_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload?.error?.message ?? failureMessage);
    }
    const whiteboardId = String(payload?.data?.whiteboard?.id ?? "").trim();
    if (!whiteboardId) {
        throw new Error("Canvas response was invalid.");
    }
    return { whiteboardId };
}

const gateway = {
    async createCanvas({ title, participantHandles } = {}) {
        return createCanvasRequest(
            {
                title,
                participants: participantHandles,
            },
            "Canvas could not be created.",
        );
    },

    async expandCanvasAccess({ whiteboardId, participantHandles } = {}) {
        const response = await apiFetch(
            "/api/v1/modules/nextcloud-whiteboard/whiteboards/access/expand",
            {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ whiteboardId, participantHandles }),
            },
        );
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(
                payload?.error?.message ??
                    "Canvas participant access could not be expanded.",
            );
        }
        return payload.data;
    },

    async createDisposableCanvas({
        resourceType,
        resourceId,
        title,
        participantHandles,
    } = {}) {
        const result = await createCanvasRequest(
            {
                resourceType,
                resourceId,
                title,
                participants: participantHandles,
                disposable: true,
            },
            "Disposable canvas could not be created.",
        );
        const { whiteboardId } = result;
        preparedCanvasIds.set(
            resourceKey(resourceType, resourceId),
            whiteboardId,
        );
        latestPreparedCanvasId = whiteboardId;
        return result;
    },
};

uiCtx.capabilities.contribute(capabilityName, gateway);
