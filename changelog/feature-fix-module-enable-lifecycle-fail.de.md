# Zuverlässiger Aktivierungslebenszyklus für Whiteboard

**Feature-Zweig:** feature-fix-module-enable-lifecycle-fail

## Konfiguration vor der Aktivierung isolieren

Nextcloud Whiteboard deklariert nun einen eigenen API-Einstiegspunkt für den deaktivierten Zustand, der ausschließlich Konfigurations- und Aktivierungstestrouten registriert. Laufzeitrouten, Speichernamensräume, Freigabeflüsse und öffentliche Whiteboard-Fähigkeiten werden erst bei der Aktivierung bereitgestellt.

## Konfigurationsregistrierung sicher gemeinsam nutzen

Die aktivierten und deaktivierten API-Einstiegspunkte verwenden dieselbe Konfigurationsschicht. Dadurch bleiben Validierung, Erreichbarkeitstest, Authentifizierung und Antworten bei nicht verfügbaren Abhängigkeiten in allen Lebenszykluszuständen konsistent.

## Vertrag für den deaktivierten Lebenszyklus prüfen

Automatisierte Tests bestätigen den Manifest-Einstiegspunkt und stellen sicher, dass die Registrierung im deaktivierten Zustand nur Routen vor der Aktivierung bereitstellt, ohne Laufzeitfähigkeiten für Dateien oder Freigaben anzufordern.

## Commits

- [8d61422](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8d61422c80b020af8d4734b7bc52e213b83da5d0)
