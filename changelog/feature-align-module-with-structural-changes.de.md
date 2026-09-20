# Whiteboard an strukturelle Änderungen anpassen

**Feature-Zweig:** feature-align-module-with-structural-changes

## Moduleinträge mit Eigentümerzuordnung verwenden

Nextcloud Whiteboard registriert öffentliche Fähigkeiten und geschützte Erweiterungen der Freigabeabläufe jetzt über seinen bereichsgebundenen Modulkontext. Cognis kann dadurch die Eigentümerschaft der Einträge durchsetzen und alle Registrierungen beim Deaktivieren oder Deinstallieren zuverlässig entfernen.

## Stabilen Whiteboard-Gateway-Vertrag veröffentlichen

Serverintegrationen verwenden weiterhin den etablierten Capability-Namensraum `whiteboard:`, einschließlich `whiteboard:fetchBoardData`, `whiteboard:membership` und `whiteboard:deleteCanvas`. Dies entspricht der dokumentierten Modul-API und stellt die Zuordnungsprüfung sowie die Mitgliedschaftssynchronisierung von Jitsi Meet wieder her.

## Namensraumübergreifende Veröffentlichung ausdrücklich deklarieren

Cognis verlangt jetzt Privilegien, wenn ein Modul außerhalb seines Modul-ID-Namensraums veröffentlicht. Das Manifest fordert daher gezielt Privilegien an, um den etablierten gemeinsamen Gateway-Vertrag `whiteboard:` zu bewahren; die Capability-Registrierung bleibt über den bereichsgebundenen Modulkontext eigentümergebunden.

## Doppelte Registrierungen bei der Aktivierung vermeiden

Das Öffnen von Fenstern hat jetzt genau einen eigentümergebundenen Herausgeber, und Freigabe-Hooks werden pro bereichsgebundenem Kontext nur einmal installiert. Dadurch brechen Konflikte bei Fähigkeiten und Abläufen die Modulaktivierung nicht mehr ab.

## Dateinamensraum nach erneuter Aktivierung wiederverwenden

Bei der Aktivierung wird jetzt zuerst der vorhandene Whiteboard-Dateinamensraum geprüft. Ein vom Datei-Gateway über Deaktivierungs- und Aktivierungszyklen beibehaltener Namensraum wird wiederverwendet, während eine Neuinstallation ihn weiterhin genau einmal registriert.

## Platz der ausgeblendeten Speicheranzeige freigeben

Die Speicherbestätigung klappt beim Ausblenden jetzt ihre Textspur, Innenabstände und Zwischenräume zusammen. Das Erfolgshäkchen kehrt sanft an den Rand der Werkzeugleiste zurück, anstatt eine unsichtbare Lücke in der Breite der Beschriftung zu hinterlassen.

## Animation lokalisierter Beschriftungen bewahren

Der Text der Speicheranzeige liegt in einer überlaufsicheren animierten Spur, sodass Beschriftungen in allen unterstützten Sprachen ein- und ausklappen, ohne benachbarte Steuerelemente zu überdecken.

## Browser-Gateway einmal veröffentlichen

Nextcloud Whiteboard deklariert `whiteboard:uiGateway` jetzt über genau einen dedizierten Capability-Provider. Die Navigationsleiste beansprucht und importiert denselben Provider nicht mehr, sodass in der eigentümergeschützten UI-Registry keine doppelte Registrierung entsteht.

## Jitsi-Meet-Steuerelement wiederherstellen

Jitsi Meet kann die Whiteboard-Canvas-Factory zuverlässig laden, nachdem das Backend die namensgebundenen Server-Capabilities erkannt hat. Dadurch stehen die Whiteboard-Schaltfläche und die Erstellung gemeinsamer Canvas in Meetingfenstern wieder zur Verfügung.

## Einen Capability-Namensraum einheitlich verwenden

Die interne Modul-API, der Aktivierungstest, das Öffnen von Fenstern, die Einbettung, die Board-Prüfung, die Mitgliedschaft, das Löschen und das Browser-Gateway verwenden jetzt einheitlich den Capability-Namensraum `whiteboard:`. Modul-IDs, Routenpfade, Flow-Hook-IDs und CLI-Befehlsnamen bleiben `nextcloud-whiteboard`, da sie das Modul und nicht seinen Capability-Vertrag bezeichnen.

## Vorherige Whiteboards innerhalb des Panels halten

Die Liste der vorherigen Whiteboards belegt jetzt die verbleibende Zeile des Startpanels und scrollt bei jeder Listengröße vertikal. Minimale Grid-Größen und abgeschnittener Panel-Überlauf halten Boardzeilen auch in niedrigen Komponentenfenstern innerhalb des abgerundeten Panels; ein stabiler Scrollleistenbereich verhindert horizontale Layoutverschiebungen.

## Redundantes Verlaufs-Popup entfernen

Das Startpanel zeigt bereits jedes vorherige Whiteboard als direkt auswählbare Zeile an. Daher wurden die doppelte Schaltfläche „Whiteboard-Verlauf“ und ihr nicht interaktives Popup entfernt. Auch die Werkzeugleiste der aktiven Arbeitsfläche bietet dieses Popup ohne Ziel nicht mehr an; dadurch entfallen der Fehler der undefinierten Popup-Capability sowie ungenutzter Code, Texte, Styles und Symbole.

## Jitsi-Whiteboard-Prüfung wiederherstellen

Das Modul veröffentlicht die deklarierten Capabilities `whiteboard:fetchBoardData` und `whiteboard:membership` nun direkt aus seiner initialisierten API-Instanz. Das Manifest deklariert außerdem die Beiträge für den Aktivierungstest und das Öffnen von Fenstern. Das Modul veröffentlicht oder sucht nicht mehr nach der nicht deklarierten Implementierungsfassade `whiteboard:api`, die den Bootstrap-Vorgang unterbrechen konnte, bevor Jitsi Meet den Prüfungsanbieter erkennen konnte.

## Mehr gespeicherte Whiteboards anzeigen

Die Liste gespeicherter Whiteboards kann nun auf die doppelte bisherige Maximalhöhe anwachsen, bevor sie vertikal scrollt. Dadurch sind mehr zuletzt verwendete Arbeitsflächen gleichzeitig sichtbar, während der Überlauf in niedrigeren Fenstern weiterhin begrenzt bleibt.

## Jitsi-Serververtrag mit dem API-Anbieter veröffentlichen

Die für Jitsi bestimmten Capabilities `whiteboard:fetchBoardData`, `whiteboard:membership` und `whiteboard:deleteCanvas` werden nun gemeinsam an der Stelle beigesteuert, an der der Whiteboard-API-Anbieter erstellt wird. Bootstrap initialisiert nur noch UI und API-Registrierung. Dies entspricht der neuesten Jitsi-Meet-Integrationsstruktur und verhindert, dass der Prüfungsvertrag fehlt, obwohl direkte Whiteboard-Routen verfügbar bleiben.

## Die bewährte Jitsi-Anbieterstruktur wiederherstellen

Die initialisierte Whiteboard-API wird genau einmal unter der moduleigenen Capability `nextcloud-whiteboard:api` gespeichert. Bootstrap löst genau diese Instanz auf und veröffentlicht die vier etablierten `whiteboard:`-Verträge, die Jitsi Meet verwendet. Es gibt einen internen Registrierungspfad und einen öffentlichen Integrationspfad, ohne Fallback oder alternatives Registrierungsverhalten.

## Kanonische Whiteboard-Eigentümeridentitäten bereitstellen

Die Board-Prüfung gibt nun `createdByAccountId` zusätzlich zum gespeicherten Nextcloud-Handle zurück. Der Wert wird über die aktuelle Identitäts-Capability von Social Profile aufgelöst und entspricht damit dem kanonischen Modell für externe Konten aus Cognis PR #225; `createdBy` bleibt für Nextcloud sowie bestehende Titel- und Erstellerprüfungen von Jitsi erhalten.

## Commits

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
- [577aea4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/577aea490c999d2385b9d10d6e3f2f3f0e301256)
- [55ecd5a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/55ecd5ade9a70ad7864e5fd9d73d27c7865f7ca1)
- [b622ea5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b622ea5b9fcc7b978a1287b68c9e96aeff3b1b9d)
- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
- [554d48f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/554d48fcd21fb08f5c08c9f902e011047bb0c8f5)
- [7c2d0f1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/7c2d0f1f067ff7b81985168133645d6863b790cc)
- [434d564](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/434d56417a6526813f6e6a5942c0e84f0d725c53)
- [b34069a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b34069ab3c09a29b4916517aee8e0fb757abcba4)
- [27a12c2](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/27a12c2eacbf2354bd02a58818bcd158fdc88210)
- [20350c7](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/20350c7fb16536c0a795cb1bd8c4f4b88239848f)
- [17a3387](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/17a3387f0845b0dfd067d10f8ae45d5cea6cc8c6)
- [a7ec3f9](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/a7ec3f9084dfbbb45543e087ca9931ca0a970712)
- [17d692b](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/17d692b66644d9cde959ac1728d62efa8d67c3a7)
- [d2c85fc](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/d2c85fcc18c0f5eae4dd57de71d12ca5ecca5715)
- [4e77310](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/4e77310afdfd9633870a10aeb8358b9f820d1459)
- [f32d660](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/f32d66062e536f658767dd9a2d6768087c252e8c)
