# Smooth Saved Status Reclamation

**Feature Branch:** feature-fix-saved-space-reclamation

## Reclaim the hidden Saved label space

The Saved confirmation now collapses its text track, padding, and spacing as it fades. The success tick returns smoothly to the toolbar edge instead of leaving an invisible label-sized gap.

## Preserve localized label animation

The Saved text is wrapped in an overflow-safe animated track so labels in every supported language expand and collapse without clipping adjacent controls.

## Commits

- [b622ea5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b622ea5b9fcc7b978a1287b68c9e96aeff3b1b9d)
