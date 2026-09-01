# Orchestrierung der Canvas-Mitgliedschaft hinzufügen

**Feature-Zweig:** feature-add-membership-functions-for-ctx-capability

## Direkte Mitgliedschaftsänderungen bereitstellen

Jitsi Meet und andere Orchestratoren können jetzt über die CTX-Capability `whiteboard:membership` mit kanonischen Konto-IDs für Akteur und Benutzer einen Canvas-Teilnehmer hinzufügen oder entfernen. Nur der Canvas-Eigentümer darf diese Änderungen vornehmen, und der Eigentümer kann seinen eigenen Zugriff nicht entfernen.

## Mitgliedschaftsänderungen absichern

Mitgliedschaftsänderungen initialisieren jetzt vor dem Zugriff den Speicher, lehnen ausgeblendete Profile ab, lösen die kanonische Profilidentitäts-Capability des Hosts zum Aufrufzeitpunkt auf, damit ihr aktueller Registrierungs- und Aktivierungszustand berücksichtigt wird, und melden Abhängigkeitsfehler, ohne interne Details offenzulegen.

## Kanonische Handle-Normalisierung wiederverwenden

Alle API-, Zugriffskontroll- und Persistenzpfade verwenden jetzt die Profilidentitäts-Capability des Hosts zur Handle-Normalisierung. Der doppelte moduleigene Normalisierer wurde vollständig entfernt.

## Commits

- [a5d8e7c](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a5d8e7cc98565a24365e0e7f4faf42861c722c56)
- [972b573](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/972b573d595667a3cd6786327b13f3cf08a897d6)
- [ba1ec07](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ba1ec07cde8d4cdaceebdfc6295a3ed08c9eb33b)
- [a2ccce2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a2ccce25543b6b580960bfc71c6d2acf9daec9f0)
- [824bed8](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/824bed8296198c32c69bc928130f7b93c1a56a6f)
