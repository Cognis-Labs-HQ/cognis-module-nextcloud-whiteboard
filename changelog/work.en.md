# Explicit whiteboard canvas load errors

**Feature Branch:** work

## Report canvas load failures clearly

Canvas session and rendering failures now display a specific message in the browser and include the canvas identifier and load stage in the developer console. Server-side snapshot failures return a safe, explicit API error and write structured diagnostic metadata to the server log.

## Commits

- [141506e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/141506e1140bc4817934f073ae3f66db5fca5c04)
