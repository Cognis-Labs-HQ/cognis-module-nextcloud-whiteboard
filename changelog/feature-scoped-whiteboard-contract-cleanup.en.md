# Isolate canvas integrations and lifecycle work

**Feature Branch:** feature-scoped-whiteboard-contract-cleanup

## Public presentation contract

The browser resolves `whiteboard:uiGateway` from the host-initialized ctx. `createCanvas({title, participantHandles})` and `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` return `{whiteboardId}`. `requestCanvasPage({signal})` returns the host component-page descriptor; `openCanvas({whiteboardId, elementId, signal})` returns its window handle. The caller supplies its own mount target and discards the returned handle on teardown. Whiteboard owns route identity, presentation flags, transport tokens and disposal semantics; integrations must not reconstruct these details. Each mount requires its exact canvas ID.

## Owned actions and reliable cleanup

Enabled asynchronous store actions execute owned `nextcloud-whiteboard:*` flows with `initialize-store` and `execute-action` stages through ctx. Missing results and inactive flows fail explicitly. Disabled configuration uses the injected store directly because the host does not register disabled module flows. Authentication and validation precede mutations; internal store calls preserve transactions. Board deletion and full cleanup share a child-first table catalog, and full cleanup rolls back on failure.

Navigation cancels transport probes and pending scene callbacks. Stale session and script responses cannot reopen a departed canvas. Probes release sockets, listeners, timers and script handles after success, failure or cancellation. Page-composer styles remain host-owned.

## Revision-aware browser entries

Whiteboard versions its registered browser entry URLs with the installed package revision from its manifest. Provider and canvas entries therefore receive new URLs after a Whiteboard update even when the Cognis build is unchanged. Browser contract tests link the actual local module graphs and reject missing named exports before release. Reload an already open page after updating an enabled module so its browser context uses the new provider.

## Commits

- [b78213e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b78213eb77660d59c9bac3aafe2dfd2677a488b0)
- [a42cff8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a42cff8c865ae0388fd3ded03d2e957e9ff5dd3e)
