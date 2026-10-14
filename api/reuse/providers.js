import { createWhiteboardUiAssetResolver } from "./assets.js";

export function registerWhiteboardUiProvider(ctx) {
    const assetUrl = createWhiteboardUiAssetResolver(ctx.moduleRoot);
    ctx.registerCapabilityProvider?.({
        scriptUrl: assetUrl("reuse/gateway.js"),
        providesCapabilities: ["whiteboard:uiGateway"],
    });
}
