import { reuse } from "./host-resources.js";

const { apiFetch } = await reuse.importModule("api-client.js");

const CREATE_CANVAS_URL =
    "/api/v1/modules/nextcloud-whiteboard/whiteboards/spawn";

const capabilityName = "whiteboard:uiGateway";
async function createCanvasRequest(body, failureMessage, signal) {
    const response = await apiFetch(CREATE_CANVAS_URL, {
        signal,
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

export function mountProvider(uiCtx) {
    const registerScopedUiActions = uiCtx.capabilities.get("ui:scopedActions");
    if (typeof registerScopedUiActions !== "function")
        throw new Error("Scoped UI actions are unavailable.");
    const requestAdministration = async (action, input) => {
        const response = await apiFetch(
            `/api/v1/modules/nextcloud-whiteboard/admin/canvases${action === "delete" ? "/delete" : ""}`,
            {
                signal: uiCtx.signal,
                ...(action === "delete"
                    ? {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify(input),
                      }
                    : {}),
            },
        );
        if (!response.ok)
            throw new Error("Canvas administration request failed.");
        return (await response.json()).data;
    };
    const gateway = {
        listAdminCanvases: () => requestAdministration("list"),
        deleteAdminCanvas: (input) => requestAdministration("delete", input),
        requestCanvasPage({ signal } = {}) {
            uiCtx.signal.throwIfAborted();
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
            uiCtx.signal.throwIfAborted();
            signal?.throwIfAborted();
            const spawn = uiCtx.capabilities.get("component-pages:spawn");
            if (typeof spawn !== "function" || !whiteboardId || !elementId)
                throw new Error("Canvas presentation is unavailable.");
            return spawn({
                componentUuid: "5bb6105d-14d2-5d9d-a284-b2969fb4e35d",
                routeId: "module.nextcloud.whiteboard.canvas",
                mode: "overlay",
                elementId,
                borderless: true,
                context: {
                    whiteboardId,
                    instantCanvas: true,
                },
                signal,
            });
        },

        async createCanvas({
            resourceType,
            resourceId,
            title,
            participantHandles,
        } = {}) {
            return createCanvasRequest(
                {
                    resourceType,
                    resourceId,
                    title,
                    participants: participantHandles,
                },
                "Canvas could not be created.",
                uiCtx.signal,
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
                uiCtx.signal,
            );
            return result;
        },
    };

    const actions = registerScopedUiActions(
        uiCtx,
        "nextcloud-whiteboard",
        gateway,
    );
    uiCtx.capabilities.contribute(capabilityName, actions);
}
