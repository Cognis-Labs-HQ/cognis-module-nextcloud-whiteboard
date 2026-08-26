export function debounce(callback, delay) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
}

export function throttleLatest(callback, delay) {
    let timer = null;
    let lastArgs = null;
    return (...args) => {
        if (!timer) {
            callback(...args);
        } else {
            lastArgs = args;
            return;
        }
        timer = setTimeout(() => {
            timer = null;
            if (lastArgs) {
                const pendingArgs = lastArgs;
                lastArgs = null;
                callback(...pendingArgs);
            }
        }, delay);
    };
}

export async function loadSocketIo(serverUrl, resourceLoader) {
    if (typeof resourceLoader?.loadScript !== "function") {
        throw new Error("Whiteboard runtime loader unavailable");
    }
    const origin = new URL(serverUrl).origin;
    const resource = await resourceLoader.loadScript({
        id: "nextcloud-whiteboard:socket-io",
        src: `${origin}/socket.io/socket.io.js`,
        globalName: "io",
    });
    const io = resource?.value ?? resource?.global ?? window.io;
    if (typeof io !== "function") {
        resource?.dispose?.();
        throw new Error("Whiteboard runtime unavailable");
    }
    return { io, dispose: () => resource?.dispose?.() };
}

export function encodeSyncMessage(type, payload = {}) {
    return new TextEncoder().encode(JSON.stringify({ type, payload }));
}

export function encodeSceneMessage(type, elements) {
    return encodeSyncMessage(type, { elements });
}

export function decodeSceneMessage(payload) {
    const text =
        typeof payload === "string"
            ? payload
            : new TextDecoder().decode(
                  payload instanceof Uint8Array
                      ? payload
                      : new Uint8Array(payload),
              );
    return JSON.parse(text);
}
