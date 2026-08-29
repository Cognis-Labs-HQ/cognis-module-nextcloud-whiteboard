# Secure delegated Whiteboard access for meeting guests

**Feature Branch:** feature-add-delegated-access-support-to-whiteboard

## Validate meeting shares without broadening their scope

Whiteboard guests may now use a validated meeting share only when Jitsi confirms its meeting-to-whiteboard association and explicitly permits the requested read or write operation. The Share gateway still validates the original meeting grant and never converts it into a general whiteboard share.

## Keep API route ownership focused

Configuration routes now live in their own API-layer module, while the main registration file retains clear spacing between imports, UI registrations, and exported functions.

## Commits

- [36613f8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/36613f8aee20aaf968045f9939af5e74010e4de7)
