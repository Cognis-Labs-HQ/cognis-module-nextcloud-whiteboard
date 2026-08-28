# Reliable whiteboard restoration after reconnecting

**Feature Branch:** feature-fix-whiteboard-canvas-refresh-issue

## Restore the shared canvas immediately after a refresh

Participants who rejoin an embedded multi-participant whiteboard now request the current scene from connected peers, so existing objects render without waiting for another participant to edit or select them. Every connected peer can answer the synchronization request, and peers send the merged scene back when they receive a new edit so canvases recover even if the initial response is missed.

## Commits

- [c706dc0](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c706dc04e59c0a0f9b316b41f5d672bafc404966)
- [89fce71](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/89fce716329e2cbf7a26ac7a09a04fd0551a086b)
