# Disposable canvases and dependable saving

**Feature Branch:** feature-implement-disposable-canvas-feature

## Disposable meeting canvases

Integrated callers can open disposable canvases that remain temporary unless an individual user presses Save.

## Multi-user saved copies

Regular canvases now create and refresh a saved copy for every member, while revoked share copies are removed.

## Clearer canvas home and save status

The home card grows for additional canvases and scrolls after four, while the status light confirms saves with an animated tick and Saved pill.

## Meeting integration gateway

The global browser UI gateway now lets meeting integrations create or resolve a disposable synchronized canvas without depending on another module’s HTTP routes.

## Compatible UI capability registration

The Whiteboard gateway now uses the canonical browser capability contribution API without causing a deferred-login runtime error or generic error popup.

## Whiteboard gateway provider discovery

The Whiteboard navbar entry now declares its browser capability so the host provider loader imports the gateway before Jitsi binds its optional Whiteboard button.

## Open embedded disposable canvases

Component windows now consume their supplied focus state and immediately open the requested disposable canvas instead of showing the Whiteboard home view.

## Element-targeted component windows

Element-targeted component mounts now stay frameless and wait for the focused disposable canvas to open before reporting the component page as ready.

## Protected component lifecycle

Whiteboard component mounts now honor the host navigation policy and return an idempotent destroy handle for the protected component-window lifecycle.

## Prepared meeting canvas handoff

The browser gateway now retains the disposable canvas it prepared, allowing the component mount to recover the exact canvas when a host supplies wrapped or incomplete focus context.

## Route-safe component cleanup

Component cleanup now detaches its abort listener, ignores stale mount handles, and clears Whiteboard mount state before Cognis completes discardAll-driven SPA navigation.

## Route-scoped direct entry

The Whiteboard browser entry now performs an automatic direct mount only on /whiteboard and /whiteboards, preventing component imports on other pages from mounting into an unrelated host root.

## Compact canvas toolbar

The canvas toolbar now scrolls its drawing tools in narrow component windows while pinning save state in view, and disposable changes always reveal a highlighted Save button until stored.

## Wrapped toolbar and private disposable canvases

Compact toolbars now wrap controls into available rows instead of scrolling horizontally. Disposable canvases render Save immediately, keep it visible while dirty, and omit sharing controls.

## One synchronized canvas for every saved member

Manual and automatic saves now store the complete collaborative canvas as its canonical snapshot. Everyone reopening a shared canvas receives that same current content, while disposable saves update only the copies of members who have chosen to save.

## Conflict-safe collaboration and undo

Concurrent saves are now serialized so one participant cannot overwrite another participant’s changes. Undo and redo also publish newer element revisions, and disposable session controls refresh as soon as session metadata is available.

## Maintainable application modules

Whiteboard navigation and connection preflight behavior now live in focused modules. The main application entry preserves clear blank lines between every top-level function and remains readable without compressed formatting.

## Commits

- [456de64](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/456de64983b6986869dfa66094e4b7bcdd48cfcc)
- [1a7f5f6](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/1a7f5f6f12268886a79afb3c51ed4f2b966b282d)
- [f033368](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f03336872aee142eac55cdea8c92d71a42de3755)
- [8778738](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8778738e12e864855d02f8f99076fca7504b1b22)
- [2cfb57e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/2cfb57e1ef85ef9dcdce0caeeecb7405b7a01a12)
- [7458d9e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7458d9ec32920a361d12e38c0c08b3cf571d6857)
- [71c41ad](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/71c41ad6a516a09c3c5c3e0454391ed63335c29b)
- [946d0dc](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/946d0dc64258f227c718b6627f54bdb4346aa1a6)
- [f822dbe](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f822dbe74798c2a8811cf59ffb8b410c1887cff8)
- [02841fd](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/02841fda50435799a91e4ebc97d2c192aa168247)
- [3f7a212](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3f7a2127625a9b60edc21eac8e0924544da1b6d6)
- [407852f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/407852fcfefdb72fc5c0d28d41a8889bd039b450)
- [4a69ab1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4a69ab19d181394dd8d96815ed0387cb03d756e0)
- [96a577d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96a577d1c4200e82ddf46f3be484bd972c8d57fb)
- [a55768d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a55768d1b367d662b84254069a682fd94d3a88ad)
- [b38fef2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b38fef2316dd81957f95542ceef74e5fcb7d0cee)
