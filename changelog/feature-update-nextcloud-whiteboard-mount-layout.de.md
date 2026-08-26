# Whiteboard-Arbeitsbereich vollständig ausfüllen

## Neues Einbettungslayout übernehmen

Nextcloud Whiteboard verwendet nun das randlose Page-Composer-Layout mit fester Höhe, damit die Zeichenfläche das verfügbare Widget ohne verschachteltes Scrollen vollständig ausfüllt.

## Überlauf der Zeichenfläche begrenzen

Die Zeichenflächenebene erzeugt keinen eigenen automatischen Scrollbereich mehr, sodass Zeicheninteraktionen am sichtbaren Widget ausgerichtet bleiben.

## Komponentenfenster verfeinern

In Komponenten eingebundene Whiteboards behalten die kollaborative Zeigerverfolgung bei, zeigen aber keine Teilen-Schaltfläche. Einbettungen, die das Elternelement ausfüllen, werden auf die Komponentenhöhe begrenzt, um vertikalen Überlauf zu verhindern; Freigabesteuerungen bleiben der vollständigen Whiteboard-Seite vorbehalten.
