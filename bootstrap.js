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
    registerUi(ctx);
    registerApiRoutes(ctx.router, ctx);

    const moduleApi = ctx.getCapability("nextcloud-whiteboard:api");
    if (!moduleApi) {
        throw new Error("Nextcloud Whiteboard API capability is unavailable.");
    }

    ctx.contributePublicCapability(
        "whiteboard:spawnWhiteboardWindow",
        moduleApi.spawnWhiteboardWindow,
    );
    ctx.contributePublicCapability(
        "whiteboard:getEmbedUrl",
        moduleApi.getEmbedUrl,
    );
    ctx.contributePublicCapability(
        "whiteboard:fetchBoardData",
        moduleApi.fetchBoardData,
    );
    ctx.contributePublicCapability(
        "whiteboard:membership",
        moduleApi.membership,
    );
}
