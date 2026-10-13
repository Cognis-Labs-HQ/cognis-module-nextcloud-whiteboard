import { reuse } from "./reuse/host-resources.js";

const [{ apiFetch }, { registerSearchIndex }, { createI18n }] =
    await Promise.all([
        reuse.importModule("api-client.js"),
        reuse.importModule("search-util/popup.js"),
        reuse.importModule("i18n.js"),
    ]);
const WHITEBOARD_API_BASE = "/api/v1/modules/nextcloud-whiteboard";

async function fetchVisibleWhiteboards() {
    const response = await apiFetch(`${WHITEBOARD_API_BASE}/whiteboards`);
    if (!response.ok) return [];
    const payload = await response.json().catch(() => null);
    return Array.isArray(payload?.data) ? payload.data : [];
}

function whiteboardFileSearchItem(board) {
    const boardId = String(board?.id ?? "").trim();
    const title = String(board?.title ?? boardId).trim();
    if (!boardId || !title) return null;
    return {
        id: `whiteboard:${boardId}`,
        label: title,
        showDescription: false,
        showMatchSnippet: false,
        url: `/whiteboard?id=${encodeURIComponent(boardId)}`,
        resultClass: "page",
        searchText: [
            title,
            board.externalPath,
            board.createdBy,
            board.updatedAt,
        ]
            .filter(Boolean)
            .join(" "),
        visible: true,
    };
}

async function collectWhiteboardNavbarSearchGroups() {
    const pageItem = {
        id: "whiteboards-page",
        label: "module.nextcloud.whiteboard.nav.label",
        description: "module.nextcloud.whiteboard.search.pages",
        url: "/whiteboards",
        resultClass: "page",
        searchText: "Whiteboards Whiteboard files boards canvas",
        visible: true,
    };
    const fileItems = (await fetchVisibleWhiteboards())
        .map(whiteboardFileSearchItem)
        .filter(Boolean);
    return [
        {
            category: "module.nextcloud.whiteboard.search.pages",
            items: [pageItem],
        },
        fileItems.length
            ? {
                  category: "module.nextcloud.whiteboard.search.category",
                  items: fileItems,
              }
            : null,
    ].filter(Boolean);
}

export async function mountProvider(ctx) {
    const i18n = await createI18n({
        componentStringBaseUrls: [
            "/static/modules/nextcloud-whiteboard/languages",
        ],
    });
    ctx.signal.throwIfAborted();
    const navbar = ctx.capabilities.get("ui:navbarLinks");
    if (typeof navbar?.contribute !== "function")
        throw new Error("Required UI capability unavailable: ui:navbarLinks");
    const removeLink = navbar.contribute("nextcloud-whiteboard:whiteboards", {
        label: i18n.t("module.nextcloud.whiteboard.nav.label"),
        href: "/whiteboards",
    });
    const removeSearch = registerSearchIndex(
        "nextcloud-whiteboard-navbar",
        collectWhiteboardNavbarSearchGroups,
        { componentId: "nextcloud-whiteboard" },
    );
    return () => {
        removeSearch();
        removeLink();
    };
}
