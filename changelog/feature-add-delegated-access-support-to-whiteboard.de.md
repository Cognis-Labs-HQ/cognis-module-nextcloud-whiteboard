# Sicherer delegierter Zugriff für Whiteboard-Gäste

**Feature-Zweig:** feature-add-delegated-access-support-to-whiteboard

## Delegierte Freigaben ohne Erweiterung ihres Geltungsbereichs validieren

Whiteboard-Gäste können delegierten Zugriff nur verwenden, wenn das Share-Gateway die Quellfreigabe, ihre anbietereigene Ressourcenzuordnung und den angeforderten Lese- oder Schreibvorgang validiert. Der delegierte Vertrag muss die genaue Whiteboard-Ressource und Fähigkeit zurückgeben, sodass daraus keine weiter gefasste Whiteboard-Freigabe entstehen kann.

## API-Routenzuständigkeiten übersichtlich halten

Konfigurationsrouten befinden sich jetzt in einem eigenen Modul der API-Schicht, während die zentrale Registrierungsdatei klare Abstände zwischen Importen, UI-Registrierungen und exportierten Funktionen beibehält.

## Commits

- [a94759f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a94759fa84f286554fc8eaf35b09e084dd6924c0)
