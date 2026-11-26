# Brave Winery – předání kodérovi

Nový návrh e-shopu vinařství Brave Winery jako **statický front-end prototyp** (HTML, CSS, vanilla JS, bez build kroku). Vzhled, obsah a chování jsou hotové a odladěné. **Objednávky, rezervace a formuláře se zatím nikam neodesílají** a je potřeba je napojit na backend.

- **Živé demo:** https://grafika-imptest.github.io/brave-winery/
- **Repozitář:** https://github.com/grafika-imptest/brave-winery (větev `main` = projekt, větev `gh-pages` = nasazený web)
- **Obsahová předloha (původní demo):** https://demo.bravewinery.cz/

---

## 1. Spuštění lokálně

Potřeba je Node.js 18+. Samotný web nemá žádné závislosti.

```bash
git clone https://github.com/grafika-imptest/brave-winery.git
cd brave-winery
npm start            # = node serve.mjs 5370  →  http://127.0.0.1:5370
```

Web je ve složce `dist/` a funguje s libovolným statickým serverem (`npx serve dist`, Live Server ve VS Code…). Otevírat `index.html` přímo ze souboru (`file://`) nedoporučujeme.

## 2. Nasazení

1. Nahrát **obsah složky `dist/`** (asi 13 MB) do kořene webu, nebo do podsložky. Všechny cesty jsou relativní (`./…`).
2. Zapnout **HTTPS**.
3. **Cache-busting:** při každé změně CSS nebo JS zvýšit `?v=N` u všech odkazů v `dist/index.html` (teď `v=44`). Jiný mechanismus není.
4. **Písmo Ogg:** přidat produkční doménu do Adobe Fonts kitu (viz [Závislosti](#5-externí-závislosti)), jinak se nadpisy vykreslí písmem Georgia.
5. Cache: `assets/` (webp, svg) dlouhá, `index.html` bez cache.

Router je hashový (`#home`, `#catalog/red`, `#product/palava`, `#page/degustace`, `#checkout`…), takže server **nepotřebuje přepisovací pravidla**.

> **Doporučení pro ostrý provoz:** hashové URL vyhledávače indexují špatně a nejdou nastavit vlastní meta tagy pro jednotlivé stránky. Původní demo má skutečné URL (`/palava`, `/degustace`). Pokud má web jít do ostrého provozu jako e-shop, šablony převeďte do e-shopového systému nebo frameworku se serverovým vykreslováním. Tento prototyp pak slouží jako vizuální a funkční předloha.

**Nasazení dema na GitHub Pages:**

```bash
git branch -D gh-pages
git subtree split --prefix dist -b gh-pages
git push -f origin gh-pages
```

## 3. Struktura souborů

| Soubor | Co obsahuje |
|---|---|
| `dist/index.html` | Kostra: hlavička, mega menu, patička, modaly, **pořadí skriptů** |
| `dist/presets.js` | **Data:** 12 vín (pole: id, název, ročník, cena, foto, kategorie, sladkost, přívlastek, alkohol, tóny, štítek, stará cena, medaile, hodnocení, počet recenzí, chuťový profil, trať, párování, teplota), kategorie, odrůdy, články |
| `dist/app.js` | Jádro převzaté ze šablony Brave Shop: router, render, košík, pokladna, filtry, vyhledávání, účet, oblíbené, porovnání, toasty, modaly |
| `dist/experience.js` | Vinařská vrstva: homepage sekce, karta a detail vína, mega menu s lahvemi, kvíz, závozové trasy (data `ROUTES`), ověření věku, paralaxy |
| `dist/winery-extra.js` | Stránky podle původního dema: degustace a ubytování s rezervací, doprava a platba, dopravci v pokladně (`SHIP`, `PAY`), vinice, kontakty, FAQ, oceněná vína, blog, rozcestník katalogu, recenze, volba jazyka a země |
| `dist/splash.js` | Přechodová animace „Nalévám…“ mezi stránkami (vypíná se při `prefers-reduced-motion`) |
| `dist/motion.js` | Plynulý scroll (Lenis), skrývání hlavičky, reveal animace |
| `dist/styles.css`, `dist/winery.css` | Základní styly šablony / vinařský vzhled a nové komponenty. Pozdější pravidla ve `winery.css` úmyslně přepisují dřívější. |
| `dist/assets/m/` | Obrázky ve dvou velikostech (`*.webp`, `*-s.webp` pro mobil): lahve `b-*`, rytiny `i-*`, fotky `s-*`, medaile `medal-*` |
| `tools/` | `test.mjs` (funkční testy), `shots.mjs` (screenshoty), `medals.mjs` (generátor medailí) |
| `serve.mjs` | Jednoduchý lokální server pro `dist/` |

Funkce v `app.js` jsou globální a pozdější skripty je přepisují (`productPage`, `contentPage`, `catalog`, `detailPanel`…). Na pořadí skriptů v `index.html` proto záleží: presets → app → experience → winery-extra → splash → motion.

## 4. Co je maketa a co napojit

| Oblast | Stav teď | Co je potřeba |
|---|---|---|
| Produkty, ceny, sklad | maketa – pole v `presets.js` | Napojit na katalog e-shopu (API nebo export) |
| Košík | funkční lokálně (`localStorage`) | Synchronizovat se serverovým košíkem |
| Pokladna | maketa – 3 kroky, dopravci a platby s cenami z originálu | Platební brána (karta, převod s QR), widget výdejních míst Zásilkovny a Balíkovny, vytvoření objednávky |
| Rezervace degustace a pobytu | maketa – kalendář, obsazenost je generovaná | Rezervační systém nebo e-mailová notifikace, skutečná dostupnost |
| Formuláře (kontakt, poradna, newsletter) | maketa – jen hláška | Odesílání na server nebo do CRM, ochrana proti spamu |
| Recenze | maketa – generované, nové jen v prohlížeči | Sběr recenzí po nákupu a schvalování |
| Účet a přihlášení | maketa – jen lokální stav | Autentizace, historie objednávek, věrnostní body |
| Vyhledávání a filtry | funkční nad daty v prohlížeči | U velkého katalogu přesunout na server |
| Slovenština | jen přepínač | Překlady textů. Měna EUR a dopravci pro SK už fungují. |
| Ověření věku 18+, cookies lišta | funkční | Napojit souhlas na skutečné měřicí skripty |

Klíče v `localStorage` začínají `brave-` (košík, oblíbené, souhlas, věk, jazyk, země, recenze…).

## 5. Externí závislosti

| Co | Odkud | Pozor |
|---|---|---|
| Písmo **Ogg** (nadpisy, Regular + Italic) | Adobe Fonts, kit `oia3cnp` | Kit je vázaný na Adobe účet IMPnet. Pro ostrý web klienta je potřeba vlastní licence a kit a v nastavení kitu povolit doménu (fonts.adobe.com). |
| Geist (text) | Google Fonts | bez omezení |
| Lenis 1.1.13 (plynulý scroll) | cdn.jsdelivr.net | Při výpadku CDN web funguje dál, jen bez plynulého scrollu |
| Leaflet 1.9.4 (mapa závozových tras) | cdnjs.cloudflare.com, načítá se jen na stránce tras | Lze přesunout do vlastních souborů |
| Mapové dlaždice | tile.openstreetmap.org | Pro ostrý provoz s větší návštěvností použít komerčního poskytovatele dlaždic (podle pravidel OSM) |

## 6. Obsah a licence

- **Fotky a ilustrace** jsou generované přes Magnific (AI). Před ostrým nasazením je nahraďte skutečnými fotkami vinařství, nebo si ověřte licenci pro použití.
- **Vína, ceny, recenze, soutěže a medaile jsou ukázkové.** Soutěže (Salon moravských vín, DWC Vienna, Bohemia Wine Trophy, Grand Prix Vitis) jsou úmyslně smyšlené. Skutečná loga soutěží nepoužívat bez licence pořadatele.
- **Texty stránek** (programy degustací, pokoje, dopravci, FAQ, tým) jsou převzaté z původního dema. Osoby, telefony a adresa jsou ilustrační.
- **E-mail `info@bravewinery.cz` je zástupný.** Původní demo uvádí osobní adresu, tu jsme úmyslně nepřevzali.
- V patičce je „Vytvořilo IMPnet“ s logem (`dist/assets/impnet-logo.svg`), odkaz vede na impnet.cz.

## 7. Testy

`tools/test.mjs` projde 15 scénářů: rezervace, katalog a filtry, porovnání, podstránky, objednávka, načítání obrázků a mobil bez vodorovného scrollu.

```bash
npm install                 # nainstaluje playwright-core
npm start                   # v jiném terminálu nechat běžet (port 5370)
npm test                    # očekávaný výsledek: 15 ok, 0 chyb
```

Testy používají nainstalovaný **Microsoft Edge**. Pro Chrome nastavte `PW_CHANNEL=chrome` (PowerShell: `$env:PW_CHANNEL="chrome"; npm test`). Jinou adresu nastavíte proměnnou `B` (výchozí `http://127.0.0.1:5370/`).

Screenshoty: `node tools/shots.mjs home '#home' --y=0,900 [--m]` → složka `shots/`.

## 8. Checklist před spuštěním

- [ ] Doména přidaná do Adobe Fonts kitu, nebo vlastní licence písma Ogg
- [ ] HTTPS a dlouhá cache pro `assets/`
- [ ] `?v=N` v `index.html` zvýšené po poslední úpravě CSS/JS
- [ ] Rozhodnuto, jestli zůstává statický prototyp, nebo převod do e-shopového systému (SEO, objednávky)
- [ ] Pokladna, rezervace a formuláře napojené na backend
- [ ] Ukázková data (vína, ceny, osoby, e-maily, soutěže) nahrazená skutečnými
- [ ] AI fotky nahrazené nebo ověřená licence
- [ ] Cookies lišta napojená na skutečné měření
- [ ] `npm test` prošel (15/15)

---

## Příloha: popis hlavních prvků návrhu

- **Úvodní paralaxa:** vrstvy `hero-bg.webp` (budova a vinice) → nadpis → `hero-leaves.webp` (listy v popředí) → text a tlačítka. Při scrollu se pozadí posouvá pomalu a listy se přibližují, myš přidává jemný posun vrstev.
- **Vinné řady** (Vápenec / Slunce / Sklep, 3 lahve v každé): na desktopu je sekce připnutá a jede vodorovně se scrollem, hover vysune název a cenu. Data jsou v `SERIES` v `experience.js`.
- **Detail vína:** barevný pás podle druhu vína, ukotvená lahev na rytině, citát sklepmistra, rozbalovací sekce (O víně, Parametry, Chuťový profil, Ke stolu, Poradna), recenze s rozložením hvězd, blok „Odkud je“, tlačítko „Vložit karton“ (6 lahví).
- **Mega menu:** po najetí na položku se zobrazí lahev nebo fotka kategorie, vrstvy se prolínají.
- **Přechod mezi stránkami:** sklenka se naplní vínem v barvě cílové kategorie (asi 1 s).
- **Patička:** fotka vinice v paralaxe uvnitř výřezu velkého loga.
- **Medaile:** `node tools/medals.mjs` → `dist/assets/m/medal-<soutěž>-<kov>.webp` (potřebuje `playwright-core` a `sharp`).
