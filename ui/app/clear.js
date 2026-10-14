import { reuse } from "../reuse/host-resources.js";

const [{ escapeHtml }, { openPopup }] = await Promise.all([
    reuse.importModule("escape-html.js"),
    reuse.importModule("popup.js"),
]);

export async function confirmClearCanvas(translate) {
    return (
        (await openPopup({
            title: translate("module.nextcloud.whiteboard.clear.board"),
            body: `<p>${escapeHtml(translate("module.nextcloud.whiteboard.clear.confirm"))}</p>`,
            actions: [
                {
                    id: "cancel",
                    label: translate("ui.reuse.close"),
                    variant: "neutral",
                },
                {
                    id: "clear",
                    label: translate("module.nextcloud.whiteboard.clear.board"),
                    variant: "cancel",
                },
            ],
            closeButtonVariant: "neutral",
        })) === "clear"
    );
}
