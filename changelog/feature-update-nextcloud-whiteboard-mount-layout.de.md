# Whiteboard-Arbeitsbereich vollständig ausfüllen

## Neues Einbettungslayout übernehmen

Nextcloud Whiteboard verwendet nun das randlose Page-Composer-Layout mit fester Höhe, damit die Zeichenfläche das verfügbare Widget ohne verschachteltes Scrollen vollständig ausfüllt.

## Überlauf der Zeichenfläche begrenzen

Die Zeichenflächenebene erzeugt keinen eigenen automatischen Scrollbereich mehr, sodass Zeicheninteraktionen am sichtbaren Widget ausgerichtet bleiben.

## Komponentenfenster vereinfachen

In Komponenten eingebundene Whiteboards zeigen weder den Zeigerumschalter des Hosts noch die Teilen-Schaltfläche. Dadurch verursacht die Zeigersteuerung keinen vertikalen Überlauf mehr und die Freigabesteuerung bleibt der vollständigen Whiteboard-Seite vorbehalten.
