# Dokumentation und Hostverträge

**Feature-Zweig:** feature-documentation-core-alignment

## Strukturierte Dokumentation

Info, Anwendung und Technik bilden vollständige lokalisierte Dokumentfamilien im Modulmanifest. Einführung, praktische Abläufe und aktuelle API-/Konfigurationsverträge besitzen eigene Ansichten. Strikte Gliederungs-, Verweis- und Dateinamenprüfungen laufen in eigenständigen Tests und CI. Quelldateilinks folgen dem Standardzweig; Änderungslinks behalten kurze Commitbezeichnungen.

## Gatewaydiagnosen

Laufzeitdiagnosen verwenden das Logging-Gateway des Hosts und dessen Ausgaberichtlinie. Befehlsberichte nutzen Terminalausgaben. Die Prüfung nativer Konsole umfasst Modul-JavaScript einschließlich Aliasen und berechneter Zugriffe. Anbieterlebenszyklen, Berechtigungen und Anleitungsabschluss-IDs bleiben erhalten.

## Aussagekräftige Bindungsnamen

Die Syntaxbaumprüfung erfasst JavaScript- und TypeScript-Quelltext, Werkzeuge, Tests und Testdaten ohne Altbestands- oder Dateiausnahmen. Sie prüft Laufzeitbindungen, Signaturparameter, private Mitglieder sowie eigene zusammengesetzte Typ- und Methodennamen. Übliche Kurzformen bleiben als direkte Namen wie `db`, `this.db`, `args` und LDAP-`dn` zulässig. Zusammengesetzte Namen schreiben andere Kurzformen als Maßeinheiten aus, auch bei übernommenen Bezeichnern: `DatabaseExecutor`, `KeyringDatabaseExecutor`, `createDatabaseExecutor`, `baseDistinguishedName` und `registerStaticDirectory`. Undurchsichtige Kurzformen, nummerierte Platzhalter und verwendete ignorierte Bindungen lassen die Prüfung fehlschlagen. Ein ungenutztes, nicht exportiertes `_`, `id` und arithmetische `i`/`j`/`k`-Zähler behalten ihre festgelegten Rollen. Generische Typparameter, kanonische Abhängigkeits- und Plattformnamen sowie öffentliche Nutzdatenschlüssel behalten ihre Verträge. Eigene API-Deklarationen, Importe, Exporte und Aufrufer verwenden denselben Namen; reine Umbenennungsaliase einschließlich Typaliasen schlagen fehl. Regressionstestfälle sichern die Unterscheidung direkter und zusammengesetzter Namen sowie kanonische Plattform-APIs. Lokalisierte Handbücher, Beitragsrichtlinien, Modulversionen, Sperrdateien und Paketprüfsummen sind synchronisiert. Maßeinheiten wie `ms`, `sec`, `px`, `rad` und `deg` bleiben in zusammengesetzten Namen abgekürzt. Zeit- und Pixelangaben verwenden wieder Formen wie `INVITE_EXPIRY_MS`, `timeoutMs` und `widthPx`. Regressionstestfälle sichern die Einheitenausnahme, ohne undurchsichtige benachbarte Wörter zuzulassen.

## Commits

- [c0dde31](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c0dde315cdeeadec8ff3a04b675bac27cb2c7a10)
- [4ab4b9e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4ab4b9e56f66725ebbba6e68119315d88746bf83)
- [47e398a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/47e398a31fbdaf984827cc0934102f60ee8b2836)
- [4b2745a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4b2745a8cbb3be64b2a0079931350cfbea63dadb)
- [33e5b34](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/33e5b3468e3ad19a327401320b39864cec12fba1)
