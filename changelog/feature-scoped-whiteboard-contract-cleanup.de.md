# Canvas-Integrationen und Lebenszyklus isolieren

**Feature-Zweig:** feature-scoped-whiteboard-contract-cleanup

## Öffentlicher Darstellungsvertrag

Der Browser bezieht `whiteboard:uiGateway` über den vom Host initialisierten ctx. `createCanvas({title, participantHandles})` und `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` liefern `{whiteboardId}`. `requestCanvasPage({signal})` liefert den Component-Page-Deskriptor; `openCanvas({whiteboardId, elementId, signal})` liefert dessen Fensterhandle. Der Aufrufer stellt sein Mount-Ziel bereit und verwirft das Handle beim Abbau. Whiteboard verwaltet Routenidentität, Darstellungsparameter, Transporttoken und Lebensdauer; Integrationen dürfen diese Details nicht nachbilden. Jeder Mount benötigt seine exakte Canvas-ID.

## Eigene Aktionen und zuverlässige Bereinigung

Asynchrone Store-Aktionen des aktivierten Moduls führen über ctx eigene `nextcloud-whiteboard:*`-Flows mit `initialize-store` und `execute-action` aus. Fehlende Ergebnisse und inaktive Flows führen zu Fehlern. Die deaktivierte Konfiguration nutzt den injizierten Store direkt, da der Host keine Flows deaktivierter Module registriert. Authentifizierung und Validierung gehen Änderungen voraus; interne Store-Aufrufe erhalten Transaktionen. Board-Löschung und vollständige Bereinigung teilen einen kindzuerst geordneten Tabellenkatalog; Fehler rollen die vollständige Bereinigung zurück.

Navigation bricht Transportprüfungen und ausstehende Szenen-Callbacks ab. Veraltete Sitzungs- und Skriptantworten öffnen keine verlassene Canvas erneut. Prüfungen geben Sockets, Listener, Timer und Skripthandles bei Erfolg, Fehler und Abbruch frei. Page-Composer-Stile bleiben Eigentum des Hosts.

## Browser-Einstiege mit Paketrevision

Whiteboard versieht die registrierten Browser-Einstiegs-URLs mit der installierten Paketrevision aus seinem Manifest. Provider- und Canvas-Einstiege erhalten dadurch nach einem Whiteboard-Update neue URLs, auch wenn der Cognis-Build unverändert bleibt. Browser-Vertragstests verknüpfen die tatsächlichen lokalen Modulgraphen und verwerfen fehlende benannte Exporte vor der Veröffentlichung. Laden Sie eine bereits geöffnete Seite nach Aktualisierung eines aktivierten Moduls neu, damit ihr Browserkontext den neuen Provider verwendet.

## Commits

- [b78213e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b78213eb77660d59c9bac3aafe2dfd2677a488b0)
- [a42cff8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a42cff8c865ae0388fd3ded03d2e957e9ff5dd3e)
