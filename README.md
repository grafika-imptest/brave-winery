# Brave Winery – demo šablony e-shopu pro vinařství

Statická maketa (bez backendu) šablony Brave Winery. Jádro (košík, pokladna, filtry, hledání, účet, chat, cookies, mega menu, porovnání, oblíbené) je sdílené s Brave Shopem.

## Spuštění
```
node serve.mjs 5370      # http://127.0.0.1:5370
node tools/test.mjs      # 15 funkčních testů (Edge přes playwright-core z braveshop-redesign)
node tools/shots.mjs home '#home' --y=0,900 [--m]   # screenshoty do shots/
```

## Soubory (dist/ = to, co se nasazuje)
- `presets.js` – data vinařství: 12 vín (ročník, sladkost, přívlastek, alkohol, chuťový profil, trať, párování, teplota, medaile), kategorie, články.
- `app.js` – sdílené jádro z Brave Shopu (texty přepsané na vinařství).
- `experience.js` – šablony vinařství: úvod s paralaxou, karty lahví, víno měsíce, příběh, časová osa, kategorie s obrázkem u kurzoru, kvíz „Které víno je pro vás“, degustace a ubytování s rezervací, ocenění, recenze, návštěva, detail vína s profilem, ověření věku 18+, podstránky.
- `motion.js` – Lenis, reveal animace, kurzor, karusely, magnetická tlačítka.
- `styles.css` (jádro) + `winery.css` (vzhled vinařství: Cormorant Garamond + Geist, papírová paleta, vínová #5A1F2B).

## Úvodní paralaxa
Vrstvy z podkladů: `hero-bg.webp` (budova + vinice, upscale 2×) → nadpis → `hero-leaves.webp` (listy s průhledností) → text a tlačítka. Při scrollu se pozadí posouvá pomalu, listy se přibližují („kamera projíždí“), nadpis mizí; myš přidává jemný posun vrstev. Respektuje `prefers-reduced-motion`.

## Fotky
Magnific: lahve s logem Brave Winery (logo jako předloha), scény ve stylu „natural“ (ořez 1,5 % kvůli filmovému rámečku). Stažení a převod: `node tools/fetch-magnific.mjs`. Odkazy mají omezenou platnost tokenu, originály jsou v `raw/` (mimo git).

## Lahve, ilustrace, medaile
Karty a detail vína: výřez lahve (`b-*.webp`, Magnific odstranění pozadí) bez rámečku, za ní jemná rytina k chuťovým tónům vína (`i-*.webp`, převedená na průhlednou tuš, průhlednost řídí CSS). Medaile `medal-gold|silver|bronze.webp`. Stažení: `node tools/fetch-magnific-2.mjs`. Původní fotky lahví (`w-*`) jsou druhým snímkem v galerii detailu a ve „Víně měsíce“.

## Detail vína
Podle sestalaioles.com: celoplošný pás v barvě druhu vína (bílá olivová, červená vínová, růžová, šumivá tmavě zelená), vlevo název, popis, volby (ročník, objem, počet), cena a košík; vpravo ukotvená velká lahev na tónované rytině. Pod tím citát sklepmistra + rozbalovací sekce (O víně, Parametry, Chuťový profil, Ke stolu, Poradna, technický list), dvě fotky přes celou šířku a odkaz do vinotéky.

## Ukázková data
Vína, ceny, ocenění, recenze, trasy i rezervace jsou ilustrační. Adresa a telefon převzaty z původního dema demo.bravewinery.cz.

## Vinné řady, medaile, písmo
- Homepage: sekce „Vinné řady“ (Vápenec / Slunce / Sklep, 3 lahve) – na desktopu připnutá a jede vodorovně se scrollem, hover vysune název a cenu. Data v `SERIES` v experience.js.
- „Vyberte si podle chuti“: plovoucí náhled střídá výřezy lahví dané kategorie.
- Soutěže jsou **fiktivní** (Salon moravských vín, DWC Vienna, Bohemia Wine Trophy, Grand Prix Vitis); nálepky jen stylem připomínají skutečné. Generuje je `node tools/medals.mjs` → `dist/assets/m/medal-<soutěž>-<kov>.webp`. Skutečná loga soutěží nepoužívat bez licence pořadatele.
- Nadpisové písmo: **Ogg** (Adobe Fonts, kit `oia3cnp`, jen Regular + Italic). Při nasazení na novou doménu ji přidat do povolených domén kitu na fonts.adobe.com, jinak se písmo nenačte.

## Doplněno podle původního dema (2026-11-24)

`dist/winery-extra.js` (načítá se po experience.js) přepisuje stránky podle demo.bravewinery.cz:
degustace a ubytování s rezervací (kalendář, časy, přídavky, platby), doprava a platba
(Balíkovna, Zásilkovna, PPL, Balík do ruky, DPD, osobní odběr, závoz; dobírka 30 / PPL 20 Kč),
naše vinice (tratě Kamenná, Pod Pálavou, Stará hora), kontakty s týmem, FAQ (21 otázek
s hledáním), oceněná vína s filtry, blog s rubrikami, rozcestník nad výpisem všech vín,
detail vína (technické údaje, recenze, karton, odkud je) a volba jazyka / měny / země.
Závozové trasy: mapa Leaflet + OSM (cdnjs), data ROUTES v experience.js.
Obecný e-mail je info@bravewinery.cz (původní demo uvádí osobní adresu, tu nepřebíráme).
