/* Brave Winery – data ukázkového vinařství. Vše ilustrační, v ostrém obchodě se napojí na sklad a katalog klienta.
   Fotografie: Magnific (lahve s logem jako předlohou, scény ve stylu „natural“). */
(()=>{
 // [id, odrůda, ročník, cena, foto, druh, sladkost, přívlastek, alk., chuťové tóny, tag, stará cena, medaile, hodnocení, recenzí, profil [tělo, kyselinka, sladkost, aroma] 1–5, trať, k jídlu, teplota]
 const rows=[
  ['ryzlink','Ryzlink rýnský',2023,345,'w-ryzlink','white','polosuché','Pozdní sběr',11.2,'citron · lipový květ · minerálie','Bestseller',null,'Zlatá medaile · Salon moravských vín 2024',4.7,15,[3,5,2,4],'Turold','ryby, drůbež, asijská kuchyně','8–10 °C'],
  ['palava','Pálava',2024,780,'w-palava','white','polosladké','Výběr z hroznů',12.2,'broskev · růže · med','Novinka',null,'Zlatá medaile · Bohemia Wine Trophy 2025',4.8,13,[4,3,4,5],'Purmice','dezerty, paštiky, zrající sýry','9–11 °C'],
  ['veltlin','Veltlínské zelené',2022,296,'w-veltlin','white','suché','Kabinetní víno',11.6,'bílý pepř · mandle · zelené jablko','Akce',349,'Zlatá medaile · Salon moravských vín 2024',4.8,16,[3,4,1,3],'Sahara','řízek, telecí, zeleninová jídla','8–10 °C'],
  ['sauvignon','Sauvignon',2022,387,'w-sauvignon','white','suché','Pozdní sběr',11.8,'angrešt · kopřiva · maracuja','Bestseller',null,'',4.8,17,[3,4,1,5],'Za Kapličkou','kozí sýr, chřest, saláty','8–10 °C'],
  ['chardonnay','Chardonnay',2023,424,'w-chardonnay','white','suché','Pozdní sběr · zrálo v dubu',13.0,'máslo · vanilka · žluté ovoce','Novinka',null,'',4.7,18,[4,3,1,4],'Dlouhé díly','smetanové omáčky, humr, risotto','10–12 °C'],
  ['tramin','Tramín červený',2024,375,'w-tramin','white','polosladké','Výběr z hroznů',11.9,'růže · liči · perník','Bestseller',null,'Stříbrná medaile · Grand Prix Vitis 2024',4.8,20,[4,2,4,5],'Purmice','kachna, thajská kuchyně, modré sýry','9–11 °C'],
  ['frankovka','Frankovka',2021,398,'w-frankovka','red','suché','Pozdní sběr',13.1,'višeň · koření · lesní plody','Novinka',null,'',4.6,11,[3,4,1,3],'Novosády','hovězí, zvěřina, těstoviny s ragú','15–17 °C'],
  ['merlot','Merlot Barrique',2021,1025,'w-merlot','red','suché','Výběr z hroznů · 18 měsíců v barrique',13.8,'švestka · kakao · sušené byliny','Bestseller',null,'Zlatá medaile · DWC Vienna 2025',4.7,14,[5,3,1,4],'Na Vinohrádkách','steak, jehněčí, tvrdé sýry','16–18 °C'],
  ['svatovavrinecke','Svatovavřinecké',2022,445,'w-svatovavrinecke','red','suché','Pozdní sběr',12.8,'višeň · švestka · hřebíček','Akce',520,'Bronzová medaile · Salon moravských vín 2025',4.6,9,[3,3,1,3],'Novosády','kachna, husa, pečená zelenina','15–17 °C'],
  ['zweigelt','Zweigeltrebe rosé',2024,290,'w-zweigelt','rose','suché','Kabinetní víno',11.5,'jahoda · malina · grapefruit','Novinka',null,'',4.7,12,[2,4,1,3],'Sahara','grilovaná zelenina, ryby, letní saláty','8–10 °C'],
  ['cabernet','Cabernet Moravia rosé',2024,310,'w-cabernet','rose','polosuché','Pozdní sběr',11.9,'rybíz · třešeň · bonbon','Výprodej',379,'',4.6,8,[2,3,3,4],'Za Kapličkou','těstoviny, pizza, dezerty z ovoce','8–10 °C'],
  ['frizzante','Frizzante',2023,242,'w-frizzante','sparkling','suché','Perlivé víno',12.4,'jablko · broskev · brioška','Bestseller',null,'Stříbrná medaile · Grand Prix Vitis 2024',4.8,12,[2,4,1,3],'Turold','aperitiv, jednohubky, sushi','6–8 °C']
 ];
 const products=rows.map((r,i)=>({id:r[0],name:r[1],vintage:r[2],price:r[3],image:'b-'+r[0],photo:r[4],illus:'i-'+r[0],category:r[5],type:r[1],sweetness:r[6],predicate:r[7],abv:r[8],notes:r[9],tag:r[10],old:r[11]||undefined,medal:r[12],rating:r[13],reviews:r[14],profile:r[15],site:r[16],food:r[17],temp:r[18],theme:'winery',brand:'',pack:'0,75 l',volume:0.75,stock:[24,8,36,18,14,22,16,6,12,30,9,40][i],surface:'0,75 l',color:'Standard',warranty:0,material:r[6]}));
 window.BRAVE_PRESETS={winery:{key:'winery',name:'Vinařství',edition:'WINERY',products,
  categories:{all:'Všechna vína',white:'Bílá vína',red:'Červená vína',rose:'Růžová vína',sparkling:'Šumivá vína',sale:'Výhodné nabídky'},
  subcategories:{white:['Ryzlink rýnský','Pálava','Veltlínské zelené','Sauvignon','Chardonnay','Tramín červený'],red:['Frankovka','Merlot Barrique','Svatovavřinecké'],rose:['Zweigeltrebe rosé','Cabernet Moravia rosé'],sparkling:['Frizzante']},
  colors:[['Standard','#9a9a92']],
  categoryImages:{white:'s-white',red:'s-red',rose:'s-rose',sparkling:'s-sparkling',all:'s-vineyard',sale:'s-giftbox'},
  categoryNotes:{white:'svěží · citrus · minerálie',red:'višeň · koření · dub',rose:'jahoda · léto · terasa',sparkling:'bublinky · oslavy'},
  editorialImage:'s-tasting',featureImage:'s-vineyard',
  articles:[{id:'jak-degustovat',image:'s-tasting',tag:'Víno · 5 min čtení',title:'Jak správně degustovat víno.'},{id:'od-vinice-do-sklenice',image:'s-harvest',tag:'Vinice · 6 min čtení',title:'Cesta vína od vinice až do sklenice.'},{id:'vino-jako-darek',image:'s-giftbox',tag:'Tipy · 4 min čtení',title:'Víno jako dárek: jak vybrat správnou láhev.'}],
  journalTitle:'Ze sklepa i z vinice.',newsletterTitle:'Nové ročníky<br>jako první.',newsletterDescription:'Novinky z vinařství, termíny degustací a nové ročníky. Jednou za měsíc, bez spamu.',footerTagline:'Rodinné vinařství ze srdce Moravy.',checkoutTitle:'O krok blíž ke sklence.',search:'Ryzlink, rosé, ročník 2022…',
  freeShipping:1500}};
 window.BRAVE_ACTIVE_STYLE='winery';
})();
