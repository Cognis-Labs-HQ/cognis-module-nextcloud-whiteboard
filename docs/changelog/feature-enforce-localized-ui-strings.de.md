# Strikte UI-Lokalisierung

**Feature-Zweig:** `feature-enforce-localized-ui-strings`

## Sprachschlüssel ohne wörtliche Ersatztexte verlangen

Die KI-Anweisungen verbieten fest kodierte englische Benutzertexte in allen Abläufen. Fehlende Werte der bevorzugten Sprache dürfen dieselben Schlüssel der englischen XML-Ressourcen verwenden. Fehlende oder leere englische Ersatzwerte müssen ausdrücklich einen Fehler auslösen, statt englische Literale, rohe Schlüssel oder leeren Text anzuzeigen. Fehler wegen fehlender Übersetzungen dürfen nicht unterdrückt werden.

## Commits
- [6860827](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/68608270ef654c2a4f46308488254eaf3644f77b)
