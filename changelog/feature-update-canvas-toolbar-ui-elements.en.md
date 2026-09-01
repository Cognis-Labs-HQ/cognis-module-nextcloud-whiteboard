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

## Stable saved-status layout

The toolbar now permanently reserves the translated Saved pill width, so its confirmation animation no longer shifts neighboring controls.

## Viewport-sized canvas

The whiteboard grid and card now clamp to the smaller of their parent space and the available dynamic viewport height. The canvas no longer creates document scrolling and remains navigable through its infinite panning surface.

## Composer-owned viewport sizing

Removed all module styling of page-shell elements. The whiteboard now requests bounded content scrolling through its page composer payload, allowing the host to size the canvas to the offered viewport.

## Commits

- [5359a44](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5359a44d3a62ae2e05175f96e4f1271802f54544)
- [4affd1e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4affd1ea400a8e2765418394c70af70997330fd8)
- [44cca91](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/44cca91a6dbf3e17f9a28e033e4dd0b9f7d8a631)
- [99ede14](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/99ede14d59284b809d724052c202396f9a810a94)
- [0e906e8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0e906e8b690c1274f9e3f0689cfbe5205a530097)
- [d7d09ed](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d7d09edc43bf57ef9fd16657aee467061ed1230d)
- [e80c294](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/e80c2945c9cced41d4b17faed29aef817b3455d8)
- [4c190bf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4c190bf57de58f5f23972b1fa56feeb53d590bfa)
- [16bb05b](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/16bb05b5270c657c48d8a275358c8e60a072e8e9)
