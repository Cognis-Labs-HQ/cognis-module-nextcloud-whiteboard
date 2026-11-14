# Geführte Anleitungen

**Feature-Zweig:** feature-guided-tutorials

## Seitenanleitungen

Anleitungen behandeln Boardauswahl, Zeichenwerkzeuge, Ansicht, Verlauf, Speichern und Teilen sowie administrative Zeichenflächenverwaltung und Konfiguration.

Der Host verwaltet Hinweise, Pfeile, Hervorhebung, Barrierefreiheit und das gemeinsame schwebende Aktionsmenü. Erstdurchläufe bieten stets Weiter, ohne Abbrechen oder Überspringen. Wiederholungen bieten Abbrechen mit `btn-cancel`. Der Abschluss wird im Browser pro Konto gespeichert. Navigation, Zugriffsverlust und Anbieterentfernung beenden die Sitzung; fehlgeschlagenes Mounten nimmt Registrierungen zurück.

## Beschreibende Anleitungsschlüssel

Die Übersetzungsschlüssel und Zielkennungen der Anleitungsschritte beschreiben ihr Thema statt ihrer Position. Dieselben Schlüssel sind in allen vier unterstützten Sprachen vorhanden.

## Weiter-Hinweise pro Schritt festlegen

Jeder Tutorial-Schritt legt `highlightNext` ausdrücklich fest: Erklärungen, die Weiter oder Fertig benötigen, aktivieren den Hinweis; interaktive und wartebasierte Übungen deaktivieren ihn. Bei reduzierter Bewegung bleibt eine statische Umrandung.

Alle UI-Komponenten benötigen eine Anleitung. Die Beitragsrichtlinien verlangen nutzerorientierte Aufgabenabläufe und eine Prüfung bestehender Anleitungen bei neuen Funktionen oder geänderter Bedienung.

## Präzise Ziele und erneuter Zweigstart

Die Erklärung zum Löschen einer Zeichenfläche hebt die angezeigte Löschen-Schaltfläche hervor. Der erste nutzbare Treffer wird im Tutorial-Abschnitt gewählt; ohne passenden Treffer wird der Schritt übersprungen.

## Sichtbare Tutorial-Ziele

Tutorial-Ziele und Weiter-Hinweise sind ausdrücklich festgelegt.

## Gemeinsame Menüwarteschlange

Menüs folgen der gemeinsamen Host-Warteschlange und der Komponentenlebensdauer.

## Dokumentierte Wiederherstellungsaktionen

Bei fehlenden Zielen stehen Weiter und Tutorial neu starten bereit; Wiederholungen bieten auch Abbrechen.

## Gezielte Tutorialführung

Anleitungen erklären unterschiedliche sichtbare Bedienelemente in UI-Reihenfolge. Die gemeinsamen Vorgaben behandeln aktive Ansichten, stabile Beispiele, Leerzustände, bedingte Zweige und Lebensdauerbereinigung. Wiederholungsaktionen und Dokumentation zu reduzierter Bewegung entsprechen dem gemeinsamen Host.

## Einheitliche Übersetzungskataloge

Übersetzungsschlüssel verwenden in Modulmetadaten und Tutorials durchgehend kleingeschriebene, durch Punkte getrennte Wörter. Katalogeinträge behalten ihre ursprünglichen Übersetzungen und entsprechen der umgebenden XML-Einrückung. Strenge Namensraumprüfungen weisen Bindestriche und Unterstriche in Übersetzungsschlüsseln zurück. Modul-IDs, UUIDs, Fähigkeiten und Tutorialabschluss-Bezeichner bleiben unverändert.

## Vor dem Zeichnen eine Fläche öffnen

Wählen Sie auf der Whiteboard-Startseite Neue Zeichenfläche oder eine gespeicherte Fläche. Diese bewusste Aktion startet den Zeichenzweig, der auf den Abschluss des Ladevorgangs wartet. Erst danach erscheinen Erklärungen zu Zeichenwerkzeugen, Fläche und Verlauf sowie Speichern und Teilen. Weiter ohne geöffnete Fläche überspringt den Zweig; eine bereits offene Fläche beginnt direkt bei den Werkzeugen. Ausgeblendete Flächen oder fehlgeschlagene Ladevorgänge gelten nicht als bereit.

## Vollständige und zugängliche Anleitungen

Bereitschaft und Schreibberechtigung sind getrennte, vom Besitzer bestätigte Zustände. Nach dem Laden sehen alle Betrachter die Verbindungserklärung. Zeichen- und Verlaufsschritte erfordern Schreibzugriff; schreibgeschützte Empfänger erhalten stattdessen eine Anleitung zum Verschieben und Zoomen. Unverfügbare Bearbeitungs- und Freigabeaktionen entfallen aus Ablauf und Schrittzahl.

## Commits

- [b63cde3](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b63cde3de36183dd8426cad60e10112c9084571e)
- [93579f2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/93579f26a30ba1f4a2c778c37861e0ddaf0a3b80)
- [b97812e](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b97812eb7fc854cfaa042c4342bbb713b3609162)
- [d9e3d34](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d9e3d346f2a3c878067dbb9d79e4624c28daf63d)
- [14a33e6](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/14a33e61511202c5c9c2e855f034e554ffd26d7e)
- [12e63fe54](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/12e63fe545ad3a0d93848bfc8b627723fff6f1de)
- [8e73fc9d4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/8e73fc9d42b9731cc7fe0ea5265840a95e086134)
- [988d611](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/988d611e9c81379ac87e58f3e5373437ac72c227)
- [31c9ddb](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/31c9ddb55be15a7bd45329e8e8f1e36b16c44ef4)
- [1cae081](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/1cae081454f489da6d998e5ba9543fd23cff7d03)
