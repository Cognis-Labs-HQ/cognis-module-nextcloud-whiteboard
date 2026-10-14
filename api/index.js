import { registerAdminCanvasRoutes } from "./routes/admin-canvases/index.js";
import { registerBoardRoutes } from "./routes/boards/index.js";
import { createWhiteboardUiAssetResolver } from "./reuse/ui-assets.js";
import path from "node:path";
import { sendJson } from "./reuse/http.js";
import { registerWhiteboardShareFlowHooks } from "./sharing/hooks.js";
import { registerWhiteboardUiProvider } from "./reuse/ui-provider.js";
import { createWhiteboardModuleApi } from "./reuse/module-api.js";
import { registerWhiteboardConfigurationApi } from "./reuse/configuration-api.js";
const initializedRuntimeContexts = new WeakSet();
const initializedShareHooksByContext = new WeakMap();
const MODULE_ID = "nextcloud-whiteboard";
const WHITEBOARD_STYLESHEETS = [
    "/static/modules/nextcloud-whiteboard/styles/whiteboards.css",
];

import {
    createProfileStoreCapability,
    registerStoredOrigin,
    resolveWhiteboardUserAccess,
} from "./reuse/access.js";

export function registerUi(ctx) {
    const whiteboardUiAsset = createWhiteboardUiAssetResolver(ctx.moduleRoot);
    const moduleUiRoot = path.join(ctx.moduleRoot, "ui");
    ctx.registerStaticDir("", moduleUiRoot);
    registerWhiteboardUiProvider(ctx);
    ctx.registerNavbarPlugin({
        scriptUrl: whiteboardUiAsset("navbar.js"),
        access: { minRole: "user" },
    });

    ctx.registerSpaRoute({
        id: "module.nextcloud.whiteboard",
        pattern: "^/whiteboards$",
        base: "/whiteboards",
        scriptUrl: whiteboardUiAsset("app/index.js"),
        stylesheets: WHITEBOARD_STYLESHEETS,
        access: { minRole: "user" },
    });

    ctx.registerSpaRoute({
        id: "module.nextcloud.whiteboard.canvas",
        pattern: "^/whiteboard$",
        base: "/whiteboard",
        scriptUrl: whiteboardUiAsset("app/index.js"),
        stylesheets: WHITEBOARD_STYLESHEETS,
        access: { minRole: "user" },
        componentPage: {
            labelKey: "module.nextcloud.whiteboard.name",
            descriptionKey: "module.nextcloud.whiteboard.description",
            modes: ["overlay", "fullscreen", "pip"],
        },
    });
    ctx.registerAdminSection({
        id: "module-nextcloud-whiteboard-canvases",
        label: "module.nextcloud.whiteboard.admin.canvases.title",
        scriptUrl: whiteboardUiAsset("admin-canvases.js"),
        access: { minRole: "admin" },
        stringsBaseUrl: "/static/modules/nextcloud-whiteboard/languages",
    });
    ctx.registerAdminSection({
        id: "module-nextcloud-whiteboard",
        label: "module.nextcloud.whiteboard.name",
        scriptUrl: whiteboardUiAsset("admin-section.js"),
        access: { minRole: "admin" },
        stringsBaseUrl: "/static/modules/nextcloud-whiteboard/languages",
    });
}

export function registerApiRoutes(router, ctx) {
    const requireAuth = ctx.getCapability("auth:requireAuth");
    const profileStore = createProfileStoreCapability(ctx);
    const resolveShareGuestAccess = ctx.getCapability(
        "share:resolveGuestAccess",
    );
    const resolveShareUserAccess = ctx.getCapability("share:resolveUserAccess");
    const resolveShareGuestId = ctx.getCapability("share:resolveGuestId");
    const resolveShareDelegatedAccess = ctx.getCapability(
        "share:resolveDelegatedAccess",
    );
    const resolveAccess = (options) =>
        resolveWhiteboardUserAccess({
            ...options,
            profileIdentity,
            resolveShareGuestAccess,
            resolveShareUserAccess,
            resolveShareDelegatedAccess,
        });
    const listSharesByResource = ctx.getCapability("share:listByResource");
    const registerNamespace = ctx.getCapability("files:registerNamespace");
    const createNamespaceClient = ctx.getCapability("files:namespace");

    const configurationApi = registerWhiteboardConfigurationApi(router, ctx, {
        enabled: true,
    });
    if (!configurationApi) {
        router.get(
            "/api/v1/modules/nextcloud-whiteboard/ping",
            async (_req, res) => {
                sendJson(res, 200, {
                    data: {
                        ready: false,
                        reason: "required_capabilities_missing",
                    },
                });
            },
        );
        return;
    }
    const { store, profileIdentity, log, registerScriptOrigins } =
        configurationApi;

    const runtimeContext = ctx;
    const shouldInitializeRuntime =
        typeof runtimeContext === "object" &&
        runtimeContext !== null &&
        !initializedRuntimeContexts.has(runtimeContext);
    const namespaceRequest = {
        namespaceId: "whiteboards",
        callerComponent: "nextcloud-whiteboard",
    };
    let whiteboardFiles;
    if (createNamespaceClient) {
        try {
            whiteboardFiles = createNamespaceClient(namespaceRequest);
        } catch (error) {
            log?.(
                "error",
                "Whiteboard file namespace acquisition failed; registering its namespace.",
                { operation: "resolve_file_namespace", errorName: error?.name },
            );
            registerNamespace?.({
                id: "whiteboards",
                ownerComponent: "nextcloud-whiteboard",
                acl: { visibility: "private-group" },
            });
            whiteboardFiles = createNamespaceClient(namespaceRequest);
        }
    }

    const ensureShareFlowHooks = () => {
        let installedFlowIds = initializedShareHooksByContext.get(ctx);
        if (!installedFlowIds) {
            installedFlowIds = new Set();
            initializedShareHooksByContext.set(ctx, installedFlowIds);
        }
        registerWhiteboardShareFlowHooks({
            ctx,
            store,
            profileStore,
            resolveWhiteboardUserAccess: resolveAccess,
            resolveShareGuestId,
            whiteboardStylesheets: WHITEBOARD_STYLESHEETS,
            installedFlowIds,
        });
    };
    ensureShareFlowHooks();
    if (shouldInitializeRuntime) {
        void registerStoredOrigin({ store, registerScriptOrigins, log });
        initializedRuntimeContexts.add(runtimeContext);
    }

    const accountRoles = ctx.getCapability("auth:accountStore");
    const resolveActorRole = async (accountId) => {
        const account = await accountRoles?.getInfo(accountId);
        return account?.enabled ? account.role : null;
    };
    const moduleApi = createWhiteboardModuleApi({
        resolveActorRole,
        listSharesByResource,
        deleteResourceShares: ctx.getCapability("share:deleteResourceShares"),
        store,
        profileStore,
        profileIdentity,
        log,
    });
    registerBoardRoutes(router, {
        requireAuth,
        store,
        profileStore,
        profileIdentity,
        resolveAccess,
        resolveShareGuestAccess,
        resolveShareUserAccess,
        resolveShareDelegatedAccess,
        whiteboardFiles,
        log,
        listSharesByResource,
        ensureShareFlowHooks,
        flow: ctx.flow,
    });

    registerAdminCanvasRoutes(router, {
        requireAuth,
        store,
        deleteCanvasRecords: moduleApi.deleteCanvasRecords,
        log,
    });
    return moduleApi;
}

export { MODULE_ID };
