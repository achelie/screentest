# Analyse der deutschen Lokalisierung

Quelle: `lib/i18n.ts`, `lib/tests-copy.ts`, `lib/test-messages.ts`

- Fachgebiet: verbrauchernahe Bildschirmdiagnose im Browser.
- Zielgruppe: Menschen, die einen Monitor, Laptop oder ein Smartphone ohne Messgerät prüfen möchten.
- Ton: direkt, freundlich, konkret und technisch korrekt. Durchgehend informelles `du`.
- Markenregel: `ScreenTestHub` und alle URL-Slugs bleiben unverändert.
- Inhaltsregel: Ratgeberartikel bleiben englisch. Deutsche Übersichtsseiten kennzeichnen sie als `Englischer Inhalt`.
- Kritische Begriffe: Pixelfehler, Backlight Bleeding, Graustufen, Gleichmäßigkeit, Banding in Farbverläufen, Schlieren und Überschwingen.

Die größte sprachliche Herausforderung sind kurze Bedienelemente, die auf kleinen Bildschirmen verständlich bleiben, ohne technische Unterschiede wie Schlieren und Overdrive-Überschwingen zu verwischen.
