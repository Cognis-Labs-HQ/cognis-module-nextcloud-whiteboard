const GATEWAY_SCRIPT =
    "/static/modules/nextcloud-whiteboard/reuse/whiteboard-ui-gateway.js";

export function registerWhiteboardUiProvider(ctx) {
    ctx.registerCapabilityProvider?.({
        scriptUrl: GATEWAY_SCRIPT,
        providesCapabilities: ["whiteboard:uiGateway"],
    });
}
