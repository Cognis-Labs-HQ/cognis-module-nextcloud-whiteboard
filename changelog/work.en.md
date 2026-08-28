# Reliable installation and pre-enablement configuration

**Feature Branch:** work

## Configuration is available before enablement

Nextcloud Whiteboard no longer declares hard gateway dependencies that can prevent its configuration routes from loading while the module is disabled. Runtime integrations continue to use the declared Cognis capabilities.

## Complete integrity inventory

The packaged file inventory now includes the contributor instructions, preventing a missing-checksum integrity warning during enablement.

## Preserve the contributor-instructions symlink

The contributor instructions remain linked to the canonical repository instructions while the manifest tooling follows that valid file link to generate and validate its integrity checksum.

## Commits

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)
