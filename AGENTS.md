# Cognis external module contributor instructions

Run `npm install` before development and `npm test`, `npm run check:manifest`, and `git diff --check` before committing.

Keep the root external-module contract (`manifest.json`, `package.json`, `routes.json`, `bootstrap.js`) intact. Preserve the UUID forever, bump the module version for every change, synchronize package and manifest versions, use only repository-relative runtime imports, and regenerate `manifest.files` with `npm run manifest:hashes` after every file change.

Use `ctx` capabilities and flows for all cross-component integration. Never import Cognis internals. Keep API, UI, CLI, documentation, and assets in their named directories. Put reusable layer-local code in `reuse/`, not `utils/`, `helpers/`, `common/`, or `shared/`.

Use the repository Prettier configuration: four-space indentation, double quotes in JavaScript, and trailing commas for multiline arrays and objects. Avoid tabs and trailing whitespace. Never wrap imports in `try`/`catch`. Validate at boundaries, authorize before business logic, avoid internal error details, and log failures with safe structured metadata. UI strings belong in all four XML locale files. Browser navigation must use the host router rather than page reloads.
