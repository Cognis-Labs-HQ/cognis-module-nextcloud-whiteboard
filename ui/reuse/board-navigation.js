export function syncBoardUrl({
    boardId,
    hostNavigationAllowed,
    integrationCanvasMode,
    shareContext,
}) {
    if (!hostNavigationAllowed || shareContext || !boardId) return;
    const searchParams = new URLSearchParams({ id: boardId });
    if (integrationCanvasMode) searchParams.set("instantCanvas", "1");
    const nextSearch = `?${searchParams.toString()}`;
    const nextUrl = `/whiteboard${nextSearch}`;
    if (
        window.location.pathname !== "/whiteboard" ||
        window.location.search !== nextSearch
    ) {
        window.history.replaceState(null, "", nextUrl);
    }
}
