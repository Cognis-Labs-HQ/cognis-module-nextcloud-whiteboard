function createHistoryEntry(beforeSnapshot, afterSnapshot) {
    const beforeById = new Map(beforeSnapshot.map((item) => [item.id, item]));
    const afterById = new Map(afterSnapshot.map((item) => [item.id, item]));
    const changedIds = new Set([...beforeById.keys(), ...afterById.keys()]);

    return {
        before: beforeSnapshot,
        after: afterSnapshot,
        changedIds: [...changedIds].filter((id) => {
            const before = beforeById.get(id);
            const after = afterById.get(id);
            return (
                JSON.stringify(before ?? null) !== JSON.stringify(after ?? null)
            );
        }),
    };
}

export function createElementHistory({ applySnapshot, onChange, limit = 100 }) {
    let past = [];
    let future = [];

    function notifyChange() {
        onChange?.({
            canUndo: past.length > 0,
            canRedo: future.length > 0,
        });
    }

    return {
        record(beforeSnapshot, afterSnapshot) {
            const entry = createHistoryEntry(beforeSnapshot, afterSnapshot);
            if (entry.changedIds.length === 0) return false;
            past.push(entry);
            past = past.slice(-limit);
            future = [];
            notifyChange();
            return true;
        },
        undo() {
            const entry = past.pop();
            if (!entry) return false;
            future.push(entry);
            applySnapshot(entry.before, entry.changedIds);
            notifyChange();
            return true;
        },
        redo() {
            const entry = future.pop();
            if (!entry) return false;
            past.push(entry);
            applySnapshot(entry.after, entry.changedIds);
            notifyChange();
            return true;
        },
        canUndo() {
            return past.length > 0;
        },
        canRedo() {
            return future.length > 0;
        },
        notifyChange,
    };
}
