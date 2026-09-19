# Whiteboard an strukturelle Änderungen anpassen

**Feature-Zweig:** feature-align-module-with-structural-changes

## Moduleinträge mit Eigentümerzuordnung verwenden

Nextcloud Whiteboard registriert öffentliche Fähigkeiten und geschützte Erweiterungen der Freigabeabläufe jetzt über seinen bereichsgebundenen Modulkontext. Cognis kann dadurch die Eigentümerschaft der Einträge durchsetzen und alle Registrierungen beim Deaktivieren oder Deinstallieren zuverlässig entfernen.

## Fähigkeiten im Modulnamensraum veröffentlichen

Alle moduleigenen Fähigkeitskennungen verwenden jetzt das Präfix `nextcloud-whiteboard:`. Der veraltete Bootstrap-Berichtshook und der direkte Zugriff auf den Systemkontext wurden entfernt, sodass die modulübergreifende Zusammenarbeit dem aktuellen Vertrag für externe Module entspricht.

## Unprivilegiert bleiben

Die von diesem Modul erweiterten Freigabeabläufe sind keine sicherheitskritischen Cognis-Abläufe, und jede veröffentlichte Server-Capability verwendet den eigenen Namensraum `nextcloud-whiteboard:`. Das Manifest bleibt daher unprivilegiert, während der stabile browserseitige Vertrag `whiteboard:uiGateway` Jitsi Meet weiterhin über den dedizierten UI-Provider zur Verfügung steht.

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

## Commits

- [5b3091d](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/5b3091d251c64ff9989c5fefd259a08a683cc057)
- [577aea4](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/577aea490c999d2385b9d10d6e3f2f3f0e301256)
- [55ecd5a](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/55ecd5ade9a70ad7864e5fd9d73d27c7865f7ca1)
- [b622ea5](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/b622ea5b9fcc7b978a1287b68c9e96aeff3b1b9d)
- [ada67ca](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/ada67ca7ed874031661d172af3c6ad279eca3a30)
- [554d48f](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/554d48fcd21fb08f5c08c9f902e011047bb0c8f5)
