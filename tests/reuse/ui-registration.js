import { registerUi } from "../../api/index.js";

export function captureUiRegistration() {
    const spaRoutes = [];
    const staticDirs = [];
    const pageExtensions = [];
    const navbarPlugins = [];
    const capabilityProviders = [];
    const adminSections = [];
    registerUi({
        moduleRoot: "/tmp/nextcloud-whiteboard",
        registerStaticDir(prefix, dir) {
            staticDirs.push({ prefix, dir });
        },
        registerNavbarPlugin(plugin) {
            navbarPlugins.push(plugin);
        },
        registerCapabilityProvider(provider) {
            capabilityProviders.push(provider);
        },
        registerSpaRoute(route) {
            spaRoutes.push(route);
        },
        registerPageExtension(pageId, element) {
            pageExtensions.push({ pageId, element });
        },
        registerAdminSection(section) {
            adminSections.push(section);
        },
    });
    return {
        spaRoutes,
        staticDirs,
        pageExtensions,
        navbarPlugins,
        capabilityProviders,
        adminSections,
    };
}
