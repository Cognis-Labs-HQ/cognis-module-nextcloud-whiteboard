# Architecture guide

## Host contract

`ctx` is the complete integration bus. Use `getCapability` for dependencies, `contributePublicCapability` for behavior other components can consume, `registerFlow`/`flow.extend` for staged composition, and the scoped route/UI registrars for host surfaces. Optional integration must feature-detect a capability; a required one must be declared in the manifest and fail clearly at bootstrap.

`bootstrap.js` should remain orchestration. Domain HTTP logic belongs in `api/`, browser code in `ui/`, command registration in `cli/`, and persistence behind a store. Reusable code remains inside its layer under `reuse/` so server-only code never leaks into the browser bundle.

## End-to-end request

The showcase form posts JSON to the module API. The route applies host authentication, rejects malformed or oversized input, normalizes the title, and calls `ShowcaseStore`. The store issues database-neutral executor commands. The response has a stable `{ data }` or `{ error: { code, message } }` envelope. The CLI calls that same route, keeping authorization and behavior consistent.

## Capabilities and flows

`showcase:listItems` demonstrates a direct provider contract. In production, document argument/result shapes, ownership, failure behavior, and whether the capability is required or optional. `showcase-items` demonstrates a multi-provider flow. Stage extensions need globally unique IDs and should return contributions rather than mutating undocumented host state.

## Adding common surfaces

- **Administration:** register an admin section from `api/ui.js`, require `admin` on its API, and localize its strings.
- **Sharing:** declare guest scopes and register share flow hooks; authorize the exact resource and capability on every request.
- **Notifications:** resolve `notify:dispatch`, register a category if available, and dispatch safe metadata.
- **Background work:** own an abort controller/timer registry and return a disposer from bootstrap.
- **User deletion:** extend the host deprovision flow and delete module-owned personal data transactionally.
- **External services:** keep credentials in host-supported configuration/secret capabilities, add liveness health, timeouts, and CSP origins where needed.

Each new behavior needs standalone tests using local capability fakes. A module test must never import the Cognis source tree.
