# Guided tutorial

This module binds its introductory play to its own page through `ui:tutorials`. The first permitted visit starts it automatically; the question-mark SVG beside the page title replays it. The host must provide the version-one page-bound tutorial contract.

## Usage Examples

Canvas readiness and write permission are separate owner-confirmed states. After loading, the connection explanation is available to all viewers. Drawing and history steps require write access; read-only recipients get a pan/zoom walkthrough instead. Unavailable editing and sharing actions are excluded from the path and count.

## Technical Specification

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

The canvas deletion explanation highlights the displayed Delete control. The first usable target is selected inside the tutorial section and the step is skipped when no matching control is available.

The shared host provides queued floating actions. First visits offer Next/Finish without Cancel or Skip; replays offer Skip before the last visible step. Restart Tutorial appears after the first visible step. Completion survives content updates. Explicit highlightNext flags enable only a breathing animation for explanatory steps; reduced motion disables it. Each stage highlights a distinct rendered control in UI order. Guides stay bound to the current view, handle empty and optional states, and release their resources on navigation or owner removal.

On the Whiteboard homepage, choose New Board or a saved board. This deliberate action starts the drawing branch, which waits for the owner to finish loading the canvas. Only then do the drawing tools, canvas/history and save/share explanations appear. Next without opening a board bypasses that branch; an already open canvas starts directly with the tools. Hidden or failed-loading canvases never qualify as ready.

The administration configuration guide keeps the host section as its discovery boundary and highlights the module-rendered form containing the server URL, API key and upload limit. Composer layout identifiers are not tutorial targets.
