# Nextcloud Whiteboard

**English** · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Collaborative whiteboards backed by Nextcloud and integrated with Cognis access controls. This repository is a self-contained Cognis external module.

## Get started

Install the module through the Module Marketplace or place it in the configured external modules directory. Enable it, open **Nextcloud Whiteboard Settings**, and configure the Whiteboard server URL, image upload limit, and shared API key.

Users can create and select boards at `/whiteboards`, then collaborate at `/whiteboard?id=<board-id>`. Owners can grant read or write access through the host share dialog.

## Contributor checks

```sh
npm install
npm run lint
npm test
npm run check:manifest
git diff --check
```

Read [`docs/standard.en.md`](docs/standard.en.md) for configuration, capabilities, routes, security boundaries, and operational guidance.
