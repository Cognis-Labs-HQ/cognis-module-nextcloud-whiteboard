# Add canvas membership orchestration

**Feature Branch:** feature-add-membership-functions-for-ctx-capability

## Expose straightforward membership changes

Jitsi Meet and other orchestrators can now add or remove a canvas participant through the `whiteboard:membership` CTX capability using canonical actor and user account IDs. Only the canvas owner can make these changes, and the owner cannot remove their own access.

## Harden membership changes

Membership changes now initialize storage before access, reject hidden profiles, resolve the host's canonical profile identity capability at call time so its current registration and enablement state is honored, and report dependency failures without exposing internal details.

## Reuse canonical handle normalization

All API, access-control, and persistence paths now use the host profile identity capability for handle normalization. The duplicate module-native normalizer has been removed entirely.

## Commits

- [a5d8e7c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a5d8e7cc98565a24365e0e7f4faf42861c722c56)
- [972b573](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/972b573d595667a3cd6786327b13f3cf08a897d6)
- [ba1ec07](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ba1ec07cde8d4cdaceebdfc6295a3ed08c9eb33b)
- [a2ccce2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a2ccce25543b6b580960bfc71c6d2acf9daec9f0)
- [824bed8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/824bed8296198c32c69bc928130f7b93c1a56a6f)
