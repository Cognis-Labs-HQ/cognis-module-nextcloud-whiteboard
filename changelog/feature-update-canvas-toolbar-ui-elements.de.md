# Eine optimierte Whiteboard-Werkzeugleiste

**Feature-Zweig:** feature-update-canvas-toolbar-ui-elements

## Klare, themenfähige Zeichensteuerung

Die Zeichen in der Werkzeugleiste wurden durch einheitliche, in `ui/reuse/assets/` gespeicherte SVG-Symbole ersetzt, die helle und dunkle Designs übernehmen. Außerdem wurde die abgerundete Farbauswahl vergrößert und die Aktion zum Leeren neben dem Canvas-Titel platziert.

## Bessere Textformatierung

Schriftfamilie und Schriftgröße sind jetzt bei aktivem Textwerkzeug verfügbar; zudem wurde die schwebende Textformatleiste ausgewogener gestaltet.

## Fokussierte Komponenten-Canvas

In Komponentenfenstern geöffnete Whiteboards zeigen die Aktionen für ein neues Whiteboard und den Verlauf nicht mehr an.

## Direkte Rückmeldung bei der Zusammenarbeit

Objekt-Ankerpunkte verwenden jetzt einen Zeiger-Cursor. Entfernte Objekte verlieren sofort ihre Auswahl durch andere Personen, und Markierungen unterscheiden aktive Objektinteraktionen und Texteingaben.

## Bestätigung zum Leeren wiederhergestellt

Die Schaltfläche zum Leeren verwendet jetzt eine stabile delegierte Ereignisbehandlung in der Werkzeugleiste und ein natives Button-Element, sodass der Bestätigungsdialog auch nach Aktualisierungen zuverlässig geöffnet wird.

## Präzise Kollaborationszeiger und Auswahlbereinigung

Beim Leeren der Canvas oder Löschen eines Objekts werden jetzt alle zugehörigen lokalen und entfernten Auswahlen aufgehoben. Canvas-eigene Kollaborationszeiger werden häufiger aktualisiert, unterscheiden Bewegung und Texteingabe und weichen beim Zeichnen, Schreiben und Ändern der Größe den Echtzeit-Markierungen.

## Stabiles Layout der Speicheranzeige

Die Werkzeugleiste reserviert jetzt dauerhaft die Breite der übersetzten Gespeichert-Anzeige, sodass ihre Bestätigungsanimation benachbarte Steuerelemente nicht mehr verschiebt.

## Canvas in Viewport-Größe

Whiteboard-Raster und -Karte werden jetzt auf den kleineren Wert aus dem verfügbaren Platz des Elternelements und der dynamischen Viewport-Höhe begrenzt. Die Canvas erzeugt kein Dokument-Scrolling mehr und bleibt über ihre unendliche Verschiebefläche navigierbar.

## Commits

- [5359a44](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5359a44d3a62ae2e05175f96e4f1271802f54544)
- [4affd1e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4affd1ea400a8e2765418394c70af70997330fd8)
- [44cca91](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/44cca91a6dbf3e17f9a28e033e4dd0b9f7d8a631)
- [99ede14](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/99ede14d59284b809d724052c202396f9a810a94)
- [0e906e8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0e906e8b690c1274f9e3f0689cfbe5205a530097)
- [d7d09ed](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d7d09edc43bf57ef9fd16657aee467061ed1230d)
- [e80c294](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/e80c2945c9cced41d4b17faed29aef817b3455d8)
- [4c190bf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4c190bf57de58f5f23972b1fa56feeb53d590bfa)
