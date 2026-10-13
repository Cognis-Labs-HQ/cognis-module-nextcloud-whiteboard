# Canvas-Integrationen und Lebenszyklus isolieren

**Feature-Zweig:** feature-scoped-whiteboard-contract-cleanup

## Öffentlicher Darstellungsvertrag

Der Browser bezieht `whiteboard:uiGateway` über den vom Host initialisierten ctx. `createCanvas({title, participantHandles})` und `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` liefern `{whiteboardId}`. `requestCanvasPage({signal})` liefert den Component-Page-Deskriptor; `openCanvas({whiteboardId, elementId, signal})` liefert dessen Fensterhandle. Der Aufrufer stellt sein Mount-Ziel bereit und verwirft das Handle beim Abbau. Whiteboard verwaltet Routenidentität, Darstellungsparameter, Transporttoken und Lebensdauer; Integrationen dürfen diese Details nicht nachbilden. Jeder Mount benötigt seine exakte Canvas-ID.

## Eigene Aktionen und zuverlässige Bereinigung

Asynchrone Store-Aktionen des aktivierten Moduls führen über ctx eigene `nextcloud-whiteboard:*`-Flows mit `initialize-store` und `execute-action` aus. Fehlende Ergebnisse und inaktive Flows führen zu Fehlern. Die deaktivierte Konfiguration nutzt den injizierten Store direkt, da der Host keine Flows deaktivierter Module registriert. Authentifizierung und Validierung gehen Änderungen voraus; interne Store-Aufrufe erhalten Transaktionen. Board-Löschung und vollständige Bereinigung teilen einen kindzuerst geordneten Tabellenkatalog; Fehler rollen die vollständige Bereinigung zurück.

Navigation bricht Transportprüfungen und ausstehende Szenen-Callbacks ab. Veraltete Sitzungs- und Skriptantworten öffnen keine verlassene Canvas erneut. Prüfungen geben Sockets, Listener, Timer und Skripthandles bei Erfolg, Fehler und Abbruch frei. Page-Composer-Stile bleiben Eigentum des Hosts.

## Browser-Einstiege mit Paketrevision

Whiteboard versieht die registrierten Browser-Einstiegs-URLs mit der installierten Paketrevision aus seinem Manifest. Provider- und Canvas-Einstiege erhalten dadurch nach einem Whiteboard-Update neue URLs, auch wenn der Cognis-Build unverändert bleibt. Browser-Vertragstests verknüpfen die tatsächlichen lokalen Modulgraphen und verwerfen fehlende benannte Exporte vor der Veröffentlichung. Laden Sie eine bereits geöffnete Seite nach Aktualisierung eines aktivierten Moduls neu, damit ihr Browserkontext den neuen Provider verwendet.

## Navigation der unendlichen Canvas lokal halten

Eingebettete Canvas verwenden einen randlosen Composer-Viewport ohne Inhaltsscrollen. Ziehen mit der mittleren Maustaste verschiebt nur die lokale Ansicht und veröffentlicht keine Szenenänderungen, speichert keine Snapshots und verändert den Synchronisationsstatus nicht.

## Eingebettetes Canvas an den Host anpassen

Größenbegrenzung des eingebetteten Canvas verhindert, dass die vorherige Bitmap-Höhe das randlose Komponentenfenster vergrößert. Werkzeugleiste und Canvas teilen die tatsächliche Host-Höhe ohne Abschneiden oder vertikales Scrollen. Ein Chromium-Regressionstest prüft eine übergroße Bitmap beim Einbinden und wiederholte Größenänderungen. Jitsi-spezifische oder Seitenschalen-Stile sind nicht erforderlich.

## Eingebettetes Layout über den Komponentenvertrag übergeben

`openCanvas` setzt `borderless: true` jetzt direkt in der Komponenten-Spawn-Anfrage. Im Canvas-Kontext verschachtelte Layoutangaben wurden vom Host ignoriert; dadurch fehlte der eingebetteten Seite die Größenanpassung an den Elternbereich und das gekapselte Canvas kollabierte. Der Kontext enthält nur noch Canvas-Identität und Modus. Gateway-Tests prüfen die öffentliche Anfrage und das randlose Fenster; der Chromium-Regressionstest verwendet das tatsächliche Gateway und Rendering in einem verschachtelten Standardmodus-Mount.

## Beitragsstandard der Vorlage

AGENTS.md mit der externen Modulvorlage synchronisieren und Domänenregeln beibehalten. Den kanonischen Release-Verzeichnispfad übernehmen; historische Inhalte und dauerhafte Modulidentität erhalten.

## Commits

- [b78213e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b78213eb77660d59c9bac3aafe2dfd2677a488b0)
- [a42cff8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a42cff8c865ae0388fd3ded03d2e957e9ff5dd3e)
- [a79203e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a79203ed13a22bfe77ae59c32efe5b43b331c559)
- [c818b40](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c818b40db5010cb220cb54ffd23bc45940539f44)

- [05e253c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/05e253c37054f54197c4f79511f722ef96df4631)
- [6ea9026](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/6ea902628f55686585e8f709ff0ddf79a1632a83)
