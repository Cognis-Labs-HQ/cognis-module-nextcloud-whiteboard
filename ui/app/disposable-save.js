export function createDisposableSaveControls({
    escapeHtml,
    onSaved,
    reportClientError,
    saveWhiteboardElements,
    setSyncStatus,
    translate,
    withinMount,
}) {
    function setDisposableSaveDirty(session, dirty) {
        if (!session?.disposable) return;
        const saveButton = withinMount("#whiteboard-save-copy");
        if (!saveButton) return;
        saveButton.dataset.dirty = String(dirty);
        saveButton.hidden = false;
    }

    function bindDisposableSaveButton(session, canvas) {
        if (!session?.disposable) return;
        const statusBox = withinMount("#whiteboard-sync-status");
        if (!statusBox) return;
        if (!withinMount("#whiteboard-save-copy")) {
            const label = escapeHtml(
                translate("module.nextcloud_whiteboard.save_canvas"),
            );
            statusBox.insertAdjacentHTML(
                "beforebegin",
                `<button type="button" id="whiteboard-save-copy" class="whiteboard-save-copy" aria-label="${label}">${label}</button>`,
            );
        }
        const saveButton = withinMount("#whiteboard-save-copy");
        if (!saveButton || saveButton.dataset.bound === "true") return;
        saveButton.dataset.bound = "true";
        saveButton.dataset.dirty = String(!session.saved);
        saveButton.addEventListener("click", async () => {
            saveButton.disabled = true;
            try {
                setSyncStatus(
                    "syncing",
                    "module.nextcloud_whiteboard.status_syncing",
                );
                const saved = await saveWhiteboardElements(
                    session.roomId,
                    canvas.getElements(),
                    { explicitSave: true },
                );
                if (Array.isArray(saved?.elements)) {
                    canvas.applyElements(saved.elements);
                }
                onSaved(canvas.getElements());
                session.saved = true;
                setDisposableSaveDirty(session, false);
                setSyncStatus(
                    "synced",
                    "module.nextcloud_whiteboard.status_synced",
                );
            } catch (error) {
                reportClientError(
                    error,
                    "module.nextcloud_whiteboard.status_sync_failed",
                );
            } finally {
                saveButton.disabled = false;
            }
        });
    }

    return { bindDisposableSaveButton, setDisposableSaveDirty };
}
