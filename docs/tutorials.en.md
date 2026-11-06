# Guided tutorial

This module binds its introductory play to its own page through `ui:tutorials`. The first permitted visit starts it automatically; the question-mark SVG beside the page title replays it. The host must provide the version-one page-bound tutorial contract.

## Usage Examples

Guides cover board selection, drawing tools, canvas navigation, history, saving and sharing, plus administrator-only canvas management and configuration.

## Technical Specification

The host owns callouts, arrows, spotlight, accessibility and the shared floating action menu. First-time runs offer Next throughout, without Cancel or Skip. Replays offer Cancel with `btn-cancel`. Completion is stored per account in the browser. Navigation, access loss and provider removal release the session; failed mounts roll back registrations.

Tutorial regions and Next cues are authored explicitly. Menus follow the shared queued host contract and component lifetime. Missing-target views provide Next and Restart Tutorial; replay also provides Cancel.

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

Each tutorial step now explicitly declares `highlightNext`: explanations that require Next or Finish enable it, while interaction- and wait-driven exercises disable it. The cue retains a static outline for reduced motion.

The canvas deletion explanation highlights the displayed Delete control. The first usable target is selected inside the tutorial section and the step is skipped when no matching control is available.
