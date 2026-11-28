export function debounce(callback, delay) {
    let timer = null;
    const run = (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
    run.cancel = () => {
        clearTimeout(timer);
        timer = null;
    };
    return run;
}

export function throttleLatest(callback, delay) {
    let timer = null;
    let lastArgumentsList = null;
    const run = (...args) => {
        if (!timer) {
            callback(...args);
        } else {
            lastArgumentsList = args;
            return;
        }
        timer = setTimeout(() => {
            timer = null;
            if (lastArgumentsList) {
                const pendingArgumentsList = lastArgumentsList;
                lastArgumentsList = null;
                callback(...pendingArgumentsList);
            }
        }, delay);
    };
    run.cancel = () => {
        clearTimeout(timer);
        timer = null;
        lastArgumentsList = null;
    };
    return run;
}

export async function loadSocketLibrary(serverUrl, resourceLoader) {
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
    return { io: io, dispose: () => resource?.dispose?.() };
}

export function encodeSyncMessage(type, payload = {}) {
    return new TextEncoder().encode(JSON.stringify({ type, payload }));
}

export function encodeSceneMessage(type, elements, { transient = false } = {}) {
    return encodeSyncMessage(type, { elements, transient });
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
