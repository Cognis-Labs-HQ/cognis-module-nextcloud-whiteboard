# Cognis external module template

An intentionally small, installable reference module that touches the **UI, API, database, CLI, capabilities, flows, localization, tests, and marketplace packaging** surfaces of Cognis. It is a learning aid—not a generator—and mirrors the external-module boundary established by Cognis PR #172 and the Jitsi Meet module.

## Start here

```sh
npm install
npm test
npm run check:manifest
```

Install the repository as a Cognis module source, review its permissions, enable it, then open `/showcase` or run `cognisctl module-template:list`.

## Architecture map

| Path | Responsibility | Key lesson |
| --- | --- | --- |
| `manifest.json` | Identity, compatibility, capabilities, entrypoints, store metadata, immutable file hashes | UUIDs are dependencies; IDs are human-readable |
| `bootstrap.js` | Sole host integration point | Register through `ctx`; never import Cognis internals |
| `routes.json` | Up-front page access declaration | The host validates protected routes before activation |
| `api/index.js` | Authenticated HTTP boundary and orchestration | Validate input and delegate persistence |
| `api/store.js` | Portable database-executor commands and schema | Never bind a module to a database driver |
| `api/ui.js` | Static assets, SPA route, navigation | Host registration makes disable/uninstall cleanup scoped |
| `ui/` | Browser entrypoint, styling, four locale bundles | Use host routes/toasts and module-owned strings |
| `cli/index.js` | `cognisctl` extension | CLI calls the public API instead of bypassing it |
| `docs/` | Contributor deep dives | Explain contracts and safe extension patterns |
| `scripts/` | Package integrity checks | Every shipped file has a SHA-256 digest |

## Lifecycle and boundaries

1. Cognis validates `manifest.json`, component dependencies, capability requirements, routes, and file digests.
2. Enabling calls `bootstrapModule(ctx)`. The module registers UI/API contributions, publishes a capability, and extends a flow.
3. API handlers authenticate and validate. The store owns schema and persistence through `db:executor`.
4. UI and CLI consume the same HTTP API. Other components may consume `showcase:listItems` through `ctx`.
5. Scoped registrations are removed when disabled. Add and return an explicit disposer if you create timers, listeners, sockets, or other resources outside scoped registrations.

Cross-component behavior belongs in **capabilities** (a callable contract) or **flows** (ordered extension stages). Do not reach into Cognis, gateways, or sibling module source trees. Required component links in `requires` are UUIDs; runtime contracts belong in `requiresCapabilities`.

## Forking this template

1. Choose a stable readable ID and generate a new UUID once. Never reuse this template UUID in a published fork.
2. Rename package, command, API/static paths, DB table prefix, localization namespace, flow extension IDs, and capability keys.
3. Replace publisher/repository/support metadata and artwork.
4. Keep manifest/package/lock versions identical.
5. Add only capabilities the module truly needs, and keep route access least-privileged.
6. Run `npm run manifest:hashes` last, then `npm run check` and `git diff --check`.

See [`docs/architecture.md`](docs/architecture.md), [`docs/security.md`](docs/security.md), and [`docs/releasing.md`](docs/releasing.md) before implementing a production module.
