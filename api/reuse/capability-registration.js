export function contributeModuleCapability(ctx, capabilityId, value) {
    const contributePublic = ctx.contributePublicCapability;
    if (typeof contributePublic === "function") {
        contributePublic.call(ctx, capabilityId, value);
        return;
    }
    ctx.capabilities?.contribute?.(capabilityId, value);
}
