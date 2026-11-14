export const guides = [
    {
        owner: "module.nextcloud-whiteboard.pages",
        definitions: [
            {
                id: "canvas",
                page: ({ pathname }) => /^\/whiteboards?$/.test(pathname),
                titleKey:
                    "module.nextcloud.whiteboard.tutorial.more.canvas.title",
                steps: [
                    {
                        highlightNext: false,
                        id: "choose-a-board",
                        selector: ".whiteboard-start-panel",
                        when: ({ targetAvailable }) => targetAvailable,
                        interaction: "target",
                        advance: {
                            event: "click",
                            accept: (event) =>
                                Boolean(
                                    event.target.closest(
                                        "#whiteboard-start-new, .whiteboard-overlay-board",
                                    ),
                                ),
                        },
                        titleKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.choose.a.board.title",
                        bodyKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.choose.a.board.body",
                    },
                    {
                        highlightNext: true,
                        id: "canvas-ready",
                        selector:
                            '.whiteboard-canvas-wrap[data-canvas-ready="true"] .whiteboard-save-state',
                        when: ({ completed, targetAvailable }) =>
                            completed.includes("choose-a-board") ||
                            targetAvailable,
                        missing: { timeoutMs: 5000, action: "retry" },
                        titleKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.connection.title",
                        bodyKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.connection.body",
                    },
                    {
                        highlightNext: true,
                        id: "drawing-tools",
                        selector:
                            '.whiteboard-canvas-wrap[data-canvas-ready="true"][data-can-write="true"] .whiteboard-drawing-tools',
                        when: ({ targetAvailable }) => targetAvailable,
                        titleKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.drawing.tools.title",
                        bodyKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.drawing.tools.body",
                    },
                    {
                        highlightNext: true,
                        id: "canvas-and-history",
                        selector:
                            '.whiteboard-canvas-wrap[data-canvas-ready="true"] #whiteboard-canvas',
                        dependsOn: ["drawing-tools"],
                        titleKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.canvas.and.history.title",
                        bodyKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.canvas.and.history.body",
                    },
                    {
                        highlightNext: true,
                        id: "read-only-navigation",
                        selector:
                            '.whiteboard-canvas-wrap[data-canvas-ready="true"][data-can-write="false"] #whiteboard-canvas',
                        when: ({ targetAvailable }) => targetAvailable,
                        titleKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.read.only.title",
                        bodyKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.read.only.body",
                    },
                    {
                        highlightNext: true,
                        id: "saving-and-sharing",
                        selector:
                            '.whiteboard-canvas-wrap[data-canvas-ready="true"] :is(#whiteboard-save-copy, #whiteboard-share-slot button)',
                        targetMatch: "first",
                        when: ({ targetAvailable }) => targetAvailable,
                        titleKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.saving.and.sharing.title",
                        bodyKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvas.saving.and.sharing.body",
                    },
                ],
                scope: ".whiteboard-canvas-wrap",
            },
        ],
    },
    {
        owner: "module.nextcloud-whiteboard.admin",
        definitions: [
            {
                id: "canvases",
                page: "/administration",
                titleKey:
                    "module.nextcloud.whiteboard.tutorial.more.canvases.title",
                steps: [
                    {
                        highlightNext: true,
                        id: "find-canvases",
                        selector: ".whiteboard-admin-filters",
                        titleKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvases.find.canvases.title",
                        bodyKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvases.find.canvases.body",
                    },
                    {
                        highlightNext: true,
                        id: "deletion-review",
                        selector: "button[data-delete-canvas]:not(:disabled)",
                        targetMatch: "first",
                        titleKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvases.deletion.review.title",
                        bodyKey:
                            "module.nextcloud.whiteboard.tutorial.more.canvases.deletion.review.body",
                    },
                ],
                scope: "#whiteboard-admin-canvases",
            },
            {
                id: "configuration",
                page: "/administration",
                titleKey:
                    "module.nextcloud.whiteboard.tutorial.more.configuration.title",
                steps: [
                    {
                        highlightNext: true,
                        id: "connection-and-limits",
                        selector: "form.whiteboard-admin",
                        titleKey:
                            "module.nextcloud.whiteboard.tutorial.more.configuration.connection.and.limits.title",
                        bodyKey:
                            "module.nextcloud.whiteboard.tutorial.more.configuration.connection.and.limits.body",
                    },
                ],
                scope: "#module-nextcloud-whiteboard",
            },
        ],
        minRole: "admin",
    },
];
