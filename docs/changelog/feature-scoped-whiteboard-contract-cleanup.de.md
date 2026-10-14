# Canvas-Integrationen und Lebenszyklus isolieren

**Feature-Zweig:** feature-scoped-whiteboard-contract-cleanup

## Diagnose in der Zeichenflächen-Verwaltung

Ausgabe 2.3.160 — Die Zeichenflächen-Verwaltung bietet Alle Zeichenflächen, Aktive Zeichenflächen und Problematische Zeichenflächen mit eigenen Leermeldungen. Die Problemansicht zeigt fehlende Eigentümer oder Eigentümerzugriffe, unvollständige Quellverknüpfungen sowie doppelte allgemeine Quellverknüpfungen oder Ressourcenverweise. Kleine Problemmarkierungen erläutern jeden Befund. Die Diagnose verwendet nur Whiteboard-eigene Daten. Die Verwaltung erfordert weiterhin Administratorrechte und gibt keine Zugangsdaten aus.

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

## Standardstruktur und eigene Integration

Vorlagenrichtlinien, domänenspezifische Routenpfade, übersetzte Integrationsdokumentation, ausführbare Strukturprüfungen und endgültige Paket-Hashes synchronisieren. Öffentliche URLs und Modulidentität bleiben erhalten. Browserbeiträge folgen den Lebenszyklusverträgen des zuständigen Hosts.

## Cognis- und Anbieterbild

Das Marketplace-Banner erhält eine Kombination aus Cognis und Anbieter, deren Marken im mittigen sichtbaren Bereich bleiben. Das vorhandene Icon wird beibehalten.

## Einheitliche Marketplace-Texte

Verwenden Sie kurze Aktionszusammenfassungen und konkrete Funktionsbeschreibungen in den Marketplace-Metadaten mit inhaltlich abgestimmten Übersetzungen.

## Zeichenflächen-Verwaltung und Quellzuordnung

Administration → Whiteboards zeigt alle Zeichenflächen mit Eigentümer, Quellzuordnung, aktiven Benutzern und Aktualisierungszeit. Die Filter Alle Zeichenflächen, Aktiv und Integrations-Zeichenflächen begrenzen die Ansicht. Administratives Löschen benötigt eine Bestätigung und widerruft Freigaben, bevor gespeicherte Inhalte, Präsenz, Teilnehmerzugriffe und Benutzerkopien gelöscht werden. Zugriffstokens werden nicht angezeigt. `whiteboard:sourceBinding` bietet `bind` und `release` mit `{whiteboardId, actorAccountId, sourceType, sourceId}`. Nur der Eigentümer darf die Zuordnung ändern. Eine bedingte Aktualisierung weist andere Quellen mit `source_conflict` zurück; dieselbe Quelle kann erneut zuordnen. Die Freigabe betrifft nur die passende Quelle, auch bei der Bereinigung historischer Mehrfachreferenzen. Die Operationen verwenden registrierte Speicher-Flows. Integrationen liefern eigene Quellenkennungen, ohne interne Speicherung oder Darstellung zu lesen.

## Scoped Browser-Aktionen und verifizierte Administration

Quellzuordnung und Löschung von Zeichenflächen erlauben auch Administratoren, die über den öffentlichen Vertrag `auth:accountStore` verifiziert werden. Vor dem Entfernen der Zeichenfläche werden ihre Freigaben sämtlicher Freigabeeigentümer widerrufen. Registrierte Server-Aktionen verwenden Camel Case nach dem unveränderlichen Modulpräfix.

## Wiederverwendbare Canvas-Verknüpfungen

Ausgabe 2.3.157 — `createCanvas` und `createDisposableCanvas` akzeptieren einen allgemeinen `resourceType` und eine `resourceId`. Zusammen lösen sie eine gespeicherte Canvas-Verknüpfung auf; wiederholte und gleichzeitige Anfragen liefern dieselbe autorisierte Zeichenfläche, ohne Inhalte oder Mitgliedschaften zurückzusetzen. Die Datenbank erzwingt einen eindeutigen Referenzschlüssel. Eine vorhandene Zeichenfläche mit anderem Persistenzmodus führt zu einem Konflikt; unberechtigte Aufrufer dürfen sie nicht wiederverwenden. Ohne Verknüpfung entsteht bei dauerhaften Zeichenflächen eine neue unabhängige Zeichenfläche. Löschen entfernt die Verknüpfung und erlaubt eine spätere Neuerstellung.

## Direkte Whiteboard-Seiten ohne Menüeintrag

Ausgabe 2.3.158 — Whiteboards trägt keinen Navigationsmenü-Link mehr bei. Die geschützte Galerie `/whiteboards`, die Zeichenfläche `/whiteboard`, der Darstellungs-Gateway, der Verwaltungsbereich und durchsuchbare Seiten- und Canvas-Einträge bleiben verfügbar. Das Navbar-Plugin verwaltet nur seinen Suchindex und entfernt ihn beim Abbau.

## Allgemeine Wiederherstellung fehlender Zeichenflächen

Ausgabe 2.3.159 — Anbieter-Metadaten veröffentlichen eine neutrale resourceReference mit resourceType und resourceId. Integrationen verwenden diese öffentliche Identität ohne Kenntnis der Speicherung. Löschen entfernt den Referenzschlüssel; eine spätere autorisierte Auflösung oder Erstellung liefert einen leeren Ersatz. Eine angemeldete eigenständige Seite darf bei einem echten not_found-Sitzungsfehler einen Ersatz über eine allgemeine Canvas-Verknüpfung erstellen, einmal laden und aktive ID sowie URL aktualisieren. Geteilte und eingebettete Ansichten erstellen keinen unabhängigen Ersatz. Berechtigungs- und Dienstfehler werden weitergegeben; erneutes Fehlen startet keine Wiederholungsschleife. Erfolg wird per Toast gemeldet und die Anbieter-Auflösung ohne Zugangsdaten protokolliert.

## Commits

- [b78213e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b78213eb77660d59c9bac3aafe2dfd2677a488b0)
- [a42cff8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a42cff8c865ae0388fd3ded03d2e957e9ff5dd3e)
- [a79203e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a79203ed13a22bfe77ae59c32efe5b43b331c559)
- [c818b40](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c818b40db5010cb220cb54ffd23bc45940539f44)
- [05e253c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/05e253c37054f54197c4f79511f722ef96df4631)
- [6ea9026](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/6ea902628f55686585e8f709ff0ddf79a1632a83)
- [080abb5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/080abb5cb88fee15491b2ef17787dfb7226890c3)
- [0db0f41](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0db0f410182c2c8d897360bc818e670ae391130e)
- [bd1f069](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/bd1f069c5bc597469c0b06cc7377ab4b837d6902)
- [b35f85d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b35f85daa2fd905fa6cf4efe2c1fc092f5c7bee5)
- [c8ecbc2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c8ecbc2fb2c8471a95302e9c92aea69f767e7501)
- [569cdc2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/569cdc2e3296f1d665b75bff1240f6738e084deb)
- [f90735c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f90735ca73e8df6644171083dd07f24e2d544515)
- [df1396f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/df1396fb4fb02272a31edcf9c274c2d3d5ba8e02)
