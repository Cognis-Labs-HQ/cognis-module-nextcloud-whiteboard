import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { createWhiteboardUiAssetResolver } from "../../api/reuse/ui-assets.js";
import { registerWhiteboardUiProvider } from "../../api/reuse/ui-provider.js";

const root = resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json")));

test("provider URLs follow the installed module revision rather than the host build", () => {
    const providers = [];
    registerWhiteboardUiProvider({
        moduleRoot: root,
        registerCapabilityProvider: (provider) => providers.push(provider),
    });
    const url = new URL(providers[0].scriptUrl, "http://localhost");
    assert.equal(url.searchParams.get("revision"), manifest.version);
    assert.equal(
        url.pathname,
        "/static/modules/nextcloud-whiteboard/reuse/whiteboard-ui-gateway.js",
    );
    assert.deepEqual(providers[0].providesCapabilities, [
        "whiteboard:uiGateway",
    ]);
    assert.equal(
        new URL(
            createWhiteboardUiAssetResolver(root)("app/index.js"),
            "http://localhost",
        ).searchParams.get("revision"),
        manifest.version,
    );
});

for (const entry of [
    "app/index.js",
    "reuse/whiteboard-ui-gateway.js",
    "navbar.js",
    "admin-section.js",
]) {
    test(`browser entry ${entry} links its actual repository module graph`, () => {
        assert.doesNotThrow(() =>
            execFileSync(
                process.execPath,
                [
                    "--experimental-vm-modules",
                    resolve(root, "tests/reuse/link-browser-module.mjs"),
                    resolve(root, "ui", entry),
                ],
                { stdio: "pipe" },
            ),
        );
    });
}

test("re-registration reads a newly installed package without retaining the previous revision", () => {
    const directory = mkdtempSync("/tmp/whiteboard-entry-");
    try {
        const versions = ["2.3.148", "2.3.149"];
        const urls = [];
        for (const version of versions) {
            writeFileSync(
                resolve(directory, "manifest.json"),
                JSON.stringify({ version }),
            );
            registerWhiteboardUiProvider({
                moduleRoot: directory,
                registerCapabilityProvider: (provider) =>
                    urls.push(provider.scriptUrl),
            });
        }
        assert.notEqual(urls[0], urls[1]);
        assert.deepEqual(
            urls.map((url) =>
                new URL(url, "http://localhost").searchParams.get("revision"),
            ),
            versions,
        );
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
