export function createWhiteboardPreflightController({
    fetchPreflight,
    getMountRoot,
    getResourceLoader,
    loadSocketIo,
    setOverlayVisible,
    showToast,
    translate,
}) {
    let status = "idle";

    async function verifyWebsocketAuth(result) {
        if (!result?.serverUrl || !result?.websocketAuthToken) return false;
        const runtime = await loadSocketIo(
            result.serverUrl,
            getResourceLoader(),
        );
        const io = runtime.io;
        return new Promise((resolve) => {
            const socket = io(result.serverUrl, {
                auth: { token: result.websocketAuthToken },
                transports: ["websocket"],
                reconnection: false,
                timeout: 5000,
            });
            const finish = (passed) => {
                socket.disconnect();
                runtime.dispose();
                resolve(passed);
            };
            const timer = window.setTimeout(() => finish(false), 5500);
            socket.on("connect", () => {
                window.clearTimeout(timer);
                finish(true);
            });
            socket.on("connect_error", () => {
                window.clearTimeout(timer);
                finish(false);
            });
        });
    }

    async function run() {
        if (status === "running") return false;
        status = "running";
        setOverlayVisible(
            getMountRoot(),
            true,
            translate("module.nextcloud_whiteboard.preflight_checking"),
        );
        let result;
        try {
            result = await fetchPreflight();
        } catch (error) {
            status = "failed";
            const message =
                error.code === "config_required"
                    ? translate(
                          "module.nextcloud_whiteboard.preflight_config_required",
                      )
                    : translate("module.nextcloud_whiteboard.preflight_failed");
            setOverlayVisible(getMountRoot(), true, message);
            showToast(message, { variant: "error" });
            return false;
        }
        if (!result?.alive) {
            status = "failed";
            const message = translate(
                "module.nextcloud_whiteboard.preflight_unreachable",
            );
            setOverlayVisible(getMountRoot(), true, message);
            showToast(message, { variant: "error" });
            return false;
        }
        const websocketAuthorized = await verifyWebsocketAuth(result).catch(
            () => false,
        );
        if (!websocketAuthorized) {
            status = "failed";
            const message = translate(
                "module.nextcloud_whiteboard.preflight_websocket_failed",
            );
            setOverlayVisible(getMountRoot(), true, message);
            showToast(message, { variant: "error" });
            return false;
        }
        status = "passed";
        return true;
    }

    return {
        getStatus: () => status,
        run,
        setStatus: (nextStatus) => {
            status = nextStatus;
        },
    };
}
