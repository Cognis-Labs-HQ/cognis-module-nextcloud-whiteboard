export function applyRemoteSceneUpdate({
    message,
    canvas,
    session,
    canWrite,
    persistChanges,
    setDisposableSaveDirty,
}) {
    if (!Array.isArray(message.payload?.elements)) return false;
    const transientUpdate = message.payload.transient === true;
    canvas.applyElements(message.payload.elements, {
        replace: false,
        transient: transientUpdate,
    });
    const mergedElements = canvas.getElements();
    if (!transientUpdate && message.type === "SCENE_UPDATE") {
        setDisposableSaveDirty(session, true);
    }
    if (canWrite && !transientUpdate) persistChanges(mergedElements);
    return true;
}
