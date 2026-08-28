# Zuverlässige Installation und Konfiguration vor der Aktivierung

**Feature-Zweig:** work

## Konfiguration ist vor der Aktivierung verfügbar

Nextcloud Whiteboard deklariert keine festen Gateway-Abhängigkeiten mehr, die das Laden seiner Konfigurationsrouten im deaktivierten Zustand verhindern können. Laufzeitintegrationen verwenden weiterhin die deklarierten Cognis-Fähigkeiten.

## Installierbares Integritätsinventar

Das Inventar der Paketdateien umfasst nun installierbare reguläre Dateien und schließt reine Repository-Links aus, die das Modulinstallationsprogramm nicht herunterladen kann.

## Symlink der Beitragsrichtlinien beibehalten

Die Beitragsrichtlinien bleiben mit den kanonischen Repository-Anweisungen verknüpft, während das herunterladbare Modulinventar den reinen Repository-Link bewusst ausschließt.

## Installation ohne Anforderung von Repository-Symlinks

Das herunterladbare Manifest schließt nun den Symlink der Beitragsrichtlinien aus, da Repository-Datei-APIs ihn nicht als installierbare Moduldatei bereitstellen. Der Symlink bleibt im Repository unverändert.

## Commits

- [3ec9f03](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/3ec9f03b132007f53ec2ae7d2b18b32754aa7422)

- [d41face](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d41face059249b7eae205a499f487a744b32225b)

- [69f81cf](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/69f81cf0d45b915e02ccb51c2747ea42cb5f4bbf)
