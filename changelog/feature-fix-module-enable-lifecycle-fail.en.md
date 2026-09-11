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

## Commits

- [c419a3d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c419a3d499a9ab4668e23225f42587862d6beb45)

- [2c6ec86](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/2c6ec86d1e83b4a5157972e4877ed343390ab221)
