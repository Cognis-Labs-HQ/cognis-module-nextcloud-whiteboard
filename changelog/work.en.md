# Reliable installation and pre-enablement configuration

**Feature Branch:** work

## Configuration is available before enablement

Nextcloud Whiteboard no longer declares hard gateway dependencies that can prevent its configuration routes from loading while the module is disabled. Runtime integrations continue to use the declared Cognis capabilities.

## Installable integrity inventory

The packaged file inventory now covers installable regular files and excludes repository-only links that the module installer cannot download.

## Preserve the contributor-instructions symlink

The contributor instructions remain linked to the canonical repository instructions, while the downloadable module inventory deliberately excludes the repository-only link.

## Install without requesting repository symlinks

The downloadable manifest now excludes the contributor-instructions symlink because repository file APIs do not expose it as an installable module file. The symlink remains unchanged in the repository.

## Commits

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)

- [69f81cf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/69f81cf0d45b915e02ccb51c2747ea42cb5f4bbf)
