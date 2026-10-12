import { reuse, uiCtx } from "./host-resources.js";

const { apiFetch } = await reuse.importModule("api-client.js");

const CREATE_CANVAS_URL =
    "/api/v1/modules/nextcloud-whiteboard/whiteboards/spawn";

const capabilityName = "whiteboard:uiGateway";
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
    requestCanvasPage({ signal } = {}) {
        signal?.throwIfAborted();
        const request = uiCtx.capabilities.get("component-pages:request");
        if (typeof request !== "function")
            throw new Error("Canvas presentation is unavailable.");
        return request({
            componentUuid: "5bb6105d-14d2-5d9d-a284-b2969fb4e35d",
            routeId: "module.nextcloud.whiteboard.canvas",
            mode: "overlay",
        });
    },

    openCanvas({ whiteboardId, elementId, signal } = {}) {
        signal?.throwIfAborted();
        const spawn = uiCtx.capabilities.get("component-pages:spawn");
        if (typeof spawn !== "function" || !whiteboardId || !elementId)
            throw new Error("Canvas presentation is unavailable.");
        return spawn({
            componentUuid: "5bb6105d-14d2-5d9d-a284-b2969fb4e35d",
            routeId: "module.nextcloud.whiteboard.canvas",
            mode: "overlay",
            elementId,
            context: {
                whiteboardId,
                instantCanvas: true,
                frameless: true,
                borderless: true,
                contentScrolling: false,
                layout: {
                    borderless: true,
                    fillParent: true,
                    scrollOwner: "document",
                },
            },
            signal,
        });
    },

    async createCanvas({ title, participantHandles } = {}) {
        return createCanvasRequest(
            {
                title,
                participants: participantHandles,
            },
            "Canvas could not be created.",
        );
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
        return result;
    },
};

uiCtx.capabilities.contribute(capabilityName, gateway);
