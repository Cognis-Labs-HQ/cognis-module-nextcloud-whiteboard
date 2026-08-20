const accessTokens = new Map();

export function issueAccessToken(subject, role = "user", options = {}) {
    const token = `test-${accessTokens.size + 1}`;
    accessTokens.set(token, { sub: subject, role, ...options });
    return token;
}

export function requireTestAuth(req, res) {
    const token = String(req?.headers?.authorization ?? "").replace(
        /^Bearer\s+/i,
        "",
    );
    const claims = accessTokens.get(token) ?? null;
    if (!claims) {
        res.writeHead(401, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "unauthorized" }));
    }
    return claims;
}
