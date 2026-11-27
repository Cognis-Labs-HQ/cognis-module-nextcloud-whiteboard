const ROLE_RANK = Object.freeze({
    guest: 0,
    user: 1,
    teacher: 1,
    moderator: 2,
    admin: 3,
    owner: 4,
});

export function hasMinRole(role, minRole) {
    return (ROLE_RANK[role] ?? -1) >= (ROLE_RANK[minRole] ?? Number.MAX_VALUE);
}

export async function readJson(request) {
    const chunks = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

export function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, { "content-type": "application/json" });
    response.end(JSON.stringify(payload));
}

export function sendError(response, statusCode, code, message, details = {}) {
    sendJson(response, statusCode, { error: { code, message, ...details } });
}
