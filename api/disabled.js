import { registerWhiteboardConfigurationApi } from "./configuration/index.js";

export function registerDisabledApiRoutes(ctx) {
    registerWhiteboardConfigurationApi(ctx.router, ctx);
}
