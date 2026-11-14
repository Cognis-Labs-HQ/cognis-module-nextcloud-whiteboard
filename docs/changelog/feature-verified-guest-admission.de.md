# Verifizierter Gastzugriff

**Feature-Zweig:** `feature-verified-guest-admission`

## Verifizierter Gastzugriff

Ressourcenrouten beziehen verifizierte Gastansprüche über `share:getGuestClaims`, bevor sie das konkrete Whiteboard und die Lese-/Schreibberechtigung prüfen. Bild-, Präsenz-, Sitzungs- und Startanfragen behalten diese Prüfungen einschließlich delegierter Zugriffe bei. Konto- und Verwaltungsrouten erfordern eine reguläre Kontositzung. Das Präfix `share:` in einem Kontonamen kennzeichnet keinen Gast. Installieren Sie vor Aktivierung dieses Modulupdates den Vertrag zur Gastanmeldung des Share-Hosts.

## Schreibgeschützter Transport und Bereitschaft geteilter Boards

Whiteboard-Sitzungstoken setzen die ermittelte Schreibberechtigung jetzt auch am Echtzeitserver durch. Geteilte Zeichenflächen beziehen ihre autorisierte Boardsitzung, bevor sie die Websocket-Bereitschaft mit demselben eingeschränkten Token prüfen. Sie rufen keine kontogebundene globale Vorprüfung auf; die Vorprüfung regulärer Konten und Verwaltungsbeschränkungen bleiben unverändert.

## Commits

- [7d08f5e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7d08f5e91549c0922580d30255902ecf3cc1e0ba)
