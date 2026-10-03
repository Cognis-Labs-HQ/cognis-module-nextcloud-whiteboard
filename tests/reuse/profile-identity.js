export const testProfileIdentity = {
    normalizeHandleKey(handle) {
        return String(handle ?? "")
            .trim()
            .replace(/^@+/, "")
            .toLowerCase();
    },
    normalizeHandleKeys(values) {
        return Array.from(
            new Set(
                (Array.isArray(values) ? values : [])
                    .map((value) => this.normalizeHandleKey(value))
                    .filter(Boolean),
            ),
        );
    },
    async resolveAccountHandle(accountId) {
        return this.normalizeHandleKey(
            String(accountId).replace(/^account:/, ""),
        );
    },
    async resolveAccountId(handle) {
        const normalizedHandle = this.normalizeHandleKey(handle);
        return normalizedHandle ? `account:${normalizedHandle}` : null;
    },
};
