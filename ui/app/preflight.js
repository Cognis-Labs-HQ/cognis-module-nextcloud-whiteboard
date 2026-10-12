import { probeWebsocketAuthorization } from "./reuse/websocket-probe.js";

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
    let requestSequence = 0;

    async function run({ signal } = {}) {
        if (status === "running") return false;
        if (signal?.aborted) return false;
        const sequence = ++requestSequence;
        const root = getMountRoot();
        const isCurrent = () =>
            !signal?.aborted &&
            sequence === requestSequence &&
            getMountRoot() === root;
        status = "running";
        setOverlayVisible(
            getMountRoot(),
            true,
            translate("module.nextcloud_whiteboard.preflight_checking"),
        );
        let result;
        try {
            result = await fetchPreflight({ signal });
            if (!isCurrent()) return false;
        } catch (error) {
            if (!isCurrent()) return false;
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
        let websocketAuthorized = false;
        try {
            const runtime = await loadSocketIo(
                result.serverUrl,
                getResourceLoader(),
            );
            if (!isCurrent()) {
                runtime.dispose();
                return false;
            }
            websocketAuthorized = await probeWebsocketAuthorization(
                runtime,
                result,
                { signal },
            );
        } catch (error) {
            if (!isCurrent()) return false;
            console.error(
                "[nextcloud-whiteboard] Websocket preflight failed.",
                { errorName: error?.name },
            );
        }
        if (!isCurrent()) return false;
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
            if (nextStatus === "idle") requestSequence += 1;
        },
    };
}
