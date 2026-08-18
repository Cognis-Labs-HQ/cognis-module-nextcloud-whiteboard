const ROLE_RANK = Object.freeze({ guest: 0, user: 1, teacher: 1, moderator: 2, admin: 3, owner: 4 });
const accessTokens = new Map();

export function hasMinRole(role, minRole) {
  return (ROLE_RANK[role] ?? -1) >= (ROLE_RANK[minRole] ?? Number.MAX_VALUE);
}

export function issueAccessToken(subject, role = 'user', options = {}) {
  const token = crypto.randomUUID();
  accessTokens.set(token, { sub: subject, role, ...options });
  return token;
}

export function requireAuth(req, res, minRole = 'user') {
  const authorization = String(req?.headers?.authorization ?? '');
  const token = authorization.replace(/^Bearer\s+/i, '');
  const claims = accessTokens.get(token) ?? req?.auth ?? null;
  if (!claims || !hasMinRole(claims.role, minRole)) {
    res.writeHead(claims ? 403 : 401, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: claims ? 'forbidden' : 'unauthorized' }));
    return null;
  }
  return claims;
}

export async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

export function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'content-type': 'application/json' });
  res.end(JSON.stringify(payload));
}

export function sendError(res, statusCode, code, message, details = {}) {
  sendJson(res, statusCode, { error: { code, message, ...details } });
}
