# Orchestrierung der Canvas-Mitgliedschaft hinzufügen

**Feature-Zweig:** feature-add-membership-functions-for-ctx-capability

## Direkte Mitgliedschaftsänderungen bereitstellen

Jitsi Meet und andere Orchestratoren können jetzt über die CTX-Capability `whiteboard:membership` mit kanonischen Konto-IDs für Akteur und Benutzer einen Canvas-Teilnehmer hinzufügen oder entfernen. Nur der Canvas-Eigentümer darf diese Änderungen vornehmen, und der Eigentümer kann seinen eigenen Zugriff nicht entfernen.

## Mitgliedschaftsänderungen absichern

Mitgliedschaftsänderungen initialisieren jetzt vor dem Zugriff den Speicher, lehnen ausgeblendete Profile ab, verwenden die kanonische Profilidentitäts-Capability des Hosts und melden Abhängigkeitsfehler, ohne interne Details offenzulegen.

## Commits

- [972b573](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/972b573d595667a3cd6786327b13f3cf08a897d6)
- [ba1ec07](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ba1ec07cde8d4cdaceebdfc6295a3ed08c9eb33b)
