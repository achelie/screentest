import type { TestGuidance, TestGuidanceId } from "./test-guidance";

export const DE_TEST_GUIDANCE = {
  guided: {
    steps: [
      "Reinige den Bildschirm und nutze deine übliche Helligkeit. Wähle Vollbild öffnen oder drücke F, damit du mehr vom Panel prüfen kannst.",
      "Prüfe mit Weiter oder den Pfeiltasten alle sechs Muster: Weiß, Schwarz, RGB, Grau, Verlauf und Bewegung. Schau auch an die Ränder und in alle Ecken.",
      "Wähle für jedes Muster Sieht normal aus, Etwas aufgefallen oder Überspringen. Klicke bei Bewegung auf Ziel starten, falls das Ziel stillsteht, und folge ihm mit den Augen.",
      "Nach deiner Antwort zum sechsten Muster öffnet sich die Zusammenfassung. Lies alle Einträge und prüfe verdächtige Stellen mit dem passenden Einzeltest nach.",
    ],
    normal: [
      "Du hast alle sechs Muster tatsächlich geprüft und mit Sieht normal aus markiert. Dabei fielen dir keine festen Pixelfehler, störenden Flecken, harten Verlaufsstreifen oder deutlichen Bewegungsschlieren auf.",
      "Übersprungen und Nicht geprüft bedeuten, dass dieser Durchgang unvollständig ist. Sie zählen nicht als normales Ergebnis.",
    ],
    results: [
      { signal: "Nichts Auffälliges gefunden", meaning: "Du hast alle sechs Prüfungen als normal markiert. Das beschreibt deine Beobachtung in diesem Durchgang, keine vollständige Hardwarediagnose." },
      { signal: "Diese Prüfung ist noch nicht vollständig", meaning: "Mindestens ein Muster wurde übersprungen oder nicht geprüft. Hole diese Prüfungen nach, bevor du das gesamte Display beurteilst." },
      { signal: "Eine oder mehrere Prüfungen genauer ansehen", meaning: "Die Zahl zählt Muster, bei denen dir etwas aufgefallen ist. Prüfe diese Muster und die noch offenen Einträge mit den jeweiligen Einzeltests nach." },
    ],
    troubleshooting: [
      "Wenn das Ziel stillsteht, wähle Ziel starten. Eine Einstellung für reduzierte Bewegung kann es pausieren. Ein stilles Ziel zeigt keine Bewegungsschlieren.",
      "Wenn der Browser Vollbild ablehnt oder nicht unterstützt, prüfe die Fläche auf dieser Seite oder nutze den Vollbildbefehl des Browsers. Bereiche außerhalb der Testfläche bleiben ungeprüft.",
      "Wenn du eine Stelle nicht einordnen kannst, reinige den Bildschirm und prüfe sie aus deinem üblichen Blickwinkel mit dem passenden Einzeltest. Erneut testen beginnt einen frischen Durchgang.",
    ],
    limitation: "Der Browser zeigt Muster und fasst deine Antworten zusammen. Er kann das Panel nicht sehen, Fehler nicht reparieren und keine Rückgabe oder Garantie entscheiden. Deine Antworten bleiben auf dieser Seite.",
  },
  "dead-pixel": {
    steps: [
      "Entferne Staub und nutze eine angenehme Alltagseinstellung für die Helligkeit. Wähle Vollbild öffnen oder drücke F.",
      "Wechsle mit den Farbtasten, Weiter oder den Pfeiltasten durch Weiß, Schwarz, Rot, Grün und Blau. Pausiere einen automatischen Wechsel, während du eine Stelle prüfst.",
      "Suche auf jedem Hintergrund in der Mitte, an allen Rändern und in den vier Ecken. Prüfe, ob ein verdächtiger Punkt beim Farbwechsel genau an derselben Stelle bleibt.",
      "Notiere die Stelle und die Hintergründe, auf denen du den Punkt siehst. Beende Vollbild, sobald du alle fünf Farben geprüft hast.",
    ],
    normal: ["Auf den geprüften Hintergründen bleibt kein fester Punkt dunkel, hell oder in der falschen Farbe. Ein unauffälliger Durchgang gilt nur für die sichtbare Testfläche."],
    results: [
      { signal: "Dunkler Punkt auf hellen Hintergründen", meaning: "Ein Pixel oder Teilpixel reagiert möglicherweise nicht. Staub oder ein Schaden an der Oberfläche kann ähnlich aussehen. Reinige deshalb zuerst." },
      { signal: "Heller oder farbiger Punkt auf Schwarz", meaning: "Ein Pixel oder Teilpixel könnte festhängen. Prüfe, ob der Punkt beim Hintergrundwechsel an derselben Stelle bleibt." },
      { signal: "Der Fleck erscheint auf einem Screenshot auf einem anderen Display", meaning: "Prüfe die App, das Ausgangsbild, den Treiber oder das Betriebssystem. Ein physischer Panelfehler erscheint nicht im Screenshot selbst." },
    ],
    troubleshooting: [
      "Reinige vorsichtig und wiederhole dieselben Farben. Drücke oder reibe nicht auf einen verdächtigen Pixel.",
      "Sieh dir einen Screenshot auf einem anderen funktionierenden Bildschirm an. Fehlt der Punkt dort, spricht das eher für dieses Panel oder seine Oberfläche. Allein beweist es die Ursache nicht.",
      "Wenn die Steuerung einen Rand verdeckt, blende sie mit H aus oder nutze den Vollbildbefehl des Browsers. Notiere Bereiche, die du nicht prüfen konntest.",
    ],
    limitation: "Das ist eine Sichtprüfung auf Pixelfehler. Die Seite zählt keine Defekte automatisch, repariert keine Pixel und wendet keine zulässige Fehlerzahl des Herstellers an.",
  },
  "backlight-bleed": {
    steps: [
      "Dunkle den Raum ab und nutze die Helligkeit, mit der du dunkle Spiele oder Filme ansiehst. Sitze in deinem üblichen Abstand gerade vor der Bildschirmmitte.",
      "Wähle Vollbild öffnen oder drücke F für die schwarze Fläche. Nutze Steuerung ausblenden oder H, damit die Leiste die Ränder nicht aufhellt.",
      "Prüfe Ränder und Ecken. Bewege den Kopf dann etwas nach links und rechts. Notiere, welche hellen Stellen fest bleiben und welche sich mit dem Blickwinkel ändern.",
      "Vergleiche verdächtige Stellen mit einer dunklen Szene, die du normalerweise ansiehst. Blende zum Schluss die Steuerung wieder ein und beende Vollbild.",
    ],
    normal: ["Von deinem üblichen Sitzplatz bei Alltagshelligkeit stört dich kein fester heller Fleck in dunklen Inhalten. Ein leichtes Leuchten, das sich mit dem Blickwinkel ändert, beweist allein keinen Defekt."],
    results: [
      { signal: "Ein heller Fleck am Rand bleibt fest", meaning: "Das passt zu Backlight Bleeding oder ungleichmäßiger Hintergrundbeleuchtung. Prüfe, ob die Stelle auch in echten Inhalten stört." },
      { signal: "Das Leuchten ändert sich mit deiner Kopfposition", meaning: "Der Blickwinkel kann zum Leuchten beitragen. Prüfe erneut gerade vor der Mitte in deinem üblichen Abstand." },
      { signal: "Ein Foto wirkt viel heller als der Bildschirm", meaning: "Die automatische Belichtung kann helle Flecken übertreiben. Nimm zuerst das, was du mit eigenen Augen siehst, als Referenz." },
    ],
    troubleshooting: [
      "Verringere Spiegelungen, blende die Steuerung aus und wiederhole den Test bei deiner üblichen Helligkeit. Ein Foto bei maximaler Helligkeit reicht nicht zur Beurteilung.",
      "Ändere Blickwinkel und Abstand leicht. Feste Flecken und mitwanderndes Leuchten liefern unterschiedliche Hinweise.",
      "Wenn reines Schwarz die Stelle verbirgt, öffne den Graustufentest. OLED hat keine LCD-Hintergrundbeleuchtung. Unebenheiten nahe Schwarz brauchen eine graue Fläche.",
    ],
    limitation: "Paneltyp, Raumlicht, lokale Dimmung und Blickwinkel verändern das Ergebnis. Diese Seite misst keinen Kontrast und legt keine Garantiegrenze fest.",
  },
  grayscale: {
    steps: [
      "Lass einen frisch eingeschalteten Bildschirm erst warm werden. Nutze deine übliche Helligkeit und sitze gerade davor.",
      "Wähle Vollbild öffnen oder drücke F. Prüfe nacheinander alle Graustufen: 5 %, 10 %, 25 %, 50 %, 75 % und 100 %.",
      "Suche auf jeder Stufe in der Mitte, an den Rändern und in den Ecken nach festen Wolken, senkrechten Bändern oder größeren Farbstichen. Halte deine Kopfposition dabei gleich.",
      "Notiere auffällige Stufen und Stellen. Vergleiche sie mit gewöhnlichen Szenen, etwa einem Himmel oder einem Kameraschwenk. Beende Vollbild nach allen sechs Stufen.",
    ],
    normal: ["Auf den geprüften Stufen fallen keine festen Wolken, Bänder oder großen verfärbten Bereiche auf. Leichte Unterschiede nahe Schwarz stören dich in gewöhnlichen Inhalten nicht."],
    results: [
      { signal: "Wolkige dunkle Stellen oder feste Bänder", meaning: "Das deutet auf ungleichmäßige Helligkeit hin, oft Dirty Screen Effect genannt. Prüfe, ob die Stellen am selben Ort bleiben." },
      { signal: "Ein Bereich wirkt rosa, grün oder blau", meaning: "Farbgleichmäßigkeit oder Blickwinkel können beteiligt sein. Prüfe erneut mit dem Kopf vor der Bildschirmmitte." },
      { signal: "Nur die dunkelsten Flächen wirken ungleichmäßig", meaning: "Das Verhalten nahe Schwarz hängt vom Panel und seiner Aufwärmzeit ab. Ein einzelnes Muster beweist keinen Defekt." },
    ],
    troubleshooting: [
      "Lass das Panel warm werden und wiederhole die betroffenen Stufen bei gleicher Helligkeit und gleichem Blickwinkel.",
      "Prüfe eine ruhige echte Szene. Handybelichtung, dunklere Bildränder durch die Kamera und Kompression können Flecken auf Fotos erzeugen oder verstärken.",
      "Lass bei OLED die normale automatische Pflege nach Herstelleranleitung laufen. Wiederholte manuelle Pixelauffrischung gehört nicht zu diesem Test.",
    ],
    limitation: "Diese Sichtprüfung misst keine Helligkeitsgleichmäßigkeit. Paneltechnik, Blickwinkel und Umgebung beeinflussen deine Beobachtung.",
  },
  gradient: {
    steps: [
      "Nutze einen neutralen Bildmodus und schalte ungewöhnliche Kontrast- oder Farbverstärkung aus. Halte Helligkeit und Anzeigemodus während des Vergleichs gleich.",
      "Öffne Vollbild, wähle Neutral und prüfe die Richtungen Horizontal und Vertikal.",
      "Wiederhole den Test mit Rot, Grün und Blau. Folge jedem Verlauf von dunkel nach hell und suche nach breiten abrupten Streifen oder Blöcken.",
      "Notiere Farbkanal und Richtung einer Unterbrechung. Vergleiche den Verlauf einmal in einem anderen Browser und beende danach Vollbild.",
    ],
    normal: ["Die Übergänge wirken in beiden Richtungen gleichmäßig. Auf den geprüften Farbkanälen fallen keine breiten abrupten Streifen, Blöcke oder plötzlichen Farbsprünge auf."],
    results: [
      { signal: "Ein weicher Verlauf zerfällt in harte Streifen", meaning: "Im Anzeigeweg entstehen sichtbare Stufen. Browser, Ausgabefarbtiefe, Bildverarbeitung oder Panel können dazu beitragen." },
      { signal: "Nur ein Farbkanal zeigt starke Bänder", meaning: "Eine Einstellung für diesen Kanal oder das Panelverhalten könnte beteiligt sein. Vergleiche denselben Kanal in einem anderen Browser." },
      { signal: "Die Bänder ändern sich nach einem Moduswechsel", meaning: "Farbprofil, Farbtiefe, Ausgabebereich oder Bildverbesserung beeinflussen den Verlauf." },
    ],
    troubleshooting: [
      "Wiederhole den Test in einem anderen aktuellen Browser mit denselben Displayeinstellungen. So kannst du prüfen, ob die Darstellung die Bänder verändert.",
      "Prüfe Farbtiefe und Ausgabebereich der Grafikkarte, das Systemfarbprofil sowie HDR oder SDR. Ändere jeweils nur eine Einstellung.",
      "Schalte starke Kontrastverstärkung, Black Equalizer oder Farbverstärkung aus und vergleiche erneut. Wenn nur ein Video Streifen zeigt, prüfe auch dessen Kompression.",
    ],
    limitation: "Die Seite erzeugt Verläufe ohne Bildkompression. Browser und Anzeigeweg beeinflussen sie trotzdem. Sie bestätigt keine Panel-Farbtiefe oder Farbgenauigkeit.",
  },
  motion: {
    steps: [
      "Nutze deine übliche Bildwiederholrate und Overdrive-Einstellung. Lass das Fenster auf dem Bildschirm, den du prüfen willst.",
      "Das Ziel startet pausiert bei 480 px/s. Wähle zuerst 240 px/s und dann Ziel starten. Vollbild allein startet die Bewegung nicht.",
      "Folge dem Ziel mit den Augen und achte auf die hintere Kante. Vergleiche mit den Geschwindigkeitstasten auch 480 und 960 px/s. Lass die übrigen Einstellungen gleich.",
      "Wenn du Overdrive-Modi vergleichst, ändere nur eine Displayeinstellung und wiederhole dieselbe Geschwindigkeit. Wähle zum Schluss Ziel pausieren.",
    ],
    normal: ["An der bewegten Kante fallen keine störende dunkle Schliere oder helle umgekehrte Kontur auf. Etwas Bewegungsunschärfe kann auch bei einem funktionierenden Display bleiben."],
    results: [
      { signal: "Eine dunkle Spur folgt dem Ziel", meaning: "Langsame Pixelübergänge können Schlieren erzeugen. Vergleiche eine andere Overdrive-Einstellung bei derselben Geschwindigkeit." },
      { signal: "Eine helle oder umgekehrte Kontur folgt dem Ziel", meaning: "Overdrive kann überschwingen. Eine weniger starke Reaktionszeiteinstellung kann die Kante sauberer machen." },
      { signal: "Das ganze Ziel springt oder hält an", meaning: "Browser-Timing, Systemlast oder die eingestellte Bildwiederholrate können Ruckeln verursachen. Das unterscheidet sich von einer Spur hinter der Kante." },
    ],
    troubleshooting: [
      "Wenn sich nichts bewegt, wähle eine Geschwindigkeit und Ziel starten. Ein Tab im Hintergrund oder reduzierte Bewegung kann das Ziel pausieren.",
      "Schließe stark ausgelastete Tabs und Apps. Halte diese Seite im Vordergrund und prüfe die Bildwiederholrate sowie den Energiesparmodus im System.",
      "Beginne erneut mit 240 px/s, bevor du schneller testest. Vergleiche dieselbe Displayeinstellung bei derselben Geschwindigkeit, damit du eine Änderung zuordnen kannst.",
    ],
    limitation: "Das ist ein Sichtvergleich des Bewegungsverhaltens. Er misst weder Reaktionszeit in Millisekunden noch Eingabeverzögerung oder die tatsächliche Monitorfrequenz.",
  },
  color: {
    steps: [
      "Schalte Nachtlicht, Blaulichtfilter und automatische Farbanpassung für einen neutralen Vergleich aus. Nutze deine übliche Helligkeit.",
      "Öffne Vollbild und wähle manuell Weiß, Schwarz, Rot, Grün, Blau, Cyan, Magenta und Gelb. Mit Weiter oder den Pfeiltasten wechselst du die Farbe.",
      "Prüfe Mitte und Ränder jeder Fläche auf feste ungewöhnliche Punkte oder verfärbte Bereiche. Vergleiche zuerst verschiedene Stellen desselben Bildschirms.",
      "Der automatische Wechsel ist optional. Pausiere ihn, um eine Stelle genauer anzusehen. Notiere die betroffenen Farben und beende Vollbild nach allen acht Flächen.",
    ],
    normal: ["Jede einfarbige Fläche wirkt im sichtbaren Bereich gleichmäßig. Du siehst keine festen Pixel in der falschen Farbe oder große unerwartete Farbflecken."],
    results: [
      { signal: "Ein Punkt übernimmt die Hintergrundfarbe nicht", meaning: "Ein Teilpixel könnte festhängen oder ausfallen. Prüfe ihn mit dem Pixelfehler-Test auf einem sauberen Bildschirm nach." },
      { signal: "Eine einfarbige Fläche wirkt fleckig", meaning: "Helligkeit oder Farben könnten ungleichmäßig sein. Vergleiche andere Farben und den Graustufentest." },
      { signal: "Handy und Monitor zeigen unterschiedliche Farben", meaning: "Bildmodus, Helligkeit, Weißpunkt, Farbraum und Profile unterscheiden sich. Ein Unterschied allein bedeutet nicht, dass eines der Panels defekt ist." },
    ],
    troubleshooting: [
      "Schalte Nachtmodus und automatische Farbanpassung aus. Wiederhole den Test in einem neutralen Bildmodus bei fester Helligkeit.",
      "Gleiche beim Vergleich zweier Geräte zunächst Modus und ungefähre Helligkeit an. Ein unkalibriertes Gerät ist keine genaue Farbreferenz.",
      "Pausiere den automatischen Wechsel und prüfe jede Fläche manuell. Bleibt eine Stelle unklar, reinige den Bildschirm und vergleiche mit einem anderen Browser.",
    ],
    limitation: "Einfarbige Flächen zeigen sichtbare Unterschiede. Sie messen keine Farbfehler, keinen Weißpunkt und keine Farbraumabdeckung. Sie erstellen kein kalibriertes Farbprofil.",
  },
  "touch-screen-test": {
    steps: [
      "Reinige und trockne den Bildschirm und deine Finger. Wähle auf einem Touch-Gerät Touch-Test starten. Mit der Maus kannst du nur das Raster ausprobieren.",
      "Bewege zwei oder mehr Finger gleichzeitig, bevor du das Raster füllst. So wird die Spitze aufgezeichnet. Die Live-Zähler sind nur im Seitenmodus sichtbar; Vollbild blendet sie aus. Lies Beobachtete Spitze später im Ergebnis.",
      "Ziehe danach einen Finger langsam durch die übrigen Felder, auch an den Rändern und in den vier Ecken. Lass die Testfläche gleich groß und prüfe leere Stellen noch einmal langsam.",
      "Bei vollständiger Abdeckung endet der Test automatisch. Zum früheren Beenden verlässt du Vollbild mit Esc oder hältst den Ausstiegsbereich oben rechts im Raster etwa eine Sekunde gedrückt. Wähle dann Beenden.",
      "Prüfe die eingefrorene Karte und die beobachtete Spitze. Ergebnis herunterladen speichert die Karte. Erneut testen beginnt einen neuen Durchgang.",
    ],
    normal: [
      "Der erfasste Pfad deckt in diesem Durchgang das ganze Testraster ab. Es bleiben keine wiederholt leeren Bereiche oder unerklärlichen Sprünge im Fingerpfad.",
      "Beobachtete Spitze ist die höchste Zahl gleichzeitiger Eingaben, die der Browser in diesem Durchgang erfasst hat. Sie bestätigt nicht die maximale Touch-Kapazität des Geräts. Ein Mauspfad bleibt eine Vorschau.",
    ],
    results: [
      { signal: "100 % Abdeckung", meaning: "Der aufgezeichnete Pfad deckt das gesamte Testraster dieses Durchgangs ab, auch Felder zwischen beobachteten Eingabepunkten. Das bestätigt weder die gesamte Touch-Hardware noch Bereiche außerhalb des Rasters." },
      { signal: "Derselbe zusammenhängende Bereich bleibt leer", meaning: "Eine tote Touch-Zone ist möglich. Ein ausgelassener Pfad, Schutzfolie, Randgeste oder Browserverhalten kann ebenfalls leere Felder hinterlassen." },
      { signal: "Pfade springen oder es erscheinen weniger Eingaben", meaning: "Feuchtigkeit, Störungen beim Laden, Touch-Limits oder die Ereignisverarbeitung des Browsers können beitragen. Die Spitze ist eine Beobachtung, keine Gerätespezifikation." },
    ],
    troubleshooting: [
      "Wenn du eine Maus nutzt, wiederhole den Test mit Fingern auf dem tatsächlichen Touch-Gerät, bevor du dessen Touch-Hardware beurteilst.",
      "Reinige und trockne die Oberfläche und ziehe das Ladekabel ab. Entferne eine störende Hülle oder Schutzfolie, wenn das praktisch möglich ist. Prüfe denselben leeren Bereich erneut langsam.",
      "Starte bei einer Größenänderung oder Drehung des Handys neu, damit du ein einheitliches Raster prüfst. Wenn Vollbild scheitert, teste hier und notiere, dass du nur diese Fläche abdeckst.",
    ],
    limitation: "Die Seite zeichnet nur Eingaben auf, die der Browser erhält. Sie liest keine Controller-Firmware, garantiert keine Abtastgenauigkeit und bestätigt nach einer vollständigen Karte keine bestandene Hardwareprüfung.",
  },
  "hdr-test": {
    steps: [
      "Schiebe das Fenster auf den Bildschirm, den du prüfen willst. Aktiviere HDR im Betriebssystem, wenn du HDR testen möchtest, und lass den Anzeigemodus gleich.",
      "Wähle Erkennung und lies die Browserberichte zu Dynamikumfang und Farbraum. Notiere HDR erkannt, SDR gemeldet oder Abfrage nicht verfügbar.",
      "Wechsle zu Dynamikumfang und prüfe dunkle Felder, Weißstufen und den kleinen hellen Bereich. Wähle dann Großer Farbraum und vergleiche die Farbspalten.",
      "Nutze die Modustasten oder Pfeiltasten. Vollbild ist optional. Notiere Browser, Anzeigemodus und sichtbare Unterschiede, bevor du den Test beendest.",
    ],
    normal: [
      "Du kannst den Fähigkeitsbericht des Browsers und die sichtbaren Unterschiede festhalten. In den Mustern fallen keine unerwartet verschmolzenen Stufen oder störenden Lichthöfe auf. Der Bericht bestätigt nicht, dass HDR gerade eingeschaltet ist.",
      "SDR gemeldet oder Abfrage nicht verfügbar bedeutet, dass der Browser die Fähigkeit hier nicht bestätigt. Prüfe zuerst Einstellungen und Browser, statt daraus einen Hardwarefehler abzuleiten.",
      "Es gibt hier kein Gesamtergebnis HDR bestanden. Ein Fähigkeitssignal und ein sichtbares Muster beantworten unterschiedliche Fragen.",
    ],
    results: [
      { signal: "HDR erkannt oder hoher Dynamikumfang gemeldet", meaning: "Der Browser meldet für die aktuelle Umgebung ein Fähigkeitssignal für hohen Dynamikumfang. Das bestätigt keine Spitzenhelligkeit oder HDR-Zertifizierung." },
      { signal: "SDR gemeldet oder Abfrage nicht verfügbar", meaning: "Der aktuelle Anzeigeweg meldet keinen hohen Dynamikumfang oder die Abfrage ist nicht verfügbar. Allein daraus folgt kein Hardwaredefekt." },
      { signal: "Dunkle oder helle Stufen verschmelzen; ein heller Fleck hat einen Lichthof", meaning: "Kontrasteinstellungen, Tonwertanpassung oder lokale Dimmung können diese Muster beeinflussen. Das Muster misst keine kalibrierte HDR-Leuchtdichte." },
      { signal: "Die Farbraumspalten sehen gleich aus", meaning: "Browserunterstützung, Systemprofil und Farbumsetzung des Displays können die Spalten ähnlich darstellen. Gleiche Spalten beweisen keinen begrenzten Farbraum des Panels." },
    ],
    troubleshooting: [
      "Prüfe System-HDR, den ausgewählten Bildschirm, seinen Bildmodus und den Ausgabeweg der Grafikkarte. Öffne die Seite nach einem Moduswechsel erneut.",
      "Teste einen anderen aktuellen Browser auf demselben Display. Eine fehlende Browserabfrage zeigt ein Kompatibilitätsproblem, keinen durchgefallenen Bildschirm.",
      "Halte Helligkeit und Raumlicht beim Vergleich gleich. Prüfe den tatsächlichen HDR-Inhaltsweg zusätzlich mit einer bekannten HDR-Anwendung.",
    ],
    limitation: "Diese Browsermuster sind keine kalibrierten PQ- oder HLG-HDR-Signale. Die Seite misst keine Nits, native Panel-Farbtiefe oder Kontrastwerte und erkennt keine HDR-Formate oder Zertifizierung.",
  },
  "screen-tearing-test": {
    steps: [
      "Nutze deine übliche Auflösung und Bildwiederholrate. Lass den Browserzoom gleich und schiebe das Fenster auf das Testdisplay.",
      "Wähle Streifenverfolgung und eine Geschwindigkeit: Langsam mit 240, Mittel mit 520 oder Schnell mit 960 px/s. Klicke bei einem stillen Muster auf Start. Die Vollbildtaste allein startet es nicht.",
      "Achte an scharfen bewegten Kanten auf einen horizontalen Versatz. Wiederhole den Test bei derselben Geschwindigkeit mit Blockebenen und Schachbrettlauf.",
      "Vergleiche jeweils nur eine Synchronisations- oder Framelimit-Einstellung. Wähle nach jeder Beobachtung Pause und prüfe die betreffende Einstellung auch im Spiel, in dem das Problem auftritt.",
    ],
    normal: ["In diesem Browserdurchgang zeigen die bewegten Muster keinen sichtbaren horizontalen Versatz zwischen oberem und unterem Bildbereich. Das beweist nicht, dass ein Spiel denselben Synchronisationsweg nutzt."],
    results: [
      { signal: "Eine horizontale Trennlinie versetzt einen Bildteil", meaning: "Das passt zu Tearing: Verschiedene Bildschirmbereiche zeigen unterschiedliche Zeitpunkte der Bewegung." },
      { signal: "Das ganze Muster springt oder stoppt gleichzeitig", meaning: "Das passt eher zu Ruckeln oder ungleichmäßigen Bildabständen als zu Tearing." },
      { signal: "Eine Kante hinterlässt eine dunkle Spur oder einen hellen Saum", meaning: "Das deutet eher auf Schlieren oder Overdrive hin. Vergleiche es mit dem Bewegungstest." },
      { signal: "Die Browser-Framezahl weicht von den Monitor-Hz ab", meaning: "Die Zahl schätzt Animationsaufrufe des Browsers. Sie misst keine Hardwarefrequenz und bestätigt kein aktives VRR." },
    ],
    troubleshooting: [
      "Wähle Start, wenn sich nichts bewegt. Nach einem Tab im Hintergrund oder bei reduzierter Bewegung kann das Muster pausiert bleiben.",
      "Schließe stark ausgelastete Aufgaben und halte die Seite im Vordergrund. Wiederhole dasselbe Muster bei gleicher Geschwindigkeit, bevor du das Panel beurteilst.",
      "Wenn der Browser flüssig läuft, aber ein Spiel Tearing zeigt, prüfe VSync, FreeSync oder G-Sync und Framelimits im Spiel und in den Treibereinstellungen.",
    ],
    limitation: "Der Browser synchronisiert seine Bildzusammensetzung meist selbst. Diese Seite kann VSync nicht ausschalten, aktives VRR nicht bestätigen und nicht jedes Vollbild- oder Ausgabeverhalten eines Spiels nachbilden.",
  },
  "monitor-color-calibration": {
    steps: [
      "Lass den Bildschirm etwa 20 Minuten warm werden. Schalte für SDR HDR, Nachtmodus und dynamischen Kontrast aus. Stelle den Browserzoom auf 100 %.",
      "Wähle Schwarz- und Weißpegel. Vergleiche mit den Monitoreinstellungen die dunklen Felder von 0–5 % und die hellen Felder von 95–100 %. Versuche, benachbarte Stufen erkennbar zu halten.",
      "Wähle Neutrale Graustufen und suche nach Farbstichen. Geh bei Gamma 2,2 zurück, bis das Schachbrett verschmilzt. Vergleiche es mit dem Grau daneben als grobe Sichtreferenz.",
      "Prüfe bei Farbtrennung die Farbfelder. Ändere jeweils nur eine Monitoreinstellung und notiere ihren ursprünglichen Wert. Prüfe zum Schluss gewöhnliche Fotos oder Videos.",
    ],
    normal: [
      "Die Stufen nahe Schwarz und Weiß bleiben unterscheidbar, soweit Display und Umgebung das zulassen. Grau wirkt neutral und die Farbfelder bleiben getrennt erkennbar.",
      "Das verschmolzene Schachbrett und das Grau daneben wirken ungefähr gleich. Das ist eine Sichthilfe, kein Nachweis eines gemessenen Gammawerts von 2,2.",
    ],
    results: [
      { signal: "Dunkle Stufen verschwinden in Schwarz", meaning: "Schwarzpegel, Ausgabebereich oder Kontrastverarbeitung können Schattendetails verschlucken." },
      { signal: "Helle Stufen verschmelzen mit Weiß", meaning: "Zu viel Kontrast oder andere Bildverarbeitung kann Lichter abschneiden. Prüfe nach einer einzelnen Einstellungsänderung erneut." },
      { signal: "Grau hat einen Farbstich", meaning: "Weißabgleich, Farbtemperatur oder ein Nachtfilter können neutrale Töne verschieben." },
      { signal: "Die beiden Gamma-Referenzflächen unterscheiden sich", meaning: "Displayverhalten und Browserdarstellung können von dieser Referenz abweichen. Leite aus dem Vergleich keinen genauen Gammawert ab." },
    ],
    troubleshooting: [
      "Kehre zu einem neutralen SDR-Bildmodus zurück und prüfe 100 % Browserzoom. Vergleiche erneut, bevor du mehrere Einstellungen änderst.",
      "Ändere jeweils nur eine Monitoreinstellung und mache Notizen. Wenn das Ergebnis schlechter wird, stelle den alten Wert wieder her, bevor du weitermachst.",
      "Nutze für genaue Farbarbeit ein Kolorimeter oder Spektralfotometer und passende Kalibriersoftware. Eine Browserfläche ersetzt keine Lichtmessung.",
    ],
    limitation: "Die Seite hilft bei Einstellungen nach Augenmaß. Sie misst weder Gamma, Weißpunkt, Farbfehler noch Farbraum und erstellt kein ICC-Profil.",
  },
  "black-level-test": {
    steps: [
      "Nutze SDR, deine übliche Helligkeit und 100 % Browserzoom. Verringere Spiegelungen und schalte Nachtmodus sowie dynamischen Kontrast aus.",
      "Öffne Vollbild und prüfe Reines Schwarz von deinem üblichen Sitzplatz aus auf aufgehelltes Schwarz oder feste helle Stellen.",
      "Wechsle zu Dunkelstufen 1-10 und notiere, welche RGB-Felder von 1 bis 10 du zuverlässig von Schwarz unterscheiden kannst. Das sind ganzzahlige RGB-Werte, keine Prozentwerte.",
      "Wähle Schwarztiefe und prüfe die eingebetteten dunklen Felder und feinen Streifen. Vergleiche lokale Dimmung ein und aus, falls vorhanden. Beende Vollbild und notiere die verwendete Einstellung.",
    ],
    normal: ["Nutze zuverlässig erkennbare Dunkelstufen als relative Referenz zwischen Einstellungen. Es gibt keine allgemein vorgeschriebene Zahl sichtbarer RGB-Felder von 1 bis 10. Raum und Panel beeinflussen das Ergebnis."],
    results: [
      { signal: "Alle Felder nahe Schwarz verschwinden", meaning: "Schwarzpegel, Gamma, ein unpassender Ausgabebereich oder die Grenzen des Panels nahe Schwarz können Details verbergen." },
      { signal: "Reines Schwarz wirkt grau", meaning: "Spiegelungen, ein unpassender Ausgabebereich oder der native Schwarzpegel des Panels können Schwarz aufhellen." },
      { signal: "Dunkle Blöcke bleiben sichtbar, feine Streifen verschwinden", meaning: "Bildverarbeitung oder lokale Dimmung kann sehr dunkle feine Details entfernen. Vergleiche nach einer einzelnen Einstellungsänderung." },
    ],
    troubleshooting: [
      "Verringere Spiegelungen und wiederhole den Test bei gleicher Sitzposition und Helligkeit. Ändere Raumlicht und Displayeinstellungen nicht gleichzeitig.",
      "Prüfe, ob Grafikkarte und Display denselben Ausgabebereich nutzen: Voll 0–255 oder Begrenzt 16–235. Ein Unterschied kann Schwarz aufhellen oder Schatten verschlucken.",
      "Vergleiche lokale Dimmung und Kontrastverbesserungen einzeln. Bleiben Details unklar, notiere den niedrigsten zuverlässig sichtbaren Wert, statt eine Pflichtzahl sichtbarer Felder festzulegen.",
    ],
    limitation: "Diese festen SDR-RGB-Muster messen keine Schwarzleuchtdichte, Kontrastwerte oder Nits und bestimmen keinen Paneltyp. Sie helfen beim Vergleich und liefern keine allgemeine Abnahmenote.",
  },
  "oled-burn-in-test": {
    steps: [
      "Zeige vorher einige Minuten gewöhnliche bewegte Inhalte. Nutze deine übliche Helligkeit und dunkle den Raum ab. Lange statische Muster sind kein Reparaturversuch.",
      "Öffne Vollbild und wähle Vollfarben-Zyklus. Prüfe Grau, Rot, Grün, Blau, Weiß und Schwarz auf feste Logos, Taskleisten oder Fensterumrisse.",
      "Wähle Dunkelgrau-Gleichmäßigkeit und vergleiche die vorhandenen Stufen 5 %, 10 %, 20 %, 30 % und 50 %. Prüfe bei Bedarf auch Bewegte Farbbalken und Verlaufslauf.",
      "Wähle Start für wechselnde Muster. Eine manuell gewählte Farbe oder Graustufe pausiert das Muster. Nach fünf Minuten durchgehender Wiedergabe stoppt der Test auf Schwarz. Ein manuell pausiertes Standbild hat diesen Zeitschutz nicht. Beende die statische Prüfung deshalb zügig.",
      "Notiere feste Umrisse und kehre zu gewöhnlichen Inhalten zurück. Prüfe nach normaler Nutzung oder einer Ruhepause erneut, statt das Testmuster stehen zu lassen.",
    ],
    normal: ["Auf mehreren Farben und in gewöhnlichen Inhalten erscheint kein fester Logo- oder Oberflächenumriss. Ein schwaches Band auf Dunkelgrau allein beweist kein dauerhaftes Einbrennen."],
    results: [
      { signal: "Ein Umriss bleibt auf mehreren Farben an derselben Stelle", meaning: "Ein Nachbild oder ungleichmäßiger Verschleiß ist möglich. Eine einzelne Beobachtung zeigt nicht, ob die Veränderung dauerhaft ist." },
      { signal: "Grau zeigt Bänder oder wolkige Stellen", meaning: "Die Gleichmäßigkeit nahe Schwarz kann variieren, ohne dass ein erkennbares Nachbild vorliegt. Vergleiche den Graustufentest und echte Inhalte." },
      { signal: "Der Umriss verblasst nach gewöhnlichen Inhalten oder einer Ruhepause", meaning: "Das passt eher zu einem vorübergehenden Nachbild. Notiere, wie sich die Stelle bei späteren Prüfungen verändert." },
    ],
    troubleshooting: [
      "Prüfe, ob die Stelle auf mehreren Farben und in echten Inhalten wiederkehrt. Wiederhole die Prüfung nach normaler Nutzung oder einer Ruhepause.",
      "Wähle Start für den Wechsel, wenn das Muster stillsteht. Manuelle Farb- oder Grauauswahl pausiert die Wiedergabe. Beende die statische Prüfung zügig, denn im pausierten Zustand läuft der Wiedergabe-Timer nicht.",
      "Folge den normalen Pflegehinweisen des Herstellers. Wiederhole keine tiefen Pixelauffrischungen und zeige keine langen statischen Muster, nur um einem Testbild nachzugehen.",
    ],
    limitation: "Die Seite misst keine Pixelalterung, bestätigt kein dauerhaftes Einbrennen nach einem Durchgang und entscheidet keine Garantie. Der Fünf-Minuten-Stopp gilt für durchgehende Wiedergabe, nicht für pausierte Standbilder.",
  },
  "screen-resolution-checker": {
    steps: [
      "Schiebe das Fenster auf das gewünschte Display und stelle den Seitenzoom des Browsers auf 100 %. Warte, bis sich die Live-Werte eingependelt haben.",
      "Vergleiche Gemeldeter Bildschirm mit Layout-Viewport und Sichtbarer Viewport. Bildschirm- und Viewportwerte nutzen CSS-Pixel. Der Viewport beschreibt die Inhaltsfläche des Browsers.",
      "Lies Pixelverhältnis und Geschätzte Ausgabepixel zusammen. Die Schätzung multipliziert die gemeldete Bildschirmgröße mit DPR. DPR hängt von Systemskalierung und Seitenzoom ab.",
      "Ändere die Fenstergröße, öffne Vollbild oder drehe das Handy und beobachte die Viewportwerte. Notiere die Werte mit Zoom und Systemskalierung. Vergleiche sie dann mit den Anzeigeeinstellungen des Systems und dem Monitormenü.",
    ],
    normal: ["Die Live-Werte reagieren auf Fenster- oder Ausrichtungsänderungen. Eine kleinere CSS-Bildschirmgröße oder Inhaltsfläche ist bei Skalierung und Browserleisten üblich. Daraus folgen allein keine fehlenden physischen Pixel."],
    results: [
      { signal: "Gemeldeter Bildschirm ist kleiner als die Panelangabe", meaning: "CSS-Pixel und Systemskalierung können das erklären. Eine 4K-Ausgabe bei 200 % Skalierung kann zum Beispiel etwa 1920 × 1080 CSS-Pixel melden." },
      { signal: "Der Viewport ist kleiner als der Bildschirm", meaning: "Fenstergröße, Browserleisten, Seitenleisten und Systemoberfläche verringern die Inhaltsfläche." },
      { signal: "DPR oder geschätzte Ausgabe ändert sich mit dem Zoom", meaning: "Seitenzoom kann DPR ändern. Die berechnete Ausgabe bleibt deshalb eine Schätzung. Eine Zoomgeste mit zwei Fingern ändert meist stattdessen die Skalierung des sichtbaren Viewports." },
      { signal: "Browser-Frame-Takt oder Farbpuffer wirkt unerwartet", meaning: "Der Frame-Takt schätzt Browseraufrufe, keine Display-Hz. Der Farbpuffer ist ein Browserwert und beweist keine native Panel-Farbtiefe." },
    ],
    troubleshooting: [
      "Stelle den Seitenzoom auf 100 % zurück und lass das Fenster auf einem Display. Vergleiche erneut, nachdem sich die Werte eingependelt haben.",
      "Prüfe die tatsächliche Auflösung und Skalierung in den Systemeinstellungen und im Menü des Displays. Bestätige die Ausgabe dort, statt nur der geschätzten Pixelzahl zu folgen.",
      "Wenn ein Feld Nicht gemeldet oder Nicht unterstützt zeigt, probiere einen anderen Browser. Halte diesen Tab für die Frame-Beobachtung sichtbar. Eine fehlende API bedeutet keinen Hardwaredefekt.",
    ],
    limitation: "Browser-APIs zeigen die physische Panelauflösung, das EDID-Modell, die physische Pixeldichte und die echte Bildwiederholrate nicht zuverlässig. Geschätzte Ausgabepixel sind eine Berechnung, keine direkte Hardwaremessung.",
  },
} as const satisfies Record<TestGuidanceId, TestGuidance>;
