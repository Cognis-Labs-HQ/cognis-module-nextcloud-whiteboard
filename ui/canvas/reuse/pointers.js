export function renderRemotePointers({
    canvasElement,
    context,
    pointers = [],
}) {
    const root = canvasElement.parentElement;
    if (!root) return;
    const rootBounds = root.getBoundingClientRect();
    const canvasBounds = canvasElement.getBoundingClientRect();
    const rootWidth = Math.max(root.scrollWidth, rootBounds.width);
    const rootHeight = Math.max(root.scrollHeight, rootBounds.height);
    for (const pointer of pointers) {
        const x =
            pointer.x * rootWidth -
            root.scrollLeft -
            (canvasBounds.left - rootBounds.left);
        const y =
            pointer.y * rootHeight -
            root.scrollTop -
            (canvasBounds.top - rootBounds.top);
        if (x < 0 || y < 0 || x > canvasBounds.width || y > canvasBounds.height)
            continue;
        drawRemotePointer(context, { ...pointer, x, y });
    }
}

function drawRemotePointer(context, pointer) {
    const active = pointer.interaction !== "idle";
    context.save();
    context.fillStyle = pointer.color;
    if (!active) {
        context.beginPath();
        context.moveTo(pointer.x, pointer.y);
        context.lineTo(pointer.x + 7, pointer.y + 18);
        context.lineTo(pointer.x + 11, pointer.y + 11);
        context.lineTo(pointer.x + 18, pointer.y + 8);
        context.closePath();
        context.fill();
    }
    const activity = pointer.interaction === "typing" ? "⌨ " : "";
    const label = `${activity}${pointer.label}`;
    context.font = "600 12px system-ui, sans-serif";
    const labelWidth = context.measureText(label).width + 12;
    const labelX = pointer.x + (active ? 0 : 12);
    const labelY = pointer.y + (active ? 8 : 15);
    context.fillRect(labelX, labelY, labelWidth, 20);
    context.fillStyle = "#ffffff";
    context.fillText(label, labelX + 6, labelY + 14);
    context.restore();
}
