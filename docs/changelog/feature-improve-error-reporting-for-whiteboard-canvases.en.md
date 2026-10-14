# Explicit whiteboard canvas load errors

**Feature Branch:** feature-improve-error-reporting-for-whiteboard-canvases

## Report canvas load failures clearly

Canvas session and rendering failures now display a specific message in the browser and include the canvas identifier and load stage in the developer console. Server-side snapshot failures return a safe, explicit API error and write structured diagnostic metadata to the server log.

## Commits

- [ad3b981](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ad3b9813ec42c3eb475d696854e42086726d42ec)
