/* =====================================================================
   Brave Winery – doplnění podle původního dema (demo.bravewinery.cz)
   Degustace, ubytování, doprava a platba, detail vína (recenze, parametry),
   vinice, kontakty, FAQ, oceněná vína, rozcestník nabídky, blog, jazyk.
   Všechna data jsou ukázková.
   ===================================================================== */
(()=>{
const ADDR='Vinařská 128, 691 42 Valtice',PHONE='+420 519 352 200',MAIL='info@bravewinery.cz';
const tel=s=>s.replace(/\s/g,'');
const kc=n=>currency(n);
const plural=(n,a,b,c)=>n===1?a:n>1&&n<5?b:c;

/* ---------- data: tratě a odvozené údaje vín ---------- */
const SITES=[
 {id:'kamenna',name:'Kamenná',area:'1,4 ha',orientation:'jihozápad',altitude:'260 m n. m.',soil:'vápenec · štěrk',warm:3,text:'Nejchudší trať, kterou máme. Réva tu shání vodu hluboko a dává vína s tvrdou, dlouhou kyselinou.'},
 {id:'pod-palavou',name:'Pod Pálavou',area:'1,2 ha',orientation:'jih',altitude:'220 m n. m.',soil:'spraš · hlína',warm:4,text:'Teplá trať pod bílými skalami. Aromatické odrůdy tu dozrávají o týden dřív než jinde.'},
 {id:'stara-hora',name:'Stará hora',area:'0,9 ha',orientation:'východ',altitude:'240 m n. m.',soil:'jíl · slín',warm:2,text:'Chladnější svah s jílem, který drží vodu. Odsud jsou naše červená vína, co vydrží deset let.'}];
const SITE_OF={ryzlink:'Kamenná',chardonnay:'Kamenná',veltlin:'Kamenná',palava:'Pod Pálavou',tramin:'Pod Pálavou',sauvignon:'Pod Pálavou',frizzante:'Pod Pálavou',zweigelt:'Pod Pálavou',frankovka:'Stará hora',merlot:'Stará hora',svatovavrinecke:'Stará hora',cabernet:'Stará hora'};
const hash=s=>[...s].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7);
const pick=(s,min,max,dec=1)=>{const r=(hash(s)%1000)/1000;return (min+r*(max-min)).toFixed(dec).replace('.',',');};
products.forEach(p=>{
 if(SITE_OF[p.id])p.site=SITE_OF[p.id];
 const m=String(p.medal||'');
 p.medalLevel=m.startsWith('Zlat')?'Zlatá':m.startsWith('Stříbr')?'Stříbrná':m.startsWith('Bronz')?'Bronzová':'';
 p.medalComp=m?m.replace(/^[^·]*·\s*/,'').replace(/\s*\d{4}$/,''):'';
 const sw=p.sweetness;
 p.sugar=sw==='suché'?pick(p.id+'s',1,3.8):sw==='polosuché'?pick(p.id+'s',5,11.5):pick(p.id+'s',14,30);
 p.acid=p.category==='red'?pick(p.id+'a',4.8,5.9):pick(p.id+'a',5.8,7.9);
 p.extract=p.category==='red'?pick(p.id+'e',24,29):pick(p.id+'e',18,23);
 p.archive=p.category==='red'?(/Barrique/.test(p.name)?'8–10 let':'5–8 let'):p.category==='rose'?'1–2 roky':p.category==='sparkling'?'1–2 roky':'3–5 let';
});

/* ---------- jazyk, měna, země doručení ---------- */
window.LANG=read('brave-lang','CZ');state.country=read('brave-country','CZ');
document.addEventListener('click',e=>{const b=e.target.closest('[data-action="language"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 const r=(name,v,t,cur)=>`<label class="radio-option"><input type="radio" name="${name}" value="${v}" ${cur===v?'checked':''}><span>${t}</span></label>`;
 modal('Jazyk, měna a doprava',`<form class="form-stack locale-form" data-form="locale"><fieldset><legend class="eyebrow">Jazyk</legend>${r('lang','CZ','Český jazyk',LANG)}${r('lang','SK','Slovenský jazyk',LANG)}</fieldset><fieldset><legend class="eyebrow">Měna</legend>${r('currency','CZK','CZK (Kč)',state.currency)}${r('currency','EUR','EUR (€)',state.currency)}</fieldset><fieldset><legend class="eyebrow">Doprava do</legend>${r('country','CZ','Česká republika',state.country)}${r('country','SK','Slovensko',state.country)}</fieldset><p class="muted" style="font-size:14px">Ukázka: slovenská jazyková verze se v napojeném e-shopu doplní z překladů. Země doručení mění nabídku dopravců v pokladně.</p><button class="btn dark">Uložit <span>↗</span></button></form>`);},true);
document.addEventListener('submit',e=>{const f=e.target;if(f.dataset?.form!=='locale')return;e.preventDefault();e.stopImmediatePropagation();const fd=new FormData(f);
 window.LANG=fd.get('lang');state.currency=fd.get('currency');state.country=fd.get('country');try{localStorage.setItem('brave-lang',JSON.stringify(LANG));localStorage.setItem('brave-country',JSON.stringify(state.country));}catch{}persist();$('#modal').close();render(false);
 if(LANG==='SK')toast('Slovenčina je v ukážke zatiaľ len prepínač – texty zostávajú v češtine.');},true);

/* ---------- doprava a platba (pokladna) ---------- */
const SHIP=[
 ['pickup','Osobní odběr ve vinařství',0,'Vinařská 128, Valtice · hotově i kartou','CZ SK'],
 ['balikovna','Česká pošta — Balíkovna',60,'výdejní místo','CZ'],
 ['zasilkovna','Zásilkovna',65,'výdejní místo nebo Z-BOX','CZ SK'],
 ['ppl','PPL',89,'kurýr na adresu','CZ SK'],
 ['balik','Česká pošta — Balík do ruky',99,'doručení na adresu','CZ'],
 ['dpd','DPD',100,'kurýr na adresu','CZ SK'],
 ['route','Závoz vinařství',0,'pravidelné trasy Brno a Pálava','CZ']];
const PAY=[['card','Platba kartou online','Visa · Mastercard · Apple Pay'],['bank','Platba převodem','QR platba, údaje pošleme e-mailem'],['cod','Dobírka','Zásilkovna, Balíkovna, Česká pošta, DPD 30 Kč · PPL 20 Kč'],['cash','Hotově při převzetí','jen osobní odběr a závoz']];
const shipAllowed=()=>SHIP.filter(s=>s[4].includes(state.country||'CZ'));
window.shipCost=(id,total)=>{const s=SHIP.find(x=>x[0]===id);if(!s)return 0;return total>=FREE?0:s[2];};
const payOk=(pid,sid)=>pid==='cash'?['pickup','route'].includes(sid):pid==='cod'?!['pickup','route'].includes(sid):true;
window.payFee=(pid,sid)=>pid==='cod'?(sid==='ppl'?20:30):0;
window.shipLabel=id=>(SHIP.find(s=>s[0]===id)||['',id])[1];
window.payLabel=id=>(PAY.find(s=>s[0]===id)||['',id])[1];
window.shipFields=(total,shipping,payment)=>{
 const list=shipAllowed();if(!list.some(s=>s[0]===shipping)){shipping=list[0][0];checkoutData.shipping=shipping;}
 if(!payOk(payment,shipping)){payment='card';checkoutData.payment='card';}
 const opt=(name,id,t,note,price,cur,dis)=>`<label class="radio-option ${dis?'is-off':''}"><input type="radio" name="${name}" value="${id}" ${cur===id?'checked':''} ${dis?'disabled':''}><span><b>${t}</b><small>${note}</small></span><span>${price}</span></label>`;
 const stop=shipping==='route'&&window.ROUTES?`<label class="field">Zastávka závozu<select name="stop">${ROUTES.map(r=>`<optgroup label="${r.name} · ${r.days.join(', ')}">${r.stops.map(s=>{const v=`${r.days.join('/')} ${s.time} · ${s.name}`;return `<option ${checkoutData.stop===v?'selected':''}>${v}</option>`}).join('')}</optgroup>`).join('')}</select></label><p class="muted" style="margin:-6px 0 0;font-size:14px">Víno předáme v uvedený den a čas přímo na zastávce. <a href="#page/zavozove-trasy">Mapa tras ↗</a></p>`
  :['balikovna','zasilkovna'].includes(shipping)?`<label class="field">Výdejní místo<select name="point"><option>Valtice, Náměstí Svobody 5 (ukázka)</option><option>Mikulov, Náměstí 1 (ukázka)</option><option>Brno, Mendlovo nám. 1 (ukázka)</option></select></label>`:'';
 return `<p class="eyebrow">DOPRAVA · ${state.country==='SK'?'SLOVENSKO':'ČESKÁ REPUBLIKA'} <button type="button" class="text-link" data-action="language" style="margin-left:8px;font-size:11px">změnit ↗</button></p>${list.map(s=>opt('shipping',s[0],s[1],s[3],s[2]&&total<FREE?kc(s[2]):'Zdarma',shipping)).join('')}${stop}
 <p class="muted" style="font-size:14px;margin:4px 0 0">${total>=FREE?'✓ Máte dopravu zdarma.':`Doprava zdarma od ${kc(FREE)} – chybí ${kc(FREE-total)}.`}</p>
 <p class="eyebrow" style="margin:20px 0 0">PLATBA</p>${PAY.map(([id,t,n])=>opt('payment',id,t,n,id==='cod'?kc(payFee('cod',shipping)):'Zdarma',payment,!payOk(id,shipping))).join('')}`;};

/* ---------- společné stavební bloky ---------- */
const facts=a=>`<ul class="x-facts">${a.map(t=>`<li>${t}</li>`).join('')}</ul>`;
const head=(eb,h,t='')=>`<div class="x-head"><p class="eyebrow">${eb}</p><h2>${h}</h2>${t?`<p>${t}</p>`:''}</div>`;
const faqList=items=>items.map(([q,a])=>`<details class="x-faq"><summary>${q}<i aria-hidden="true"></i></summary><p>${a}</p></details>`).join('');
const ctaBox=(t,txt,mail)=>`<section class="x-cta"><div><h2>${t}</h2><p>${txt}</p></div><div class="x-cta-links"><a class="btn dark" href="tel:${tel(PHONE)}">${PHONE}</a><a class="text-link" href="mailto:${mail}">${mail} <span>↗</span></a></div></section>`;

/* ---------- rezervace (degustace i pobyt) ---------- */
const PROGRAMS=[
 {id:'mala',name:'Malá degustace',meta:'60 min · 5 vzorků',price:450,note:'za osobu · s DPH',desc:'Rychlý průřez ročníkem pro ty, co jedou dál. Stojí se ve sklepě, mluví se k věci.',inc:['Čtyři bílá a jedno červené z aktuálního ročníku','Výklad u sudů, kde víno leží','Chléb a voda k neutralizaci']},
 {id:'velka',name:'Velká degustace',badge:'Nejčastěji rezervované',meta:'90 min · 8 vzorků',price:890,note:'za osobu · s DPH',desc:'Celý sklep od sektu po slámové víno, u stolu a v klidu. Nejlepší volba pro první návštěvu.',inc:['Osm vzorků včetně dvou archivních ročníků','Deska sýrů a paštik od sousedů z Lednice','Prohlídka lisovny a archivu']},
 {id:'vecer',name:'Večer s vinařem',meta:'120 min · 10 vzorků',price:1490,note:'za osobu · min. 6 osob',min:6,desc:'Sklepmistr Jan Vrba, deset vzorků a večeře. Končí, když dojde řeč — obvykle po půlnoci.',inc:['Řízený výklad po tratích, trať po trati','Vzorky ze sudu, které se nelahvují','Teplá večeře z domácí kuchyně']}];
const ROOMS=[
 {id:'frankovka',name:'Pokoj Frankovka',short:'Frankovka',price:1490,m2:'22 m²',cap:2,beds:'2 lůžka',feat:['terasa do dvora','pes vítán (250 Kč za pobyt)'],state:'Volný',img:'s-room'},
 {id:'ryzlink',name:'Apartmán Ryzlink',short:'Ryzlink',price:1890,m2:'31 m²',cap:2,beds:'2 lůžka',feat:['výhled do vinic','apartmá'],state:'Držíme vám ho',img:'s-breakfast'},
 {id:'palava',name:'Apartmán Pálava',short:'Pálava',price:2590,m2:'44 m²',cap:4,beds:'4 lůžka',feat:['balkon nad sklepem','vlastní kuchyňka','přistýlka 390 Kč'],state:'Volný',img:'s-vineyard'}];
const PAYB=[['card','Kartou online','Visa · Mastercard · Apple Pay'],['bank','Bankovním převodem','zálohová faktura přijde do 24 hodin'],['place','Platba na místě','kartou i hotově při příchodu']];
const SLOTS=['10:00','11:00','14:00','15:00','16:00','17:00','18:00'];
const ymd=d=>d.toISOString().slice(0,10);
const today0=()=>{const d=new Date();d.setHours(12,0,0,0);return d;};
const closed=d=>d.getDay()===1; // pondělí zavřeno
const busyRoom=(room,d)=>(hash(room+ymd(d))%9)===0; // ukázková obsazenost
function bookForm(kind){
 const T=kind==='tasting',opts=T?PROGRAMS:ROOMS;
 return `<form class="xbook" data-form="xbook" data-kind="${kind}" novalidate>
 <div class="notice">Ukázková rezervace. Nic se neodesílá a termín se skutečně neblokuje.</div>
 <ol class="xbook-steps">
  <li><h3><span>1</span>${T?'Vyberte program':'Vyberte pokoj'}</h3><div class="xbook-opts">${opts.map((o,i)=>`<label class="radio-option"><input type="radio" name="opt" value="${o.id}" ${i===(T?1:0)?'checked':''}><span><b>${o.name}</b><small>${T?o.meta:`${o.m2} · ${o.beds}`}</small></span><span>${kc(o.price)}${T?' / os.':' / noc'}</span></label>`).join('')}</div></li>
  <li><h3><span>2</span>${T?'Vyberte termín':'Vyberte termín pobytu'}</h3><div class="xcal" data-cal></div><p class="xcal-legend"><i class="lg-free"></i>volno <i class="lg-off"></i>zavřeno / obsazeno <i class="lg-sel"></i>${T?'vybraný termín':'příjezd a odjezd'}</p></li>
  <li><h3><span>3</span>${T?'Vyberte čas':'Čas příjezdu'}</h3><div class="xslots" data-slots></div></li>
  <li><h3><span>4</span>${T?'Zůstat na noc?':'Přidat degustaci?'}</h3><div class="xbook-opts">${(T?[{id:'',name:'Bez přídavku',sub:'Odjedeme domů.'},...ROOMS.map(r=>({id:r.id,name:r.name,sub:r.m2+' · snídaně v ceně',price:r.price,unit:' za noc'}))]:[{id:'',name:'Bez přídavku',sub:'Jen ubytování.'},...PROGRAMS.map(p=>({id:p.id,name:p.name,sub:p.meta,price:p.price,unit:' za osobu'}))]).map((o,i)=>`<label class="radio-option"><input type="radio" name="addon" value="${o.id}" ${i?'':'checked'}><span><b>${o.name}</b><small>${o.sub}</small></span><span>${o.price?kc(o.price)+o.unit:'—'}</span></label>`).join('')}</div>
  ${T?'':`<div class="xbook-extras"><label class="checkline" data-extra="bed"><input type="checkbox" name="bed"> Přistýlka (390 Kč / noc, jen Apartmán Pálava)</label><label class="checkline" data-extra="dog"><input type="checkbox" name="dog"> Pes (250 Kč za pobyt, jen Pokoj Frankovka)</label></div>`}</li>
 </ol>
 <div class="xbook-grid">
  <div><h3 class="xbook-h">Kontaktní údaje</h3>
   <div class="form-columns"><label class="field">${T?'Počet osob':'Počet hostů'}<input name="persons" type="number" min="1" max="${T?20:4}" value="2" required></label><label class="field">Jméno a příjmení<input name="name" required autocomplete="name"></label></div>
   <div class="form-columns"><label class="field">E-mail<input name="email" type="email" required autocomplete="email"></label><label class="field">Telefon<input name="phone" type="tel" autocomplete="tel"></label></div>
   <label class="field">Poznámka pro nás<textarea name="note" rows="3"></textarea></label>
   <h3 class="xbook-h">Platba</h3>${PAYB.map(([id,t,n],i)=>`<label class="radio-option"><input type="radio" name="pay" value="${id}" ${i?'':'checked'}><span><b>${t}</b><small>${n}</small></span><span>zdarma</span></label>`).join('')}
   <label class="checkline"><input type="checkbox" name="consent" required> Souhlasím se zpracováním osobních údajů za účelem vyřízení rezervace.</label></div>
  <aside class="xbook-sum" data-sum></aside>
 </div></form>`;}
function bookState(f){f._s=f._s||{month:(()=>{const d=today0();d.setDate(1);return d;})(),date:null,from:null,to:null,time:null};return f._s;}
function drawBook(f){const s=bookState(f),T=f.dataset.kind==='tasting',opt=$('input[name="opt"]:checked',f).value;
 const m=new Date(s.month),y=m.getFullYear(),mo=m.getMonth(),first=(new Date(y,mo,1).getDay()+6)%7,days=new Date(y,mo+1,0).getDate(),t0=today0();
 const cells=[];for(let i=0;i<first;i++)cells.push('<span></span>');
 for(let d=1;d<=days;d++){const dt=new Date(y,mo,d,12);const past=dt<=t0,off=past||(T?closed(dt):busyRoom(opt,dt));const k=ymd(dt);
  const sel=T?s.date===k:(s.from===k||s.to===k);const inr=!T&&s.from&&s.to&&k>s.from&&k<s.to;
  cells.push(`<button type="button" class="${off?'off':''} ${sel?'sel':''} ${inr?'in':''}" data-day="${k}" ${off?'disabled':''} aria-label="${d}. ${mo+1}.">${d}</button>`);}
 $('[data-cal]',f).innerHTML=`<div class="xcal-top"><button type="button" data-mon="-1" aria-label="Předchozí měsíc" ${new Date(y,mo,1)<=new Date(t0.getFullYear(),t0.getMonth(),1)?'disabled':''}>←</button><b>${m.toLocaleDateString('cs-CZ',{month:'long',year:'numeric'})}</b><button type="button" data-mon="1" aria-label="Další měsíc">→</button></div><div class="xcal-dow">${['po','út','st','čt','pá','so','ne'].map(d=>`<span>${d}</span>`).join('')}</div><div class="xcal-grid">${cells.join('')}</div>`;
 const slots=T?SLOTS:['14:00','16:00','18:00','20:00'];const key=T?s.date:s.from;
 $('[data-slots]',f).innerHTML=key?slots.map(t=>{const free=T?Math.max(0,20-(hash(key+t+opt)%22)):1;return `<button type="button" class="${s.time===t?'sel':''}" data-time="${t}" ${free?'':'disabled'}><b>${t}</b><small>${T?(free?`volných ${free}`:'obsazeno'):'možný příjezd'}</small></button>`;}).join(''):`<p class="muted">${T?'Nejdřív vyberte den v kalendáři.':'Vyberte v kalendáři příjezd a odjezd.'}</p>`;
 if(!T){const bed=$('[data-extra="bed"]',f),dog=$('[data-extra="dog"]',f);bed.hidden=opt!=='palava';dog.hidden=opt!=='frankovka';if(bed.hidden)bed.querySelector('input').checked=false;if(dog.hidden)dog.querySelector('input').checked=false;}
 const persons=Math.max(1,Number(f.persons.value)||1);
 let rows=[],total=0,ok=false,hint='';
 if(T){const p=PROGRAMS.find(x=>x.id===opt);total=p.price*persons;rows.push(['Program',p.name],['Termín',s.date?new Date(s.date).toLocaleDateString('cs-CZ',{weekday:'short',day:'numeric',month:'numeric'}):'—'],['Čas',s.time||'—'],['Počet osob',`${persons} × ${kc(p.price)}`]);
  const add=$('input[name="addon"]:checked',f).value;if(add){const r=ROOMS.find(x=>x.id===add);rows.push(['Nocleh',`${r.name} · ${kc(r.price)}`]);total+=r.price;}
  ok=!!(s.date&&s.time);hint=p.min&&persons<p.min?`Večer s vinařem pořádáme od ${p.min} osob.`:ok?'':'Vyberte termín a čas.';if(p.min&&persons<p.min)ok=false;}
 else{const r=ROOMS.find(x=>x.id===opt);const n=s.from&&s.to?Math.round((new Date(s.to)-new Date(s.from))/864e5):0;total=r.price*n;rows.push(['Pokoj',r.name],['Příjezd',s.from?new Date(s.from).toLocaleDateString('cs-CZ'):'—'],['Odjezd',s.to?new Date(s.to).toLocaleDateString('cs-CZ'):'vyberte v kalendáři'],['Počet hostů',String(persons)]);
  if(n)rows.push(['Noci',`${n} × ${kc(r.price)}`]);if(f.bed.checked&&n){rows.push(['Přistýlka',`${n} × ${kc(390)}`]);total+=390*n;}if(f.dog.checked){rows.push(['Pes',kc(250)]);total+=250;}
  const add=$('input[name="addon"]:checked',f).value;if(add){const p=PROGRAMS.find(x=>x.id===add);rows.push(['Degustace',`${p.name} · ${persons} × ${kc(p.price)}`]);total+=p.price*persons;}
  ok=!!(n&&s.time)&&persons<=r.cap+(f.bed.checked?1:0);hint=persons>r.cap+(f.bed.checked?1:0)?`${r.name} je pro ${r.cap} ${plural(r.cap,'osobu','osoby','osob')}.`:!n?'Vyberte v kalendáři příjezd a odjezd.':!s.time?'Vyberte čas příjezdu.':'';}
 $('[data-sum]',f).innerHTML=`<p class="eyebrow">Souhrn rezervace</p>${rows.map(([a,b])=>`<div class="order-row"><span>${a}</span><span>${b}</span></div>`).join('')}<div class="order-row total"><span>Celkem</span><span>${kc(total)}</span></div>${hint?`<p class="muted" style="font-size:14px">${hint}</p>`:''}<button class="btn dark" ${ok?'':'disabled'}>${$('input[name="pay"]:checked',f).value==='card'?'Pokračovat k platbě':'Odeslat rezervaci'} <span>↗</span></button><p class="muted" style="font-size:13px">${T?'Storno zdarma do 48 hodin před začátkem.':'Storno zdarma do 72 hodin před příjezdem.'}</p>`;
 f._total=total;}
document.addEventListener('click',e=>{const f=e.target.closest('form[data-form="xbook"]');if(!f)return;const s=bookState(f),T=f.dataset.kind==='tasting';
 const mon=e.target.closest('[data-mon]');if(mon){const d=new Date(s.month);d.setMonth(d.getMonth()+Number(mon.dataset.mon));s.month=d;drawBook(f);return;}
 const day=e.target.closest('[data-day]');if(day&&!day.disabled){const k=day.dataset.day;if(T){s.date=k;s.time=null;}else{if(!s.from||s.to||k<=s.from){s.from=k;s.to=null;s.time=null;}else{const opt=$('input[name="opt"]:checked',f).value;let c=new Date(s.from);let clash=false;while(ymd(c)<k){if(busyRoom(opt,c)){clash=true;break;}c=new Date(c.getTime()+864e5);}if(clash){toast('V tomto rozmezí je pokoj obsazený. Zkuste jiný termín.');s.from=k;s.to=null;}else s.to=k;}}drawBook(f);return;}
 const tm=e.target.closest('[data-time]');if(tm&&!tm.disabled){s.time=tm.dataset.time;drawBook(f);}});
document.addEventListener('change',e=>{const f=e.target.closest('form[data-form="xbook"]');if(!f)return;if(e.target.name==='opt'){const s=bookState(f);if(f.dataset.kind==='room'){s.from=s.to=null;s.time=null;}}drawBook(f);});
document.addEventListener('input',e=>{const f=e.target.closest('form[data-form="xbook"]');if(f&&e.target.name==='persons')drawBook(f);});
document.addEventListener('submit',e=>{const f=e.target;if(f.dataset?.form!=='xbook')return;e.preventDefault();e.stopImmediatePropagation();
 if(!f.checkValidity()){f.reportValidity();return;}const s=bookState(f),T=f.dataset.kind==='tasting',o=$('input[name="opt"]:checked',f).closest('label').querySelector('b').textContent;
 modal('Rezervace přijata.',`<div class="notice">Ukázka: nic se neodeslalo a termín se neblokuje.</div><p><b>${o}</b><br>${T?`${new Date(s.date).toLocaleDateString('cs-CZ')} v ${s.time}`:`${new Date(s.from).toLocaleDateString('cs-CZ')} – ${new Date(s.to).toLocaleDateString('cs-CZ')} · příjezd ${s.time}`} · ${f.persons.value} ${T?'osob':'hostů'}</p><p>Celkem <b>${kc(f._total)}</b> · ${$('input[name="pay"]:checked',f).closest('label').querySelector('b').textContent}</p><p class="muted">V napojeném systému přijde potvrzení e-mailem a termín se zapíše do kalendáře vinařství.</p><button class="btn dark" data-action="close-modal">Rozumím</button>`);},true);
const initBook=()=>$$('form.xbook').forEach(f=>{if(!f._init){f._init=1;drawBook(f);}});new MutationObserver(initBook).observe($('#main'),{childList:true});
document.addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(!b)return;const f=$('form[data-form="xbook"]');if(!f)return;const i=$(`input[name="opt"][value="${b.dataset.pick}"]`,f);if(i){i.checked=true;i.dispatchEvent(new Event('change',{bubbles:true}));}f.scrollIntoView({behavior:'smooth',block:'start'});});

/* ---------- stránky ---------- */
function tastingPage(){return `${pageTop('Degustace vede vinař, ne průvodce','Tři programy ve sklepě pod dvorem. Začíná se u sudů, končí u stolu — a co vám chutnalo, odvezete si s sebou.','DEGUSTACE · VALTICE')}
<section class="x-wrap">${facts(['60–120 minut','Vinařská 128, Valtice','2 až 20 hostů'])}<div class="x-hero-img">${img('s-tasting','Degustace ve sklepě','',true,'100vw')}</div></section>
<section class="x-wrap">${head('Programy','Tři programy, jeden sklep','Každý začíná dole u sudů a končí nahoře u stolu. Lijeme z lahví, které si můžete rovnou odvézt — cenu degustace odečteme z nákupu nad 2 000 Kč.')}
 <div class="x-cards three">${PROGRAMS.map(p=>`<article class="x-card ${p.badge?'is-hl':''}">${p.badge?`<span class="x-badge">${p.badge}</span>`:''}<p class="eyebrow">${p.meta}</p><h3>${p.name}</h3><p>${p.desc}</p><ul class="x-ticks">${p.inc.map(i=>`<li>${i}</li>`).join('')}</ul><div class="x-price"><b>${kc(p.price)}</b><small>${p.note}</small></div><button class="btn ${p.badge?'dark':''}" type="button" data-pick="${p.id}">Rezervovat termín <span>↗</span></button></article>`).join('')}</div>
 <p class="x-note">Degustaci lze koupit jako dárkový poukaz s platností 12 měsíců. Skupiny nad 12 osob a firemní akce domlouváme telefonicky na <a href="tel:${tel(PHONE)}">${PHONE}</a>.</p></section>
<section class="x-wrap x-band">${head('Jak to probíhá','Dvě hodiny, čtyři zastávky','Nikam nespěcháme, ale víme, kam jdeme. Tohle je pořadí, které se nám osvědčilo.')}
 <ol class="x-steps">${[['Na dvoře','Přivítání','Sejdeme se u brány, necháte kabáty a auto. Kdo řídí, dostane odlivky a vodu.'],['Ve sklepě','U sudů','Projdeme ročník od nejlehčího vzorku. Řekneme, co dělalo počasí a proč je kyselina taková.'],['Nahoře','U stolu','Sedneme si k jídlu a k archivním ročníkům. Tady se obvykle rozhoduje, co si odvezete.'],['Na závěr','Odjezd nebo nocleh','Nákup naložíme do auta. Pro ty, co zůstávají, jsou klíče od pokoje připravené u stolu.']].map(([p,t,x],i)=>`<li><span class="x-step-no">0${i+1}</span><p class="eyebrow">${p}</p><h3>${t}</h3><p>${x}</p></li>`).join('')}</ol></section>
<section class="x-wrap" id="rezervace">${head('Rezervace','Vyberte termín a rovnou zaplaťte','Program, termín, čas a počet osob. Platit můžete kartou, převodem — nebo až na místě.')}${bookForm('tasting')}</section>
<section class="x-wrap x-two">${head('Než přijedete','Co se nejčastěji ptáte')}<div>${faqList([['Kolik nás může přijet?','Ve sklepě je místo pro dvacet lidí u stolu. Menší skupiny spojujeme jen po dohodě — pokud chcete sklep jen pro sebe, napište to do poznámky v rezervaci.'],['Dá se přijet s dětmi?','Ano. Děti mají ve dvoře stůl s hroznovým moštem. Ve sklepě je chladno kolem 12 °C — vezměte jim něco přes sebe.'],['Kdy se platí a jak zrušit termín?','Platí se kartou online, převodem, nebo na místě kartou i hotově. Termín zrušíte zdarma do 48 hodin před začátkem — stačí odpovědět na potvrzovací e-mail.'],['Jak se k vám dostaneme bez auta?','Z vlakového nádraží Valtice je to patnáct minut pěšky do kopce. Pro skupiny od šesti osob zařídíme odvoz z Břeclavi i zpátky, 90 Kč za osobu.']])}</div></section>
<section class="x-wrap"><a class="x-teaser" href="#page/ubytovani"><span class="x-teaser-img">${img('s-room','Pokoj s výhledem do vinic','',false,'50vw')}</span><span class="x-teaser-copy"><p class="eyebrow">Nechce se vám domů</p><h2>Tři pokoje o patro výš</h2><p>Kamenné zdi, dubové postele a okna do vinic. Kdo spí u nás, nemusí řešit, kdo pojede zpátky.</p><span class="text-link">Prohlédnout ubytování <span>↗</span></span></span></a></section>
${ctaBox('Nevíte, který program vybrat?','Zavolejte — doporučíme podle toho, kolik vás jede a kolik máte času.','degustace@bravewinery.cz')}`;}

function stayPage(){return `${pageTop('Spí se nad sklepem, okny do vinic','Tři pokoje ve starém dvoře — kamenné zdi, dubové postele po babičce a snídaně z Valtic. Bez recepce: klíč dostanete od nás do ruky.','UBYTOVÁNÍ · VALTICE')}
<section class="x-wrap">${facts(['3 pokoje · 2 až 4 lůžka','příjezd 14:00–20:00','Vinařská 128, Valtice'])}</section>
<section class="x-wrap x-split"><div class="x-split-img">${img('s-room','Pokoj s výhledem do vinic','',true,'50vw')}</div><div>${head('Dvůr a pokoje','Statek z roku 1846, tři pokoje k obývání','Dvůr jsme opravovali sedm let a nechali v něm, co šlo: kamenné klenby, dřevěná okna a podlahy z modřínu. Topí se kamny, snídá se na terase nad sklepem.')}<ul class="x-ticks">${['Snídaně z Valtic v ceně','Parkování ve dvoře zdarma','Odjezd do 10:00, úschova kol','Cyklostezka Valtice–Lednice od brány'].map(t=>`<li>${t}</li>`).join('')}</ul></div></section>
<section class="x-wrap">${head('Ceník · tři jednotky','Který pokoj to bude')}
 <div class="x-cards three">${ROOMS.map(r=>`<article class="x-card x-room"><div class="x-room-img">${img(r.img,r.name,'',false,'33vw')}<span class="x-state ${r.state==='Volný'?'ok':''}">${r.state}</span></div><h3>${r.short}</h3><p class="eyebrow">${r.m2} · ${r.beds}</p><ul class="x-ticks">${r.feat.map(t=>`<li>${t}</li>`).join('')}</ul><div class="x-price"><b>${kc(r.price)}</b><small>za noc · snídaně v ceně</small></div><button class="btn" type="button" data-pick="${r.id}">Vybrat pokoj <span>↗</span></button></article>`).join('')}</div>
 <p class="x-note">Ceny jsou za pokoj a noc včetně snídaně. Apartmán Pálava má vlastní kuchyňku, přistýlka 390 Kč.</p></section>
<section class="x-wrap"><article class="x-package"><div><p class="eyebrow">Balíček · degustace a nocleh</p><h2>Velká degustace a noc pro dva</h2><p>Osm vzorků se sýry, pokoj Frankovka a snídaně na terase. Nemusíte řešit, kdo pojede zpátky.</p></div><div class="x-price"><b>${kc(2990)}</b><small><s>${kc(3270)}</s> zvlášť</small><button class="btn dark" type="button" data-pick="frankovka" data-pkg="1">Rezervovat balíček <span>↗</span></button></div></article></section>
<section class="x-wrap x-two">${head('Doplňky a pravidla','Co je v ceně a co ne')}<div><table class="spec-table">${[['Snídaně','v ceně · od 8:00 na terase nad sklepem'],['Parkování ve dvoře','zdarma'],['Přistýlka',`${kc(390)} / noc · Apartmán Pálava`],['Pes',`${kc(250)} za pobyt · Pokoj Frankovka`],['Degustace k pobytu',`${kc(450)}–${kc(1490)} za osobu`],['Příjezd','klíče předáváme osobně 14:00–20:00, později po domluvě'],['Odjezd','do 10:00, kola a zavazadla pohlídáme i po odhlášení'],['Storno','zdarma do 72 hodin před příjezdem']].map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table></div></section>
<section class="x-wrap" id="rezervace">${head('Rezervace pobytu','Vyberte pokoj, termín a způsob platby','Platba kartou, převodem, nebo až u nás na místě. Dostupnost potvrdíme e-mailem a domluvíme příjezd.')}${bookForm('room')}</section>
<section class="x-wrap x-two">${head('Než přijedete','Co se nejčastěji ptáte')}<div>${faqList([['Kdy se dá přijet a odjet?','Klíče předáváme osobně mezi 14:00 a 20:00, pozdější příjezd po domluvě. Odjezd do 10:00, kola a zavazadla vám pohlídáme ve dvoře i po odhlášení.'],['Je snídaně v ceně?','Ano, pro všechny pokoje. Chleba z Valtic, sýry z Lednice, vejce ze dvora a moravský meruňkový džem — od 8:00 na terase nad sklepem.'],['Vejdeme se s dětmi nebo se psem?','Apartmán Pálava má čtyři lůžka a místo pro přistýlku (390 Kč). Pes je vítaný ve Frankovce, 250 Kč za pobyt.'],['Jak funguje storno pobytu?','Rezervaci zrušíte zdarma do 72 hodin před příjezdem. Platit můžete předem kartou nebo převodem, případně na místě kartou i hotově.']])}</div></section>
${ctaBox('Chcete celý dvůr jen pro sebe?','Napište nám — svatby a firemní pobyty domlouváme na míru.','ubytovani@bravewinery.cz')}`;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-pkg]');if(!b)return;setTimeout(()=>{const f=$('form[data-form="xbook"]');const a=f&&$('input[name="addon"][value="velka"]',f);if(a){a.checked=true;f.persons.value=2;drawBook(f);}},50);});

function shippingPage(){const row=(a)=>`<tr>${a.map(x=>`<td>${x}</td>`).join('')}</tr>`;return `${pageTop('Doprava a platba','Víno k vám dopravíme rychle a bezpečně — po celé České republice i na Slovensko. Ceny jsou včetně DPH a stejné uvidíte i v košíku.','NÁKUP')}
<section class="x-wrap x-doc"><nav class="x-toc">${['Způsoby dopravy','Doprava zdarma','Způsoby platby','Dodací lhůta','Balení vína','Závozové trasy'].map((t,i)=>`<a href="#page/doprava" data-scrollto="sec-${i}"><span>0${i+1}</span>${t}</a>`).join('')}</nav><div class="x-doc-body">
 <h2 id="sec-0">Způsoby dopravy</h2><p>Způsob dopravy si zvolíte v košíku. Cena platí za jednu zásilku bez ohledu na počet lahví.</p>
 <table class="spec-table x-table"><thead><tr><th>Doprava</th><th>Kam</th><th>Cena</th></tr></thead><tbody>${SHIP.map(s=>row([`<b>${s[1]}</b><small>${s[3]}</small>`,s[4].replace(' ',', ').replace('CZ','ČR'),s[2]?kc(s[2]):'zdarma'])).join('')}</tbody></table>
 <p class="muted">Při platbě v eurech se ceny přepočítají kurzem e-shopu. Závazná je vždy cena zobrazená v košíku.</p>
 <h2 id="sec-1">Doprava zdarma</h2><p>Objednávka nad ${kc(FREE)} má dopravu zdarma — platí pro všechny způsoby dopravy do ČR i na Slovensko.</p>
 <h2 id="sec-2">Způsoby platby</h2><table class="spec-table x-table"><thead><tr><th>Platba</th><th>Kdy</th><th>Cena</th></tr></thead><tbody>${[['Platba kartou online','u všech způsobů dopravy','zdarma'],['Platba převodem','u všech způsobů dopravy · QR platba, údaje pošleme e-mailem','zdarma'],['Dobírka','Zásilkovna, Balíkovna, Česká pošta, DPD',kc(30)],['Dobírka PPL','PPL kurýr',kc(20)],['Hotově při převzetí','osobní odběr a závoz vinařství','zdarma']].map(row).join('')}</tbody></table>
 <h2 id="sec-3">Dodací lhůta</h2><p>Objednávky přijaté v pracovní den do 14:00 expedujeme zpravidla týž den, nejpozději následující pracovní den. Doručení po ČR trvá obvykle 1–2 pracovní dny, na Slovensko 2–3 pracovní dny. U platby převodem expedujeme po připsání platby.</p><p>O každé změně stavu objednávky vás informujeme e-mailem. Zásilku s vínem převezme jen osoba starší 18 let — dopravce může požádat o doklad.</p>
 <h2 id="sec-4">Balení vína</h2><p>Každou láhev balíme do ochranných vložek a pevných kartonů určených pro přepravu skla, aby k vám víno dorazilo v pořádku. Pokud by přesto byla zásilka poškozená, ozvěte se nám — vyřešíme to.</p>
 <h2 id="sec-5">Závozové trasy</h2><p>Po Brně a Pálavě jezdíme pravidelné trasy. Víno předáme zdarma na zastávce v uvedený den a čas. <a href="#page/zavozove-trasy">Mapa tras a zastávek ↗</a></p>
</div></section>`;}
document.addEventListener('click',e=>{const a=e.target.closest('[data-scrollto]');if(!a)return;e.preventDefault();document.getElementById(a.dataset.scrollto)?.scrollIntoView({behavior:'smooth',block:'start'});});

function vineyardPage(){return `${pageTop('Tři a půl hektaru pod bílými skalami','Tři viniční tratě, každá s jinou půdou a jiným charakterem. Obhospodařujeme je ručně — od řezu v březnu po sklizeň v září.','NAŠE VINICE · VALTICE')}
<section class="x-wrap">${facts(['3 tratě · 3,5 ha','vápenec, spraš, jíl','od roku 2000'])}<figure class="x-hero-img">${img('s-vineyard','Vinice pod Pálavou','',true,'100vw')}<figcaption>Vápenec se štěrkem na trati Kamenná — réva tu shání vodu do osmi metrů.</figcaption></figure></section>
<section class="x-wrap x-two">${head('Terroir','Půda dělá víc než sklep')}<div><p>Naše tratě leží na vápenci, spraši a jílu — tři různé podklady na necelých čtyřech hektarech. Vápenec dává vínům tvrdou kyselinu a minerální tón, spraš teplo a plnost, jíl drží vodu pro červená vína, která mají čas.</p><p>Každou trať sklízíme a kvasíme zvlášť. Až pak se rozhodujeme, jestli víno půjde do lahve samo, nebo se s něčím spojí.</p><div class="x-nums">${[['3,5 ha','vlastních vinic'],['2000','rok první sklizně'],['16 hl','ročně, ručně']].map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div></div></section>
<section class="x-wrap">${head('Viniční tratě','Tři svahy, tři povahy')}
 <div class="x-tabs" role="tablist">${SITES.map((s,i)=>`<button type="button" role="tab" aria-selected="${i?'false':'true'}" data-site="${s.id}">${s.name}</button>`).join('')}</div>
 ${SITES.map((s,i)=>{const ws=products.filter(p=>p.site===s.name);return `<article class="x-site" data-site-panel="${s.id}" ${i?'hidden':''}><div><h3>${s.name}</h3><p>${s.text}</p><dl class="x-dl">${[['Výměra',s.area],['Půda',s.soil],['Nadmořská výška',s.altitude],['Orientace',s.orientation],['Odrůdy',[...new Set(ws.map(p=>p.type))].join(', ')]].map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}<div><dt>Teplo tratě</dt><dd><span class="x-scale">${[1,2,3,4,5].map(n=>`<i class="${n<=s.warm?'on':''}"></i>`).join('')}</span></dd></div></dl></div><div class="x-site-wines"><p class="eyebrow">Vína z této tratě</p>${ws.map(p=>`<a href="#product/${p.id}">${img(p.image,p.name,'',false,'80px')}<span><b>${esc(p.name)} ${p.vintage}</b><small>${kc(p.price)}</small></span></a>`).join('')}</div></article>`;}).join('')}</section>
<section class="x-wrap x-band">${head('Rok ve vinici','Co se kdy děje','Devadesát procent práce je hotovo, než se vůbec dotkneme sklepa.')}
 <ol class="x-year">${[['Březen','Řez','Ručně, keř po keři. Rozhodujeme, kolik oček réva ponese — tady začíná výnos i chuť.'],['Květen','Podlom a vyvazování','Odstraníme nadbytečné výhony, zbytek vyvážeme do drátů, aby hrozny prosvítilo slunce.'],['Červenec','Zelené práce','Odstraňujeme každý třetí hrozen. Menší výnos, hlubší chuť — a zdravější réva.'],['Září','Sklizeň','Ručně do přepravek po 15 kg, tratě sbíráme zvlášť. Ve sklepě jsme do dvou hodin.'],['Listopad','Odpočinek','Réva jde do klidu, my do sklepa. Mladá vína leží na kalech a poprvé ukazují, co budou.']].map(([m,t,x])=>`<li><p class="eyebrow">${m}</p><h3>${t}</h3><p>${x}</p></li>`).join('')}</ol></section>
<section class="x-wrap x-split"><div class="x-split-img">${img('s-harvest','Ruční sklizeň','',false,'50vw')}</div><div>${head('Jak to děláme','Čtyři věci, na kterých trváme')}<div class="x-principles">${[['Bez herbicidů','Meziřadí sekáme a necháváme zapravit — půda tak drží vodu i život.'],['Vlastní kompost','Hroznové výlisky se vracejí zpátky do vinice, kde vyrostly.'],['Ruční sběr','Žádný kombajn. Hrozen, který nechceme, do přepravky nepřijde.'],['Moderní sklep','Pneumatický lis a nerezové tanky s řízeným chlazením hlídají, aby se ve sklepě neztratilo, co přivezeme z vinice.']].map(([t,x],i)=>`<div><span>0${i+1}</span><h3>${t}</h3><p>${x}</p></div>`).join('')}</div></div></section>
<section class="x-wrap"><figure class="x-quote"><blockquote>„Ve vinici se dá pokazit všechno. Ve sklepě už ten zbytek nezachráníte.“</blockquote><figcaption><b>Jan Vrba</b> · sklepmistr</figcaption></figure></section>
<section class="x-cta"><div><p class="eyebrow">Podívejte se sami</p><h2>Projdeme s vámi vinici i sklep</h2><p>Degustace ve sklepě, prohlídka tratí po dohodě. Trvá dvě hodiny, končí u stolu.</p></div><div class="x-cta-links"><a class="btn dark" href="#page/degustace">Rezervovat termín <span>↗</span></a></div></section>`;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-site]');if(!b)return;$$('[data-site]').forEach(x=>x.setAttribute('aria-selected',String(x===b)));$$('[data-site-panel]').forEach(p=>p.hidden=p.dataset.sitePanel!==b.dataset.site);});

const TEAM=[['Jan Vrba','Sklepmistr · vína a degustace','Poradí s výběrem ročníku i se snoubením. Vede degustace ve sklepě.','+420 519 352 201','jan@bravewinery.cz','s-winemaker'],['Eva Vrbová','Objednávky · ubytování','Vyřizuje objednávky, dárkové sety a rezervace pokojů.','+420 519 352 202','eva@bravewinery.cz','s-vinoteka'],['Petr Vrba','Vinice · velkoodběr','Řeší dodávky pro restaurace, vinotéky a firemní dárky.','+420 519 352 203','petr@bravewinery.cz','s-harvest']];
function contactPage(){return `${pageTop('Ozvěte se, jsme tři','Odpovídáme obvykle do hodiny · Po–Pá 9:00–17:00','KONTAKT')}
<section class="x-wrap"><div class="x-quick">${[[PHONE,'Zavolejte — nejrychlejší cesta',`tel:${tel(PHONE)}`],[MAIL,'Odpovídáme do jednoho dne',`mailto:${MAIL}`],[ADDR,'Vinotéka i sklep na jedné adrese','https://www.openstreetmap.org/search?query='+encodeURIComponent(ADDR)]].map(([a,b,h])=>`<a href="${h}" ${h.startsWith('http')?'target="_blank" rel="noopener"':''}><b>${a}</b><span>${b}</span></a>`).join('')}</div></section>
<section class="x-wrap x-two"><div>${head('Napište nám','S čím vám můžeme pomoct?')}<dl class="x-dl"><div><dt>Po–Pá</dt><dd>9:00–17:00</dd></div><div><dt>So</dt><dd>9:00–12:00</dd></div></dl><p class="muted">Degustace i mimo hodiny po dohodě — zavolejte den dopředu.</p></div>
 <form class="form-stack" data-form="xcontact"><div class="notice">Ukázkový formulář. Údaje se nikam neodesílají.</div><fieldset class="x-topics"><legend class="eyebrow">Téma</legend>${['Objednávka a doprava','Degustace','Ubytování','Velkoodběr','Něco jiného'].map((t,i)=>`<label><input type="radio" name="topic" value="${t}" ${i?'':'checked'}><span>${t}</span></label>`).join('')}</fieldset><div class="form-columns"><label class="field">Jméno a příjmení<input name="name" required autocomplete="name"></label><label class="field">E-mail<input name="email" type="email" required autocomplete="email"></label></div><label class="field">Telefon (nepovinné)<input name="phone" type="tel" autocomplete="tel"></label><label class="field">Zpráva<textarea name="msg" rows="5" required></textarea></label><label class="checkline"><input type="checkbox" required> Souhlasím se zpracováním osobních údajů.</label><button class="btn dark">Odeslat zprávu <span>↗</span></button></form></section>
<section class="x-wrap">${head('Kdo vám odpoví','Rodina, ne call centrum')}<div class="x-cards three">${TEAM.map(([n,r,t,p,m,i])=>`<article class="x-card x-person"><div class="x-person-img">${img(i,n,'',false,'33vw')}</div><h3>${n}</h3><p class="eyebrow">${r}</p><p>${t}</p><p class="x-person-links"><a href="tel:${tel(p)}">${p}</a><a href="mailto:${m}">${m}</a></p></article>`).join('')}</div><p class="x-note"><a class="text-link" href="#page/faq">Časté otázky <span>↗</span></a></p></section>
${visitSection()}
<section class="x-wrap x-two">${head('Fakturační údaje','Brave Winery s.r.o.')}<div><table class="spec-table">${[['Firma','Brave Winery s.r.o.'],['Sídlo',ADDR],['IČO','123 45 678'],['DIČ','CZ12345678'],['Účet','1234567890 / 0300']].map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table><p class="muted">Ukázkové údaje.</p></div></section>`;}
document.addEventListener('submit',e=>{const f=e.target;if(f.dataset?.form!=='xcontact')return;e.preventDefault();e.stopImmediatePropagation();if(!f.checkValidity()){f.reportValidity();return;}toast(`Děkujeme! Ukázková zpráva (${new FormData(f).get('topic')}) se nikam neodeslala.`);f.reset();},true);

const FAQ=[['Nákup a objednávka',[['Musím se registrovat, abych mohl nakoupit?','Nemusíte. Objednávka projde i bez účtu — stačí jméno, e-mail, telefon a adresa. Účet se hodí, když nakupujete opakovaně: pamatuje si adresy, drží historii objednávek a sbíráte v něm věrnostní body.'],['Kolik lahví musím koupit najednou?','Klidně jednu. Vína posíláme v šestkových kartonech s tvarovanými vložkami — láhve se v nich nepohnou a doprava vyjde levněji. Na detailu vína najdete tlačítko „Vložit karton“.'],['Můžu objednávku ještě změnit?','Dokud vám nepřijde e-mail o předání přepravci, ano. Zavolejte nebo napište — přidání láhve zvládneme obratem.'],['Vystavíte fakturu na firmu?','Samozřejmě. V pokladně zaškrtněte nákup na firmu a doplňte IČO a DIČ; fakturu pošleme e-mailem hned po odeslání zásilky.']]],
 ['Doručení a platba',[['Za jak dlouho víno přijde?','Odesíláme do 1–2 pracovních dnů. Zásilkovna doručí obvykle druhý den, kurýr PPL na adresu třetí. Přesné datum najdete v e-mailu se sledováním.'],['Kdy mám dopravu zdarma?',`Nad ${kc(FREE)}, tedy zpravidla od čtyř lahví. V košíku vidíte, kolik ještě chybí.`],['Doručujete i na Slovensko?','Ano, Zásilkovnou, PPL nebo DPD s doručením do tří pracovních dnů. Zemi doručení přepnete v hlavičce. Do dalších zemí EU po dohodě — napište nám a spočítáme dopravu.'],['Jak můžu zaplatit?','Kartou online, Apple Pay, bankovním převodem s QR kódem nebo dobírkou. Při osobním odběru a na závozové trase i hotově.'],['Co když nebudu doma?','Kurýr zkusí doručit znovu nebo balík uloží na výdejním místě. Zásilkovna drží balík sedm dní.']]],
 ['Vína a skladování',[['Jak dlouho víno vydrží?','Naše svěží bílá a rosé jsou nejlepší do dvou let od stočení. Barrique červená zrají pět až deset let. U každého vína na detailu píšeme doporučenou archivaci.'],['Jak víno správně skladovat?','V leže, ve tmě, při 10–14 °C a bez otřesů. Nejhorší je kolísání teploty — láhev u sporáku zestárne rychleji než v nevytápěné komoře.'],['Proč má víno šroubový uzávěr?','Protože u svěžích bílých vín chrání ovocnou vůni lépe než korek a nehrozí korková příchuť. Archivní ročníky zavíráme přírodním korkem.'],['Máte vína bez oxidu siřičitého?','Úplně bez ne — malé množství vzniká i při kvašení. Síříme ale minimálně, obvykle na polovině limitu pro bio vína.'],['Co je sediment na dně láhve?','Přirozená usazenina barviv a vinného kamene, typická pro archivní ročníky. Není to vada — láhev nechte stát a nalévejte pomalu.']]],
 ['Degustace a návštěva',[['Musím se na degustaci předem hlásit?','Ano, ve sklepě je místo pro dvacet lidí. Termín vyberete online v rezervaci a potvrzení přijde e-mailem.'],['Kolik lidí musí být pro degustaci?','Jedeme i pro dva. Skupiny nad dvanáct osob a firemní akce domlouváme telefonicky, připravíme sklep i občerstvení.'],['Můžu k degustaci přijet autem?','Přijeďte, ale zpět raději ne. Nabízíme ubytování ve vinařství a taxi do Mikulova vám rádi zavoláme.'],['Dá se degustace darovat?','Ano, dárkový poukaz na degustaci platí rok od zakoupení a příjemce si termín vybere sám.']]],
 ['Vrácení a reklamace',[['Můžu víno vrátit?','Do 14 dnů od převzetí bez důvodu, pokud je láhev neotevřená a nepoškozená. Napište nám a pošleme instrukce; peníze vracíme do 14 dnů od doručení zásilky.'],['Co když přijde rozbitá láhev?','Nafoťte zásilku i láhev a napište do 48 hodin. Nové víno posíláme obratem, nic nedokazujete.'],['Co když víno nechutná tak, jak jsem čekal?','Ozvěte se. Chuťová preference není vada, ale rádi poradíme, které víno z naší nabídky sedne lépe — a příště přiložíme vzorek.']]]];
window.wineFaqAll=FAQ;
function faqPage(){const n=FAQ.reduce((s,[,i])=>s+i.length,0);return `${pageTop('Časté otázky',`${n} odpovědí · na zbytek zavolejte ${PHONE}`,'PORADNA')}
<section class="x-wrap x-faqpage"><aside class="x-faq-side"><label class="field">Hledat v otázkách<input type="search" data-faq-search placeholder="např. doprava, sklad, poukaz"></label><nav>${FAQ.map(([g,i],k)=>`<a href="#page/faq" data-scrollto="faq-${k}">${g} <small>${i.length}</small></a>`).join('')}</nav></aside>
<div class="x-faq-body">${FAQ.map(([g,items],k)=>`<section class="x-faq-group" id="faq-${k}"><h2>${g}</h2>${faqList(items)}</section>`).join('')}<div class="x-faq-empty" hidden><h3>Na tohle jsme odpověď nenapsali</h3><p>Zkuste jiné slovo — nebo se zeptejte přímo, odpovídáme obvykle do hodiny.</p><a class="btn dark" href="#page/kontakty">Napsat dotaz <span>↗</span></a></div></div></section>
${ctaBox('Nenašli jste odpověď?','Zavolejte nebo napište — poradíme s výběrem i dopravou. Po–Pá 9:00–17:00 · So 9:00–12:00.',MAIL)}`;}
document.addEventListener('input',e=>{if(!e.target.matches('[data-faq-search]'))return;const q=e.target.value.trim().toLowerCase();let any=0;$$('.x-faq-group').forEach(g=>{let vis=0;$$('.x-faq',g).forEach(d=>{const m=!q||d.textContent.toLowerCase().includes(q);d.hidden=!m;if(m){vis++;if(q)d.open=true;}});g.hidden=!vis;any+=vis;});$('.x-faq-empty').hidden=!!any;});

function awardsPage(){const won=products.filter(p=>p.medal);const lv=['Zlatá','Stříbrná','Bronzová'];const comps=[...new Set(won.map(p=>p.medalComp))];
 const medals=(typeof awards!=='undefined'?awards.length:0)||won.length;
 return `${pageTop('Oceněná vína','Co porota ochutnala dřív než vy. U každé lahve visí medaile, kterou přivezla — a láhev si můžete vzít rovnou odsud.','OCENĚNÍ')}
<section class="x-wrap"><div class="x-nums big"><div><b>${medals}</b><span>${plural(medals,'medaile','medaile','medailí')}</span></div><div><b>${won.length}</b><span>${plural(won.length,'oceněné víno','oceněná vína','oceněných vín')}</span></div><div><b>${comps.length}</b><span>${plural(comps.length,'soutěž','soutěže','soutěží')}</span></div></div>
<p class="x-lead">Medaile ze soutěží, kde se víno hodnotí naslepo a porota neví, čí sklenku drží. Soutěže jsou v ukázce smyšlené.</p>
<div class="x-filter" data-aw><div role="group" aria-label="Filtr podle soutěže"><button type="button" class="pill active" data-aw-comp="">Všechny soutěže</button>${comps.map(c=>`<button type="button" class="pill" data-aw-comp="${esc(c)}">${c} <small>${won.filter(p=>p.medalComp===c).length}</small></button>`).join('')}</div>
<div role="group" aria-label="Filtr podle medaile"><button type="button" class="pill active" data-aw-lv="">Všechny medaile</button>${lv.filter(l=>won.some(p=>p.medalLevel===l)).map(l=>`<button type="button" class="pill" data-aw-lv="${l}">${l.replace('á','o').replace('Zloto','Zlato').replace('Stříbrno','Stříbro').replace('Bronzovo','Bronz')}</button>`).join('')}</div></div>
<div class="product-grid x-aw-grid">${won.map(p=>`<div class="x-aw-item" data-comp="${esc(p.medalComp)}" data-lv="${p.medalLevel}">${card(p)}</div>`).join('')}</div>
<p class="x-aw-empty muted" hidden>Téhle kombinaci soutěže a medaile neodpovídá žádné víno.</p></section>`;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-aw-comp],[data-aw-lv]');if(!b)return;const k=b.hasAttribute('data-aw-comp')?'comp':'lv';$$(`[data-aw-${k}]`).forEach(x=>x.classList.toggle('active',x===b));
 const c=$('[data-aw-comp].active').dataset.awComp,l=$('[data-aw-lv].active').dataset.awLv;let n=0;$$('.x-aw-item').forEach(i=>{const v=(!c||i.dataset.comp===c)&&(!l||i.dataset.lv===l);i.hidden=!v;n+=v;});$('.x-aw-empty').hidden=!!n;});

/* ---------- přesměrování stránek ---------- */
const baseContent=contentPage;
contentPage=function(id){
 if(id==='degustace')return tastingPage();
 if(id==='ubytovani')return stayPage();
 if(id==='doprava')return shippingPage();
 if(id==='nase-vinice'||id==='o-nas')return vineyardPage();
 if(id==='kontakty')return contactPage();
 if(id==='faq')return faqPage();
 if(id==='ocenena-vina')return awardsPage();
 if(id==='blog'||id==='aktuality')return blogPage();
 return baseContent(id);};

/* ---------- blog s rubrikami ---------- */
articles.push(
 {id:'jak-skladovat-vino',image:'s-cellar',tag:'Tipy · 4 min čtení',title:'Jak skladovat víno doma.'},
 {id:'co-je-terroir',image:'s-grapes',tag:'Vinice · 5 min čtení',title:'Co znamená terroir a proč je pro víno důležitý.'},
 {id:'vino-podle-prilezitosti',image:'s-white',tag:'Víno · 4 min čtení',title:'Bílé, červené nebo růžové? Jak vybrat víno podle příležitosti.'});
const catOf=a=>a.tag.split(' · ')[0];
function blogPage(){const cats=[...new Set(articles.map(catOf))];return `${pageTop(THEME.journalTitle,'Poznámky z ročníku, snoubení a degustací — píšeme je sami, mezi bečkami a řádky.','BLOG')}
<section class="section" style="padding-top:10px"><div class="pills x-blog-cats" role="group" aria-label="Rubriky blogu"><button type="button" class="pill active" data-blog-cat="">Vše <small>${articles.length}</small></button>${cats.map(c=>`<button type="button" class="pill" data-blog-cat="${c}">${c} <small>${articles.filter(a=>catOf(a)===c).length}</small></button>`).join('')}</div>
<div class="journal-grid">${articles.map(a=>`<a class="journal-card" data-cat="${catOf(a)}" href="#article/${a.id}"><div class="image-wrap" data-cursor="ČÍST ↗">${img(a.image,a.title)}</div><p class="eyebrow">${a.tag}</p><h3>${a.title}</h3><span class="text-link">Číst článek <span>↗</span></span></a>`).join('')}</div>
<figure class="x-quote small"><blockquote>„Dobré víno se nedělá ve sklepě. Ve sklepě se už jen nezkazí to, co přivezeme z vinice.“</blockquote><figcaption><b>Jan Vrba</b> · sklepmistr</figcaption></figure></section>`;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-blog-cat]');if(!b)return;$$('[data-blog-cat]').forEach(x=>x.classList.toggle('active',x===b));$$('.journal-card[data-cat]').forEach(c=>c.hidden=!!b.dataset.blogCat&&c.dataset.cat!==b.dataset.blogCat);});

/* ---------- rozcestník nabídky nad výpisem všech vín ---------- */
const COLOR_TXT={white:'svěží a minerální — k rybě, sýrům i letnímu večeru',red:'sametová, s tmavým ovocem — ke zvěřině a ke krbu',rose:'lehká a ovocná — na terasu a k lehké kuchyni',sparkling:'jemné bublinky — na přípitek i na celý večer'};
const baseCatalog=catalog;
catalog=function(){const html=baseCatalog();if(currentCat!=='all'||Object.keys(filters).length||typeFilter)return html;
 const n=k=>products.filter(p=>p.category===k).length;
 const hub=`<section class="x-hub"><p class="eyebrow">Podle barvy</p><h2>Kterou barvou začnete?</h2><div class="x-hub-tiles">${['white','red','rose','sparkling'].map(k=>`<a href="#catalog/${k}" class="x-hub-tile" data-tone="${k}"><span class="x-hub-img">${img(THEME.categoryImages[k],categories[k],'',false,'25vw')}</span><b>${categories[k]}</b><small>${n(k)} ${plural(n(k),'víno','vína','vín')}</small><span>${COLOR_TXT[k]}</span></a>`).join('')}</div>
 <div class="x-hub-row"><div><p class="eyebrow">Podle chuti</p><div class="pills">${['suché','polosuché','polosladké'].filter(s=>products.some(p=>p.sweetness===s)).map(s=>`<button type="button" class="pill" data-chip="sweetness" data-val="${s}">${s}</button>`).join('')}</div></div>
 <div><p class="eyebrow">Oblíbená hledání</p><div class="pills">${['Pálava','Ryzlink rýnský','Frankovka','Zweigeltrebe rosé','Frizzante'].filter(t=>products.some(p=>p.type===t)).map(t=>`<button type="button" class="pill" data-chip="type" data-val="${t}">${t.replace(' rýnský','').replace('Zweigeltrebe rosé','Rosé')}</button>`).join('')}</div></div></div></section>`;
 return html.replace('</div><div class="catalog-section">',`</div>${hub}<div class="catalog-section">`).replace(/(<div class="page-top">[\s\S]*?<\/div>)(?!<section class="x-hub")/,m=>m);};
document.addEventListener('click',e=>{const b=e.target.closest('[data-chip]');if(!b)return;filters={};typeFilter='';if(b.dataset.chip==='type')typeFilter=b.dataset.val;else filters={[b.dataset.chip]:[b.dataset.val]};visibleCount=8;render(false);$('.catalog-section')?.scrollIntoView({behavior:'smooth',block:'start'});});

/* ---------- detail vína: parametry, karton, recenze, odkud je ---------- */
const baseDetail=detailPanel;
detailPanel=function(p,t){if(Number(t)!==1)return baseDetail(p,t);const rows=[['Odrůda',p.type],['Ročník',p.vintage],['Přívlastek',p.predicate],['Barva vína',{white:'bílé',red:'červené',rose:'růžové',sparkling:'šumivé'}[p.category]],['Kategorie vína',p.sweetness],['Zbytkový cukr',p.sugar+' g/l'],['Kyseliny',p.acid+' g/l'],['Obsah alkoholu',String(p.abv).replace('.',',')+' % obj.'],['Bezcukerný extrakt',p.extract+' g/l'],['Teplota podávání',p.temp],['Archivační potenciál',p.archive],['Obsah lahve','0,75 l'],['Vinařská obec','Valtice'],['Viniční trať',p.site],['Region','Morava · podoblast mikulovská'],['Obsahuje','oxid siřičitý']];
 return `<table class="spec-table">${rows.map(([a,b])=>`<tr><td>${a}</td><td>${esc(String(b))}</td></tr>`).join('')}</table><p class="muted">Ukázková data. Analytické hodnoty doplní vinařství podle etikety.</p>`;};
const NAMES=['Eva M.','Petr K.','Jan N.','Tomáš P.','Marek H.','Lucie S.','Jana D.','Ondřej V.','Klára B.','Martin R.'];
const TEXTS=['Krásně pitelné, jen bych snesl o chlup víc kyseliny. K sýrům ale sedí naprosto skvěle.','Přesně ta svěžest z popisku. Bral jsem šest lahví na oslavu a byla to první věc, co zmizela.','Pili jsme večer na terase a šlo to samo. Příště beru rovnou karton.','Doporučení sklepmistra sedlo přesně k jídlu. Objednávka dorazila druhý den, krásně zabalená.',null,'Na tu cenu výborné. Kupuju už potřetí a ročník od ročníku mě baví víc.'];
function reviewsOf(p){const n=p.reviews,five=Math.max(0,Math.min(n,Math.round((p.rating-4)*n))),dist={5:five,4:n-five,3:0,2:0,1:0};const items=[];
 for(let i=0;i<Math.min(n,8);i++){const h=hash(p.id+i);const d=new Date(Date.now()-(i*11+h%9+3)*864e5);items.push({author:NAMES[(h+i)%NAMES.length],date:d.toLocaleDateString('cs-CZ'),rating:i<five?5:4,text:TEXTS[(h+i)%TEXTS.length]});}
 const own=read('brave-reviews',{})[p.id]||[];return {n:n+own.length,dist,items:[...own,...items],avg:p.rating};}
function reviewsSection(p){const r=reviewsOf(p);return `<section class="x-wrap x-reviews" id="recenze"><div class="x-rev-sum"><p class="eyebrow">Recenze</p><div class="x-rev-avg"><b>${String(r.avg).replace('.',',')}</b>${stars(r.avg)}</div><p>z ${r.n} hodnocení ověřených nákupem</p>
 <ul class="x-rev-dist">${[5,4,3,2,1].map(s=>`<li><span>${s} ★</span><i><em style="width:${r.n?Math.round(r.dist[s]/p.reviews*100):0}%"></em></i><span>${r.dist[s]}</span></li>`).join('')}</ul>
 <p class="muted" style="font-size:13px">Hodnocení sbíráme e-mailem po nákupu. Ukázková data.</p><button class="btn dark" type="button" data-action="x-review" data-id="${p.id}">Napsat recenzi <span>↗</span></button></div>
 <div class="x-rev-list">${r.items.map((x,i)=>`<article class="x-rev" ${i>=4?'hidden data-more':''}><div class="x-rev-top">${stars(x.rating)}<span><b>${esc(x.author)}</b> · ${x.date} · ověřený nákup</span></div>${x.text?`<p>${esc(x.text)}</p>`:''}${x.tags?.length?`<p class="x-rev-tags">${x.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</p>`:''}</article>`).join('')}${r.items.length>4?`<button class="text-link" type="button" data-rev-more>Zobrazit další recenze (${r.items.length-4}) <span>↓</span></button>`:''}</div></section>`;}
document.addEventListener('click',e=>{const m=e.target.closest('[data-rev-more]');if(m){$$('.x-rev[data-more]').forEach(x=>x.hidden=false);m.remove();return;}
 const b=e.target.closest('[data-action="x-review"]');if(!b)return;e.stopImmediatePropagation();const p=getProduct(b.dataset.id);
 modal(`Jak vám chutnal${p?` ${esc(p.name)}`:''}?`,`<form class="form-stack" data-form="xreview" data-id="${b.dataset.id}"><div class="notice">Ukázka: recenze se uloží jen ve vašem prohlížeči.</div><fieldset class="x-stars-in"><legend class="eyebrow">Vyberte hvězdičky</legend>${[5,4,3,2,1].map(s=>`<input type="radio" name="rating" id="rs${s}" value="${s}" ${s===5?'checked':''}><label for="rs${s}" aria-label="${s} z 5">★</label>`).join('')}</fieldset><fieldset class="x-topics"><legend class="eyebrow">Co vystihuje víno nejlíp?</legend>${['svěží','ovocné','minerální','k jídlu','na terasu','dobrá cena'].map(t=>`<label><input type="checkbox" name="tags" value="${t}"><span>${t}</span></label>`).join('')}</fieldset><label class="field">Jméno nebo přezdívka<input name="author" required placeholder="Marek H."></label><label class="field">E-mail (nezveřejníme)<input name="email" type="email" required></label><label class="field">Vaše zkušenost<textarea name="text" rows="4" placeholder="Kdy a k čemu jste víno pili? Co vás na něm překvapilo?"></textarea></label><label class="checkline"><input type="checkbox" required> Souhlasím se zpracováním osobních údajů.</label><button class="btn dark">Odeslat recenzi <span>↗</span></button><p class="muted" style="font-size:13px">Recenze zveřejňujeme jen u ověřených nákupů.</p></form>`);},true);
document.addEventListener('submit',e=>{const f=e.target;if(f.dataset?.form!=='xreview')return;e.preventDefault();e.stopImmediatePropagation();if(!f.checkValidity()){f.reportValidity();return;}const fd=new FormData(f),all=read('brave-reviews',{}),id=f.dataset.id;
 (all[id]=all[id]||[]).unshift({author:String(fd.get('author')),date:new Date().toLocaleDateString('cs-CZ'),rating:Number(fd.get('rating')),text:String(fd.get('text')||'')||null,tags:fd.getAll('tags')});try{localStorage.setItem('brave-reviews',JSON.stringify(all));}catch{}$('#modal').close();render(false);toast('Děkujeme za recenzi!');setTimeout(()=>$('#recenze')?.scrollIntoView({behavior:'smooth'}),200);},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-action="x-carton"]');if(!b)return;e.stopImmediatePropagation();addToCart(b.dataset.id,6);});
const basePP=productPage;
productPage=function(p){let h=basePP(p);if(!p)return h;const s=SITES.find(x=>x.name===p.site);
 h=h.replace('<p class="free-hint">',`<button class="text-link x-carton" type="button" data-action="x-carton" data-id="${p.id}">+ Vložit karton (6 lahví) <span>↗</span></button><p class="free-hint">`);
 h=h.replace(/<span>([0-9,]+) · (\d+) hodnocení<\/span>/,`<a href="#product/${p.id}" data-scrollto="recenze">$1 · $2 hodnocení</a>`);
 const origin=s?`<section class="x-wrap x-split x-origin"><div class="x-split-img">${img('s-grapes','Vinice pod Pálavou','',false,'50vw')}</div><div><p class="eyebrow">Odkud je</p><h2>Trať ${s.name}</h2><p>${s.text} ${s.soil.replace(' · ',' a ')}, ${s.altitude}, orientace na ${s.orientation}.</p><p>Hrozny sbíráme ručně do přepravek a zpracováváme do dvou hodin od sběru. Archivační potenciál: ${p.archive}.</p><a class="text-link" href="#page/nase-vinice">Podívat se na vinice <span>↗</span></a></div></section>`:'';
 h=h.replace('<a class="pd-discover"',`${origin}${reviewsSection(p)}<a class="pd-discover"`);
 h=h.replace(/sectionHead\('Mohlo by vám chutnat'[^)]*\)/,'');
 h=h.replace(/<section class="section related">[\s\S]*?<\/div>/,m=>m.replace(/Mohlo by vám chutnat/,'Mohlo by chutnat').replace(/Další vína z naší vinotéky/,'Ze stejného sklepa'));
 return h;};

/* ---------- chat a první vykreslení ---------- */
if(typeof wineFaq!=="undefined"&&wineFaq[1])wineFaq[1][1]=`Balíkovna 60 Kč, Zásilkovna 65 Kč, PPL 89 Kč, Balík do ruky 99 Kč, DPD 100 Kč. Osobní odběr ve Valticích a závoz vinařství zdarma. Od ${kc(FREE)} je doprava zdarma.`;
render(false);initBook();
})();
