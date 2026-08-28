# Zuverlässige Initialisierung der Whiteboard-Datenbank

**Feature-Zweig:** feature-fix-sql-execution-errors

## Gleichzeitige Schemaerstellung verhindern

Whiteboard-Anfragen verwenden jetzt gemeinsam einen einzigen Vorgang zur Initialisierung des Datenbankschemas. Dadurch werden PostgreSQL-Fehler wegen doppelter Typen bei gleichzeitig eintreffenden Anfragen verhindert. Eine fehlgeschlagene Initialisierung kann erneut versucht werden.

## Nur installierbare Repository-Dateien paketieren

Das Modulmanifest führt Repository-Symlinks nicht mehr als herunterladbare Dateien auf. Dadurch schlagen Installationen nicht mehr fehl, wenn die Repository-Datei-API einen Symlink-Pfad nicht bereitstellen kann.

## Commits

- [96d40aa](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96d40aac42fe25c75fa02a0f2bb224896bc3f450)
- [cf6e6b1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/cf6e6b10f2c61e7757d9513db88a84a9a0a65f7f)
