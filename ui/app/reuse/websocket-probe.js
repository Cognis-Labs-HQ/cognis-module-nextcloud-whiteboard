/** The provider owns transport setup, timeout and cancellation. */
export function probeWebsocketAuthorization(
    runtime,
    result,
    { signal, timeoutMs = 5500 } = {},
) {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            runtime.dispose();
            resolve(false);
            return;
        }
        let socket;
        try {
            socket = runtime.io(result.serverUrl, {
                auth: { token: result.websocketAuthToken },
                transports: ["websocket"],
                reconnection: false,
                timeout: 5000,
            });
        } catch (error) {
            runtime.dispose();
            reject(error);
            return;
        }
        let finished = false;
        let timer;
        const onAbort = () => finish(false);
        const finish = (passed) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            signal?.removeEventListener("abort", onAbort);
            socket.removeAllListeners();
            socket.disconnect();
            runtime.dispose();
            resolve(passed);
        };
        timer = setTimeout(() => finish(false), timeoutMs);
        signal?.addEventListener("abort", onAbort, { once: true });
        socket.on("connect", () => finish(true));
        socket.on("connect_error", () => finish(false));
    });
}
