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
