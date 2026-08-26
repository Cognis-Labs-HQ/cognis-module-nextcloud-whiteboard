# Flüssigere Zusammenarbeit am Whiteboard

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
