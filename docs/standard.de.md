# Nextcloud-Whiteboard-Modul

Das Nextcloud-Whiteboard-Modul stellt Cognis-Benutzern eine native kollaborative Zeichenfläche bereit, die von einem eigenständigen Nextcloud-Whiteboard-Socket.IO-Server unterstützt wird. Cognis verwaltet Konfiguration, Autorisierung, Persistenz, Freigaben und Benutzeroberfläche; der externe Server überträgt ausschließlich autorisierte Echtzeit-Szenenänderungen.

## Verwendungsbeispiele

**Dienst konfigurieren**

Aktivieren Sie das Modul, öffnen Sie **Nextcloud Whiteboard Settings** und geben Sie Folgendes an:

- die **Whiteboard-Server-URL**, zum Beispiel `https://whiteboard.example.com:3002`;
- das **Bild-Upload-Limit** in Bytes, wobei `0` das Hochladen eingefügter Bilder deaktiviert; und
- den **API-Schlüssel**, ein gemeinsames Geheimnis mit mindestens 16 Zeichen zum Signieren kurzlebiger Sitzungstoken.

Beim Speichern werden die Werte validiert und der Server-Ursprung für die erforderlichen Browserverbindungen registriert. Prüfen Sie die Bereitschaft mit `cognisctl nextcloud-whiteboard:ping`; Administratoren können Boards mit `cognisctl nextcloud-whiteboard:whiteboards` auflisten.

**Board öffnen und freigeben**

Benutzer öffnen `/whiteboards`, um ein Board anzulegen oder auszuwählen, und `/whiteboard?id=<board-id>`, um daran zu arbeiten. `instantCanvas=1` aktiviert die kompakte Integrationsfläche. Die Werkzeugleiste unterstützt Auswahl, Freihandzeichnen, Formen, Pfeile, Text, Radieren, Rückgängig/Wiederholen, Farben, Strichbreiten, eingefügte Bilder, Verlauf, Umbenennen und Leeren.

Eigentümer können über die Werkzeugleiste den Freigabedialog des Hosts öffnen und Lese- oder Schreibzugriff erteilen. Kontoempfänger öffnen das Board direkt; Linkempfänger werden über die Freigabe-Flows des Hosts aufgelöst und erhalten nur die freigegebenen Capabilities.

**Über Capabilities integrieren**

Lösen Sie öffentliche Capabilities über `ctx` auf, statt Routen anderer Komponenten fest zu codieren oder deren Interna zu importieren:

```js
const getEmbedUrl = ctx.getCapability("whiteboard:getEmbedUrl");
const fetchBoardData = ctx.getCapability("whiteboard:fetchBoardData");
const spawnWhiteboardWindow = ctx.getCapability(
    "nextcloud-whiteboard:spawnWhiteboardWindow",
);

const url = getEmbedUrl(boardId, { instantCanvas: true });
const board = await fetchBoardData(boardId);
await spawnWhiteboardWindow({ whiteboardId: board.id });
```

`getEmbedUrl` liefert ohne Board-ID `null`. Die asynchronen Capabilities schlagen fehl, wenn die Modul-API nicht verfügbar ist oder der Aufrufer keinen Zugriff auf das angeforderte Board hat.

## Technische Spezifikation

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

- `GET` und `POST /config` lesen und ändern die Administratorkonfiguration.
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
- `GET`, `POST` und `POST /share/delete` listen, erstellen und löschen Zugriffsregeln.

Grenzvalidierung begrenzt Anfragen, normalisiert Kennungen und autorisiert vor der Geschäftslogik. Fehlende Abhängigkeiten liefern „Service unavailable“; Betriebsfehler werden mit sicheren strukturierten Metadaten protokolliert.

### Persistenz und Echtzeitverhalten

Cognis speichert Konfiguration, Boards, Zugriffsregeln, Präsenz und Snapshots über `db:executor`. Bilder verwenden einen Modul-Namensraum aus den Files-Capabilities. Board-IDs und Token werden kryptografisch sicher erzeugt und verwenden niemals `Math.random`.

Der Client verbindet sich mit begrenzter Verzögerung erneut, pausiert Echtzeitarbeit bei verborgenem Tab, führt Szenenversionen zusammen, persistiert nicht-transiente Änderungen und aktualisiert Präsenz separat. Uploads beachten das Byte-Limit. Beim Unmount werden Sockets, Observer, Event-Handler und Canvas-Ressourcen bereinigt.

### Sicherheit und Betriebsbedingungen

Betreiben Sie den Whiteboard-Server produktiv über HTTPS und behandeln Sie den API-Schlüssel als Geheimnis. Der Ursprung muss für Cognis und die Browser der Benutzer erreichbar sein; Reverse Proxies müssen Websocket-Upgrades erlauben. Wegen ablaufender JWTs ist eine synchronisierte Systemzeit erforderlich.

Verwenden Sie ausschließlich die im Manifest deklarierten öffentlichen `ctx`-Capabilities und Flows. Importieren Sie keine Cognis-Interna, übertragen Sie den API-Schlüssel nicht an den Browser, umgehen Sie nicht den Host-Router und senden Sie keine nicht authentifizierten Modulaufrufe. Generieren Sie `manifest.files` nach jeder Änderung neu und halten Sie alle vier Dokumentations- und Sprachvarianten synchron.
