# Temporäre Leinwände und zuverlässiges Speichern

**Feature-Zweig:** feature-implement-disposable-canvas-feature

## Temporäre Besprechungsleinwände

Integrierte Aufrufer können temporäre Leinwände öffnen, die nur gespeichert werden, wenn ein einzelner Benutzer Speichern drückt.

## Gespeicherte Kopien für mehrere Benutzer

Reguläre Leinwände erstellen und aktualisieren nun eine gespeicherte Kopie für jedes Mitglied; Kopien widerrufener Freigaben werden entfernt.

## Übersichtlichere Startseite und Speicherstatus

Die Karte wächst bei zusätzlichen Leinwänden und scrollt nach vier Einträgen; die Statusanzeige bestätigt Speichervorgänge mit einem animierten Häkchen und dem Hinweis Gespeichert.

## Gateway für Besprechungsintegrationen

Das globale Browser-UI-Gateway ermöglicht Besprechungsintegrationen nun, eine synchronisierte temporäre Leinwand zu erstellen oder aufzulösen, ohne von den HTTP-Routen eines anderen Moduls abzuhängen.

## Kompatible Registrierung der UI-Funktion

Das Whiteboard-Gateway verwendet nun die kanonische Browser-API zum Beitragen von Funktionen, ohne einen Laufzeitfehler bei der verzögerten Anmeldung oder ein allgemeines Fehlerfenster auszulösen.

## Erkennung des Whiteboard-Gateway-Anbieters

Der Whiteboard-Navigationsleisteneintrag deklariert nun seine Browser-Funktion, damit der Host-Anbieterlader das Gateway importiert, bevor Jitsi seine optionale Whiteboard-Schaltfläche bindet.

## Eingebettete temporäre Leinwände öffnen

Komponentenfenster verwenden nun den übergebenen Fokuszustand und öffnen sofort die angeforderte temporäre Leinwand, statt die Whiteboard-Startseite anzuzeigen.

## Elementbezogene Komponentenfenster

Elementbezogene Komponenten-Mounts bleiben nun rahmenlos und warten, bis die fokussierte temporäre Leinwand geöffnet ist, bevor die Komponentenseite als bereit gemeldet wird.

## Geschützter Komponentenlebenszyklus

Whiteboard-Komponenten-Mounts beachten nun die Navigationsrichtlinie des Hosts und geben einen idempotenten Destroy-Handle für den geschützten Komponentenfenster-Lebenszyklus zurück.

## Übergabe der vorbereiteten Besprechungsleinwand

Das Browser-Gateway behält nun die vorbereitete temporäre Leinwand bei, sodass der Komponenten-Mount die genaue Leinwand wiederherstellen kann, wenn ein Host einen umschlossenen oder unvollständigen Fokuskontext liefert.

## Routensichere Komponentenbereinigung

Die Komponentenbereinigung entfernt nun ihren Abbruch-Listener, ignoriert veraltete Mount-Handles und löscht den Whiteboard-Mount-Zustand, bevor Cognis die durch discardAll gesteuerte SPA-Navigation abschließt.

## Routenbezogener Direkteinstieg

Der Whiteboard-Browsereinstieg führt eine automatische direkte Einbindung nun nur unter /whiteboard und /whiteboards aus, sodass Komponentenimporte auf anderen Seiten nicht in ein fremdes Host-Root eingebunden werden.

## Kompakte Leinwand-Werkzeugleiste

Die Leinwand-Werkzeugleiste scrollt Zeichenwerkzeuge nun in schmalen Komponentenfenstern und hält den Speicherstatus sichtbar; Änderungen an temporären Leinwänden zeigen bis zum Speichern stets eine hervorgehobene Speichern-Schaltfläche.

## Umgebrochene Werkzeugleiste und private temporäre Leinwände

Kompakte Werkzeugleisten brechen Bedienelemente nun in verfügbare Zeilen um, statt horizontal zu scrollen. Temporäre Leinwände zeigen Speichern sofort an, halten die Schaltfläche bei Änderungen sichtbar und blenden Freigabesteuerungen aus.

## Eine synchronisierte Leinwand für jedes speichernde Mitglied

Manuelles und automatisches Speichern legt nun die vollständige gemeinschaftliche Leinwand als maßgeblichen Stand ab. Beim erneuten Öffnen einer geteilten Leinwand erhalten alle denselben aktuellen Inhalt, während bei Wegwerf-Leinwänden nur die Kopien der Mitglieder aktualisiert werden, die sich für das Speichern entschieden haben.

## Konfliktsichere Zusammenarbeit und Rückgängig-Funktion

Gleichzeitige Speichervorgänge werden nun nacheinander ausgeführt, damit Änderungen eines Teilnehmers nicht die eines anderen überschreiben. Rückgängig und Wiederholen veröffentlichen außerdem neuere Elementrevisionen, und die Bedienelemente temporärer Sitzungen werden aktualisiert, sobald die Sitzungsdaten verfügbar sind.

## Wartbare Anwendungsmodule

Whiteboard-Navigation und Verbindungsprüfung befinden sich nun in gezielten Modulen. Der Haupteinstieg der Anwendung behält klare Leerzeilen zwischen allen Funktionen auf oberster Ebene und bleibt ohne komprimierte Formatierung lesbar.

## Commits

- [456de64](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/456de64983b6986869dfa66094e4b7bcdd48cfcc)
- [1a7f5f6](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/1a7f5f6f12268886a79afb3c51ed4f2b966b282d)
- [f033368](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f03336872aee142eac55cdea8c92d71a42de3755)
- [8778738](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8778738e12e864855d02f8f99076fca7504b1b22)
- [2cfb57e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/2cfb57e1ef85ef9dcdce0caeeecb7405b7a01a12)
- [7458d9e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7458d9ec32920a361d12e38c0c08b3cf571d6857)
- [71c41ad](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/71c41ad6a516a09c3c5c3e0454391ed63335c29b)
- [946d0dc](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/946d0dc64258f227c718b6627f54bdb4346aa1a6)
- [f822dbe](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f822dbe74798c2a8811cf59ffb8b410c1887cff8)
- [02841fd](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/02841fda50435799a91e4ebc97d2c192aa168247)
- [3f7a212](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3f7a2127625a9b60edc21eac8e0924544da1b6d6)
- [407852f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/407852fcfefdb72fc5c0d28d41a8889bd039b450)
- [4a69ab1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4a69ab19d181394dd8d96815ed0387cb03d756e0)
- [96a577d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96a577d1c4200e82ddf46f3be484bd972c8d57fb)
- [a55768d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a55768d1b367d662b84254069a682fd94d3a88ad)
- [b38fef2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b38fef2316dd81957f95542ceef74e5fcb7d0cee)
