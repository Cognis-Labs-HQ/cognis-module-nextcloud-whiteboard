# Reliable installation and pre-enablement configuration

**Feature Branch:** feature-fix-module-enablement-errors

## Configuration is available before enablement

Nextcloud Whiteboard keeps its required Cognis core components separate from external-module dependencies, allowing Cognis to apply the correct lifecycle rules to each dependency type.

## Installable integrity inventory

The packaged file inventory now covers installable regular files and excludes repository-only links that the module installer cannot download.

## Preserve the contributor-instructions symlink

The contributor instructions remain linked to the canonical repository instructions, while the downloadable module inventory deliberately excludes the repository-only link.

## Install without requesting repository symlinks

The downloadable manifest now excludes the contributor-instructions symlink because repository file APIs do not expose it as an installable module file. The symlink remains unchanged in the repository.

## Align dependency metadata with Cognis

Core component UUIDs remain in `requires`, while the new `hardDependencies` and `softDependencies` fields explicitly declare that Nextcloud Whiteboard has no external-module installation dependencies.

## Use save feedback space only while visible

The Saved pill no longer reserves toolbar space while hidden. It enters the layout for its confirmation animation and is removed again when the animation finishes.

## Save only real canvas changes

Selection-only clicks no longer emit a content-change event, so clicking an unchanged canvas does not trigger persistence or Saved feedback.

## Keep in-flight drawings remote-only

Drawing drafts are marked as transient collaboration updates and rendered in a separate remote-draft layer. They are excluded from saved snapshots and peer snapshot responses, preventing creators from seeing a returned ghost of their own object.

## Keep collaboration previews temporary

Live moves, resizes, and text edits now remain in the remote preview layer instead of entering the persistent scene. Abandoned drawing previews are cancelled when possible and expire automatically after a disconnected collaborator stops updating them.

## Organize canvas application functions

Canvas toolbar behavior now lives in a focused module, and remote-selection normalization is grouped in a reusable whiteboard layer instead of relying on oversized application files.

## Show only the latest collaborative edit

When another collaborator edits an object that is already selected, the live preview now replaces the stable rendering of that object. The canvas no longer draws both the selected starting state and the in-flight edit at the same time.

## Restore application section spacing

Blank lines once again separate the whiteboard application’s top-level controller setup and functions, preserving the established readable structure after the recent refactor.

## Commits

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)

- [69f81cf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/69f81cf0d45b915e02ccb51c2747ea42cb5f4bbf)

- [608dbd1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/608dbd18c9b362450d603f7e5d73585b22bf031d)

- [0098018](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0098018a714ce03e75bd4e6dc92fe06dd9db35f9)

- [0a66697](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0a66697637c4d93eca95eac47297787c08726320)

- [aa53f27](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/aa53f276825ec86376d4dbf74f830a72d1e0aff5)

- [80cedb5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/80cedb5613263ea332575a3976c7b01b609d3cc6)

- [4cfcaa0](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4cfcaa0911c15083d23d2ca3bfb286dc1ff7788d)
