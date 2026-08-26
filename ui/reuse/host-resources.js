import { uiCtx } from "/static/reuse/ui-ctx.js";

const reuse = uiCtx.capabilities.get("ui:reuse");

if (
    !reuse ||
    typeof reuse.importModule !== "function" ||
    typeof reuse.loadStylesheets !== "function"
) {
    throw new TypeError("Cognis UI reuse resources are unavailable.");
}

export { reuse, uiCtx };
