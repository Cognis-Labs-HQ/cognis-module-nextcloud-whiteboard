# Nextcloud Whiteboard module

The Nextcloud Whiteboard module gives Cognis users a native collaborative drawing surface backed by a standalone Nextcloud Whiteboard Socket.IO server. Cognis owns configuration, authorization, persistence, sharing, and the user interface; the external server only transports authorized realtime scene updates.

## Usage examples

**Configure the service**

Enable the module, open **Nextcloud Whiteboard Settings**, and provide:

- **Whiteboard Server URL**, such as `https://whiteboard.example.com:3002`;
- **Image upload limit**, in bytes, where `0` disables pasted-image uploads; and
- **API key**, a shared secret of at least 16 characters used to sign short-lived session tokens.

Saving the settings validates the values and registers the server origin for the required browser connections. Use `cognisctl nextcloud-whiteboard:ping` to verify readiness and `cognisctl nextcloud-whiteboard:whiteboards` to list boards as an administrator.

**Open and share a board**

Users open `/whiteboards` to create or select a board and `/whiteboard?id=<board-id>` to work on it. Add `instantCanvas=1` to use the compact integration canvas. The toolbar supports selection, freehand drawing, shapes, arrows, text, erasing, undo and redo, colors, stroke widths, image paste, board history, renaming, and clearing.

Owners can open the host share popup from the toolbar and grant read or write access. Account recipients can open the board directly; link recipients resolve through the host share flows and receive only the capabilities granted by the share.

Persistent canvas membership is controlled only through the public `whiteboard:membership` CTX capability. Its `add` and `remove` functions accept a canvas ID plus canonical actor and user account IDs, authorize the canvas owner, and update one participant at a time.

**Integrate through capabilities**

Resolve public capabilities from `ctx` instead of hard-coding another component's routes or importing its internals:

```js
const getEmbedUrl = ctx.getCapability("whiteboard:getEmbedUrl");
const fetchBoardData = ctx.getCapability("whiteboard:fetchBoardData");
const spawnWhiteboardWindow = ctx.getCapability(
    "nextcloud-whiteboard:spawnWhiteboardWindow",
);

const url = getEmbedUrl(boardId, { instantCanvas: true });
const board = await fetchBoardData(boardId);
await spawnWhiteboardWindow({ whiteboardId: board.id });
```

`getEmbedUrl` returns `null` without a board ID. The asynchronous capabilities reject when the module API is unavailable or the caller cannot access the requested board.

## Technical specification

### Architecture and lifecycle

`bootstrap.js` registers the UI and API, contributes public capabilities, and extends `bootstrap-platform`. The UI uses the host page composer and router while the API owns board metadata, snapshots, presence, configuration, and session creation. Enabling registers `/whiteboards`, `/whiteboard`, static assets, navigation, APIs, capabilities, and share-flow hooks; disabling removes the module-scoped registrations.

The browser receives a short-lived JWT for one authorized board and connects directly to the configured Socket.IO endpoint. The administrator API key remains server-side. Scene snapshots are stored in Cognis so boards can recover after reconnecting, while Socket.IO distributes live updates and presence.

### Configuration and validation

The manifest declares `serverUrl`, `imageUploadMaxBytes`, and `apiKey` preferences with localized labels. The server URL must be an HTTP or HTTPS URL. The upload limit is normalized to a non-negative number. A supplied API key must contain at least 16 characters; an omitted key during an update preserves the stored secret. Invalid fields produce safe validation responses without exposing internal errors.

The preflight endpoint checks configuration, HTTP reachability, and websocket authorization before a canvas session starts. The enable-test endpoint is administrator-only and reports whether required dependencies and the external service are usable.

### Authorization and sharing

All board operations authenticate through `auth:requireAuth`. Owners can rename boards and manage their participant allow-list. Participants receive access according to their stored role. Profile handles are normalized before comparison, and hidden profiles are not implicitly exposed.

The module extends `mint-share-token`, `resolve-share-token`, `construct-share-page`, and `revoke-share-token` when those host flows exist. It validates the resource before authorizing a minter, rejects share guests attempting to create or revoke shares, resolves only `whiteboard` resources, and uses the host share renderer contract for link pages.

### API routes

Routes are rooted at `/api/v1/modules/nextcloud-whiteboard`:

- `GET` and `POST /config` read and update administrator configuration.
- `GET /ping` reports module readiness.
- `POST /admin/enable-test` performs the administrator enablement check.
- `GET /whiteboards` lists accessible boards; administrator scope can list all boards.
- `POST /whiteboards/spawn` creates a board, while `GET /whiteboards/launch` resolves launch data.
- `POST /whiteboards/preflight` checks the external server before connection.
- `GET /whiteboards/session` authorizes a board and returns connection data.
- `POST /whiteboards/elements` persists a scene snapshot.
- `GET` and `POST /whiteboards/presence` read and update participant presence.
- `POST /whiteboards/rename` renames an owned board.
- `GET` and `POST /whiteboards/images` retrieve and upload namespaced images.
- `GET`, `POST`, and `POST /share/delete` list, create, and delete board access entries.

Boundary validation limits request sizes, normalizes identifiers, and authorizes before business logic. Unavailable dependencies return a service-unavailable response; operational failures are logged with safe structured metadata.

### Persistence and realtime behavior

Cognis stores configuration, boards, access entries, presence, and snapshots through the `db:executor` capability. Uploaded images use a module namespace obtained through the files capabilities. Board IDs and tokens use cryptographically secure generators; generated values never use `Math.random`.

The client reconnects with bounded delay, suspends realtime work while its tab is hidden, merges scene versions, persists non-transient changes, and updates presence independently. Image uploads obey the configured byte limit. Cleanup disconnects sockets, observers, event handlers, and canvas resources when the page unmounts.

### Security and operational constraints

Deploy the standalone whiteboard server over HTTPS in production and protect the shared API key as a secret. The configured origin must be reachable by both Cognis and users' browsers. Reverse proxies must allow websocket upgrades. Clock synchronization is required because session JWTs expire.

Use only the public `ctx` capabilities and flows listed in the manifest. Do not import Cognis gateway or adapter internals, expose the API key to browser code, bypass the host router, or construct unauthenticated module API calls. Regenerate `manifest.files` after every packaged-file change and keep all four documentation and locale variants synchronized.
