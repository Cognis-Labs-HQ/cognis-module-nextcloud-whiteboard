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

    const systemCtx = ctx.getCapability("system:ctx");

    const spawnWhiteboardWindow = async (options = {}) => {
        const moduleApi = systemCtx?.getCapability?.(
            "nextcloud-whiteboard:api",
        );
        if (!moduleApi) {
            throw new Error(
                "Nextcloud Whiteboard API capability is unavailable.",
            );
        }
        return moduleApi.spawnWhiteboardWindow(options);
    };

    const getEmbedUrl = (whiteboardId, options = {}) => {
        if (!whiteboardId) return null;
        const params = new URLSearchParams({ id: whiteboardId });
        if (options.instantCanvas === true) params.set("instantCanvas", "1");
        return `/whiteboard?${params.toString()}`;
    };

    const fetchBoardData = async (whiteboardId) => {
        const moduleApi = systemCtx?.getCapability?.(
            "nextcloud-whiteboard:api",
        );
        if (!moduleApi) {
            throw new Error(
                "Nextcloud Whiteboard API capability is unavailable.",
            );
        }
        return moduleApi.fetchBoardData(whiteboardId);
    };

    ctx.contributePublicCapability(
        "nextcloud-whiteboard:spawnWhiteboardWindow",
        spawnWhiteboardWindow,
    );
    ctx.contributePublicCapability("whiteboard:getEmbedUrl", getEmbedUrl);
    ctx.contributePublicCapability("whiteboard:fetchBoardData", fetchBoardData);

    ctx.flow.extend(
        "bootstrap-platform",
        "register-flows",
        { id: "nextcloud-whiteboard-module:bootstrap-registration" },
        () => ({
            moduleId: "nextcloud-whiteboard",
            registeredCapabilities: [
                "nextcloud-whiteboard:spawnWhiteboardWindow",
                "whiteboard:getEmbedUrl",
                "whiteboard:fetchBoardData",
            ],
        }),
    );
}
