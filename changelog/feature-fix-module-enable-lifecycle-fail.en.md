# Reliable Whiteboard Enablement Lifecycle

**Feature Branch:** feature-fix-module-enable-lifecycle-fail

## Isolate pre-enablement configuration

Nextcloud Whiteboard now declares a dedicated disabled API entrypoint that registers only configuration and enablement-test routes while the module is disabled. Runtime routes, storage namespaces, sharing flows, and public whiteboard capabilities remain deferred until enablement.

## Share configuration registration safely

Enabled and disabled API entrypoints use the same configuration registration layer, preserving consistent validation, liveness testing, authentication, and unavailable-dependency responses across lifecycle states.

## Verify the disabled lifecycle contract

Automated coverage confirms the manifest entrypoint and ensures disabled registration exposes only pre-enablement routes without requesting runtime file or sharing capabilities.

## Pass tightened module boundary validation

The Whiteboard browser obtains the host UI context from its public global capability registry instead of importing a Cognis internal path. The clear-board control now uses a module-owned style class, removing both validation violations that blocked enablement.

## Keep preflight liveness checks available

The runtime preflight route now imports the shared liveness timeout explicitly, preventing a reference error after configuration registration was extracted. Regression coverage verifies that the route uses the shared timeout.

## Commits

- [b725331](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b725331e48adff3f25bdd40447b22f41a2d2045b)

- [7e22cba](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7e22cbaf70bd8f0184b000e757ac1c268059645f)
