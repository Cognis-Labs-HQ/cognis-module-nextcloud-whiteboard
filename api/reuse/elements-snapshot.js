function elementRevision(element) {
    return [Number(element?.version) || 0, Number(element?.versionNonce) || 0];
}

function isNewerElement(candidate, current) {
    const [candidateVersion, candidateNonce] = elementRevision(candidate);
    const [currentVersion, currentNonce] = elementRevision(current);
    return (
        candidateVersion > currentVersion ||
        (candidateVersion === currentVersion && candidateNonce > currentNonce)
    );
}

export function mergeElementsSnapshots(currentElements, incomingElements) {
    const merged = new Map();
    for (const element of Array.isArray(currentElements)
        ? currentElements
        : []) {
        const id = String(element?.id ?? "").trim();
        if (id) merged.set(id, element);
    }
    for (const element of Array.isArray(incomingElements)
        ? incomingElements
        : []) {
        const id = String(element?.id ?? "").trim();
        if (!id) continue;
        const current = merged.get(id);
        if (!current || isNewerElement(element, current)) {
            merged.set(id, element);
        }
    }
    return [...merged.values()];
}
