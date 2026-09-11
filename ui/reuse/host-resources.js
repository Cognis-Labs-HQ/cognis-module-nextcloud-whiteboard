const uiCtx = globalThis[Symbol.for("cognis.uiCtx")];

if (!uiCtx || typeof uiCtx.capabilities?.get !== "function") {
    throw new TypeError("Cognis UI context is unavailable.");
}

const reuse = uiCtx.capabilities.get("ui:reuse");

if (
    !reuse ||
    typeof reuse.importModule !== "function" ||
    typeof reuse.loadStylesheets !== "function"
) {
    throw new TypeError("Cognis UI reuse resources are unavailable.");
}

export { reuse, uiCtx };
