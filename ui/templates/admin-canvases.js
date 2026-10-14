export function renderCanvasRows(
    rows,
    filter,
    label,
    escapeHtml,
    formatDateTime,
) {
    return (
        rows
            .filter(
                (row) =>
                    filter === "all" ||
                    (filter === "active"
                        ? row.activeUsers.length
                        : row.sourceId),
            )
            .map(
                (row) =>
                    `<tr><td>${escapeHtml(row.title)}<br><code>${escapeHtml(row.id)}</code></td><td>${escapeHtml(row.createdBy)}</td><td>${escapeHtml([row.sourceType, row.sourceId].filter(Boolean).join(": "))}</td><td>${escapeHtml(row.activeUsers.join(", "))}</td><td>${escapeHtml(formatDateTime(row.updatedAt))}</td><td><button type="button" class="btn-cancel" data-delete-canvas="${escapeHtml(row.id)}">${escapeHtml(label("delete"))}</button></td></tr>`,
            )
            .join("") ||
        `<tr><td colspan="6">${escapeHtml(label("empty"))}</td></tr>`
    );
}

export function renderCanvasTable(filter, label, escapeHtml) {
    return `<div id="whiteboard-admin-canvases"><div class="whiteboard-admin-filters">${["all", "active", "bound"].map((value) => `<button type="button" class="whiteboard-admin-filter-button" data-canvas-filter="${value}" aria-pressed="${value === filter}">${escapeHtml(label(value))}</button>`).join("")}</div><div class="users-table-wrap"><table class="users-table"><thead><tr>${["canvas", "owner", "source", "participants", "updated", "actions"].map((key) => `<th>${escapeHtml(label(key))}</th>`).join("")}</tr></thead><tbody></tbody></table></div></div>`;
}
