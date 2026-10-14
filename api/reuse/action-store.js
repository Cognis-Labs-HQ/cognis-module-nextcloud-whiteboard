const ACTION_METHODS = [
    "getConfig",
    "saveConfig",
    "deleteConfig",
    "deleteAllData",
    "deleteWhiteboard",
    "createWhiteboard",
    "getWhiteboardByReferenceKey",
    "getWhiteboardById",
    "getWhiteboardByExternalPath",
    "listWhiteboards",
    "bindWhiteboardSource",
    "releaseWhiteboardSource",
    "listAccessibleWhiteboards",
    "renameWhiteboard",
    "listParticipants",
    "addWhiteboardMember",
    "removeWhiteboardMember",
    "canAccessWhiteboard",
    "upsertPresence",
    "listPresence",
    "getElementsSnapshot",
    "saveElementsSnapshot",
    "saveMergedElementsSnapshot",
    "saveUserCopies",
    "listUserCopyOwners",
    "hasUserCopy",
    "getUserCopy",
    "deleteUserCopy",
    "mintSessionToken",
];
const actionsByContext = new WeakMap();

export function registerWhiteboardActions(ctx, store) {
    if (actionsByContext.has(ctx)) return actionsByContext.get(ctx);
    const actions = Object.create(store);
    for (const method of ACTION_METHODS) {
        const flowId = `nextcloud-whiteboard:${method}`;
        ctx.registerFlow({
            id: flowId,
            description: `Execute Whiteboard ${method}.`,
            stages: ["initialize-store", "execute-action"],
        });
        actions[method] = async (...parameters) => {
            try {
                const result = await ctx.flow.run(
                    flowId,
                    { parameters },
                    {
                        handlers: {
                            "initialize-store": () => store.ensureSchema(),
                            "execute-action": ({ input }) => {
                                if (!ctx.flow.exists(flowId))
                                    throw new Error(
                                        "Whiteboard action is no longer active.",
                                    );
                                return store[method](...input.parameters);
                            },
                        },
                    },
                );
                const values = result.stageResults?.["execute-action"];
                if (!values?.length)
                    throw new Error("Whiteboard action did not execute.");
                return values[0];
            } catch (error) {
                ctx.log?.("error", "Whiteboard action failed.", {
                    operation: flowId,
                    errorName: error?.name,
                });
                throw error;
            }
        };
    }
    actionsByContext.set(ctx, actions);
    return actions;
}
