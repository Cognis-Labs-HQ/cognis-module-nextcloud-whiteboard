import { apiFetch } from "/static/reuse/api-client.js";
import { uiCtx } from "/static/reuse/ui-ctx.js";

const CREATE_DISPOSABLE_URL =
    "/api/v1/modules/nextcloud-whiteboard/whiteboards/spawn";

const capabilityName = "whiteboard:uiGateway";
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
        return { whiteboardId };
    },
};

function registerGateway() {
    const capabilities = uiCtx.capabilities;
    if (!capabilities) return;
    const registrar = [
        [capabilities, capabilities?.set],
        [capabilities, capabilities?.register],
        [capabilities, capabilities?.provide],
        [capabilities, capabilities?.contribute],
        [uiCtx, uiCtx.registerCapability],
        [uiCtx, uiCtx.provideCapability],
        [uiCtx, uiCtx.contributeCapability],
    ].find(([, candidate]) => typeof candidate === "function");
    if (registrar) {
        registrar[1].call(registrar[0], capabilityName, gateway);
        return;
    }
    const originalGet = capabilities?.get;
    const descriptor = Object.getOwnPropertyDescriptor(capabilities, "get");
    if (
        typeof originalGet === "function" &&
        Object.isExtensible(capabilities) &&
        (!descriptor || descriptor.writable || descriptor.configurable)
    ) {
        Object.defineProperty(capabilities, "get", {
            configurable: true,
            value(name) {
                return name === capabilityName
                    ? gateway
                    : originalGet.call(capabilities, name);
            },
            writable: true,
        });
    }
}

registerGateway();
