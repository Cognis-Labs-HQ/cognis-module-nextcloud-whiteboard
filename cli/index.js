export function registerCommands({ register, apiGet }) {
    register(
        "modules:nextcloud-whiteboard:ping",
        async ({ apiBaseUrl, getApiToken }) => {
            return apiGet(
                apiBaseUrl,
                "/api/v1/modules/nextcloud-whiteboard/ping",
                await getApiToken(),
            );
        },
        {
            usage: "cognisctl modules:nextcloud-whiteboard:ping",
            description:
                "Check whether the Nextcloud Whiteboard module is ready.",
        },
    );

    register(
        "modules:nextcloud-whiteboard:whiteboards",
        async ({ apiBaseUrl, getApiToken }) => {
            return apiGet(
                apiBaseUrl,
                "/api/v1/modules/nextcloud-whiteboard/whiteboards?scope=all",
                await getApiToken(),
            );
        },
        {
            usage: "cognisctl modules:nextcloud-whiteboard:whiteboards",
            description: "List all Nextcloud Whiteboards for administrators.",
        },
    );
}
