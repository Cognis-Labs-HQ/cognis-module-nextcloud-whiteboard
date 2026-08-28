# Smoother live whiteboard collaboration

**Feature Branch:** feature-improve-canvas-object-resizing-and-cursor-tracking

## Objects mirror when resized across an axis

Dragging a resize handle beyond the opposite edge now mirrors object content instead of restoring its previous orientation.

## Faster cursors without request flooding

Cursor updates now appear near real time while bounded throttling and batched presence refreshes keep network traffic controlled.

## In-progress objects stay visible

Collaborators can now see text while it is still being entered, as well as shapes while they are being drawn.

## Coordinates remain aligned during rapid edits

Canvas sizing no longer rewrites shared object coordinates, preventing collaborators from accumulating different offsets during fast concurrent changes.

## Standard canvases restore their border

Opening a normal whiteboard now explicitly disables borderless and frameless component presentation, replacing any layout state left by a previous meeting.

## Component windows no longer alter the page shell

Whiteboard component windows now leave the page composer's borderless shell mode disabled and rely on their host window for framing, so SPA navigation cannot carry the meeting appearance into another page.

## Commits

- [c0e93b3](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c0e93b392d2aa3ffcc90fdcff149c1cff6fca293)
- [9b08604](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/9b0860479c280d624734d9415327517ea59926a5)
- [a64b94c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a64b94c3ffd36d56d3f4355d18476b932bd05053)
- [93d0d8a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/93d0d8aa5fcdc7c89eae71208dfada5a6f2d40f4)
- [bdc7b97](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/bdc7b97b510fdd96c816be51df907f7358cb6332)
