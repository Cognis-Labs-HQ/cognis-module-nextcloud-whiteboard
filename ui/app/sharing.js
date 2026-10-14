export async function openWhiteboardSharePopup({
    board,
    canManageShares,
    openPopup,
    reportError,
    translate,
}) {
    if (!board?.id || !canManageShares()) return;
    if (typeof openPopup !== "function") return;
    try {
        await openPopup({
            resourceType: "whiteboard",
            resourceId: board.id,
            contentUrl: `/whiteboard?id=${encodeURIComponent(board.id)}`,
            grantedCapabilities: ["whiteboard:read", "whiteboard:write"],
            supportsReadOnly: true,
            linkAccessOptions: [
                {
                    id: "read",
                    label: translate(
                        "module.nextcloud.whiteboard.share.permission.read",
                    ),
                    permissions: ["read"],
                    grantedCapabilities: ["whiteboard:read"],
                },
                {
                    id: "write",
                    label: translate(
                        "module.nextcloud.whiteboard.share.permission.write",
                    ),
                    permissions: ["read", "write"],
                    grantedCapabilities: [
                        "whiteboard:read",
                        "whiteboard:write",
                    ],
                },
            ],
            title: translate("module.nextcloud.whiteboard.share.popup.title"),
            labels: {
                empty: translate("module.nextcloud.whiteboard.share.empty"),
                untitled: translate(
                    "module.nextcloud.whiteboard.share.untitled",
                ),
                copyLink: translate(
                    "module.nextcloud.whiteboard.share.copy.link",
                ),
                revoke: translate("module.nextcloud.whiteboard.share.revoke"),
                shareOptions: translate(
                    "module.nextcloud.whiteboard.share.options.label",
                ),
                permission: translate(
                    "module.nextcloud.whiteboard.share.options.label",
                ),
                accessMode: translate(
                    "module.nextcloud.whiteboard.share.options.label",
                ),
                readPermission: translate(
                    "module.nextcloud.whiteboard.share.permission.read",
                ),
                writePermission: translate(
                    "module.nextcloud.whiteboard.share.permission.write",
                ),
                mail: translate("ui.reuse.mail"),
                label: translate("module.nextcloud.whiteboard.share.label"),
                labelPlaceholder: translate(
                    "module.nextcloud.whiteboard.share.label.placeholder",
                ),
                expiryLabel: translate(
                    "module.nextcloud.whiteboard.share.expiry.label",
                ),
                password: translate(
                    "module.nextcloud.whiteboard.share.password.optional",
                ),
                passwordPopupTitle: translate(
                    "module.nextcloud.whiteboard.share.password.title",
                ),
                passwordPopupLabel: translate(
                    "module.nextcloud.whiteboard.share.password.instruction",
                ),
                passwordPlaceholder: translate(
                    "module.nextcloud.whiteboard.share.password.placeholder",
                ),
                cancel: translate("ui.reuse.cancel"),
                confirm: translate("module.nextcloud.whiteboard.share.revoke"),
                deleteConfirmMessage: translate(
                    "module.nextcloud.whiteboard.share.delete.prompt",
                ),
                statusActive: translate(
                    "module.nextcloud.whiteboard.share.status.active",
                ),
                statusExpired: translate(
                    "module.nextcloud.whiteboard.share.status.expired",
                ),
                expiresAtLabel: translate(
                    "module.nextcloud.whiteboard.share.expires.at.label",
                ),
                expiredAtLabel: translate(
                    "module.nextcloud.whiteboard.share.expired.at.label",
                ),
                generateLink: translate(
                    "module.nextcloud.whiteboard.share.generate.link",
                ),
                close: translate("ui.reuse.close"),
                createFailed: translate(
                    "module.nextcloud.whiteboard.share.create.failed",
                ),
                copySuccess: translate(
                    "module.nextcloud.whiteboard.share.copy.success",
                ),
                copyFailed: translate(
                    "module.nextcloud.whiteboard.share.copy.failed",
                ),
                deleteFailed: translate(
                    "module.nextcloud.whiteboard.share.delete.failed",
                ),
            },
        });
    } catch (error) {
        reportError(error, "module.nextcloud.whiteboard.share.create.failed");
    }
}
