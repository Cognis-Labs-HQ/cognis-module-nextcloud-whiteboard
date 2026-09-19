# Scoped and Verifiable Whiteboard Integration

**Feature Branch:** feature-align-module-ownership-contract

## Use owner-tracked module contributions

Nextcloud Whiteboard now registers public capabilities and protected sharing-flow extensions through its scoped module context. Cognis can therefore enforce contribution ownership and remove every registration reliably when the module is disabled or uninstalled.

## Publish capabilities in the module namespace

All module-owned capability identifiers now use the `nextcloud-whiteboard:` prefix. The obsolete bootstrap reporting hook and direct access to the system context were removed, keeping cross-module cooperation within the current external-module contract.

## Declare protected integration explicitly

The manifest now requests privileged status because the module extends Cognis sharing flows. Official installations can be verified against their trusted source and packaged file hashes, while tests guard the namespace and privilege requirements.

## Commits

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
