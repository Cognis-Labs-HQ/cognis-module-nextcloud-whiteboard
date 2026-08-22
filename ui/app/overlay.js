/**
 * @param {Element} root
 * @param {boolean} visible
 * @param {string} message
 */
export function setOverlayVisible(root, visible, message = "") {
    const overlay = root.querySelector("#whiteboard-canvas-overlay");
    if (!overlay) return;
    overlay.hidden = !visible;
    const messageElement = overlay.querySelector(".whiteboard-overlay-message");
    if (messageElement) messageElement.textContent = message;
}

/**
 * @param {Element} root
 * @param {Array<{ id: string }>} boards
 * @param {(board: { id: string }) => void} selectBoard
 */
export function bindOverlayBoardSelection(root, boards, selectBoard) {
    root.querySelectorAll(".whiteboard-overlay-board").forEach((button) => {
        button.addEventListener("click", () => {
            const board = boards.find(
                (item) => item.id === button.dataset.boardId,
            );
            if (board) selectBoard(board);
        });
    });
}
