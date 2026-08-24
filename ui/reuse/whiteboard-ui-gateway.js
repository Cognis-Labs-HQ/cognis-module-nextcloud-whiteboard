import { apiFetch } from "/static/reuse/api-client.js";
import { uiCtx } from "/static/reuse/ui-ctx.js";

const CREATE_DISPOSABLE_URL =
    "/api/v1/modules/nextcloud-whiteboard/whiteboards/spawn";

uiCtx.capabilities.set("whiteboard:uiGateway", {
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
        return { whiteboardId };
    },
});
