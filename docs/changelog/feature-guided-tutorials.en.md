# Guided Tutorials

**Feature Branch:** feature-guided-tutorials

## Page Guides

Guides cover board selection, drawing tools, canvas navigation, history, saving and sharing, plus administrator-only canvas management and configuration.

The host owns callouts, arrows, spotlight, accessibility and the shared floating action menu. First-time runs offer Next throughout, without Cancel or Skip. Replays offer Cancel with `btn-cancel`. Completion is stored per account in the browser. Navigation, access loss and provider removal release the session; failed mounts roll back registrations.

## Descriptive Tutorial Keys

Tutorial step translation keys and target identifiers describe their subject instead of their position in the guide. The same keys are supplied in all four supported languages.

## Author Next cues per step

Each tutorial step now explicitly declares `highlightNext`: explanations that require Next or Finish enable it, while interaction- and wait-driven exercises disable it. The cue retains a static outline for reduced motion.

Tutorial coverage is required for every UI-facing component. Contributor guidance requires user-first, task-focused walkthroughs and a review of existing tutorials whenever features or UI behavior change.

## Specific targets and branch replay

The canvas deletion explanation highlights the displayed Delete control. The first usable target is selected inside the tutorial section and the step is skipped when no matching control is available.

## Visible tutorial regions

Tutorial regions and Next cues are authored explicitly.

## Shared floating-menu queue

Menus follow the shared queued host contract and component lifetime.

## Documented recovery controls

Missing-target views provide Next and Restart Tutorial; replay also provides Cancel.

## Intentional tutorial guidance

Tutorials explain distinct visible controls in UI order. Shared guidance covers active-view discovery, stable examples, empty states, conditional branches and lifecycle cleanup. Replay controls and reduced-motion documentation match the shared host.

## Consistent Translation Catalogs

Translation keys use lowercase period-delimited words throughout the module metadata and tutorials. Catalog entries retain their original translated values and match the surrounding XML indentation. Strict namespace checks reject hyphens and underscores in translation keys. Module IDs, UUIDs, capabilities and tutorial completion identities remain unchanged.

## Commits

- [b63cde3](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b63cde3de36183dd8426cad60e10112c9084571e)
- [93579f2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/93579f26a30ba1f4a2c778c37861e0ddaf0a3b80)
- [b97812e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b97812eb7fc854cfaa042c4342bbb713b3609162)
- [d9e3d34](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d9e3d346f2a3c878067dbb9d79e4624c28daf63d)
- [14a33e6](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/14a33e61511202c5c9c2e855f034e554ffd26d7e)
- [12e63fe54](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/12e63fe545ad3a0d93848bfc8b627723fff6f1de)
- [8e73fc9d4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8e73fc9d42b9731cc7fe0ea5265840a95e086134)
