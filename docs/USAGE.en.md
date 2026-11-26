# Usage

Create and share collaborative drawing canvases in Cognis.

## Prerequisites

An administrator must configure the Whiteboard server and its API key. Both Cognis and the browser must reach that server. Editing requires write access to the selected board.

## Examples

Open Whiteboard and choose New Board or a saved board. Wait for the connection status, then draw or inspect the canvas according to your access.

**Configure the service**

Enable the module, open **Nextcloud Whiteboard Settings**, and provide:

- **Whiteboard Server URL**, such as `https://whiteboard.example.com:3002`;
- **Image upload limit**, in bytes, where `0` disables pasted-image uploads; and
- **API key**, a shared secret of at least 16 characters used to sign short-lived session tokens.

Saving the settings validates the values and registers the server origin for the required browser connections. Use `cognisctl modules:nextcloud-whiteboard:ping` to verify readiness and `cognisctl modules:nextcloud-whiteboard:whiteboards` to list boards as an administrator.

**Open and share a board**

Users open `/whiteboards` to create or select a board and `/whiteboard?id=<board-id>` to work on it. Add `instantCanvas=1` to use the compact integration canvas. The toolbar supports selection, freehand drawing, shapes, arrows, text, erasing, undo and redo, colors, stroke widths, image paste, board history, renaming, and clearing.

Owners can open the host share popup from the toolbar and grant read or write access. Account recipients can open the board directly; link recipients resolve through the host share flows and receive only the capabilities granted by the share.

Persistent canvas membership is controlled only through the public `whiteboard:membership` CTX capability. Its `add` and `remove` functions accept a canvas ID plus canonical actor and user account IDs, authorize the canvas owner, and update one participant at a time.

**Integrate through capabilities**

Resolve public capabilities from `ctx` instead of hard-coding another component's routes or importing its internals:

```js
const getEmbedUrl = ctx.getCapability("whiteboard:getEmbedUrl");
const fetchBoardData = ctx.getCapability("whiteboard:fetchBoardData");
const spawnWhiteboardWindow = ctx.getCapability(
    "whiteboard:spawnWhiteboardWindow",
);

const url = getEmbedUrl(boardId, { instantCanvas: true });
const board = await fetchBoardData(boardId);
// board.createdByAccountId is the canonical Cognis account ID.
await spawnWhiteboardWindow({
    title: "Shared canvas",
    createdBy: ownerHandle,
    participants: participantHandles,
});
```

`getEmbedUrl` returns `null` without a board ID. The asynchronous capabilities reject when the module API is unavailable or the caller cannot access the requested board.

Canvas readiness and write permission are separate owner-confirmed states. After loading, the connection explanation is available to all viewers. Drawing and history steps require write access; read-only recipients get a pan/zoom walkthrough instead. Unavailable editing and sharing actions are excluded from the path and count.

## Expected Results

Authorized participants see the shared board. Drawing changes synchronize; panning moves only your own viewport. Saving a disposable canvas creates a retained copy.

## Troubleshooting

Check server reachability, websocket proxy support and the configured key when preparation fails. Read-only access deliberately hides editing actions; ask the owner for write access.
