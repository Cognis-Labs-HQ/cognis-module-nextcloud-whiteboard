export function applyRemoteSceneUpdate({
    message,
    canvas,
    session,
    canWrite,
    persistChanges,
    setDisposableSaveDirty,
}) {
    if (!Array.isArray(message.payload?.elements)) return false;
    canvas.applyElements(message.payload.elements, { replace: false });
    const mergedElements = canvas.getElements();
    const transientUpdate = message.payload.transient === true;
    if (!transientUpdate && message.type === "SCENE_UPDATE") {
        setDisposableSaveDirty(session, true);
    }
    if (canWrite && !transientUpdate) persistChanges(mergedElements);
    return true;
}
