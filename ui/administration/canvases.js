import {
    renderCanvasRows,
    renderCanvasTable,
} from "../templates/administration.js";
import { reuse, uiCtx } from "../reuse/host-resources.js";

const [{ openPopup }, { formatDateTime }, { ensurePageStylesheet }] =
    await Promise.all([
        reuse.importModule("popup.js"),
        reuse.importModule("timestamp.js"),
        reuse.importModule("page-styles.js"),
    ]);

export function createAdminSection({ i18n, escapeHtml, showToast }) {
    const gateway = uiCtx.capabilities.get("whiteboard:uiGateway");
    if (
        typeof gateway?.listAdminCanvases !== "function" ||
        typeof gateway?.deleteAdminCanvas !== "function"
    )
        throw new Error("Canvas administration gateway is unavailable.");
    let root;
    let filter = "all";
    let rows = [];
    let refreshSequence = 0;
    const label = (key) =>
        i18n.t(`module.nextcloud.whiteboard.admin.canvases.${key}`);
    async function refresh() {
        const currentRoot = root;
        const sequence = ++refreshSequence;
        const data = await gateway.listAdminCanvases();
        if (
            currentRoot !== root ||
            sequence !== refreshSequence ||
            !root?.isConnected
        )
            return;
        rows = Array.isArray(data) ? data : [];
        root.querySelector("tbody").innerHTML = renderCanvasRows(
            rows,
            filter,
            label,
            escapeHtml,
            formatDateTime,
        );
    }
    async function handleClick(event) {
        const button = event.target.closest("button");
        if (!button || !root?.contains(button)) return;
        if (button.dataset.canvasFilter) {
            filter = button.dataset.canvasFilter;
            for (const pill of root.querySelectorAll("[data-canvas-filter]"))
                pill.setAttribute("aria-pressed", String(pill === button));
            await refresh();
            return;
        }
        const whiteboardId = button.dataset.deleteCanvas;
        if (!whiteboardId) return;
        const choice = await openPopup({
            title: label("delete"),
            body: `<p>${escapeHtml(label("confirm"))}</p>`,
            actions: [
                { id: "delete", label: label("delete"), variant: "cancel" },
                {
                    id: "cancel",
                    label: i18n.t("ui.reuse.cancel"),
                    variant: "neutral",
                },
            ],
        });
        if (choice !== "delete") return;
        button.disabled = true;
        try {
            await gateway.deleteAdminCanvas({ whiteboardId });
            showToast(label("deleted"), { variant: "success" });
            await refresh();
        } finally {
            button.disabled = false;
        }
    }
    const reportFailure = (error) => {
        if (!root?.isConnected) return;
        uiCtx.capabilities.get("ui:log")?.(
            "error",
            "Whiteboard administration failed.",
            {
                operation: "admin_canvases",
                errorName: error?.name,
            },
        );
        showToast(label("failed"), { variant: "error" });
    };
    return {
        id: "whiteboard-canvases",
        label: label("title"),
        dataReady: ensurePageStylesheet(
            "/static/modules/nextcloud-whiteboard/styles/administration.css",
        ),
        subComposerOptions: {
            allowCustomization: false,
            preferenceKey: "whiteboard-administration",
            heading: label("title"),
            onRender: (parent) => {
                root = parent.querySelector("#whiteboard-admin-canvases");
                root.onclick = (event) => {
                    void handleClick(event).catch(reportFailure);
                };
                void refresh().catch(reportFailure);
            },
            onUnmount: () => {
                if (root) root.onclick = null;
                root = null;
            },
            elements: [
                {
                    id: "whiteboard-admin-canvases",
                    label: label("title"),
                    pinned: true,
                    render: () => renderCanvasTable(filter, label, escapeHtml),
                },
            ],
        },
    };
}
