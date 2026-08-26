# Reliable whiteboard restoration after reconnecting

## Restore the shared canvas immediately after a refresh

Participants who rejoin an embedded multi-participant whiteboard now request the current scene from connected peers, so existing objects render without waiting for another participant to edit or select them. Every connected peer can answer the synchronization request, and peers send the merged scene back when they receive a new edit so canvases recover even if the initial response is missed.
