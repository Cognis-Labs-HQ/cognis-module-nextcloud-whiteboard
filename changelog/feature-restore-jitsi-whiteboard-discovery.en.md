# Restore Whiteboard Discovery in Meetings

**Feature Branch:** feature-restore-jitsi-whiteboard-discovery

## Publish the browser gateway once

Nextcloud Whiteboard now declares `whiteboard:uiGateway` through one dedicated capability provider. The navbar no longer claims or imports the same provider, preventing the owner-protected UI registry from encountering a duplicate registration.

## Restore the Jitsi Meet control

Jitsi Meet can reliably load the Whiteboard canvas factory after its backend detects the namespaced server capabilities, restoring the Whiteboard button and shared-canvas creation in meeting windows.

## Commits

- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
