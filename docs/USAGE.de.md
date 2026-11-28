# Anwendung

Erstellen und teilen Sie gemeinsame Zeichenflächen in Cognis.

## Voraussetzungen

Ein Administrator muss Whiteboard-Server und API-Schlüssel einrichten. Cognis und Browser müssen den Server erreichen. Bearbeitung erfordert Schreibzugriff auf die gewählte Tafel.

## Beispiele

Öffnen Sie Whiteboard und wählen Sie eine neue oder gespeicherte Tafel. Warten Sie auf den Verbindungsstatus und zeichnen oder lesen Sie entsprechend Ihren Rechten.

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

Bereitschaft und Schreibberechtigung sind getrennte, vom Besitzer bestätigte Zustände. Nach dem Laden sehen alle Betrachter die Verbindungserklärung. Zeichen- und Verlaufsschritte erfordern Schreibzugriff; schreibgeschützte Empfänger erhalten stattdessen eine Anleitung zum Verschieben und Zoomen. Unverfügbare Bearbeitungs- und Freigabeaktionen entfallen aus Ablauf und Schrittzahl.

## Erwartete Ergebnisse

Berechtigte Teilnehmer sehen dieselbe Tafel. Zeichnungen werden synchronisiert; Verschieben betrifft nur Ihren Ausschnitt. Das Speichern einer temporären Zeichenfläche erstellt eine dauerhafte Kopie.

## Fehlerbehebung

Prüfen Sie bei Vorbereitungsfehlern Erreichbarkeit, Websocket-Proxy und Schlüssel. Lesezugriff blendet Bearbeitungsaktionen aus; Schreibzugriff vergibt der Eigentümer.
