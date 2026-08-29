# Secure delegated access for Whiteboard guests

**Feature Branch:** feature-add-delegated-access-support-to-whiteboard

## Validate delegated shares without broadening their scope

Whiteboard guests may use delegated access only when the Share gateway validates the source share, its provider-owned resource association, and the requested read or write operation. The delegated contract must echo the exact Whiteboard resource and capability, so it cannot become a broader Whiteboard share.

## Keep API route ownership focused

Configuration routes now live in their own API-layer module, while the main registration file retains clear spacing between imports, UI registrations, and exported functions.

## Commits

- [a94759f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a94759fa84f286554fc8eaf35b09e084dd6924c0)
