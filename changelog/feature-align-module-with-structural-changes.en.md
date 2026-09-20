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

## Use one capability namespace consistently

The internal module API, enablement test, window spawning, embedding, board verification, membership, deletion, and browser gateway now all use the `whiteboard:` capability namespace. Module IDs, route paths, flow-hook IDs, and CLI command names remain `nextcloud-whiteboard` because they identify the module rather than its capability contract.

## Keep previous Whiteboards inside the panel

The previous-Whiteboards list now owns the remaining start-panel row and scrolls vertically at every list size. Minimum grid sizing and clipped panel overflow keep board rows inside the rounded panel even in short component windows, while a stable scrollbar gutter prevents horizontal layout shifts.

## Remove the redundant history popup

The start panel already presents every previous Whiteboard as a directly selectable row, so the duplicate Whiteboard History button and its non-interactive popup have been removed. The active-canvas toolbar no longer exposes the same dead-end popup, eliminating the undefined popup capability error and its unused code, strings, styles, and icons.

## Restore Jitsi Whiteboard verification

The module now publishes the declared `whiteboard:fetchBoardData` and `whiteboard:membership` capabilities directly from its initialized API instance. The manifest also declares its enablement-test and window-spawning contributions. The module no longer publishes or looks up the undeclared `whiteboard:api` implementation facade, which could interrupt bootstrap before Jitsi Meet could discover the verification provider.

## Show more saved Whiteboards

The saved-Whiteboard list can now grow to twice its previous maximum height before vertical scrolling begins, making more recent boards visible at once while preserving bounded overflow in shorter windows.

## Commits

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
- [577aea4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/577aea490c999d2385b9d10d6e3f2f3f0e301256)
- [55ecd5a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/55ecd5ade9a70ad7864e5fd9d73d27c7865f7ca1)
- [b622ea5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b622ea5b9fcc7b978a1287b68c9e96aeff3b1b9d)
- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
- [554d48f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/554d48fcd21fb08f5c08c9f902e011047bb0c8f5)
- [7c2d0f1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7c2d0f1f067ff7b81985168133645d6863b790cc)
- [434d564](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/434d56417a6526813f6e6a5942c0e84f0d725c53)
- [b34069a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b34069ab3c09a29b4916517aee8e0fb757abcba4)
- [27a12c2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/27a12c2eacbf2354bd02a58818bcd158fdc88210)
- [20350c7](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/20350c7fb16536c0a795cb1bd8c4f4b88239848f)
- [17a3387](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/17a3387f0845b0dfd067d10f8ae45d5cea6cc8c6)
