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
