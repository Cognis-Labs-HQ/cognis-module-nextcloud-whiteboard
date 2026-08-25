# Temporäre Leinwände und zuverlässiges Speichern

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

Whiteboard-Navigation und Verbindungsprüfung befinden sich nun in gezielten Modulen. Dadurch bleibt der Haupteinstieg der Anwendung lesbar, ohne sinnvolle Abstände zu komprimieren oder zu entfernen.
