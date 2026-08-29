# Secure delegated Whiteboard access for meeting guests

**Feature Branch:** work

## Validate meeting shares without broadening their scope

Whiteboard guests may now use a validated meeting share only when Jitsi confirms its meeting-to-whiteboard association and explicitly permits the requested read or write operation. The Share gateway still validates the original meeting grant and never converts it into a general whiteboard share.

## Commits

- [7071266](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7071266c0fe1c836292431d0f41344bfa9a58f7f)
