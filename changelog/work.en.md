# Add canvas membership orchestration

**Feature Branch:** work

## Expose straightforward membership changes

Jitsi Meet and other orchestrators can now add or remove a canvas participant through the `whiteboard:membership` CTX capability using canonical actor and user account IDs. Only the canvas owner can make these changes, and the owner cannot remove their own access.

## Commits

- [37f900e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/37f900e5b2fd7b4234755e851d29e822311ef076)
