# Reliable Whiteboard Enablement Lifecycle

**Feature Branch:** feature-align-module-enable-lifecycle

## Isolate pre-enablement configuration

Nextcloud Whiteboard now declares a dedicated disabled API entrypoint that registers only configuration and enablement-test routes while the module is disabled. Runtime routes, storage namespaces, sharing flows, and public whiteboard capabilities remain deferred until enablement.

## Share configuration registration safely

Enabled and disabled API entrypoints use the same configuration registration layer, preserving consistent validation, liveness testing, authentication, and unavailable-dependency responses across lifecycle states.

## Verify the disabled lifecycle contract

Automated coverage confirms the manifest entrypoint and ensures disabled registration exposes only pre-enablement routes without requesting runtime file or sharing capabilities.

## Commits

- [8d61422](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8d61422c80b020af8d4734b7bc52e213b83da5d0)
