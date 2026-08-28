# Whiteboard-Arbeitsbereich vollständig ausfüllen

**Feature-Zweig:** feature-update-nextcloud-whiteboard-mount-layout

## Neues Einbettungslayout übernehmen

Nextcloud Whiteboard verwendet nun das randlose Page-Composer-Layout mit fester Höhe, damit die Zeichenfläche das verfügbare Widget ohne verschachteltes Scrollen vollständig ausfüllt.

## Überlauf der Zeichenfläche begrenzen

Die Zeichenflächenebene erzeugt keinen eigenen automatischen Scrollbereich mehr, sodass Zeicheninteraktionen am sichtbaren Widget ausgerichtet bleiben.

## Komponentenfenster verfeinern

In Komponenten eingebundene Whiteboards behalten die kollaborative Zeigerverfolgung bei, zeigen aber keine Teilen-Schaltfläche. Ihr Zeichenflächenraster wird auf die Höhe des Elternelements begrenzt und weist der Zeichenfläche nur den unterhalb der Werkzeugleiste verbleibenden Platz zu. So wird vertikaler Überlauf verhindert, während Freigabesteuerungen der vollständigen Whiteboard-Seite vorbehalten bleiben.

## Wiederverwendbare Ressourcen des Hosts verwenden

Der Whiteboard-Browsercode bezieht gemeinsame Hilfsfunktionen und Styles nun über die Fähigkeit `ui:reuse`. Veraltetes Modul-CSS und eine redundante Kapselung gespeicherter Elemente wurden entfernt, sodass Cognis alleiniger Eigentümer des wiederverwendbaren UI-Verhaltens bleibt.

## Commits

- [1c5cd96](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/1c5cd967cfd773f0453ae41429dd37abacb5d046)
- [6bda211](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/6bda2116eb158add7b7d56caee3d8926dd58d7da)
- [cc3318c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/cc3318cda3855bec02fa96bd11056e19b5483f9a)
- [264d2b2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/264d2b2342fbf2c25b1b0e65146e9dbddd0f10c2)
- [f1bf36e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f1bf36e764fa022f7f59e405d697d4fcc0afc049)
- [23dd970](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/23dd970372c2f0d16e379e68cacb733f274ecf4a)
