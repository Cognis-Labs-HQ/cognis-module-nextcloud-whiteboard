import { resolve } from "node:path";
import { registerUi } from "../../api/index.js";

export function captureUiRegistration() {
    const spaRoutes = [];
    const staticDirectories = [];
    const pageExtensions = [];
    const navbarPlugins = [];
    const capabilityProviders = [];
    const adminSections = [];
    registerUi({
        moduleRoot: resolve(import.meta.dirname, "../.."),
        registerStaticDir(prefix, directory) {
            staticDirectories.push({ prefix, dir: directory });
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
        staticDirs: staticDirectories,
        pageExtensions,
        navbarPlugins,
        capabilityProviders,
        adminSections,
    };
}
