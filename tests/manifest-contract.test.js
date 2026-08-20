import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

test("module manifest requires the profile adapter and share gateway", () => {
    assert.deepEqual(manifest.requires, [
        "4387fae9-26dd-5a80-84b2-e5f4833b7fb9",
        "0da92508-63fa-53ed-918c-e6f08692a382",
    ]);
});

test("module manifest requires the Cognis authentication gateway", () => {
    assert.ok(manifest.requiresCapabilities.includes("auth:requireAuth"));
});

test("module manifest exposes whiteboard configuration to preference ingestion", () => {
    assert.deepEqual(
        manifest.ui.preferences.map(({ key, type, default: defaultValue }) => ({
            key,
            type,
            default: defaultValue,
        })),
        [
            { key: "serverUrl", type: "string", default: "" },
            {
                key: "imageUploadMaxBytes",
                type: "number",
                default: 1048576,
            },
            { key: "apiKey", type: "password", default: "" },
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
