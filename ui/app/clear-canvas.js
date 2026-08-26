import { reuse } from "../reuse/host-resources.js";

const [{ escapeHtml }, { openPopup }] = await Promise.all([
    reuse.importModule("escape-html.js"),
    reuse.importModule("popup.js"),
]);

export async function confirmClearCanvas(translate) {
    return (
        (await openPopup({
            title: translate("module.nextcloud_whiteboard.clear_board"),
            body: `<p>${escapeHtml(translate("module.nextcloud_whiteboard.clear_confirm"))}</p>`,
            actions: [
                {
                    id: "cancel",
                    label: translate("ui.reuse.close"),
                    variant: "neutral",
                },
                {
                    id: "clear",
                    label: translate("module.nextcloud_whiteboard.clear_board"),
                    variant: "cancel",
                },
            ],
            closeButtonVariant: "neutral",
        })) === "clear"
    );
}
