# A polished whiteboard toolbar

**Feature Branch:** feature-update-canvas-toolbar-ui-elements

## Clear, theme-aware drawing controls

Replaced toolbar characters with consistent SVG icon files stored in `ui/reuse/assets/` that inherit light and dark theme colors, enlarged the rounded color picker, and placed the clear action beside the canvas title.

## Better text formatting

Added font family and size controls when the Text tool is active and balanced the floating text-format toolbar.

## Focused component canvases

Removed the new-whiteboard and history actions from whiteboards opened inside component windows.

## Live collaboration feedback

Object handles now use a pointer cursor. Remote selections are removed as soon as their objects are deleted, and collaborator badges distinguish active object interaction and typing.

## Restore clear-canvas confirmation

The clear button now uses stable delegated toolbar handling and a native button, ensuring its confirmation dialog opens reliably after toolbar refreshes.

## Accurate collaborative cursors and selection cleanup

Clearing the canvas or deleting an object now removes every matching local and remote selection. Canvas-native collaborator cursors update more frequently, switch between movement and typing states, and yield to live drawing, typing, and resizing labels.

## Commits

- [5359a44](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5359a44d3a62ae2e05175f96e4f1271802f54544)
- [4affd1e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4affd1ea400a8e2765418394c70af70997330fd8)
- [44cca91](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/44cca91a6dbf3e17f9a28e033e4dd0b9f7d8a631)
- [99ede14](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/99ede14d59284b809d724052c202396f9a810a94)
- [0e906e8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0e906e8b690c1274f9e3f0689cfbe5205a530097)
- [d7d09ed](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d7d09edc43bf57ef9fd16657aee467061ed1230d)
