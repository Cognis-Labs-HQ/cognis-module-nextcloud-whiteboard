# Zuverlässige Installation und Konfiguration vor der Aktivierung

**Feature-Zweig:** work

## Konfiguration ist vor der Aktivierung verfügbar

Nextcloud Whiteboard deklariert keine festen Gateway-Abhängigkeiten mehr, die das Laden seiner Konfigurationsrouten im deaktivierten Zustand verhindern können. Laufzeitintegrationen verwenden weiterhin die deklarierten Cognis-Fähigkeiten.

## Vollständiges Integritätsinventar

Das Inventar der Paketdateien enthält nun die Beitragsrichtlinien und verhindert dadurch bei der Aktivierung eine Integritätswarnung wegen einer fehlenden Prüfsumme.

## Symlink der Beitragsrichtlinien beibehalten

Die Beitragsrichtlinien bleiben mit den kanonischen Repository-Anweisungen verknüpft, während die Manifest-Werkzeuge diesem gültigen Dateilink folgen, um seine Integritätsprüfsumme zu erzeugen und zu validieren.

## Commits

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)
