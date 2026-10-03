import { registerApiRoutes, registerUi } from "./api/index.js";
import { NextcloudWhiteboardStore } from "./api/store.js";

export async function uninstallModule(ctx, { deleteContent }) {
    const store = new NextcloudWhiteboardStore({
        db: ctx.getCapability("db:executor"),
        log: ctx.log,
    });
    await store.ensureSchema();
    if (deleteContent) {
        const createNamespaceClient = ctx.getCapability("files:namespace");
        const whiteboardFiles = createNamespaceClient?.({
            namespaceId: "whiteboards",
            callerComponent: "nextcloud-whiteboard",
        });
        if (whiteboardFiles) {
            const access = { actorId: ctx.moduleId, role: "admin" };
            const storedFiles = await whiteboardFiles.list(access);
            for (const file of storedFiles) {
                await whiteboardFiles.delete(access, file.key);
            }
        }
        await store.deleteAllData();
    } else {
        await store.deleteConfig();
    }
    ctx.log?.("info", "Nextcloud Whiteboard saved data deleted.", {
        component: "nextcloud-whiteboard-module",
        operation: "uninstall_cleanup",
        deleteContent,
    });
}

export function bootstrapModule(ctx) {
    const moduleApi = registerApiRoutes(ctx.router, ctx);
    if (!moduleApi) {
        throw new Error("Nextcloud Whiteboard API capability is unavailable.");
    }

    const publicCapabilities = new Map([
        ["whiteboard:deleteCanvas", moduleApi.deleteCanvas],
        ["whiteboard:spawnWhiteboardWindow", moduleApi.spawnWhiteboardWindow],
        ["whiteboard:getEmbedUrl", moduleApi.getEmbedUrl],
        ["whiteboard:fetchBoardData", moduleApi.fetchBoardData],
        ["whiteboard:membership", moduleApi.membership],
    ]);
    for (const [capabilityId, value] of publicCapabilities) {
        try {
            ctx.contributePublicCapability(capabilityId, value);
        } catch (error) {
            ctx.log?.("error", "Whiteboard capability registration failed.", {
                component: "nextcloud-whiteboard-module",
                operation: "register_public_capability",
                capabilityId,
            });
            throw error;
        }
    }
    registerUi(ctx);
}
