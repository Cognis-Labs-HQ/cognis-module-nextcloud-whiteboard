# Whiteboard-Erkennung in Meetings wiederherstellen

**Feature-Zweig:** feature-restore-jitsi-whiteboard-discovery

## Browser-Gateway einmal veröffentlichen

Nextcloud Whiteboard deklariert `whiteboard:uiGateway` jetzt über genau einen dedizierten Capability-Provider. Die Navigationsleiste beansprucht und importiert denselben Provider nicht mehr, sodass in der eigentümergeschützten UI-Registry keine doppelte Registrierung entsteht.

## Jitsi-Meet-Steuerelement wiederherstellen

Jitsi Meet kann die Whiteboard-Canvas-Factory zuverlässig laden, nachdem das Backend die namensgebundenen Server-Capabilities erkannt hat. Dadurch stehen die Whiteboard-Schaltfläche und die Erstellung gemeinsamer Canvas in Meetingfenstern wieder zur Verfügung.

## Commits

- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
