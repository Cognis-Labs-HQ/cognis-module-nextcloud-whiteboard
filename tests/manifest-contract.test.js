import assert from "node:assert/strict";
import { lstat, readFile, readlink } from "node:fs/promises";
import test from "node:test";

const manifest = JSON.parse(
    await readFile(new URL("../manifest.json", import.meta.url), "utf8"),
);

test("module manifest declares its supplied whiteboard capabilities", () => {
    assert.deepEqual(manifest.capabilities, [
        "whiteboard:collaboration",
        "whiteboard:access-control",
        "whiteboard:getEmbedUrl",
        "whiteboard:fetchBoardData",
    ]);
});

test("module manifest does not block configuration on hard dependencies", () => {
    assert.deepEqual(manifest.requires, []);
});

test("module manifest requires the Cognis authentication gateway", () => {
    assert.ok(manifest.requiresCapabilities.includes("auth:requireAuth"));
    assert.ok(manifest.requiresCapabilities.includes("ui:reuse"));
});

test("module manifest excludes changelog entries from packaged hashes", () => {
    assert.equal(
        manifest.files.some(({ path }) => path.startsWith("changelog/")),
        false,
    );
});

test("module manifest includes the contributor instructions", () => {
    assert.equal(
        manifest.files.some(({ path }) => path === "AGENTS.md"),
        true,
    );
});

test("contributor instructions remain linked to the canonical instructions", async () => {
    const instructionsUrl = new URL("../AGENTS.md", import.meta.url);
    assert.equal((await lstat(instructionsUrl)).isSymbolicLink(), true);
    assert.equal(
        await readlink(instructionsUrl),
        ".github/copilot-instructions.md",
    );
});

test("module manifest exposes required whiteboard configuration to preference ingestion", () => {
    assert.deepEqual(
        manifest.ui.preferences.map(
            ({ key, type, required, default: defaultValue }) => ({
                key,
                type,
                required,
                default: defaultValue,
            }),
        ),
        [
            {
                key: "serverUrl",
                type: "string",
                required: true,
                default: "",
            },
            {
                key: "imageUploadMaxBytes",
                type: "number",
                required: true,
                default: 1048576,
            },
            {
                key: "apiKey",
                type: "password",
                required: true,
                default: "",
            },
        ],
    );
});

test("module manifest exposes localized preference metadata", () => {
    assert.equal(
        manifest.ui.stringsBaseUrl,
        "/static/modules/nextcloud-whiteboard/languages",
    );
    for (const preference of manifest.ui.preferences) {
        assert.match(preference.labelKey, /^module\.nextcloud_whiteboard\./);
        assert.match(
            preference.descriptionKey,
            /^module\.nextcloud_whiteboard\./,
        );
        assert.equal(preference.label, undefined);
        assert.equal(preference.description, undefined);
    }
});
