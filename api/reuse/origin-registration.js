export function createOriginRegistrar(ctx) {
    const register = ctx.getCapability("auth:registerPageScriptOrigins");
    if (typeof register !== "function") return undefined;
    const owners = new Set();
    let active = true;
    ctx.registerDisposer(() => {
        active = false;
        for (const owner of owners) register(owner, []);
        owners.clear();
    });
    return (owner, origins) => {
        if (!active) return [];
        owners.add(owner);
        return register(owner, origins);
    };
}
