# Zuverlässige Wiederherstellung des Whiteboards nach erneuter Verbindung

**Feature-Zweig:** feature-fix-whiteboard-canvas-refresh-issue

## Gemeinsame Zeichenfläche nach dem Aktualisieren sofort wiederherstellen

Teilnehmende, die einem eingebetteten Whiteboard mit mehreren Personen erneut beitreten, fordern nun die aktuelle Szene von verbundenen Personen an. Vorhandene Objekte werden dadurch angezeigt, ohne auf eine Bearbeitung oder Auswahl durch andere Teilnehmende zu warten. Jede verbundene Person kann auf die Synchronisierungsanfrage antworten. Beim Empfang einer neuen Bearbeitung senden die verbundenen Personen außerdem die zusammengeführte Szene zurück, sodass die Zeichenfläche auch dann wiederhergestellt wird, wenn die erste Antwort ausbleibt.

## Commits

- [c706dc0](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c706dc04e59c0a0f9b316b41f5d672bafc404966)
- [89fce71](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/89fce716329e2cbf7a26ac7a09a04fd0551a086b)
