export function diagnoseCanvases(boards) {
    const sourceCounts = new Map();
    const referenceCounts = new Map();
    const sourceKey = (board) =>
        board.sourceType && board.sourceId
            ? JSON.stringify([board.sourceType, board.sourceId])
            : null;
    const referenceKey = (board) =>
        board.resourceReference
            ? JSON.stringify([
                  board.resourceReference.resourceType,
                  board.resourceReference.resourceId,
              ])
            : null;
    for (const board of boards) {
        for (const [counts, key] of [
            [sourceCounts, sourceKey(board)],
            [referenceCounts, referenceKey(board)],
        ]) {
            if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
        }
    }
    return (board, members) => {
        const issues = [];
        if (!board.createdBy) issues.push("missingOwner");
        else if (!members.includes(board.createdBy))
            issues.push("ownerAccessMissing");
        if (Boolean(board.sourceType) !== Boolean(board.sourceId))
            issues.push("incompleteSource");
        if (sourceCounts.get(sourceKey(board)) > 1)
            issues.push("duplicateSource");
        if (referenceCounts.get(referenceKey(board)) > 1)
            issues.push("duplicateReference");
        return issues;
    };
}
