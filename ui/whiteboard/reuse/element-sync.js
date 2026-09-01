import { bumpElementVersion, bumpElementVersionPast } from "../elements.js";

export function applyElementHistorySnapshot(elements, snapshot, changedIds) {
    const snapshotById = new Map(snapshot.map((item) => [item.id, item]));
    const currentById = new Map(elements.map((item) => [item.id, item]));
    const changed = new Set(changedIds);

    return [
        ...elements
            .filter((element) => !changed.has(element.id))
            .map(cloneElement),
        ...[...changed]
            .map((id) => snapshotById.get(id))
            .filter(Boolean)
            .map((element) =>
                bumpElementVersionPast(
                    element,
                    currentById.get(element.id),
                    cloneElement(element),
                ),
            ),
        ...[...changed]
            .filter((id) => !snapshotById.has(id) && currentById.has(id))
            .map((id) =>
                bumpElementVersion(currentById.get(id), { isDeleted: true }),
            ),
    ];
}

export function mergeRemoteElements(elements, remoteElements) {
    const mergedById = new Map(
        elements.map((element) => [element.id, element]),
    );

    for (const remoteElement of remoteElements) {
        const local = mergedById.get(remoteElement.id);
        if (!local || isRemoteElementNewer(remoteElement, local)) {
            mergedById.set(remoteElement.id, remoteElement);
        }
    }

    return [...mergedById.values()];
}

function cloneElement(element) {
    return {
        ...element,
        points: element.points?.map((point) => [...point]),
    };
}

function isRemoteElementNewer(remoteElement, localElement) {
    const remoteVersion = remoteElement.version ?? 0;
    const localVersion = localElement.version ?? 0;
    return (
        remoteVersion > localVersion ||
        (remoteVersion === localVersion &&
            (remoteElement.versionNonce ?? 0) >
                (localElement.versionNonce ?? 0))
    );
}
