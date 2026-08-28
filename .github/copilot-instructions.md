# Cognis external module contributor instructions

Run `npm install` before development and `npm test`, `npm run check:manifest`, and `git diff --check` before committing.

Keep the root external-module contract (`manifest.json`, `package.json`, `routes.json`, `bootstrap.js`) intact. Preserve the UUID forever, bump the module version for every change, synchronize package and manifest versions, use only repository-relative runtime imports, and regenerate `manifest.files` with `npm run manifest:hashes` after every file change.

Publish the module-owned locale bundle through `ui.stringsBaseUrl` in `manifest.json`, and keep that URL aligned with the module's static language directory.

Use `ctx` capabilities and flows for all cross-component integration. Never import Cognis internals. Keep API, UI, CLI, documentation, and assets in their named directories. Put reusable layer-local code in `reuse/`, not `utils/`, `helpers/`, `common/`, or `shared/`.

Use the repository Prettier configuration: four-space indentation, double quotes in JavaScript, and trailing commas for multiline arrays and objects. Avoid tabs and trailing whitespace. Never wrap imports in `try`/`catch`. Validate at boundaries, authorize before business logic, avoid internal error details, and log failures with safe structured metadata. UI strings belong in all four XML locale files. Browser navigation must use the host router rather than page reloads.

### Changelog entries

Store changelog entries under `changelog/` (one shared directory for all changelog files) instead of a root `CHANGELOG.md`.

Every pull request change must add changelog files for that PR in every supported app language (de, en, id, ja). Use the filename pattern `<branch-name-without-copilot-prefix>.<lang>.md` for each language (for example, branch `copilot/cleanup-strings-and-codebase` produces `cleanup-strings-and-codebase.en.md`, `cleanup-strings-and-codebase.de.md`, `cleanup-strings-and-codebase.id.md`, and `cleanup-strings-and-codebase.ja.md`).

Changelog entry structure is mandatory:

- `# ...` — changelog title (release summary title)
- `## ...` — one change point per heading (these are shown as dot-point summary items in release popups)
- body content under each `##` — full details shown on the changelogs page only

Translate each file into the language it represents — do not copy English text into non-English files (the same exceptions listed under i18n apply: brand names, universal technical acronyms, and the Latin tagline are language-neutral).

Do not append to or recreate a global monolithic changelog file. Existing changelog entry files in `changelog/` are historical records and should remain immutable except for factual corrections.

Every implementation commit whose work is described by the current pull request's changelog must ensure that the changelog's commit list links the immediately preceding implementation commit. When a user requests this provenance update immediately before implementation, finish the work with a dedicated final commit that changes only the localized changelog files to record the prior implementation commit; that bookkeeping commit must not add unrelated changes or link itself.
