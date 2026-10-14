import {
    CanvasRequestError,
    resolveVisibleAccountHandle,
} from "../reuse/account-handle.js";

/** A canvas can belong to one integration source; repeated claims by that source are safe. */
export function createCanvasSourceBinding({
    store,
    profileStore,
    profileIdentity,
    log,
    resolveActorRole,
}) {
    const invoke = async (method, input) => {
        const role = await resolveActorRole?.(input.actorAccountId);
        const administrator = role === "admin" || role === "owner";
        const actorHandle = administrator
            ? ""
            : await resolveVisibleAccountHandle(
                  profileStore,
                  profileIdentity,
                  input.actorAccountId,
                  "actorAccountId",
              );
        const board = await store.getWhiteboardById(input.whiteboardId);
        if (!board && method === "releaseWhiteboardSource") return;
        if (!board || (!administrator && board.createdBy !== actorHandle))
            throw new CanvasRequestError(
                "Only the canvas owner can change its source binding.",
            );
        await store[method](input);
        log?.("info", "Canvas source binding updated.", {
            operation: method,
            whiteboardId: input.whiteboardId,
            sourceType: input.sourceType,
            sourceId: input.sourceId,
        });
    };
    return {
        bind: (input) => invoke("bindWhiteboardSource", input),
        release: (input) => invoke("releaseWhiteboardSource", input),
    };
}
