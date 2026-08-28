# Fill the Whiteboard workspace

**Feature Branch:** feature-update-nextcloud-whiteboard-mount-layout

## Adopt the new mount layout

Nextcloud Whiteboard now uses the frameless, fixed-height page-composer layout so its canvas fills the available widget without nested content scrolling.

## Keep canvas overflow contained

The canvas stage no longer creates its own automatic scroll area, keeping drawing interactions aligned with the visible widget.

## Refine component windows

Component-mounted whiteboards retain collaborative pointer tracking while omitting the Share button. Their canvas grid is clamped to the parent height and assigns only the remaining space below the toolbar to the canvas, preventing vertical overflow while sharing controls remain on the full Whiteboard page.

## Use host-owned reusable resources

Whiteboard browser code now obtains shared utilities and styles through the `ui:reuse` capability. Obsolete module CSS and a redundant saved-elements wrapper were removed so Cognis remains the single owner of reusable UI behavior.

## Commits

- [1c5cd96](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/1c5cd967cfd773f0453ae41429dd37abacb5d046)
- [6bda211](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/6bda2116eb158add7b7d56caee3d8926dd58d7da)
- [cc3318c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/cc3318cda3855bec02fa96bd11056e19b5483f9a)
- [264d2b2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/264d2b2342fbf2c25b1b0e65146e9dbddd0f10c2)
- [f1bf36e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f1bf36e764fa022f7f59e405d697d4fcc0afc049)
- [23dd970](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/23dd970372c2f0d16e379e68cacb733f274ecf4a)
