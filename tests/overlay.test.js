import assert from "node:assert/strict";
import test from "node:test";

class FakeElement {
    constructor(boardId = "") {
        this.dataset = { boardId };
        this.listeners = new Map();
        this.boardButtons = [];
    }

    querySelectorAll(selector) {
        assert.equal(selector, ".whiteboard-overlay-board");
        return this.boardButtons;
    }

    addEventListener(type, listener) {
        this.listeners.set(type, listener);
    }

    click() {
        this.listeners.get("click")?.();
    }
}

globalThis.Element = FakeElement;

const { bindOverlayBoardSelection } = await import("../ui/app/overlay.js");

test("selects a board from the page root created by an SPA transition", () => {
    const directPageRoot = new FakeElement();
    directPageRoot.boardButtons = [new FakeElement("direct-board")];
    const transitionedPageRoot = new FakeElement();
    transitionedPageRoot.boardButtons = [new FakeElement("spa-board")];
    const boards = [{ id: "direct-board" }, { id: "spa-board" }];
    const selections = [];

    bindOverlayBoardSelection(directPageRoot, boards, (board) => {
        selections.push(board.id);
    });
    bindOverlayBoardSelection(transitionedPageRoot, boards, (board) => {
        selections.push(board.id);
    });

    transitionedPageRoot.boardButtons[0].click();

    assert.deepEqual(selections, ["spa-board"]);
});

test("whiteboard mount validates its page root before initialization", async () => {
    const source = await import("node:fs/promises").then((fs) =>
        fs.readFile(new URL("../ui/app/index.js", import.meta.url), "utf8"),
    );

    assert.match(
        source,
        /export async function mount\(\s*root[^]*?if \(!\(root instanceof Element\)\)/,
    );
    assert.match(source, /let pageMountRoot = null/);
    assert.doesNotMatch(source, /let mountRoot/);
});
