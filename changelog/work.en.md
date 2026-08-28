# Reliable installation and pre-enablement configuration

**Feature Branch:** work

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

## Commits

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)

- [69f81cf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/69f81cf0d45b915e02ccb51c2747ea42cb5f4bbf)

- [608dbd1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/608dbd18c9b362450d603f7e5d73585b22bf031d)
