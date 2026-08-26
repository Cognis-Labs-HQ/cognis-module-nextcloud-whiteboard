# Smoother live whiteboard collaboration

## Objects mirror when resized across an axis

Dragging a resize handle beyond the opposite edge now mirrors object content instead of restoring its previous orientation.

## Faster cursors without request flooding

Cursor updates now appear near real time while bounded throttling and batched presence refreshes keep network traffic controlled.

## In-progress objects stay visible

Collaborators can now see text while it is still being entered, as well as shapes while they are being drawn.

## Coordinates remain aligned during rapid edits

Canvas sizing no longer rewrites shared object coordinates, preventing collaborators from accumulating different offsets during fast concurrent changes.
