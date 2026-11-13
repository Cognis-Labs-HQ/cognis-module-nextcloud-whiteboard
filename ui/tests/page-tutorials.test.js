import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mountProvider } from "../tutorials/provider.js";

test("page tutorials preserve scoped publication, administrator boundaries and four-language text", async () => {
    const controller = new AbortController();
    let contribution,
        released = false;
    const ctx = {
        signal: controller.signal,
        capabilities: {
            get: (id) => {
                assert.equal(id, "ui:reuse");
                return {
                    importModule: async (path) => {
                        assert.equal(path, "tutorials/pages.js");
                        return {
                            mountTutorialProvider: async (scope, options) => {
                                assert.equal(scope, ctx);
                                contribution = options;
                                return () => {
                                    released = true;
                                };
                            },
                        };
                    },
                };
            },
        },
    };
    const dispose = await mountProvider(ctx);
    const plays = contribution.guides.flatMap((guide) => guide.definitions);
    assert.equal(plays.length, 3);
    assert.ok(
        contribution.guides
            .filter((guide) =>
                guide.definitions.some(
                    (play) => play.page === "/administration",
                ),
            )
            .every((guide) => guide.minRole === "admin"),
    );
    for (const play of plays)
        for (const step of play.steps)
            assert.equal(
                step.highlightNext,
                !Boolean(step.advance || step.waitFor),
                `${play.id}:${step.id}`,
            );
    for (const locale of ["en", "de", "id", "ja"]) {
        const xml = readFileSync(
            new URL(`../languages/${locale}/strings.xml`, import.meta.url),
            "utf8",
        );
        for (const play of plays) {
            const keys = [
                play.titleKey,
                ...play.steps.flatMap((step) => [step.titleKey, step.bodyKey]),
            ];
            for (const key of keys)
                assert.ok(xml.includes(`name="${key}"`), `${locale}:${key}`);
        }
    }
    dispose();
    assert.equal(released, true);
});

test("canvas walkthrough requires a deliberate create/load action or an already ready canvas", async () => {
    const { guides } = await import("../tutorials/guides.js");
    const [choose, tools, canvas, save] = guides[0].definitions[0].steps;
    assert.equal(choose.highlightNext, false);
    assert.equal(choose.when({ targetAvailable: false }), false);
    assert.equal(
        choose.advance.accept({ target: { closest: () => null } }),
        false,
    );
    assert.equal(
        choose.advance.accept({ target: { closest: () => ({}) } }),
        true,
    );
    assert.equal(tools.when({ completed: [], targetAvailable: false }), false);
    assert.equal(
        tools.when({ completed: ["choose-a-board"], targetAvailable: false }),
        true,
    );
    assert.equal(tools.when({ completed: [], targetAvailable: true }), true);
    assert.equal(tools.missing.action, "retry");
    assert.deepEqual(canvas.dependsOn, ["drawing-tools"]);
    assert.deepEqual(save.dependsOn, ["drawing-tools"]);
});
