# Sicherer delegierter Whiteboard-Zugriff für Besprechungsgäste

**Feature-Zweig:** feature-add-delegated-access-support-to-whiteboard

## Besprechungsfreigaben ohne Erweiterung ihres Geltungsbereichs validieren

Whiteboard-Gäste können nun eine validierte Besprechungsfreigabe nur verwenden, wenn Jitsi die Zuordnung zwischen Besprechung und Whiteboard bestätigt und den angeforderten Lese- oder Schreibvorgang ausdrücklich erlaubt. Das Share-Gateway validiert weiterhin die ursprüngliche Besprechungsberechtigung und wandelt sie niemals in eine allgemeine Whiteboard-Freigabe um.

## API-Routenzuständigkeiten übersichtlich halten

Konfigurationsrouten befinden sich jetzt in einem eigenen Modul der API-Schicht, während die zentrale Registrierungsdatei klare Abstände zwischen Importen, UI-Registrierungen und exportierten Funktionen beibehält.

## Commits

- [36613f8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/36613f8aee20aaf968045f9939af5e74010e4de7)
