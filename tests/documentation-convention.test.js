import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const TEMPLATE = resolve(ROOT, ".github/documentation/TECHNICAL.en.md");
const LANGUAGES = ["de", "en", "id", "ja"];
const CHANGELOG_LABELS = {
    de: ["Feature-Zweig", "Commits"],
    en: ["Feature Branch", "Commits"],
    id: ["Cabang Fitur", "Komit"],
    ja: ["機能ブランチ", "コミット"],
};

function markdownFiles(directory) {
    return readdirSync(directory)
        .filter((name) => name !== "changelog")
        .flatMap((name) => {
            const path = resolve(directory, name);
            if (statSync(path).isDirectory()) return markdownFiles(path);
            return name.endsWith(".md") ? [path] : [];
        });
}

function headingLevels(path) {
    return readFileSync(path, "utf8")
        .split("\n")
        .filter((line) => /^#{1,6} /.test(line))
        .map((line) => line.match(/^#+/)[0].length);
}

test("localized changelogs identify their branch and linked commits", () => {
    const changelogs = markdownFiles(resolve(ROOT, "docs/changelog"));
    for (const path of changelogs) {
        const match = /\.([a-z]{2})\.md$/.exec(path);
        assert.ok(match, `${relative(ROOT, path)} must have a language suffix`);
        const [branchLabel, commitsLabel] = CHANGELOG_LABELS[match[1]];
        const markdown = readFileSync(path, "utf8");
        assert.match(
            markdown,
            new RegExp(`^\\*\\*${branchLabel}:\\*\\* \\S+$`, "m"),
        );

        assert.match(markdown, new RegExp(`^## ${commitsLabel}$`, "m"));
        assert.match(
            markdown,
            /^- \[[0-9a-f]{7}\]\(https:\/\/github\.com\/Cognis-Labs-HQ\/cognis-module-nextcloud-whiteboard\/commit\/[0-9a-f]{40}\)$/m,
        );
    }
});

test("temporary work changelogs are not retained", () => {
    const temporaryChangelogs = readdirSync(
        resolve(ROOT, "docs/changelog"),
    ).filter((name) => /^work\.(?:de|en|id|ja)\.md$/.test(name));

    assert.deepEqual(temporaryChangelogs, []);
});
