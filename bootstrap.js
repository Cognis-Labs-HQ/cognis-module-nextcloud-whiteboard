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
    const moduleApi = registerApiRoutes(ctx.router, ctx);
    if (!moduleApi) return;

    const spawnWhiteboardWindow = async (options = {}) => {
        return moduleApi.spawnWhiteboardWindow(options);
    };

    const getEmbedUrl = (whiteboardId, options = {}) => {
        if (!whiteboardId) return null;
        const params = new URLSearchParams({ id: whiteboardId });
        if (options.instantCanvas === true) params.set("instantCanvas", "1");
        if (options.disposable === true) params.set("disposable", "1");
        return `/whiteboard?${params.toString()}`;
    };

    const fetchBoardData = async (whiteboardId) => {
        return moduleApi.fetchBoardData(whiteboardId);
    };

    const membership = {
        async add(input) {
            return moduleApi.membership.add(input);
        },
        async remove(input) {
            return moduleApi.membership.remove(input);
        },
    };

    ctx.contributePublicCapability(
        "whiteboard:spawnWhiteboardWindow",
        spawnWhiteboardWindow,
    );
    ctx.contributePublicCapability("whiteboard:getEmbedUrl", getEmbedUrl);
    ctx.contributePublicCapability("whiteboard:fetchBoardData", fetchBoardData);
    ctx.contributePublicCapability("whiteboard:membership", membership);
}
