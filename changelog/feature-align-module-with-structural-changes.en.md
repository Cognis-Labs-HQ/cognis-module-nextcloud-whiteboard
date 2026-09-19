# Align Whiteboard with Structural Changes

**Feature Branch:** feature-align-module-with-structural-changes

## Use owner-tracked module contributions

Nextcloud Whiteboard now registers public capabilities and protected sharing-flow extensions through its scoped module context. Cognis can therefore enforce contribution ownership and remove every registration reliably when the module is disabled or uninstalled.

## Publish the stable Whiteboard gateway contract

Server integrations now continue to use the established `whiteboard:` capability namespace, including `whiteboard:fetchBoardData`, `whiteboard:membership`, and `whiteboard:deleteCanvas`. This matches the documented module API and restores Jitsi Meet mapping verification and membership synchronization.

## Declare cross-namespace publication explicitly

Cognis now requires privilege when a module publishes outside its module-ID namespace. The manifest therefore requests privilege specifically to preserve the established shared `whiteboard:` gateway contract; capability registration remains owner-tracked through the scoped module context.

## Avoid duplicate registrations during enablement

Window spawning now has a single owner-tracked publisher, and sharing hooks are installed only once per scoped context. This prevents capability and flow conflicts from aborting module enablement.

## Reuse the file namespace after re-enablement

Enablement now probes the existing Whiteboard file namespace before attempting registration. A namespace retained by the Files gateway across disable and enable cycles is reused, while a fresh installation still registers it exactly once.

## Reclaim the hidden Saved label space

The Saved confirmation now collapses its text track, padding, and spacing as it fades. The success tick returns smoothly to the toolbar edge instead of leaving an invisible label-sized gap.

## Preserve localized label animation

The Saved text is wrapped in an overflow-safe animated track so labels in every supported language expand and collapse without clipping adjacent controls.

## Publish the browser gateway once

Nextcloud Whiteboard now declares `whiteboard:uiGateway` through one dedicated capability provider. The navbar no longer claims or imports the same provider, preventing the owner-protected UI registry from encountering a duplicate registration.

## Restore the Jitsi Meet control

Jitsi Meet can reliably load the Whiteboard canvas factory after its backend detects the namespaced server capabilities, restoring the Whiteboard button and shared-canvas creation in meeting windows.

## Commits

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
- [577aea4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/577aea490c999d2385b9d10d6e3f2f3f0e301256)
- [55ecd5a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/55ecd5ade9a70ad7864e5fd9d73d27c7865f7ca1)
- [b622ea5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b622ea5b9fcc7b978a1287b68c9e96aeff3b1b9d)
- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
- [554d48f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/554d48fcd21fb08f5c08c9f902e011047bb0c8f5)
- [7c2d0f1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7c2d0f1f067ff7b81985168133645d6863b790cc)
