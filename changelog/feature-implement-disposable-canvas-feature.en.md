# Disposable canvases and dependable saving

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

Whiteboard navigation and connection preflight behavior now live in focused modules, keeping the main application entry readable without compressing or removing meaningful whitespace.
