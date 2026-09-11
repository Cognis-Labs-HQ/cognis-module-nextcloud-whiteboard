# Zuverlässiger Aktivierungslebenszyklus für Whiteboard

**Feature-Zweig:** feature-fix-module-enable-lifecycle-fail

## Konfiguration vor der Aktivierung isolieren

Nextcloud Whiteboard deklariert nun einen eigenen API-Einstiegspunkt für den deaktivierten Zustand, der ausschließlich Konfigurations- und Aktivierungstestrouten registriert. Laufzeitrouten, Speichernamensräume, Freigabeflüsse und öffentliche Whiteboard-Fähigkeiten werden erst bei der Aktivierung bereitgestellt.

## Konfigurationsregistrierung sicher gemeinsam nutzen

Die aktivierten und deaktivierten API-Einstiegspunkte verwenden dieselbe Konfigurationsschicht. Dadurch bleiben Validierung, Erreichbarkeitstest, Authentifizierung und Antworten bei nicht verfügbaren Abhängigkeiten in allen Lebenszykluszuständen konsistent.

## Vertrag für den deaktivierten Lebenszyklus prüfen

Automatisierte Tests bestätigen den Manifest-Einstiegspunkt und stellen sicher, dass die Registrierung im deaktivierten Zustand nur Routen vor der Aktivierung bereitstellt, ohne Laufzeitfähigkeiten für Dateien oder Freigaben anzufordern.

## Verschärfte Modulgrenzenprüfung bestehen

Der Whiteboard-Browser bezieht den UI-Kontext des Hosts nun aus dessen öffentlicher globaler Fähigkeitsregistrierung, statt einen internen Cognis-Pfad zu importieren. Die Schaltfläche zum Leeren verwendet jetzt eine moduleigene Stilklasse. Damit sind beide Prüfverstöße behoben, die die Aktivierung blockiert haben.

## Erreichbarkeitsprüfung vor dem Start verfügbar halten

Die Laufzeitroute für die Vorabprüfung importiert nun ausdrücklich das gemeinsame Zeitlimit für die Erreichbarkeitsprüfung. Dadurch entsteht nach der Auslagerung der Konfigurationsregistrierung kein Referenzfehler mehr. Ein Regressionstest bestätigt, dass die Route das gemeinsame Zeitlimit verwendet.

## Commits

- [b725331](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b725331e48adff3f25bdd40447b22f41a2d2045b)

- [7e22cba](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7e22cbaf70bd8f0184b000e757ac1c268059645f)
