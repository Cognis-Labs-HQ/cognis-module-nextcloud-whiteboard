import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    headless: true,
});
try {
    const page = await browser.newPage();
    const styles = await readFile(
        new URL("../ui/styles/whiteboards.css", import.meta.url),
        "utf8",
    );
    await page.setContent(`<style>
        * { box-sizing: border-box; }
        .host { display: grid; grid-template-rows: minmax(min-content, 1fr); }
        .mounted-page { height: 100%; min-height: 100%; display: grid; grid-template-rows: minmax(min-content, 1fr); }
        ${styles}
    </style><div class="host"><div class="mounted-page">
        <div class="whiteboard-canvas-wrap whiteboard-canvas-wrap--embedded">
            <header class="whiteboard-toolbar" style="height:60px">Tools</header>
            <div class="whiteboard-canvas-stage"><canvas id="whiteboard-canvas" style="height:2000px" height="2000"></canvas></div>
        </div>
    </div></div>`);
    for (const [width, height] of [
        [900, 400],
        [420, 280],
        [900, 600],
        [900, 350],
    ]) {
        const bounds = await page.evaluate(
            ({ width, height }) => {
                const host = document.querySelector(".host");
                host.style.width = `${width}px`;
                host.style.height = `${height}px`;
                const canvas = document.querySelector("canvas");
                for (let iteration = 0; iteration < 6; iteration++) {
                    const rect = canvas.parentElement.getBoundingClientRect();
                    canvas.width = Math.ceil(rect.width);
                    canvas.height = Math.ceil(rect.height);
                    canvas.style.width = `${canvas.width}px`;
                    canvas.style.height = `${canvas.height}px`;
                }
                return {
                    height: host.clientHeight,
                    scrollHeight: host.scrollHeight,
                    surfaceHeight: document.querySelector(
                        ".whiteboard-canvas-wrap",
                    ).clientHeight,
                    canvasHeight: canvas.clientHeight,
                    toolbarHeight: document
                        .querySelector("header")
                        .getBoundingClientRect().height,
                };
            },
            { width, height },
        );
        assert.equal(
            bounds.scrollHeight,
            height,
            "Embedded content must not enlarge its host",
        );
        assert.equal(bounds.surfaceHeight, height);
        assert.equal(
            bounds.canvasHeight + bounds.toolbarHeight,
            height,
            "The toolbar and canvas must both fit, without clipping",
        );
        assert.ok(bounds.canvasHeight > 0);
    }
    console.log(
        "Embedded canvas fits its host after mounting, shrinking and expanding.",
    );
} finally {
    await browser.close();
}
