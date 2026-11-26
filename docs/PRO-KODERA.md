# Brave Winery – podklady pro kodéra

Grafický návrh e-shopu vinařství Brave Winery je postavený jako **funkční statický prototyp**. Slouží jako předloha pro nakódování do e-shopového systému.
Obsahově vychází z původního dema demo.bravewinery.cz, vzhled a ovládání jsou nové.

- **Živý náhled:** https://grafika-imptest.github.io/brave-winery/
- **Zdrojové kódy:** https://github.com/grafika-imptest/brave-winery
- **Stažení jako ZIP:** https://github.com/grafika-imptest/brave-winery/archive/refs/heads/main.zip
- **Obsahová předloha (původní demo):** https://demo.bravewinery.cz/

> Stav k 26. 11. 2026.

---

## 1. Stránky

Web je jedna stránka (`dist/index.html`) s hashovým routerem. Všechny adresy jsou pod `https://grafika-imptest.github.io/brave-winery/…`

| Stránka | Adresa | Obsah |
|---|---|---|
| Úvod | `#home` | paralaxní hero (budova + listy v popředí), úvod, kategorie, vinné řady Vápenec / Slunce / Sklep (vodorovný scroll), pás „Objevte všechna naše vína“, terroir, příběh, časová osa, výběr podle chuti, kvíz, zážitky, ocenění, recenze, návštěva, blog |
| Všechna vína | `#catalog/all` | rozcestník podle barvy a chuti, filtry (druh, sladkost, odrůda, ročník, soutěž, medaile, cena), řazení, načíst další |
| Kategorie | `#catalog/white`, `red`, `rose`, `sparkling`, `sale` | výpis s podkategoriemi (odrůdy) |
| Detail vína | `#product/<id>` | barevný pás podle druhu, lahev na rytině, cena, karton (6 ks), citát sklepmistra, parametry, chuťový profil, párování, „Odkud je“, recenze s formulářem, „Ze stejného sklepa“ |
| Degustace | `#page/degustace` | 3 programy, jak to probíhá, rezervace (kalendář, čas, nocleh, platba), FAQ |
| Ubytování | `#page/ubytovani` | 3 pokoje, balíček degustace + nocleh, doplňky, rezervace pobytu, FAQ |
| Naše vinice | `#page/nase-vinice` | terroir, 3 tratě (záložky), rok ve vinici, zásady, citát |
| Oceněná vína | `#page/ocenena-vina` | souhrn, filtr soutěže a medaile, karty vín |
| Závozové trasy | `#page/zavozove-trasy` | mapa (Leaflet + OSM), trasy Brno a Pálava se zastávkami |
| Doprava a platba | `#page/doprava` | dopravci a ceny, platby, dodací lhůta, balení |
| Kontakty | `#page/kontakty` | rychlé kontakty, formulář s tématy, tým, mapa, fakturační údaje |
| FAQ | `#page/faq` | 21 otázek v 5 skupinách s vyhledáváním |
| Blog | `#page/blog`, `#article/<id>` | rubriky a články |
| Pokladna | `#checkout` | 3 kroky; dopravci podle země (ČR/SK), závoz se zastávkou, dobírka 30 / PPL 20 Kč |
| Účet, oblíbené, porovnání | `#account`, `#wishlist`, `#compare` | jádro šablony |
| Právní stránky | `#page/obchodnipodminky`, `vraceni-a-reklamace`, `odstoupeni-od-smlouvy`, `zpracovani-osobnich-udaju`, `cookies` | texty |

---

## 2. Technologie a spuštění

- Čisté HTML + CSS + JavaScript, **bez frameworku a bez buildu**. Knihovny z CDN: Lenis (plynulý scroll), Leaflet (jen stránka závozových tras).
- Lokálně: Node ≥ 18

```bash
npm start       # http://127.0.0.1:5370
npm install     # jen pro testy (playwright-core)
npm test        # funkční testy v Edge (15 scénářů)
```

- Nasazuje se **jen obsah složky `dist/`** na libovolný statický hosting s HTTPS (cesty jsou relativní, server nepotřebuje přepisovací pravidla).
- **Cache-busting:** po změně CSS/JS zvýšit `?v=N` u odkazů v `dist/index.html` (teď `v=44`).
- Nasazení náhledu na GitHub Pages: `git subtree split --prefix dist -b gh-pages && git push -f origin gh-pages`.

---

## 3. Struktura

```
dist/index.html                kostra: hlavička, mega menu, patička, modaly, pořadí skriptů
dist/presets.js                DATA – viz kapitola 4
dist/app.js                    jádro (sdílené s Brave Shopem): router, render, košík, pokladna,
                               filtry, hledání, účet, oblíbené, porovnání, CZK/EUR, chat, cookies
dist/experience.js             vinařská vrstva: úvod, karta a detail vína, mega menu s lahvemi,
                               kvíz, vinné řady, závozové trasy (ROUTES), ověření věku 18+
dist/winery-extra.js           stránky podle původního dema: degustace, ubytování, doprava
                               (SHIP, PAY), vinice, kontakty, FAQ, ocenění, blog, recenze, jazyk/země
dist/splash.js                 přechod mezi stránkami „Nalévám…“
dist/motion.js                 Lenis, skrývání hlavičky, reveal animace
dist/styles.css                základní styly šablony
dist/winery.css                vzhled vinařství a nové komponenty (pozdější pravidla přepisují dřívější)
dist/assets/m/                 obrázky: lahve b-*, rytiny i-*, fotky s-*, medaile medal-* (name.webp + name-s.webp)
dist/assets/*.svg              logo Brave Winery (tmavé / bílé), logo IMPnet do patičky
tools/                         testy, screenshoty, generátor medailí (nejsou potřeba pro provoz)
raw/                           originály fotek – NENÍ v repozitáři
```

Funkce v `app.js` jsou globální a pozdější skripty je přepisují. Pořadí skriptů: presets → app → experience → winery-extra → splash → motion.

---

## 4. Data (co bude v e-shopu)

| Kde | Obsah | V e-shopu jako |
|---|---|---|
| `presets.js` → vína | 12 vín: název, ročník, cena, foto, kategorie, sladkost, přívlastek, alkohol, chuťové tóny, štítek, stará cena, medaile, hodnocení, počet recenzí, chuťový profil, trať, párování, teplota | katalog produktů |
| `presets.js` | kategorie, odrůdy, články, texty | strom kategorií, blog |
| `winery-extra.js` → `SITES` | 3 tratě (výměra, orientace, výška, půda) | obsahová stránka Vinice |
| `winery-extra.js` → `PROGRAMS`, `ROOMS` | programy degustace (450 / 890 / 1 490 Kč), pokoje (1 490 / 1 890 / 2 590 Kč) | rezervační systém |
| `winery-extra.js` → `SHIP`, `PAY` | dopravci a platby s cenami | nastavení dopravy a plateb |
| `winery-extra.js` → `FAQ`, `TEAM` | 21 otázek, tým tří lidí | obsahové stránky |
| `experience.js` → `ROUTES`, `SERIES` | závozové trasy se zastávkami a GPS, vinné řady | nastavení závozu, kolekce |

- Technické údaje vín (cukr, kyseliny, extrakt, archivace) se v prototypu dopočítávají – v e-shopu budou z etikety.
- **Stav v prohlížeči** (`localStorage`, klíče `brave-*`): košík, oblíbené, souhlas, věk, jazyk, země, recenze.
- **Maketa bez backendu:** pokladna, platby, rezervace (obsazenost je generovaná), formuláře, recenze a účet nic neodesílají – napojit v e-shopu.

---

## 5. Klíčové funkce k zachování

1. **Úvodní paralaxa** – vrstvy pozadí, nadpis a listy v popředí, reakce na scroll i myš.
2. **Vinné řady** – na desktopu připnutá sekce s vodorovným posunem, hover vysune název a cenu.
3. **Detail vína** – barevný pás podle druhu, ukotvená lahev, rozbalovací sekce, recenze, karton.
4. **Rezervace degustace a pobytu** – kalendář, časy, přídavky, průběžný souhrn ceny.
5. **Pokladna** – dopravci podle země, závoz se zastávkou, dobírka jen tam, kde dává smysl.
6. **Mega menu** – náhled konkrétní lahve, vrstvy se prolínají (vyhrává poslední najetí).
7. **Přechod „Nalévám…“** – sklenka se plní vínem v barvě cílové kategorie (~1 s).
8. **Ověření věku 18+**, cookies lišta.
9. **Přístupnost** – fokus, klávesnice, `prefers-reduced-motion` (animace se vypínají), mobil 390 px bez vodorovného přetečení.

---

## 6. Design

- **Písma:** **Ogg** Regular + Italic (nadpisy, Adobe Fonts kit `oia3cnp`), **Geist** (text, Google Fonts).
- **Ogg je vázaný na Adobe účet IMPnet** – pro ostrý web klienta vlastní licence a kit, v nastavení kitu povolit doménu (jinak náhradní Georgia).
- **Barvy:** papírový podklad, tmavý text `#1d1a17`, vínová `#5A1F2B`; pásy podle druhu vína – bílé `#59603F`, červené `#5A1F2B`, růžové `#94585B`, šumivé `#2F3B35`.
- **Logo:** `dist/assets/brave-winery-logo.svg` (tmavé), `brave-winery-logo-white.svg`; v patičce „Vytvořilo IMPnet“ (`impnet-logo.svg`).
- Responzivita: hlavní zlomy 900 px a 760 px.

---

## 7. Obrázky

- Všechny fotky, lahve a rytiny jsou **generované přes Magnific (AI)** – před ostrým provozem nahradit skutečnými fotkami vinařství (nebo ověřit licenci).
- Formát WebP ve dvou šířkách přes `srcset`: `name.webp` a `name-s.webp` (mobil).
- **Soutěže a medaile jsou smyšlené** (Salon moravských vín, DWC Vienna, Bohemia Wine Trophy, Grand Prix Vitis); skutečná loga soutěží jen s licencí pořadatele.
- Mapové dlaždice OpenStreetMap – pro větší návštěvnost komerční poskytovatel dlaždic.

---

## 8. Otevřené body

- Převod do e-shopového systému – hashové URL vyhledávače neindexují dobře (původní demo má skutečné URL `/palava`, `/degustace`).
- Napojení pokladny, plateb, rezervací, formulářů a recenzí.
- Skutečná data vín (ceny, sklad, analytické hodnoty, medaile) a fotky.
- E-mail `info@bravewinery.cz` je zástupný (původní demo uvádí osobní adresu, tu jsme nepřevzali).
- Slovenština – zatím jen přepínač, chybí překlady textů.
- Licence písma Ogg pro doménu klienta.
