# RED Interview · Wissensquiz / Knowledge Quiz (zweisprachige PWA)

Quellenbasierte Lern-PWA aus `Preparing for the Interview.md`. Sie enthält konkrete Multiple-Choice-Fragen mit je vier Optionen, eindeutiger Lösung, Erklärung und Abschnittsquelle. Falsche Fragen werden am Rundenende wiederholt; Antworten und Fragen werden mit Fisher-Yates gemischt; der Erstversuch wird separat gezählt. Bildquellen werden lokal aus `assets/` geladen, mit Alttext, responsiver Darstellung und Klick-Zoom.

## Sprache / Language
Die Oberfläche ist zweisprachig (Deutsch/Englisch). Oben rechts schaltet ein `DE | EN`-Umschalter die komplette UI **und** alle Fragen um; die Auswahl wird in `localStorage` gespeichert. Standard ist Englisch. Die Fragen liegen je Sprache in `data/knowledge.de.json` und `data/knowledge.en.json`; beide Dateien müssen dieselben Frage-IDs in derselben Reihenfolge enthalten (der Build prüft das).

## Start
```sh
node scripts/build.mjs
npx serve dist -l 3000
```
Dann `http://localhost:3000` öffnen. Das Projekt hat keine externen Build-Abhängigkeiten und nutzt relative URLs für GitHub-Pages-Unterpfade.

## JSON-Schema
`data/knowledge.<lang>.json` (lang = `de`/`en`) ist ein Objekt mit `id`, `title`, `description`, `questions`. Jede Frage hat `id`, `topic`, `question`, `answers` (vier Objekte mit `id`/`text`), `correctAnswerId`, `explanation`, `source` sowie optional `image` (lokaler Pfad). Der Build prüft Eindeutigkeit, vier Antworten, Lösungs-ID, Bildreferenzen sowie übereinstimmende Frage-IDs/Reihenfolge zwischen den Sprachen.

## Deployment
`.github/workflows/deploy.yml` baut bei Push auf `main` und veröffentlicht `dist` über GitHub Pages. Die App registriert einen Service Worker, dessen Initialisierung den Start nicht blockiert; Netzwerkfehler werden mit klarer Fehlermeldung und Reload-Hinweis behandelt.

## Quellenabdeckung und Einschränkungen
Abgedeckt sind alle substantiellen Hauptabschnitte: analoge/digitale Quellen, Formate/Bitraten/Transparenz/RED-Formate, LAME CBR/VBR/ABR, Transcodes, BitTorrent/Clients/Ratio/Leech-Varianten/Port Forwarding/Partial Seeder/private Torrents, Spektralanalyse, CD-Ripping/Burning/Logs/CUE/Programme, Golden Rules sowie Dupes/Trumps (Format/Tags/Ordner). Bildfragen verwenden die Originalbilder; sie sind nicht als alleiniger Codec- oder Echtheitsbeweis formuliert. Die Quelle ist ein Interview-Lerntext, kein aktuelles Regelwerk; die PWA garantiert keine vollständige Beherrschung. Die vorhandenen Quellenbilder wurden übernommen (10 PNG) und um zwei generierte PWA-App-Icons ergänzt; es wurden keine fehlenden Bilder erfunden.
