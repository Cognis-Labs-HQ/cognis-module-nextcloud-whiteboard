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
                        "module.nextcloud_whiteboard.share_permission_read",
                    ),
                    permissions: ["read"],
                    grantedCapabilities: ["whiteboard:read"],
                },
                {
                    id: "write",
                    label: translate(
                        "module.nextcloud_whiteboard.share_permission_write",
                    ),
                    permissions: ["read", "write"],
                    grantedCapabilities: [
                        "whiteboard:read",
                        "whiteboard:write",
                    ],
                },
            ],
            title: translate("module.nextcloud_whiteboard.share_popup_title"),
            labels: {
                empty: translate("module.nextcloud_whiteboard.share_empty"),
                untitled: translate(
                    "module.nextcloud_whiteboard.share_untitled",
                ),
                copyLink: translate(
                    "module.nextcloud_whiteboard.share_copy_link",
                ),
                revoke: translate("module.nextcloud_whiteboard.share_revoke"),
                shareOptions: translate(
                    "module.nextcloud_whiteboard.share_options_label",
                ),
                permission: translate(
                    "module.nextcloud_whiteboard.share_options_label",
                ),
                accessMode: translate(
                    "module.nextcloud_whiteboard.share_options_label",
                ),
                readPermission: translate(
                    "module.nextcloud_whiteboard.share_permission_read",
                ),
                writePermission: translate(
                    "module.nextcloud_whiteboard.share_permission_write",
                ),
                mail: translate("ui.reuse.mail"),
                label: translate("module.nextcloud_whiteboard.share_label"),
                labelPlaceholder: translate(
                    "module.nextcloud_whiteboard.share_label_placeholder",
                ),
                expiryLabel: translate(
                    "module.nextcloud_whiteboard.share_expiry_label",
                ),
                password: translate(
                    "module.nextcloud_whiteboard.share_password_optional",
                ),
                passwordPopupTitle: translate(
                    "module.nextcloud_whiteboard.share_password_title",
                ),
                passwordPopupLabel: translate(
                    "module.nextcloud_whiteboard.share_password_instruction",
                ),
                passwordPlaceholder: translate(
                    "module.nextcloud_whiteboard.share_password_placeholder",
                ),
                cancel: translate("ui.reuse.cancel"),
                confirm: translate("module.nextcloud_whiteboard.share_revoke"),
                deleteConfirmMessage: translate(
                    "module.nextcloud_whiteboard.share_delete_prompt",
                ),
                statusActive: translate(
                    "module.nextcloud_whiteboard.share_status_active",
                ),
                statusExpired: translate(
                    "module.nextcloud_whiteboard.share_status_expired",
                ),
                expiresAtLabel: translate(
                    "module.nextcloud_whiteboard.share_expires_at_label",
                ),
                expiredAtLabel: translate(
                    "module.nextcloud_whiteboard.share_expired_at_label",
                ),
                generateLink: translate(
                    "module.nextcloud_whiteboard.share_generate_link",
                ),
                close: translate("ui.reuse.close"),
                createFailed: translate(
                    "module.nextcloud_whiteboard.share_create_failed",
                ),
                copySuccess: translate(
                    "module.nextcloud_whiteboard.share_copy_success",
                ),
                copyFailed: translate(
                    "module.nextcloud_whiteboard.share_copy_failed",
                ),
                deleteFailed: translate(
                    "module.nextcloud_whiteboard.share_delete_failed",
                ),
            },
        });
    } catch (error) {
        reportError(error, "module.nextcloud_whiteboard.share_create_failed");
    }
}
