# Zuverlässige Initialisierung der Whiteboard-Datenbank

**Feature-Zweig:** feature-fix-sql-execution-errors

## Gleichzeitige Schemaerstellung verhindern

Whiteboard-Anfragen verwenden jetzt gemeinsam einen einzigen Vorgang zur Initialisierung des Datenbankschemas. Dadurch werden PostgreSQL-Fehler wegen doppelter Typen bei gleichzeitig eintreffenden Anfragen verhindert. Eine fehlgeschlagene Initialisierung kann erneut versucht werden.

## Commits

- [96d40aa](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96d40aac42fe25c75fa02a0f2bb224896bc3f450)
