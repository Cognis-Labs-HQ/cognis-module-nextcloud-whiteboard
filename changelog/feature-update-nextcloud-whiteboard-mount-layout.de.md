# Whiteboard-Arbeitsbereich vollständig ausfüllen

## Neues Einbettungslayout übernehmen

Nextcloud Whiteboard verwendet nun das randlose Page-Composer-Layout mit fester Höhe, damit die Zeichenfläche das verfügbare Widget ohne verschachteltes Scrollen vollständig ausfüllt.

## Überlauf der Zeichenfläche begrenzen

Die Zeichenflächenebene erzeugt keinen eigenen automatischen Scrollbereich mehr, sodass Zeicheninteraktionen am sichtbaren Widget ausgerichtet bleiben.

## Komponentenfenster verfeinern

In Komponenten eingebundene Whiteboards behalten die kollaborative Zeigerverfolgung bei, zeigen aber keine Teilen-Schaltfläche. Ihr Zeichenflächenraster wird auf die Höhe des Elternelements begrenzt und weist der Zeichenfläche nur den unterhalb der Werkzeugleiste verbleibenden Platz zu. So wird vertikaler Überlauf verhindert, während Freigabesteuerungen der vollständigen Whiteboard-Seite vorbehalten bleiben.

## Wiederverwendbare Ressourcen des Hosts verwenden

Der Whiteboard-Browsercode bezieht gemeinsame Hilfsfunktionen und Styles nun über die Fähigkeit `ui:reuse`. Veraltetes Modul-CSS und eine redundante Kapselung gespeicherter Elemente wurden entfernt, sodass Cognis alleiniger Eigentümer des wiederverwendbaren UI-Verhaltens bleibt.
