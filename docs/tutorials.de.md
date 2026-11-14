# Geführtes Tutorial

Dieses Modul bindet seinen Einführungsablauf über `ui:tutorials` an seine eigene Seite. Beim ersten zulässigen Besuch startet er automatisch; das Fragezeichen-SVG neben dem Seitentitel wiederholt ihn. Der Host muss den seitengebundenen Tutorialvertrag der Version eins bereitstellen.

## Anwendungsbeispiele

Bereitschaft und Schreibberechtigung sind getrennte, vom Besitzer bestätigte Zustände. Nach dem Laden sehen alle Betrachter die Verbindungserklärung. Zeichen- und Verlaufsschritte erfordern Schreibzugriff; schreibgeschützte Empfänger erhalten stattdessen eine Anleitung zum Verschieben und Zoomen. Unverfügbare Bearbeitungs- und Freigabeaktionen entfallen aus Ablauf und Schrittzahl.

## Technische Spezifikation

Anbietertests prüfen den öffentlichen Vertrag, alle vier Übersetzungen, Verfügbarkeitsregeln, Fehlerbereinigung und die Ablehnung nicht unterstützter Host-Versionen.

Die Erklärung zum Löschen einer Zeichenfläche hebt die angezeigte Löschen-Schaltfläche hervor. Der erste nutzbare Treffer wird im Tutorial-Abschnitt gewählt; ohne passenden Treffer wird der Schritt übersprungen.

Der gemeinsame Host stellt schwebende Aktionen über seine Warteschlange bereit. Erstbesuche bieten Weiter/Fertig ohne Abbrechen oder Überspringen; Wiederholungen bieten Überspringen vor dem letzten sichtbaren Schritt. Neustart erscheint nach dem ersten sichtbaren Schritt. Abschlüsse bleiben nach Inhaltsänderungen gültig. Ausdrückliche highlightNext-Angaben aktivieren nur die Atemanimation für Erklärungen; reduzierte Bewegung deaktiviert sie. Jeder Schritt hebt ein anderes reales Bedienelement in UI-Reihenfolge hervor. Anleitungen bleiben an die aktuelle Ansicht gebunden, behandeln leere und optionale Zustände und räumen bei Navigation oder Besitzerentfernung auf.

Wählen Sie auf der Whiteboard-Startseite Neue Zeichenfläche oder eine gespeicherte Fläche. Diese bewusste Aktion startet den Zeichenzweig, der auf den Abschluss des Ladevorgangs wartet. Erst danach erscheinen Erklärungen zu Zeichenwerkzeugen, Fläche und Verlauf sowie Speichern und Teilen. Weiter ohne geöffnete Fläche überspringt den Zweig; eine bereits offene Fläche beginnt direkt bei den Werkzeugen. Ausgeblendete Flächen oder fehlgeschlagene Ladevorgänge gelten nicht als bereit.

Die Konfigurationsanleitung verwendet den Host-Abschnitt weiterhin als Suchbereich und hebt das vom Modul dargestellte Formular mit Server-URL, API-Schlüssel und Uploadlimit hervor. Layoutkennungen des Composers sind keine Tutorialziele.
