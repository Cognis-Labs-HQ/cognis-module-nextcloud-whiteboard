# Zuverlässige Installation und Konfiguration vor der Aktivierung

**Feature-Zweig:** feature-fix-module-enablement-errors

## Konfiguration ist vor der Aktivierung verfügbar

Nextcloud Whiteboard trennt seine erforderlichen Cognis-Kernkomponenten von Abhängigkeiten zu externen Modulen, damit Cognis für jeden Abhängigkeitstyp die richtigen Lebenszyklusregeln anwenden kann.

## Installierbares Integritätsinventar

Das Inventar der Paketdateien umfasst nun installierbare reguläre Dateien und schließt reine Repository-Links aus, die das Modulinstallationsprogramm nicht herunterladen kann.

## Symlink der Beitragsrichtlinien beibehalten

Die Beitragsrichtlinien bleiben mit den kanonischen Repository-Anweisungen verknüpft, während das herunterladbare Modulinventar den reinen Repository-Link bewusst ausschließt.

## Installation ohne Anforderung von Repository-Symlinks

Das herunterladbare Manifest schließt nun den Symlink der Beitragsrichtlinien aus, da Repository-Datei-APIs ihn nicht als installierbare Moduldatei bereitstellen. Der Symlink bleibt im Repository unverändert.

## Abhängigkeitsmetadaten an Cognis ausrichten

UUIDs von Kernkomponenten verbleiben in `requires`, während die neuen Felder `hardDependencies` und `softDependencies` ausdrücklich festlegen, dass Nextcloud Whiteboard keine Installationsabhängigkeiten zu externen Modulen besitzt.

## Platz für Speicherbestätigung nur bei Sichtbarkeit verwenden

Die „Gespeichert“-Anzeige reserviert im ausgeblendeten Zustand keinen Platz mehr in der Werkzeugleiste. Für ihre Bestätigungsanimation wird sie in das Layout eingeblendet und nach Ende der Animation wieder entfernt.

## Nur tatsächliche Zeichenflächenänderungen speichern

Reine Auswahlklicks lösen kein Inhaltsänderungsereignis mehr aus. Ein Klick auf eine unveränderte Zeichenfläche startet daher weder die Speicherung noch die Speicherbestätigung.

## Laufende Zeichnungen nur bei anderen anzeigen

Zeichnungsentwürfe werden als vorübergehende Kollaborationsaktualisierungen gekennzeichnet und in einer separaten Ebene für entfernte Entwürfe dargestellt. Sie werden aus gespeicherten Momentaufnahmen und Antworten anderer Teilnehmer ausgeschlossen, damit Ersteller kein zurückgesendetes Geisterbild ihres eigenen Objekts sehen.

## Vorschauen der Zusammenarbeit vorübergehend halten

Laufende Verschiebungen, Größenänderungen und Textbearbeitungen bleiben nun in der entfernten Vorschauebene, statt in die dauerhafte Szene zu gelangen. Aufgegebene Zeichnungsvorschauen werden nach Möglichkeit abgebrochen und laufen automatisch ab, wenn getrennte Beteiligte sie nicht mehr aktualisieren.

## Funktionen der Zeichenflächenanwendung organisieren

Das Verhalten der Zeichenflächen-Werkzeugleiste befindet sich nun in einem gezielten Modul, und die Normalisierung entfernter Auswahlen ist in einer wiederverwendbaren Zeichenflächenebene gebündelt, anstatt übergroße Anwendungsdateien zu benötigen.

## Commits

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)

- [69f81cf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/69f81cf0d45b915e02ccb51c2747ea42cb5f4bbf)

- [608dbd1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/608dbd18c9b362450d603f7e5d73585b22bf031d)

- [0098018](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0098018a714ce03e75bd4e6dc92fe06dd9db35f9)

- [0a66697](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/0a66697637c4d93eca95eac47297787c08726320)

- [aa53f27](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/aa53f276825ec86376d4dbf74f830a72d1e0aff5)
