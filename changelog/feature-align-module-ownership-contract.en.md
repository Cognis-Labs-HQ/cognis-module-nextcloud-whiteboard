# Scoped and Verifiable Whiteboard Integration

**Feature Branch:** feature-align-module-ownership-contract

## Use owner-tracked module contributions

Nextcloud Whiteboard now registers public capabilities and protected sharing-flow extensions through its scoped module context. Cognis can therefore enforce contribution ownership and remove every registration reliably when the module is disabled or uninstalled.

## Publish capabilities in the module namespace

All module-owned capability identifiers now use the `nextcloud-whiteboard:` prefix. The obsolete bootstrap reporting hook and direct access to the system context were removed, keeping cross-module cooperation within the current external-module contract.

## Declare protected integration explicitly

The manifest now requests privileged status because the module extends Cognis sharing flows. Official installations can be verified against their trusted source and packaged file hashes, while tests guard the namespace and privilege requirements.

## Avoid duplicate registrations during enablement

Window spawning now has a single owner-tracked publisher, and sharing hooks are installed only once per scoped context. This prevents capability and flow conflicts from aborting module enablement.

## Reuse the file namespace after re-enablement

Enablement now probes the existing Whiteboard file namespace before attempting registration. A namespace retained by the Files gateway across disable and enable cycles is reused, while a fresh installation still registers it exactly once.

## Commits

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
- [577aea4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/577aea490c999d2385b9d10d6e3f2f3f0e301256)
- [55ecd5a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/55ecd5ade9a70ad7864e5fd9d73d27c7865f7ca1)
