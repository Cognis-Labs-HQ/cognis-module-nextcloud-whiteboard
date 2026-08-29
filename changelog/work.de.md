# Sicherer delegierter Whiteboard-Zugriff für Besprechungsgäste

**Feature-Zweig:** work

## Besprechungsfreigaben ohne Erweiterung ihres Geltungsbereichs validieren

Whiteboard-Gäste können nun eine validierte Besprechungsfreigabe nur verwenden, wenn Jitsi die Zuordnung zwischen Besprechung und Whiteboard bestätigt und den angeforderten Lese- oder Schreibvorgang ausdrücklich erlaubt. Das Share-Gateway validiert weiterhin die ursprüngliche Besprechungsberechtigung und wandelt sie niemals in eine allgemeine Whiteboard-Freigabe um.

## Commits

- [7071266](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7071266c0fe1c836292431d0f41344bfa9a58f7f)
