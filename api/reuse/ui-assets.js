import { readFileSync } from "node:fs";
import { join } from "node:path";

export function createWhiteboardUiAssetResolver(moduleRoot) {
    const manifest = JSON.parse(
        readFileSync(join(moduleRoot, "manifest.json"), "utf8"),
    );
    return (path) =>
        `/static/modules/nextcloud-whiteboard/${path}?revision=${encodeURIComponent(manifest.version)}`;
}
