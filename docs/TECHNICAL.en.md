# Technical Reference

Public interfaces, configuration and lifecycle of Whiteboard.

## Interfaces

The Nextcloud Whiteboard module gives Cognis users a native collaborative drawing surface backed by a standalone Nextcloud Whiteboard Socket.IO server. Cognis owns configuration, authorization, persistence, sharing, and the user interface; the external server only transports authorized realtime scene updates.

### Provider-owned presentation and action flows

The browser resolves `whiteboard:uiGateway` from the host-initialized ctx. `createCanvas({resourceType, resourceId, title, participantHandles})` and `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` return `{whiteboardId}`. `requestCanvasPage({signal})` returns the host component-page descriptor; `openCanvas({whiteboardId, elementId, signal})` returns its window handle. The caller supplies its own mount target and discards the returned handle on teardown. Whiteboard owns route identity, presentation flags, transport tokens and disposal semantics; integrations must not reconstruct these details. Each mount requires its exact canvas ID. The provider requests borderless presentation at the top level of the host spawn contract; canvas context carries only identity and mode.

Enabled asynchronous store actions execute owned `nextcloud-whiteboard:*` flows with `initialize-store` and `execute-action` stages through ctx. Missing results and inactive flows fail explicitly. Disabled configuration uses the injected store directly because the host does not register disabled module flows. Authentication and validation precede mutations; internal store calls preserve transactions. Board deletion and full cleanup share a child-first table catalog, and full cleanup rolls back on failure.

Navigation cancels transport probes and pending scene callbacks. Stale session and script responses cannot reopen a departed canvas. Probes release sockets, listeners, timers and script handles after success, failure or cancellation. Page-composer styles remain host-owned.

Whiteboard versions its registered browser entry URLs with the installed package revision from its manifest. Provider and canvas entries therefore receive new URLs after a Whiteboard update even when the Cognis build is unchanged. Browser contract tests link the actual local module graphs and reject missing named exports before release. Reload an already open page after updating an enabled module so its browser context uses the new provider.

Embedded canvases use a borderless composer viewport with content scrolling disabled. The embedded surface isolates its intrinsic canvas size so the toolbar and drawing area fit the host, including after the meeting window shrinks or expands. Middle-button dragging moves only the local viewport and does not publish scene changes, persist snapshots or alter synchronization status.

### API routes

Routes are rooted at `/api/v1/modules/nextcloud-whiteboard`:

- `GET` and `PUT` / `DELETE /config` read and update administrator configuration.
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
- `GET /share`, `POST /share`, and `POST /share/delete` list, create, and delete board access entries.

Boundary validation limits request sizes, normalizes identifiers, and authorizes before business logic. Unavailable dependencies return a service-unavailable response; operational failures are logged with safe structured metadata.

## Configuration

The module manifest declares its supported settings and dependencies. Configure only the owning module or its declared authentication adapter through Administration; enabled and disabled entrypoints follow the manifest.

### Configuration and validation

The manifest declares `serverUrl`, `imageUploadMaxBytes`, and `apiKey` preferences with localized labels. The server URL must be an HTTP or HTTPS URL. The upload limit is normalized to a non-negative number. A supplied API key must contain at least 16 characters; an omitted key during an update preserves the stored secret. Invalid fields produce safe validation responses without exposing internal errors.

The preflight endpoint checks configuration, HTTP reachability, and websocket authorization before a canvas session starts. The enable-test endpoint is administrator-only and reports whether required dependencies and the external service are usable.

### Declared administrator fields

| Key                   | Type       |
| --------------------- | ---------- |
| `serverUrl`           | `string`   |
| `imageUploadMaxBytes` | `number`   |
| `apiKey`              | `password` |

## Behavior

### Architecture and lifecycle

`bootstrap.js` registers the UI and API, contributes public capabilities, and extends `bootstrap-platform`. The UI uses the host page composer and router while the API owns board metadata, snapshots, presence, configuration, and session creation. Enabling registers `/whiteboards`, `/whiteboard`, static assets, navigation, APIs, capabilities, and share-flow hooks; disabling removes the module-scoped registrations.

The browser receives a short-lived JWT for one authorized board and connects directly to the configured Socket.IO endpoint. The administrator API key remains server-side. Scene snapshots are stored in Cognis so boards can recover after reconnecting, while Socket.IO distributes live updates and presence.

### Persistence and realtime behavior

Cognis stores configuration, boards, access entries, presence, and snapshots through the `db:executor` capability. Uploaded images use a module namespace obtained through the files capabilities. Board IDs and tokens use cryptographically secure generators; generated values never use `Math.random`.

The client reconnects with bounded delay, suspends realtime work while its tab is hidden, merges scene versions, persists non-transient changes, and updates presence independently. Image uploads obey the configured byte limit. Cleanup disconnects sockets, observers, event handlers, and canvas resources when the page unmounts.

### Canvas integration lifecycle

The browser provider publishes `whiteboard:uiGateway` only from `mountProvider(ctx)`. Its `nextcloud-whiteboard:requestCanvasPage`, `openCanvas`, `createCanvas` and `createDisposableCanvas` flows execute through the scoped UI context. Disable aborts pending creation and rejects stale gateway handles; re-enable remounts the same cached provider. The embedded canvas markup lives under `ui/templates/` and its sizing is verified in Chromium/CDP without Playwright.

### Canvas administration and source ownership

Administration → Whiteboards lists every canvas with owner, source binding, active users and update time. All Canvases, Active Canvases and Troubled Canvases pill filters narrow the list. Administrator deletion requires confirmation and revokes canvas shares before deleting saved snapshots, presence, participant access and user copies. Access tokens are never returned in the administration listing. `whiteboard:sourceBinding` exposes `bind` and `release` with `{whiteboardId, actorAccountId, sourceType, sourceId}`. Only the canvas owner can change its binding; a conditional update rejects another source with `source_conflict`, and repeated claims by the same source succeed. Release matches the exact source, including cleanup of historical duplicate references. These operations use registered store flows. Integrations provide their own source identifiers without reading Whiteboard persistence or rendering internals.

Canvas source changes and deletion also permit administrators verified through the public `auth:accountStore` contract. Deletion revokes every share owner’s canvas shares before removing canvas records. Registered server action names use camel case after the immutable module prefix.

### Direct Whiteboard pages without a navigation entry

Whiteboards does not contributes a navigation-menu link. The protected `/whiteboards` gallery and `/whiteboard` canvas URLs, canvas presentation gateway, administration section and searchable page/canvas entries remain available. The navbar plugin owns only its search index and removes it on teardown.

### Generic missing-canvas recovery

Provider board metadata exposes a neutral resourceReference containing resourceType and resourceId. Integrations use this public identity without knowing storage mechanics. Deletion releases the stored reference key; a subsequent authorized create-or-resolve request supplies a blank replacement. A signed-in standalone page receiving an actual not_found session response can create a replacement under a generic canvas reference, load it once and update its active ID and URL. Shared/embedded views do not independently create replacements. Permission and service failures propagate, and a repeated missing response does not trigger a retry loop. Successful recovery shows a toast; provider resolution is logged without credentials.

Canvas administration offers All Canvases, Active Canvases and Troubled Canvases, each with its own empty message. The troubled view lists canvases with missing owners or owner access, incomplete source bindings, or duplicate generic source bindings or resource references. Small issue pills explain each problem. Diagnostics use only Whiteboard-owned data; administration still requires administrator access and never returns canvas credentials.

Canvas implementation lives in `api/canvas/` and `ui/canvas/` with short filenames such as `source-binding.js`, `events.js` and `snapshot.js`. The runtime enablement probe is `api/configuration/enablement.js`; unit tests remain in `api/tests/`. Shared-page entries use the same revision-qualified asset resolver as ordinary routes. Administration excludes inactive presence and returns `invalid_json` for malformed deletion requests. A single authorized canvas at a canonical resource path receives an immutable reference assignment without changing its contents; ambiguous paths produce a conflict and a Troubled Canvases issue instead of selecting a record.

### Page Guides

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

The canvas deletion explanation highlights the displayed Delete control. The first usable target is selected inside the tutorial section and the step is skipped when no matching control is available.

The shared host provides queued floating actions. First visits offer Next/Finish without Cancel or Skip; replays offer Skip before the last visible step. Restart Tutorial appears after the first visible step. Completion survives content updates. Explicit highlightNext flags enable only a breathing animation for explanatory steps; reduced motion disables it. Each stage highlights a distinct rendered control in UI order. Guides stay bound to the current view, handle empty and optional states, and release their resources on navigation or owner removal.

On the Whiteboard homepage, choose New Board or a saved board. This deliberate action starts the drawing branch, which waits for the owner to finish loading the canvas. Only then do the drawing tools, canvas/history and save/share explanations appear. Next without opening a board bypasses that branch; an already open canvas starts directly with the tools. Hidden or failed-loading canvases never qualify as ready.

The administration configuration guide keeps the host section as its discovery boundary and highlights the module-rendered form containing the server URL, API key and upload limit. Composer layout identifiers are not tutorial targets.

## Security

Board owners and stored access entries govern reading, editing and sharing. The external server key stays server-side; the browser receives a short-lived board session credential. Websocket origins and proxy upgrades must match the configured service. Client diagnostics use ui:log with safe error names, while failure feedback remains localized.

### Authorization and sharing

All board operations authenticate through `auth:requireAuth`. Owners can rename boards and manage their participant allow-list. Participants receive access according to their stored role. Profile handles are normalized before comparison, and hidden profiles are not implicitly exposed.

The module extends `mint-share-token`, `resolve-share-token`, `construct-share-page`, and `revoke-share-token` when those host flows exist. It validates the resource before authorizing a minter, rejects share guests attempting to create or revoke shares, resolves only `whiteboard` resources, and uses the host share renderer contract for link pages.

### Security and operational constraints

Deploy the standalone whiteboard server over HTTPS in production and protect the shared API key as a secret. The configured origin must be reachable by both Cognis and users' browsers. Reverse proxies must allow websocket upgrades. Clock synchronization is required because session JWTs expire.

Use only the public `ctx` capabilities and flows listed in the manifest. Do not import Cognis gateway or adapter internals, expose the API key to browser code, bypass the host router, or construct unauthenticated module API calls. Regenerate `manifest.files` after every packaged-file change and keep all four documentation and locale variants synchronized.

## Reference

- [manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/blob/HEAD/manifest.json)
- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/blob/HEAD/bootstrap.js)
- [Cognis](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/modules/external/TECHNICAL.en.md)

### Reusable canvas references

`createCanvas` and `createDisposableCanvas` accept a generic `resourceType` and `resourceId`. Supplying both resolves one stored canvas reference; repeated and concurrent requests return the same authorized canvas without resetting its contents or membership. The database enforces uniqueness of the reference key. An existing canvas with a different disposal mode is a conflict, and unauthorized callers cannot reuse it. Omitting the reference when creating a persistent canvas creates a new independent canvas. Deleting a canvas removes its reference, permitting later recreation.

### Naming validation

`npm test` checks binding names with the local syntax-tree detector, including bootstrap, scripts, tests and fixtures. Parsing errors fail validation. The detector regression fixtures cover declarations, parameters, private members, TypeScript assertions and legitimate type-only names. See the [host naming standard](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.en.md#binding-names) for the shared policy.
