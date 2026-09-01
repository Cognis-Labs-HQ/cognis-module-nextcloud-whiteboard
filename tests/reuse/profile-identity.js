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
};
