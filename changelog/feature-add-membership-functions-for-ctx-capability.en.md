# Add canvas membership orchestration

**Feature Branch:** feature-add-membership-functions-for-ctx-capability

## Expose straightforward membership changes

Jitsi Meet and other orchestrators can now add or remove a canvas participant through the `whiteboard:membership` CTX capability using canonical actor and user account IDs. Only the canvas owner can make these changes, and the owner cannot remove their own access.

## Harden membership changes

Membership changes now initialize storage before access, reject hidden profiles, resolve the host's canonical profile identity capability at call time so its current registration and enablement state is honored, and report dependency failures without exposing internal details.

## Commits

- [a5d8e7c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a5d8e7cc98565a24365e0e7f4faf42861c722c56)
- [972b573](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/972b573d595667a3cd6786327b13f3cf08a897d6)
- [ba1ec07](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ba1ec07cde8d4cdaceebdfc6295a3ed08c9eb33b)
