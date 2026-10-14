# Isolate canvas integrations and lifecycle work

**Feature Branch:** feature-scoped-whiteboard-contract-cleanup

## Public presentation contract

The browser resolves `whiteboard:uiGateway` from the host-initialized ctx. `createCanvas({title, participantHandles})` and `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` return `{whiteboardId}`. `requestCanvasPage({signal})` returns the host component-page descriptor; `openCanvas({whiteboardId, elementId, signal})` returns its window handle. The caller supplies its own mount target and discards the returned handle on teardown. Whiteboard owns route identity, presentation flags, transport tokens and disposal semantics; integrations must not reconstruct these details. Each mount requires its exact canvas ID.

## Owned actions and reliable cleanup

Enabled asynchronous store actions execute owned `nextcloud-whiteboard:*` flows with `initialize-store` and `execute-action` stages through ctx. Missing results and inactive flows fail explicitly. Disabled configuration uses the injected store directly because the host does not register disabled module flows. Authentication and validation precede mutations; internal store calls preserve transactions. Board deletion and full cleanup share a child-first table catalog, and full cleanup rolls back on failure.

Navigation cancels transport probes and pending scene callbacks. Stale session and script responses cannot reopen a departed canvas. Probes release sockets, listeners, timers and script handles after success, failure or cancellation. Page-composer styles remain host-owned.

## Revision-aware browser entries

Whiteboard versions its registered browser entry URLs with the installed package revision from its manifest. Provider and canvas entries therefore receive new URLs after a Whiteboard update even when the Cognis build is unchanged. Browser contract tests link the actual local module graphs and reject missing named exports before release. Reload an already open page after updating an enabled module so its browser context uses the new provider.

## Keep infinite canvas navigation local

Embedded canvases use a borderless composer viewport with content scrolling disabled. Middle-button dragging moves only the local viewport and does not publish scene changes, persist snapshots or alter synchronization status.

## Fit the embedded canvas to its host

Embedded canvas size containment prevents the drawing bitmap’s previous height from expanding the borderless component window. The toolbar and canvas share the actual host height without cropping or vertical scrolling. A Chromium regression checks mounting with an oversized bitmap and repeated container resizing. No Jitsi-specific or page-shell styles are required.

## Pass embedded layout through the component-page contract

`openCanvas` now sets `borderless: true` on the top-level component-page spawn request. Layout flags nested in canvas context were ignored by the host broker, leaving the nested page without fill-parent sizing and collapsing the contained canvas. Context now contains only the canvas identity and mode. Gateway tests verify the public request and returned borderless handle; the Chromium regression invokes the real gateway and renderer through a nested standards-mode mount.

## Template contributor standard

Synchronize AGENTS.md with the external-module template while retaining domain-specific rules. Adopt the canonical release-note location and preserve historical content and permanent module identity.

## Standard structure and owned integration

Synchronize template guidance, domain route paths, localized integration documentation, executable structure checks and final package digests. Keep existing public URLs and module identity. Browser contributions follow their owning host lifecycle contracts.

## Cognis and provider artwork

Replace the marketplace banner with a Cognis + provider composition, keeping its branding within the central visible band and preserving the existing icon.

## Consistent marketplace descriptions

Use short action summaries and concrete feature descriptions across marketplace metadata, keeping localized meanings aligned.

## Canvas administration and source ownership

Administration → Whiteboards lists every canvas with owner, source binding, active users and update time. All, Active and Integration canvases pill filters narrow the list. Administrator deletion requires confirmation and revokes canvas shares before deleting saved snapshots, presence, participant access and user copies. Access tokens are never returned in the administration listing. `whiteboard:sourceBinding` exposes `bind` and `release` with `{whiteboardId, actorAccountId, sourceType, sourceId}`. Only the canvas owner can change its binding; a conditional update rejects another source with `source_conflict`, and repeated claims by the same source succeed. Release matches the exact source, including cleanup of historical duplicate references. These operations use registered store flows. Integrations provide their own source identifiers without reading Whiteboard persistence or rendering internals.

## Scoped browser actions and authoritative administration

Canvas source changes and deletion also permit administrators verified through the public `auth:accountStore` contract. Deletion revokes every share owner’s canvas shares before removing canvas records. Registered server action names use camel case after the immutable module prefix.

## Reusable canvas references

Release 2.3.157 — `createCanvas` and `createDisposableCanvas` accept a generic `resourceType` and `resourceId`. Supplying both resolves one stored canvas reference; repeated and concurrent requests return the same authorized canvas without resetting its contents or membership. The database enforces uniqueness of the reference key. An existing canvas with a different disposal mode is a conflict, and unauthorized callers cannot reuse it. Omitting the reference when creating a persistent canvas creates a new independent canvas. Deleting a canvas removes its reference, permitting later recreation.

## Direct Whiteboard pages without a navigation entry

Release 2.3.158 — Whiteboards no longer contributes a navigation-menu link. The protected `/whiteboards` gallery and `/whiteboard` canvas URLs, canvas presentation gateway, administration section and searchable page/canvas entries remain available. The navbar plugin owns only its search index and removes it on teardown.

## Generic missing-canvas recovery

Release 2.3.159 — Provider board metadata exposes a neutral resourceReference containing resourceType and resourceId. Integrations use this public identity without knowing storage mechanics. Deletion releases the stored reference key; a subsequent authorized create-or-resolve request supplies a blank replacement. A signed-in standalone page receiving an actual not_found session response can create a replacement under a generic canvas reference, load it once and update its active ID and URL. Shared/embedded views do not independently create replacements. Permission and service failures propagate, and a repeated missing response does not trigger a retry loop. Successful recovery shows a toast; provider resolution is logged without credentials.

## Commits

- [b78213e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b78213eb77660d59c9bac3aafe2dfd2677a488b0)
- [a42cff8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a42cff8c865ae0388fd3ded03d2e957e9ff5dd3e)
- [a79203e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a79203ed13a22bfe77ae59c32efe5b43b331c559)
- [c818b40](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c818b40db5010cb220cb54ffd23bc45940539f44)
- [05e253c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/05e253c37054f54197c4f79511f722ef96df4631)
- [6ea9026](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/6ea902628f55686585e8f709ff0ddf79a1632a83)
- [080abb5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/080abb5cb88fee15491b2ef17787dfb7226890c3)
- [0db0f41](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0db0f410182c2c8d897360bc818e670ae391130e)
- [bd1f069](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/bd1f069c5bc597469c0b06cc7377ab4b837d6902)
- [b35f85d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b35f85daa2fd905fa6cf4efe2c1fc092f5c7bee5)
- [c8ecbc2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c8ecbc2fb2c8471a95302e9c92aea69f767e7501)
- [569cdc2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/569cdc2e3296f1d665b75bff1240f6738e084deb)
- [f90735c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f90735ca73e8df6644171083dd07f24e2d544515)
