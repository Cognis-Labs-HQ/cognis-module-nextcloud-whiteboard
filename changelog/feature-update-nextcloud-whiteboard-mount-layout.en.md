# Fill the Whiteboard workspace

## Adopt the new mount layout

Nextcloud Whiteboard now uses the frameless, fixed-height page-composer layout so its canvas fills the available widget without nested content scrolling.

## Keep canvas overflow contained

The canvas stage no longer creates its own automatic scroll area, keeping drawing interactions aligned with the visible widget.

## Refine component windows

Component-mounted whiteboards retain collaborative pointer tracking while omitting the Share button. Their canvas grid is clamped to the parent height and assigns only the remaining space below the toolbar to the canvas, preventing vertical overflow while sharing controls remain on the full Whiteboard page.

## Use host-owned reusable resources

Whiteboard browser code now obtains shared utilities and styles through the `ui:reuse` capability. Obsolete module CSS and a redundant saved-elements wrapper were removed so Cognis remains the single owner of reusable UI behavior.
