export function syncBoardUrl({
    boardId,
    hostNavigationAllowed,
    integrationCanvasMode,
    shareContext,
}) {
    if (!hostNavigationAllowed || shareContext || !boardId) return;
    const searchParameters = new URLSearchParams({ id: boardId });
    if (integrationCanvasMode) searchParameters.set("instantCanvas", "1");
    const nextSearch = `?${searchParameters.toString()}`;
    const nextUrl = `/whiteboard${nextSearch}`;
    if (
        window.location.pathname !== "/whiteboard" ||
        window.location.search !== nextSearch
    ) {
        window.history.replaceState(null, "", nextUrl);
    }
}
