// Vymyšlené soutěžní nálepky (podobný styl jako skutečné, ale fiktivní soutěže) → dist/assets/m/medal-<key>.webp
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Omen/Documents/claude/braveshop-redesign/package.json');
const {chromium}=require('playwright-core');const sharp=require('sharp');
const OUT='C:/Users/Omen/Documents/claude/brave-winery/dist/assets/m/';

const P=(r,top)=>top?`M ${200-r} 200 A ${r} ${r} 0 0 1 ${200+r} 200`:`M ${200-r} 200 A ${r} ${r} 0 0 0 ${200+r} 200`;
const arc=(id,r,top)=>`<path id="${id}" d="${P(r,top)}" fill="none"/>`;
const tp=(id,txt,st)=>`<text style="${st}"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${txt}</textPath></text>`;
const grape=(cx,cy,s,fill)=>{const pts=[[0,0],[1,0],[2,0],[3,0],[.5,.87],[1.5,.87],[2.5,.87],[1,1.74],[2,1.74],[1.5,2.6]];return pts.map(([x,y])=>`<circle cx="${cx+(x-1.5)*s}" cy="${cy+y*s}" r="${s*.5}" fill="${fill}"/>`).join('')+`<path d="M ${cx} ${cy-s*.5} q ${s*.2} ${-s*1.1} ${s*1.3} ${-s*1.4}" stroke="${fill}" stroke-width="${s*.18}" fill="none" stroke-linecap="round"/><path d="M ${cx+s*.4} ${cy-s*1.05} q ${s*1.4} ${-s*.9} ${s*2.2} ${s*.1} q ${-s*1.1} ${s*.6} ${-s*2.2} ${-s*.1}z" fill="${fill}"/>`;};

function salon(k){const g=k==='gold'?['#FFF1B0','#FBD34D','#E9A400','#C98A00','#FFE07A']:['#F6C9A0','#D9925A','#A85F2E','#7E4420','#E8AE7C'];
 const label=k==='gold'?'ZLATÁ MEDAILE':'BRONZOVÁ MEDAILE';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
 <radialGradient id="a" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="${g[0]}"/><stop offset=".45" stop-color="${g[1]}"/><stop offset="1" stop-color="${g[2]}"/></radialGradient>
 <radialGradient id="b" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="${g[4]}"/><stop offset=".6" stop-color="${g[1]}"/><stop offset="1" stop-color="${g[2]}"/></radialGradient>
 <linearGradient id="c" x1="0" x2="1"><stop offset="0" stop-color="${g[2]}"/><stop offset=".5" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[2]}"/></linearGradient>
 <pattern id="dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".9" fill="${g[3]}" opacity=".35"/></pattern>
 ${arc('t',150,1)}${arc('u',176,0)}</defs>
 <circle cx="200" cy="200" r="196" fill="url(#a)"/><circle cx="200" cy="200" r="196" fill="url(#dots)" opacity=".6"/>
 <circle cx="200" cy="200" r="118" fill="url(#b)"/>
 <path d="M 6 214 A 196 196 0 0 0 394 214 L 400 200 L 376 200 A 176 176 0 0 1 24 200 L 0 200 Z" fill="none"/>
 <path d="M 0 196 L 34 186 A 168 168 0 0 0 366 186 L 400 196 L 388 214 A 192 192 0 0 1 12 214 Z" fill="url(#c)" opacity=".001"/>
 <path d="${`M 18 205 A 184 184 0 0 0 382 205`}" stroke="url(#c)" stroke-width="44" fill="none"/>
 <path d="M 4 186 L 26 196 L 10 222 Z M 396 186 L 374 196 L 390 222 Z" fill="${g[3]}" opacity=".55"/>
 ${tp('t',label,"font:700 34px 'Cormorant Garamond';letter-spacing:3px;fill:#1b1306")}
 ${tp('u','MORAVSKÝCH VÍN',"font:700 30px 'Cormorant Garamond';letter-spacing:3px;fill:#1b1306")}
 <g transform="translate(200 120)"><path d="M -22 -34 h 44 c 4 34 -6 52 -22 56 c -16 -4 -26 -22 -22 -56 z" fill="none" stroke="#1b1306" stroke-width="4"/>
 <path d="M -19 -6 c 10 6 28 6 38 0 c -3 18 -10 26 -19 28 c -9 -2 -16 -10 -19 -28z" fill="#6E1630"/><path d="M 0 22 v 24 M -16 48 h 32" stroke="#1b1306" stroke-width="4" stroke-linecap="round"/></g>
 <text x="200" y="232" text-anchor="middle" style="font:700 70px 'Cormorant Garamond';fill:#1b1306;letter-spacing:1px">SALON</text>
 <text x="200" y="272" text-anchor="middle" style="font:700 30px 'Cormorant Garamond';fill:#1b1306">2025</text></svg>`;}

function dwc(){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
 <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E7D39A"/><stop offset=".35" stop-color="#C9AE6A"/><stop offset=".7" stop-color="#9C7F3E"/><stop offset="1" stop-color="#7B6230"/></linearGradient>
 <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
 ${arc('t',168,1)}${arc('u',184,0)}</defs>
 <circle cx="200" cy="200" r="198" fill="#1d1810"/>
 <circle cx="200" cy="200" r="150" fill="url(#g)"/>
 <path d="M 62 170 A 140 140 0 0 1 338 170 Q 200 120 62 170Z" fill="url(#gl)"/>
 <circle cx="200" cy="200" r="150" fill="none" stroke="#e6d3a0" stroke-opacity=".5" stroke-width="1.5"/>
 ${tp('t','INTERNATIONAL WINE CHALLENGE',"font:400 21px 'Jost';letter-spacing:3.2px;fill:#CDB677")}
 ${tp('u','danube-wine-challenge',"font:500 19px 'Jost';letter-spacing:2px;fill:#CDB677")}
 <text x="200" y="146" text-anchor="middle" style="font:300 58px 'Jost';fill:#2a2213;letter-spacing:2px">DWC</text>
 <text x="200" y="178" text-anchor="middle" style="font:400 24px 'Jost';fill:#2a2213;letter-spacing:7px">VIENNA</text>
 <path d="M 118 194 H 282 M 118 256 H 282" stroke="#2a2213" stroke-width="2"/>
 <text x="200" y="244" text-anchor="middle" style="font:600 50px 'Jost';fill:#2a2213;letter-spacing:3px">GOLD</text>
 <text x="200" y="298" text-anchor="middle" style="font:400 34px 'Jost';fill:#2a2213">2025</text></svg>`;}

function bwt(){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>${arc('t',166,1)}${arc('u',186,0)}</defs>
 <circle cx="200" cy="200" r="198" fill="#111"/><circle cx="200" cy="200" r="146" fill="#BF9C68"/>
 ${tp('t','BOHEMIA WINE TROPHY 2025',"font:700 30px 'Barlow Semi Condensed';letter-spacing:3.6px;fill:#BF9C68")}
 ${tp('u','INTERNATIONAL WINE CONTEST',"font:700 29px 'Barlow Semi Condensed';letter-spacing:5px;fill:#BF9C68")}
 <circle cx="24" cy="200" r="5" fill="#BF9C68"/><circle cx="376" cy="200" r="5" fill="#BF9C68"/>
 <path d="M200 84 L214 128 L260 128 L223 155 L237 199 L200 172 L163 199 L177 155 L140 128 L186 128Z" fill="#111"/>
 <text x="200" y="262" text-anchor="middle" style="font:700 56px 'Barlow Semi Condensed';fill:#111;letter-spacing:1px">BOHEMIA</text>
 <text x="200" y="318" text-anchor="middle" style="font:700 66px 'Barlow Semi Condensed';fill:#111">GOLD</text></svg>`;}

function vitis(){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><defs>
 <radialGradient id="s" cx="35%" cy="28%" r="85%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".4" stop-color="#E1E3E6"/><stop offset=".8" stop-color="#A9ADB3"/><stop offset="1" stop-color="#8C9096"/></radialGradient>
 <linearGradient id="r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C8CBD0"/><stop offset=".5" stop-color="#F4F5F6"/><stop offset="1" stop-color="#8E9298"/></linearGradient>
 ${arc('t',167,1)}${arc('u',184,0)}</defs>
 <circle cx="200" cy="200" r="198" fill="url(#r)"/><circle cx="200" cy="200" r="198" fill="none" stroke="#7d8187" stroke-width="2"/>
 <circle cx="200" cy="200" r="145" fill="url(#s)" stroke="#8A1538" stroke-width="5"/>
 ${tp('t','MEZINÁRODNÍ SOUTĚŽ VÍN',"font:700 21px 'Open Sans';letter-spacing:3px;fill:#3a3d42")}
 ${tp('u','INTERNATIONAL WINE COMPETITION',"font:600 18px 'Open Sans';letter-spacing:2.6px;fill:#3a3d42")}
 ${grape(136,116,17,'#8A1538')}
 <text x="246" y="128" text-anchor="middle" style="font:800 30px 'Open Sans';fill:#222;letter-spacing:.5px">GRAND</text>
 <text x="246" y="160" text-anchor="middle" style="font:800 30px 'Open Sans';fill:#222;letter-spacing:.5px">PRIX</text>
 <text x="200" y="236" text-anchor="middle" style="font:italic 800 74px 'Open Sans';fill:#8A1538;letter-spacing:-1px">Vitis</text>
 <text x="200" y="276" text-anchor="middle" style="font:700 18px 'Open Sans';fill:#222;letter-spacing:2px">STŘÍBRNÁ MEDAILE</text>
 <text x="200" y="314" text-anchor="middle" style="font:800 32px 'Open Sans';fill:#8A1538">2024</text></svg>`;}

const raw={'salon-gold':salon('gold'),'salon-bronze':salon('bronze'),'dwc-gold':dwc(),'bwt-gold':bwt(),'vitis-silver':vitis()};
const set=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k,v.replace(/id="(\w+)"/g,'id="'+k+'-$1"').replace(/url\(#(\w+)\)/g,'url(#'+k+'-$1)').replace(/href="#(\w+)"/g,'href="#'+k+'-$1"')]));
const b=await chromium.launch({channel:'msedge'});const p=await b.newPage({viewport:{width:500,height:500},deviceScaleFactor:1.2});
await p.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@300;400;500;600&family=Barlow+Semi+Condensed:wght@700&family=Open+Sans:ital,wght@0,600;0,700;0,800;1,800&display=block" rel="stylesheet"><style>body{margin:0;background:transparent}div{width:400px;height:400px}</style></head><body>${Object.entries(set).map(([k,s])=>`<div id="${k}">${s}</div>`).join('')}</body></html>`,{waitUntil:'networkidle'});
await p.evaluate(()=>document.fonts.ready);
for(const k of Object.keys(set)){const buf=await p.locator('#'+k).screenshot({omitBackground:true});
 await sharp(buf).resize(240,240).webp({quality:92,alphaQuality:100}).toFile(OUT+`medal-${k}.webp`);
 await sharp(buf).png().toFile(`C:/Users/Omen/Documents/claude/brave-winery/raw/medal-${k}.png`);console.log(k);}
await b.close();
