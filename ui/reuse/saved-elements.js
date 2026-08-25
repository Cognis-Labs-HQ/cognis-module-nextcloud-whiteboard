export function applySavedElements(canvas, saved) {
    if (Array.isArray(saved?.elements)) canvas.applyElements(saved.elements);
    return canvas.getElements();
}
