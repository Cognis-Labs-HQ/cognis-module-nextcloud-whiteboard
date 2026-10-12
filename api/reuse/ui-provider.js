import { createWhiteboardUiAssetResolver } from "./ui-assets.js";

export function registerWhiteboardUiProvider(ctx) {
    const assetUrl = createWhiteboardUiAssetResolver(ctx.moduleRoot);
    ctx.registerCapabilityProvider?.({
        scriptUrl: assetUrl("reuse/whiteboard-ui-gateway.js"),
        providesCapabilities: ["whiteboard:uiGateway"],
    });
}
