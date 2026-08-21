# Nextcloud Whiteboard

[English](README.en.md) · **Deutsch** · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Kollaborative Whiteboards auf Basis von Nextcloud mit integrierter Cognis-Zugriffskontrolle. Dieses Repository ist ein eigenständiges externes Cognis-Modul.

## Erste Schritte

Installieren Sie das Modul über den Modul-Marktplatz oder legen Sie es im konfigurierten Verzeichnis für externe Module ab. Aktivieren Sie es, öffnen Sie **Nextcloud Whiteboard Settings** und konfigurieren Sie die Whiteboard-Server-URL, das Bild-Upload-Limit und den gemeinsamen API-Schlüssel.

Benutzer können unter `/whiteboards` Boards erstellen und auswählen und anschließend unter `/whiteboard?id=<board-id>` zusammenarbeiten. Eigentümer können über den Freigabedialog des Hosts Lese- oder Schreibzugriff gewähren.

## Prüfungen für Mitwirkende

```sh
npm install
npm run lint
npm test
npm run check:manifest
git diff --check
```

Lesen Sie [`docs/standard.de.md`](docs/standard.de.md) für Konfiguration, Capabilities, Routen, Sicherheitsgrenzen und Betriebshinweise.
