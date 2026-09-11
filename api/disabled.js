import { registerWhiteboardConfigurationApi } from "./reuse/configuration-api.js";

export function registerDisabledApiRoutes(ctx) {
    registerWhiteboardConfigurationApi(ctx.router, ctx);
}
