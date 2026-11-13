# Verified guest access

**Feature Branch:** `feature-verified-guest-admission`

## Verified guest access

Resource routes obtain verified guest claims through `share:getGuestClaims` before checking the exact board and read/write capability. Image, presence, session and launch requests retain these checks, including delegated access. Account and management routes require an ordinary account session. A `share:` account-name prefix does not identify a guest. Install the host Share credential-admission contract before enabling this module update.

## Read-only transport and shared readiness

Whiteboard session tokens now enforce the resolved write permission at the realtime server. Shared canvases obtain their authorized board session before probing websocket readiness with that same scoped token. They do not invoke account-only global preflight; ordinary account preflight and management restrictions remain unchanged.

## Commits

- [7c5b43f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7c5b43fd1cd3129e55f4c79b278b068d2be6c25c)
- [f9f8964](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f9f896488c44628f14cfc80b44b7a5324b000def)
