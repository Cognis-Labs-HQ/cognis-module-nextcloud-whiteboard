# Dokumentation und Hostverträge

**Feature-Zweig:** feature-documentation-core-alignment

## Strukturierte Dokumentation

Info, Anwendung und Technik bilden vollständige lokalisierte Dokumentfamilien im Modulmanifest. Einführung, praktische Abläufe und aktuelle API-/Konfigurationsverträge besitzen eigene Ansichten. Strikte Gliederungs-, Verweis- und Dateinamenprüfungen laufen in eigenständigen Tests und CI. Quelldateilinks folgen dem Standardzweig; Änderungslinks behalten kurze Commitbezeichnungen.

## Gatewaydiagnosen

Laufzeitdiagnosen verwenden das Logging-Gateway des Hosts und dessen Ausgaberichtlinie. Befehlsberichte nutzen Terminalausgaben. Die Prüfung nativer Konsole umfasst Modul-JavaScript einschließlich Aliasen und berechneter Zugriffe. Anbieterlebenszyklen, Berechtigungen und Anleitungsabschluss-IDs bleiben erhalten.

## Aussagekräftige Bindungsnamen

Die Syntaxbaumprüfung untersucht Deklarationen, Exporte, Destrukturierungen, Laufzeit- und Typsignaturparameter, Konstruktor-Parametereigenschaften, Catch-Bindungen, Importe, benannte Funktionen und Klassen, Laufzeitbindungen von Enums und Namensräumen sowie private Mitglieder unabhängig von der Formatierung. Sie erfasst Quelltext, Werkzeuge, Tests und Testdaten ohne Altbestands- oder Dateiausnahmen. Undurchsichtige Kurzformen, abgekürzte Pluralformen, nummerierte Platzhalter und verwendete ignorierte Bindungen lassen die Prüfung fehlschlagen. Übliche Entwicklerbegriffe wie `args`, `db`, LDAP-`dn`, HTTP-`req`/`res`, `env`, `opts` und `params` bleiben zulässig; das Glossar definiert den vollständigen Wortschatz. Weitere kurze Ausnahmen sind ein ungenutztes, nicht exportiertes `_`, `id` und numerische `i`/`j`/`k`-Zähler mit passenden arithmetischen Aktualisierungen. Koordinaten und Abmessungen erhalten aussagekräftige lokale Namen. Eigene Hilfs- und Speicher-APIs verwenden ihre aussagekräftigen Namen direkt in Deklarationen, Exporten, Importen und Aufrufern; reine Umbenennungsaliase für Importe und Exporte schlagen fehl. Verbraucher müssen die kanonischen Exporte statt verkürzter Aliase verwenden. Öffentliche Nutzdatenschlüssel, Fähigkeitsbezeichner und reine Typbezeichner behalten ihre Vertragsrollen. Lokalisierte Handbücher, Beitragsrichtlinien, Modulversionen, Sperrdateien und Paketprüfsummen sind synchronisiert.

## Commits

- [c0dde31](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/c0dde315cdeeadec8ff3a04b675bac27cb2c7a10)
- [4ab4b9e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4ab4b9e56f66725ebbba6e68119315d88746bf83)
- [47e398a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/47e398a31fbdaf984827cc0934102f60ee8b2836)
