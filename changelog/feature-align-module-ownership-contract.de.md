# Bereichsgebundene und überprüfbare Whiteboard-Integration

**Feature-Zweig:** feature-align-module-ownership-contract

## Moduleinträge mit Eigentümerzuordnung verwenden

Nextcloud Whiteboard registriert öffentliche Fähigkeiten und geschützte Erweiterungen der Freigabeabläufe jetzt über seinen bereichsgebundenen Modulkontext. Cognis kann dadurch die Eigentümerschaft der Einträge durchsetzen und alle Registrierungen beim Deaktivieren oder Deinstallieren zuverlässig entfernen.

## Fähigkeiten im Modulnamensraum veröffentlichen

Alle moduleigenen Fähigkeitskennungen verwenden jetzt das Präfix `nextcloud-whiteboard:`. Der veraltete Bootstrap-Berichtshook und der direkte Zugriff auf den Systemkontext wurden entfernt, sodass die modulübergreifende Zusammenarbeit dem aktuellen Vertrag für externe Module entspricht.

## Geschützte Integration ausdrücklich deklarieren

Das Manifest fordert jetzt den privilegierten Status an, da das Modul Freigabeabläufe von Cognis erweitert. Offizielle Installationen können anhand ihrer vertrauenswürdigen Quelle und der Hashwerte der Paketdateien überprüft werden; Tests sichern die Anforderungen an Namensraum und Privilegien ab.

## Commits

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
