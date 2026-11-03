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
                        id: "step1",
                        selector: ".whiteboard-overlay-board-list",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.step1.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.step1.body",
                    },
                    {
                        id: "step2",
                        selector: "#whiteboard-toolbar",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.step2.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.step2.body",
                    },
                    {
                        id: "step3",
                        selector: ".whiteboard-canvas-stage",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.step3.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.step3.body",
                    },
                    {
                        id: "step4",
                        selector: ".whiteboard-save-state",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.step4.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvas.step4.body",
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
                        id: "step1",
                        selector: ".whiteboard-admin-filters",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvases.step1.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvases.step1.body",
                    },
                    {
                        id: "step2",
                        selector: "#whiteboard-admin-canvases",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvases.step2.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.canvases.step2.body",
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
                        id: "step1",
                        selector: "#module-nextcloud-whiteboard",
                        titleKey:
                            "module.nextcloud-whiteboard.tutorial.more.configuration.step1.title",
                        bodyKey:
                            "module.nextcloud-whiteboard.tutorial.more.configuration.step1.body",
                    },
                ],
                scope: "#module-nextcloud-whiteboard",
            },
        ],
        minRole: "admin",
    },
];
