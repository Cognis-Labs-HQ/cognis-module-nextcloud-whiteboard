export const guides = [
    {
        owner: "module.nextcloud-whiteboard.pages",
        definitions: [
            {
                id: "canvas",
                page: ({ pathname }) => /^\/whiteboards?$/.test(pathname),
                titleKey:
                    "module.nextcloud-whiteboard.tutorial.more.canvas.title",
                steps: [
                    {
                        id: "choose-a-board",
                        selector: ".whiteboard-overlay-board-list",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.choose.a.board.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.choose.a.board.body",
                    },
                    {
                        id: "drawing-tools",
                        selector: "#whiteboard-toolbar",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.drawing.tools.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.drawing.tools.body",
                    },
                    {
                        id: "canvas-and-history",
                        selector: ".whiteboard-canvas-stage",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.canvas.and.history.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.canvas.and.history.body",
                    },
                    {
                        id: "saving-and-sharing",
                        selector: ".whiteboard-save-state",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.saving.and.sharing.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.saving.and.sharing.body",
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
                    "module.nextcloud-whiteboard.tutorial.more.canvases.title",
                steps: [
                    {
                        id: "find-canvases",
                        selector: ".whiteboard-admin-filters",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvases.find.canvases.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvases.find.canvases.body",
                    },
                    {
                        id: "deletion-review",
                        selector: "#whiteboard-admin-canvases",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvases.deletion.review.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvases.deletion.review.body",
                    },
                ],
                scope: "#whiteboard-admin-canvases",
            },
            {
                id: "configuration",
                page: "/administration",
                titleKey:
                    "module.nextcloud-whiteboard.tutorial.more.configuration.title",
                steps: [
                    {
                        id: "connection-and-limits",
                        selector: "#module-nextcloud-whiteboard",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.configuration.connection.and.limits.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.configuration.connection.and.limits.body",
                    },
                ],
                scope: "#module-nextcloud-whiteboard",
            },
        ],
        minRole: "admin",
    },
];
