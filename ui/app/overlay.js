export function setOverlayVisible(root, visible, message = "") {
    const overlay = root?.querySelector("#whiteboard-canvas-overlay");
    if (!overlay) return;
    overlay.hidden = !visible;
    const messageElement = overlay.querySelector(".whiteboard-overlay-message");
    if (messageElement) messageElement.textContent = message;
}
