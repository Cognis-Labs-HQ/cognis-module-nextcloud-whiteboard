# Flüssigere Zusammenarbeit am Whiteboard

**Feature-Zweig:** feature-improve-canvas-object-resizing-and-cursor-tracking

## Objekte werden beim Skalieren über eine Achse gespiegelt

Wird ein Skalierungsgriff über die gegenüberliegende Kante gezogen, wird der Objektinhalt jetzt gespiegelt, statt seine vorherige Ausrichtung wiederherzustellen.

## Schnellere Cursor ohne Anfrageflut

Cursor-Aktualisierungen erscheinen jetzt nahezu in Echtzeit, während begrenzte Drosselung und gebündelte Anwesenheitsaktualisierungen den Netzwerkverkehr kontrollieren.

## Unfertige Objekte bleiben sichtbar

Mitwirkende können Text jetzt bereits während der Eingabe sowie Formen während des Zeichnens sehen.

## Koordinaten bleiben bei schnellen Bearbeitungen ausgerichtet

Die Größenanpassung der Zeichenfläche schreibt gemeinsam genutzte Objektkoordinaten nicht mehr um. Dadurch sammeln sich bei schnellen gleichzeitigen Änderungen keine unterschiedlichen Versätze an.

## Standard-Zeichenflächen stellen ihren Rahmen wieder her

Beim Öffnen eines normalen Whiteboards wird die randlose und rahmenlose Komponentendarstellung jetzt ausdrücklich deaktiviert. Dadurch wird ein von einer vorherigen Besprechung verbliebener Layoutzustand ersetzt.

## Komponentenfenster verändern die Seitenhülle nicht mehr

Whiteboard-Komponentenfenster lassen den randlosen Modus der Seitenkomposition jetzt deaktiviert und überlassen die Rahmung ihrem Hostfenster. Dadurch kann die Besprechungsdarstellung bei einer SPA-Navigation nicht auf eine andere Seite übertragen werden.

## Commits

- [c0e93b3](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c0e93b392d2aa3ffcc90fdcff149c1cff6fca293)
- [9b08604](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/9b0860479c280d624734d9415327517ea59926a5)
- [a64b94c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a64b94c3ffd36d56d3f4355d18476b932bd05053)
- [93d0d8a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/93d0d8aa5fcdc7c89eae71208dfada5a6f2d40f4)
- [bdc7b97](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/bdc7b97b510fdd96c816be51df907f7358cb6332)
