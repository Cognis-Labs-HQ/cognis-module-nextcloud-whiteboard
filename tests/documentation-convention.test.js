import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const TEMPLATE = resolve(ROOT, ".github/DOCUMENTATION_TEMPLATE.en.md");
const LANGUAGES = ["de", "en", "id", "ja"];
const CHANGELOG_LABELS = {
    de: ["Feature-Zweig", "Commits"],
    en: ["Feature Branch", "Commits"],
    id: ["Cabang Fitur", "Komit"],
    ja: ["機能ブランチ", "コミット"],
};

function markdownFiles(directory) {
    return readdirSync(directory).flatMap((name) => {
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

test("documentation follows the hidden heading convention", () => {
    const expected = headingLevels(TEMPLATE).slice(0, 3);
    const violations = markdownFiles(resolve(ROOT, "docs")).flatMap((path) => {
        const actual = headingLevels(path).slice(0, expected.length);
        return actual.length === expected.length &&
            actual.every((level, index) => level === expected[index])
            ? []
            : [relative(ROOT, path)];
    });
    assert.deepEqual(violations, []);
});

test("documentation templates exist for every supported language", () => {
    const expected = headingLevels(TEMPLATE);
    for (const language of LANGUAGES) {
        const template = resolve(
            ROOT,
            `.github/DOCUMENTATION_TEMPLATE.${language}.md`,
        );
        assert.ok(statSync(template).isFile());
        assert.deepEqual(headingLevels(template), expected);
    }
});

test("every documentation topic has one variant per supported language", () => {
    const documents = markdownFiles(resolve(ROOT, "docs"));
    const families = new Map();
    for (const path of documents) {
        const relativePath = relative(resolve(ROOT, "docs"), path);
        const match = /^(.*)\.(de|en|id|ja)\.md$/.exec(relativePath);
        assert.ok(
            match,
            `${relative(ROOT, path)} must include a language suffix`,
        );
        const [, topic, language] = match;
        const variants = families.get(topic) ?? new Set();
        variants.add(language);
        families.set(topic, variants);
    }
    for (const [topic, variants] of families) {
        assert.deepEqual([...variants].sort(), [...LANGUAGES].sort(), topic);
    }
});

test("localized changelogs identify their branch and linked commits", () => {
    const changelogs = markdownFiles(resolve(ROOT, "changelog"));
    for (const path of changelogs) {
        const match = /\.([a-z]{2})\.md$/.exec(path);
        assert.ok(match, `${relative(ROOT, path)} must have a language suffix`);
        const [branchLabel, commitsLabel] = CHANGELOG_LABELS[match[1]];
        const markdown = readFileSync(path, "utf8");
        assert.match(
            markdown,
            new RegExp(`^\\*\\*${branchLabel}:\\*\\* \\S+$`, "m"),
        );

        if (
            path.includes(`${relative(ROOT, resolve(ROOT, "changelog/work"))}.`)
        ) {
            continue;
        }
        assert.match(markdown, new RegExp(`^## ${commitsLabel}$`, "m"));
        assert.match(
            markdown,
            /^- \[[0-9a-f]{7}\]\(https:\/\/github\.com\/Cognis-Labs-HQ\/cognis-module-nextcloud-whiteboard\/commit\/[0-9a-f]{40}\)$/m,
        );
    }
});
