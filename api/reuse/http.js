const ROLE_RANK = Object.freeze({ guest: 0, user: 1, teacher: 1, moderator: 2, admin: 3, owner: 4 });

export function hasMinRole(role, minRole) {
  return (ROLE_RANK[role] ?? -1) >= (ROLE_RANK[minRole] ?? Number.MAX_VALUE);
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
