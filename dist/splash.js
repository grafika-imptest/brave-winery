/* =====================================================================
   Brave Winery – přechod mezi stránkami „Nalévám…“
   Papírová opona se sklenkou, která se naplní vínem (barva podle cíle),
   pak opona odjede nahoru. Krátké (~1 s), bez animace při reduced motion.
   ===================================================================== */
(()=>{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const LINES=['Nalévám…','Odzátkovávám…','Necháváme dýchat…','Kroužím, čichám, ochutnávám…','Jen malý doušek…','Ze sklepa to chvilku trvá…','Na zdraví!'];
const TONES={red:'#6e1f2c',white:'#d9b85a',rose:'#d98a8f',sparkling:'#e3cf86',all:'#6e1f2c'};
const el=document.createElement('div');el.className='splash';el.setAttribute('aria-hidden','true');
el.innerHTML=`<div class="splash-in">
<svg class="splash-glass" viewBox="0 0 120 200" width="84" height="140">
 <defs><clipPath id="splash-bowl"><path d="M31 18 C29 70 38 104 60 107 C82 104 91 70 89 18 Z"/></clipPath></defs>
 <g clip-path="url(#splash-bowl)"><g class="splash-wine"><path d="M-60 62 Q-45 56 -30 62 T0 62 T30 62 T60 62 T90 62 T120 62 T150 62 T180 62 V140 H-60 Z"/></g></g>
 <path class="splash-line" d="M31 18 C29 70 38 104 60 107 C82 104 91 70 89 18 Z M60 107 V168 M38 174 Q60 166 82 174"/>
</svg>
<p class="splash-txt"></p><p class="splash-brand">BRAVE WINERY</p></div>`;
document.body.appendChild(el);
let n=0,t1=0,t2=0;
const toneFor=h=>{const [r,id]=h.replace(/^#/,'').split('/');
 if(r==='catalog')return TONES[id]||TONES.all;
 if(r==='product'&&window.getProduct){const p=getProduct(id);return p?TONES[p.category]:TONES.all;}
 return TONES.all;};
function play(first){clearTimeout(t1);clearTimeout(t2);
 el.style.setProperty('--wine',toneFor(location.hash));
 el.querySelector('.splash-txt').textContent=first?'Vítejte ve sklepě…':LINES[n++%LINES.length];
 el.classList.remove('out','fill');el.classList.add('on');void el.offsetWidth;el.classList.add('fill');
 t1=setTimeout(()=>el.classList.add('out'),first?1100:780);
 t2=setTimeout(()=>el.classList.remove('on','out','fill'),first?1750:1400);}
let last=location.hash.split('/')[0]+'/'+(location.hash.split('/')[1]||'');
addEventListener('hashchange',()=>{const now=location.hash.split('/')[0]+'/'+(location.hash.split('/')[1]||'');if(now===last)return;last=now;play(false);});
play(true);
})();
