export function contributeModuleCapability(ctx, capabilityId, value) {
    const contribute = ctx.capabilities?.contribute;
    if (typeof contribute === "function") {
        contribute.call(ctx.capabilities, capabilityId, value);
        return;
    }
    ctx.contributePublicCapability?.(capabilityId, value);
}
