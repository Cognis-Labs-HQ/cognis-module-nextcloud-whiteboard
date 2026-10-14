# Nextcloud-Whiteboard-Modul

Das Nextcloud-Whiteboard-Modul stellt Cognis-Benutzern eine native kollaborative Zeichenfläche bereit, die von einem eigenständigen Nextcloud-Whiteboard-Socket.IO-Server unterstützt wird. Cognis verwaltet Konfiguration, Autorisierung, Persistenz, Freigaben und Benutzeroberfläche; der externe Server überträgt ausschließlich autorisierte Echtzeit-Szenenänderungen.

## Verwendungsbeispiele

**Dienst konfigurieren**

Aktivieren Sie das Modul, öffnen Sie **Nextcloud Whiteboard Settings** und geben Sie Folgendes an:

- die **Whiteboard-Server-URL**, zum Beispiel `https://whiteboard.example.com:3002`;
- das **Bild-Upload-Limit** in Bytes, wobei `0` das Hochladen eingefügter Bilder deaktiviert; und
- den **API-Schlüssel**, ein gemeinsames Geheimnis mit mindestens 16 Zeichen zum Signieren kurzlebiger Sitzungstoken.

Beim Speichern werden die Werte validiert und der Server-Ursprung für die erforderlichen Browserverbindungen registriert. Prüfen Sie die Bereitschaft mit `cognisctl modules:nextcloud-whiteboard:ping`; Administratoren können Boards mit `cognisctl modules:nextcloud-whiteboard:whiteboards` auflisten.

**Board öffnen und freigeben**

Benutzer öffnen `/whiteboards`, um ein Board anzulegen oder auszuwählen, und `/whiteboard?id=<board-id>`, um daran zu arbeiten. `instantCanvas=1` aktiviert die kompakte Integrationsfläche. Die Werkzeugleiste unterstützt Auswahl, Freihandzeichnen, Formen, Pfeile, Text, Radieren, Rückgängig/Wiederholen, Farben, Strichbreiten, eingefügte Bilder, Verlauf, Umbenennen und Leeren.

Eigentümer können über die Werkzeugleiste den Freigabedialog des Hosts öffnen und Lese- oder Schreibzugriff erteilen. Kontoempfänger öffnen das Board direkt; Linkempfänger werden über die Freigabe-Flows des Hosts aufgelöst und erhalten nur die freigegebenen Capabilities.

Die Mitgliedschaft dauerhafter Arbeitsflächen wird ausschließlich über die öffentliche CTX-Capability `whiteboard:membership` gesteuert. Ihre Funktionen `add` und `remove` akzeptieren eine Canvas-ID sowie kanonische Konto-IDs für Akteur und Benutzer, autorisieren den Canvas-Eigentümer und ändern jeweils einen Teilnehmer.

**Über Capabilities integrieren**

Lösen Sie öffentliche Capabilities über `ctx` auf, statt Routen anderer Komponenten fest zu codieren oder deren Interna zu importieren:

```js
const getEmbedUrl = ctx.getCapability("whiteboard:getEmbedUrl");
const fetchBoardData = ctx.getCapability("whiteboard:fetchBoardData");
const spawnWhiteboardWindow = ctx.getCapability(
    "whiteboard:spawnWhiteboardWindow",
);

const url = getEmbedUrl(boardId, { instantCanvas: true });
const board = await fetchBoardData(boardId);
// board.createdByAccountId ist die kanonische Cognis-Konto-ID.
await spawnWhiteboardWindow({
    title: "Shared canvas",
    createdBy: ownerHandle,
    participants: participantHandles,
});
```

`getEmbedUrl` liefert ohne Board-ID `null`. Die asynchronen Capabilities schlagen fehl, wenn die Modul-API nicht verfügbar ist oder der Aufrufer keinen Zugriff auf das angeforderte Board hat.

## Technische Spezifikation

### Provider-eigene Darstellung und Aktions-Flows

Der Browser bezieht `whiteboard:uiGateway` über den vom Host initialisierten ctx. `createCanvas({resourceType, resourceId, title, participantHandles})` und `createDisposableCanvas({resourceType, resourceId, title, participantHandles})` liefern `{whiteboardId}`. `requestCanvasPage({signal})` liefert den Component-Page-Deskriptor; `openCanvas({whiteboardId, elementId, signal})` liefert dessen Fensterhandle. Der Aufrufer stellt sein Mount-Ziel bereit und verwirft das Handle beim Abbau. Whiteboard verwaltet Routenidentität, Darstellungsparameter, Transporttoken und Lebensdauer; Integrationen dürfen diese Details nicht nachbilden. Jeder Mount benötigt seine exakte Canvas-ID. Der Anbieter fordert die randlose Darstellung direkt im Spawn-Vertrag des Hosts an; der Canvas-Kontext enthält nur Identität und Modus.

Asynchrone Store-Aktionen des aktivierten Moduls führen über ctx eigene `nextcloud-whiteboard:*`-Flows mit `initialize-store` und `execute-action` aus. Fehlende Ergebnisse und inaktive Flows führen zu Fehlern. Die deaktivierte Konfiguration nutzt den injizierten Store direkt, da der Host keine Flows deaktivierter Module registriert. Authentifizierung und Validierung gehen Änderungen voraus; interne Store-Aufrufe erhalten Transaktionen. Board-Löschung und vollständige Bereinigung teilen einen kindzuerst geordneten Tabellenkatalog; Fehler rollen die vollständige Bereinigung zurück.

Navigation bricht Transportprüfungen und ausstehende Szenen-Callbacks ab. Veraltete Sitzungs- und Skriptantworten öffnen keine verlassene Canvas erneut. Prüfungen geben Sockets, Listener, Timer und Skripthandles bei Erfolg, Fehler und Abbruch frei. Page-Composer-Stile bleiben Eigentum des Hosts.

Whiteboard versieht die registrierten Browser-Einstiegs-URLs mit der installierten Paketrevision aus seinem Manifest. Provider- und Canvas-Einstiege erhalten dadurch nach einem Whiteboard-Update neue URLs, auch wenn der Cognis-Build unverändert bleibt. Browser-Vertragstests verknüpfen die tatsächlichen lokalen Modulgraphen und verwerfen fehlende benannte Exporte vor der Veröffentlichung. Laden Sie eine bereits geöffnete Seite nach Aktualisierung eines aktivierten Moduls neu, damit ihr Browserkontext den neuen Provider verwendet.

Eingebettete Canvas verwenden einen randlosen Composer-Viewport ohne Inhaltsscrollen. Die eingebettete Fläche isoliert die intrinsische Canvas-Größe, sodass Werkzeugleiste und Zeichenbereich auch nach dem Verkleinern oder Vergrößern des Besprechungsfensters in den Host passen. Ziehen mit der mittleren Maustaste verschiebt nur die lokale Ansicht und veröffentlicht keine Szenenänderungen, speichert keine Snapshots und verändert den Synchronisationsstatus nicht.

### Architektur und Lebenszyklus

`bootstrap.js` registriert UI und API, stellt öffentliche Capabilities bereit und erweitert `bootstrap-platform`. Die UI verwendet Page Composer und Router des Hosts; die API verwaltet Board-Metadaten, Snapshots, Präsenz, Konfiguration und Sitzungen. Beim Aktivieren werden `/whiteboards`, `/whiteboard`, statische Assets, Navigation, APIs, Capabilities und Freigabe-Hooks registriert; beim Deaktivieren werden die modulspezifischen Registrierungen entfernt.

Der Browser erhält ein kurzlebiges JWT für genau ein autorisiertes Board und verbindet sich direkt mit dem konfigurierten Socket.IO-Endpunkt. Der Administrator-API-Schlüssel verbleibt auf dem Server. Szenen-Snapshots werden in Cognis gespeichert, während Socket.IO Live-Änderungen und Präsenz verteilt.

### Konfiguration und Validierung

Das Manifest deklariert `serverUrl`, `imageUploadMaxBytes` und `apiKey` mit lokalisierten Bezeichnungen. Die Server-URL muss eine HTTP- oder HTTPS-URL sein. Das Upload-Limit wird auf eine nicht negative Zahl normalisiert. Ein angegebener API-Schlüssel benötigt mindestens 16 Zeichen; wird er bei einer Aktualisierung ausgelassen, bleibt das gespeicherte Geheimnis erhalten. Ungültige Felder erzeugen sichere Validierungsantworten ohne interne Details.

Der Preflight-Endpunkt prüft Konfiguration, HTTP-Erreichbarkeit und Websocket-Autorisierung vor dem Sitzungsstart. Der Enable-Test ist nur für Administratoren zugänglich und meldet die Verfügbarkeit erforderlicher Abhängigkeiten und des externen Dienstes.

### Autorisierung und Freigaben

Alle Board-Operationen authentifizieren über `auth:requireAuth`. Eigentümer dürfen Boards umbenennen und Teilnehmer verwalten. Teilnehmer erhalten Zugriff entsprechend ihrer gespeicherten Rolle. Profil-Handles werden vor Vergleichen normalisiert; verborgene Profile werden nicht implizit offengelegt.

Das Modul erweitert, sofern vorhanden, `mint-share-token`, `resolve-share-token`, `construct-share-page` und `revoke-share-token`. Es validiert Ressourcen vor der Freigabe, verweigert Freigabe-Gästen das Erstellen oder Widerrufen von Freigaben, löst ausschließlich `whiteboard`-Ressourcen auf und verwendet den öffentlichen Share-Renderer-Vertrag des Hosts.

### API-Routen

Alle Routen beginnen mit `/api/v1/modules/nextcloud-whiteboard`:

- `GET` und `PUT` / `DELETE /config` lesen und ändern die Administratorkonfiguration.
- `GET /ping` meldet die Modulbereitschaft.
- `POST /admin/enable-test` führt den Aktivierungstest aus.
- `GET /whiteboards` listet zugängliche Boards; Administratoren können alle abfragen.
- `POST /whiteboards/spawn` erstellt ein Board; `GET /whiteboards/launch` liefert Startdaten.
- `POST /whiteboards/preflight` prüft den externen Server.
- `GET /whiteboards/session` autorisiert ein Board und liefert Verbindungsdaten.
- `POST /whiteboards/elements` speichert einen Szenen-Snapshot.
- `GET` und `POST /whiteboards/presence` lesen und aktualisieren Präsenz.
- `POST /whiteboards/rename` benennt ein eigenes Board um.
- `GET` und `POST /whiteboards/images` lesen und speichern Bilder im Modul-Namensraum.
- `GET /share`, `POST /share` und `POST /share/delete` listen, erstellen und löschen Zugriffsregeln.

Grenzvalidierung begrenzt Anfragen, normalisiert Kennungen und autorisiert vor der Geschäftslogik. Fehlende Abhängigkeiten liefern „Service unavailable“; Betriebsfehler werden mit sicheren strukturierten Metadaten protokolliert.

### Persistenz und Echtzeitverhalten

Cognis speichert Konfiguration, Boards, Zugriffsregeln, Präsenz und Snapshots über `db:executor`. Bilder verwenden einen Modul-Namensraum aus den Files-Capabilities. Board-IDs und Token werden kryptografisch sicher erzeugt und verwenden niemals `Math.random`.

Der Client verbindet sich mit begrenzter Verzögerung erneut, pausiert Echtzeitarbeit bei verborgenem Tab, führt Szenenversionen zusammen, persistiert nicht-transiente Änderungen und aktualisiert Präsenz separat. Uploads beachten das Byte-Limit. Beim Unmount werden Sockets, Observer, Event-Handler und Canvas-Ressourcen bereinigt.

### Sicherheit und Betriebsbedingungen

Betreiben Sie den Whiteboard-Server produktiv über HTTPS und behandeln Sie den API-Schlüssel als Geheimnis. Der Ursprung muss für Cognis und die Browser der Benutzer erreichbar sein; Reverse Proxies müssen Websocket-Upgrades erlauben. Wegen ablaufender JWTs ist eine synchronisierte Systemzeit erforderlich.

Verwenden Sie ausschließlich die im Manifest deklarierten öffentlichen `ctx`-Capabilities und Flows. Importieren Sie keine Cognis-Interna, übertragen Sie den API-Schlüssel nicht an den Browser, umgehen Sie nicht den Host-Router und senden Sie keine nicht authentifizierten Modulaufrufe. Generieren Sie `manifest.files` nach jeder Änderung neu und halten Sie alle vier Dokumentations- und Sprachvarianten synchron.

### Lebenszyklus der Canvas-Integration

Der Browseranbieter veröffentlicht `whiteboard:uiGateway` ausschließlich über `mountProvider(ctx)`. Seine Abläufe `nextcloud-whiteboard:requestCanvasPage`, `openCanvas`, `createCanvas` und `createDisposableCanvas` laufen durch den bereichsgebundenen UI-Kontext. Deaktivieren bricht laufende Erstellung ab und weist alte Gateway-Referenzen zurück; erneutes Aktivieren bindet den zwischengespeicherten Anbieter neu ein. Das eingebettete Canvas-Markup liegt unter `ui/templates/`; seine Größe wird mit Chromium/CDP ohne Playwright geprüft.

### Mitwirkendenstruktur und Zuständigkeit des Hosts

Neue Module beginnen mit [cognis-module-template](https://github.com/Cognis-Labs-HQ/cognis-module-template); dieses Repository folgt der in `AGENTS.md` festgehaltenen Vorlagenrevision. `bootstrap.js` orchestriert den Lebenszyklus, `api/index.js` verdrahtet ctx-Abhängigkeiten, `api/routes/<domain>/index.js` enthält HTTP-Handler und `api/reuse/` wiederverwendbaren Servercode. Browserfunktionen liegen unter `ui/`, Styles unter `ui/styles/`, wiederverwendbare Vorlagen unter `ui/templates/` und lokalisierte Dokumentation unter `docs/index.<locale>.md`. Historische Veröffentlichungen liegen in `docs/changelog/` und werden nicht gehasht. Nicht unterstützte optionale Bereiche entfallen.

Öffentliche ctx-Fähigkeiten und deklarierte Abläufe nutzen; niemals Cognis-Interna oder benachbarte Module importieren. Dashboard-Anbieter für Fähigkeiten und Navigation exportieren `mountProvider(scopedUiCtx)` und geben Aufräumfunktionen für eigene Ressourcen zurück. Importe registrieren kein Modulverhalten. Der Host entfernt Fähigkeiten, Ablauf-Hooks, Listener und Anbieterzustand beim Deaktivieren und bindet zwischengespeicherte Anbieter beim erneuten Aktivieren neu ein. Einstellungen, Administration und Anmeldefußzeilen folgen ihren jeweiligen dokumentierten Host-Verträgen. Diese Verträge mit eigenständigen Testdoubles prüfen, die ausführbare Strukturprüfung ausführen, Hashes nach der letzten Paketänderung erneuern und vor der Veröffentlichung Lint, Tests und Manifestprüfung ausführen.

Das Marketplace-Banner kombiniert Cognis mit der Anbieteridentität in einem mittigen, gegen Beschneiden geschützten Layout; das vorhandene Anbieter-Icon bleibt erhalten.

## Zeichenflächen-Verwaltung und Quellzuordnung

Administration → Whiteboards zeigt alle Zeichenflächen mit Eigentümer, Quellzuordnung, aktiven Benutzern und Aktualisierungszeit. Die Filter Alle Zeichenflächen, Aktive Zeichenflächen und Problematische Zeichenflächen begrenzen die Ansicht. Administratives Löschen benötigt eine Bestätigung und widerruft Freigaben, bevor gespeicherte Inhalte, Präsenz, Teilnehmerzugriffe und Benutzerkopien gelöscht werden. Zugriffstokens werden nicht angezeigt. `whiteboard:sourceBinding` bietet `bind` und `release` mit `{whiteboardId, actorAccountId, sourceType, sourceId}`. Nur der Eigentümer darf die Zuordnung ändern. Eine bedingte Aktualisierung weist andere Quellen mit `source_conflict` zurück; dieselbe Quelle kann erneut zuordnen. Die Freigabe betrifft nur die passende Quelle, auch bei der Bereinigung historischer Mehrfachreferenzen. Die Operationen verwenden registrierte Speicher-Flows. Integrationen liefern eigene Quellenkennungen, ohne interne Speicherung oder Darstellung zu lesen.

Quellzuordnung und Löschung von Zeichenflächen erlauben auch Administratoren, die über den öffentlichen Vertrag `auth:accountStore` verifiziert werden. Vor dem Entfernen der Zeichenfläche werden ihre Freigaben sämtlicher Freigabeeigentümer widerrufen. Registrierte Server-Aktionen verwenden Camel Case nach dem unveränderlichen Modulpräfix.

## Wiederverwendbare Canvas-Verknüpfungen

`createCanvas` und `createDisposableCanvas` akzeptieren einen allgemeinen `resourceType` und eine `resourceId`. Zusammen lösen sie eine gespeicherte Canvas-Verknüpfung auf; wiederholte und gleichzeitige Anfragen liefern dieselbe autorisierte Zeichenfläche, ohne Inhalte oder Mitgliedschaften zurückzusetzen. Die Datenbank erzwingt einen eindeutigen Referenzschlüssel. Eine vorhandene Zeichenfläche mit anderem Persistenzmodus führt zu einem Konflikt; unberechtigte Aufrufer dürfen sie nicht wiederverwenden. Ohne Verknüpfung entsteht bei dauerhaften Zeichenflächen eine neue unabhängige Zeichenfläche. Löschen entfernt die Verknüpfung und erlaubt eine spätere Neuerstellung.

## Direkte Whiteboard-Seiten ohne Menüeintrag

Whiteboards trägt keinen Navigationsmenü-Link mehr bei. Die geschützte Galerie `/whiteboards`, die Zeichenfläche `/whiteboard`, der Darstellungs-Gateway, der Verwaltungsbereich und durchsuchbare Seiten- und Canvas-Einträge bleiben verfügbar. Das Navbar-Plugin verwaltet nur seinen Suchindex und entfernt ihn beim Abbau.

## Allgemeine Wiederherstellung fehlender Zeichenflächen

Anbieter-Metadaten veröffentlichen eine neutrale resourceReference mit resourceType und resourceId. Integrationen verwenden diese öffentliche Identität ohne Kenntnis der Speicherung. Löschen entfernt den Referenzschlüssel; eine spätere autorisierte Auflösung oder Erstellung liefert einen leeren Ersatz. Eine angemeldete eigenständige Seite darf bei einem echten not_found-Sitzungsfehler einen Ersatz über eine allgemeine Canvas-Verknüpfung erstellen, einmal laden und aktive ID sowie URL aktualisieren. Geteilte und eingebettete Ansichten erstellen keinen unabhängigen Ersatz. Berechtigungs- und Dienstfehler werden weitergegeben; erneutes Fehlen startet keine Wiederholungsschleife. Erfolg wird per Toast gemeldet und die Anbieter-Auflösung ohne Zugangsdaten protokolliert.

Die Zeichenflächen-Verwaltung bietet Alle Zeichenflächen, Aktive Zeichenflächen und Problematische Zeichenflächen mit eigenen Leermeldungen. Die Problemansicht zeigt fehlende Eigentümer oder Eigentümerzugriffe, unvollständige Quellverknüpfungen sowie doppelte allgemeine Quellverknüpfungen oder Ressourcenverweise. Kleine Problemmarkierungen erläutern jeden Befund. Die Diagnose verwendet nur Whiteboard-eigene Daten. Die Verwaltung erfordert weiterhin Administratorrechte und gibt keine Zugangsdaten aus.

Die Zeichenflächen-Implementierung liegt in `api/canvas/` und `ui/canvas/` mit kurzen Dateinamen wie `source-binding.js`, `events.js` und `snapshot.js`. Die Laufzeitprüfung für die Aktivierung heißt `api/configuration/enablement.js`; Unit-Tests bleiben in `api/tests/`. Geteilte Seiten verwenden denselben revisionsgebundenen Asset-Resolver wie normale Routen. Die Verwaltung schließt inaktive Präsenz aus und liefert `invalid_json` bei fehlerhaften Löschanfragen. Eine einzelne zugängliche Zeichenfläche am kanonischen Ressourcenpfad erhält einen unveränderlichen Verweis ohne Inhaltsänderung. Mehrdeutige Pfade führen zu einem Konflikt und einer Problemmarkierung statt einer automatischen Datensatzauswahl.
