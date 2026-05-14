// AXIS — Critical Minerals Data
// Source: USGS Mineral Commodity Summaries 2026 (Published Feb 6, 2026)
// Production data reflects 2025 figures
// Processing data reflects 2023-2024 estimates (latest available)
// https://doi.org/10.3133/mcs2026

const minerals={
rareEarth:{name:{en:"Rare Earth Elements",tr:"Nadir Toprak Elementleri"},sector:{en:"Defense, Electronics, EV",tr:"Savunma, Elektronik, EV"},mining:{CN:60,US:14,AU:10,MM:8,IN:1},processing:{CN:90,US:3},source:"USGS MCS 2026 (2025 data)"},
lithium:{name:{en:"Lithium",tr:"Lityum"},sector:{en:"EV Batteries, Energy Storage",tr:"EV Batarya, Enerji Depolama"},mining:{AU:47,CL:26,CN:15,AR:6,BR:3},processing:{CN:65,CL:15,AR:5},source:"USGS MCS 2026 (2025 data)"},
cobalt:{name:{en:"Cobalt",tr:"Kobalt"},sector:{en:"EV Batteries, Superalloys",tr:"EV Batarya, Süper Alaşımlar"},mining:{CD:76,ID:10,RU:4,AU:3},processing:{CN:80,FI:5},source:"USGS MCS 2026 (2025 data)"},
copper:{name:{en:"Copper",tr:"Bakır"},sector:{en:"Construction, Electronics, Grid",tr:"İnşaat, Elektronik, Şebeke"},mining:{CL:24,CD:12,PE:10,CN:8,US:6,ID:5,AU:4,RU:4,MX:3},processing:{CN:44,CL:8,JP:7,CD:5,RU:4,IN:3,KR:3,DE:2},source:"USGS MCS 2026 (2025 data)"},
nickel:{name:{en:"Nickel",tr:"Nikel"},sector:{en:"Stainless Steel, EV Batteries",tr:"Paslanmaz Çelik, EV Batarya"},mining:{ID:55,PH:10,RU:5,CN:4,AU:4,CA:3,BR:3},processing:{CN:35,ID:30,JP:5,RU:4},source:"USGS MCS 2026 (2025 data)"},
aluminum:{name:{en:"Aluminum (Bauxite)",tr:"Alüminyum (Boksit)"},sector:{en:"Aerospace, Transport, Packaging",tr:"Havacılık, Ulaşım, Ambalaj"},mining:{AU:26,CN:21,BR:10,IN:9,ID:7},processing:{CN:59,IN:6,RU:5,CA:4},source:"USGS MCS 2026 (2025 data)"},
tungsten:{name:{en:"Tungsten",tr:"Tungsten"},sector:{en:"Military, Mining Equipment",tr:"Askeri, Maden Ekipmanı"},mining:{CN:82,RU:4},processing:{CN:90},source:"USGS MCS 2026 (2025 data)"},
titanium:{name:{en:"Titanium",tr:"Titanyum"},sector:{en:"Aerospace, Military Armor",tr:"Havacılık, Askeri Zırh"},mining:{CN:34,AU:12,ZA:10,MX:5},processing:{CN:69,JP:7,RU:5},source:"USGS MCS 2026 (2025 data)"},
graphite:{name:{en:"Natural Graphite",tr:"Doğal Grafit"},sector:{en:"EV Batteries (Anodes)",tr:"EV Batarya (Anotlar)"},mining:{CN:65,MX:7,BR:7,KR:3},processing:{CN:95},source:"USGS MCS 2026 (2025 data)"},
antimony:{name:{en:"Antimony",tr:"Antimon"},sector:{en:"Ammunition, Flame Retardants",tr:"Mühimmat, Alev Geciktiriciler"},mining:{CN:48,RU:18,TR:5},processing:{CN:55},source:"USGS MCS 2026 (2025 data)"},
uranium:{name:{en:"Uranium",tr:"Uranyum"},sector:{en:"Nuclear Energy, Defense",tr:"Nükleer Enerji, Savunma"},mining:{KZ:43,CA:7,AU:5,RU:5},processing:{RU:27,CN:16,FR:12},source:"USGS MCS 2026 (2025 data)"},
silicon:{name:{en:"Silicon",tr:"Silikon"},sector:{en:"Semiconductors, Solar Panels",tr:"Yarı İletkenler, Güneş Panelleri"},mining:{CN:69,RU:5,BR:5,US:4},processing:{CN:78},source:"USGS MCS 2026 (2025 data)"}
};

const mineralProfiles={
US:{importDependency:.76,criticalImports:["rareEarth","lithium","cobalt","graphite","tungsten","antimony"],topSupplier:"CN",note:{en:"80% rare earth import dependent. Project Vault stockpile program (2025). Diversifying via Australia, Japan, Canada. Net processed mineral imports doubled to $185B in 2025.",tr:"Nadir toprak ithalatında %80 bağımlı. Project Vault stoklama programı (2025). Avustralya, Japonya, Kanada ile çeşitlendirme. 2025'te net işlenmiş mineral ithalatı 185 milyar $'a ikiye katlandı."}},
CN:{importDependency:.15,criticalImports:["cobalt","nickel","copper"],topSupplier:"AU",note:{en:"Dominant processor of 14+ minerals. Mining-to-processing leverage is primary geoeconomic tool.",tr:"14+ mineralde baskın işlemci. Madencilikten işlemeye kaldıraç temel jeoekonomik araç."}},
JP:{importDependency:.92,criticalImports:["rareEarth","lithium","cobalt","copper","nickel","tungsten"],topSupplier:"CN",note:{en:"Near-total mineral import dependency. Stockpiling strategy since 2010 China rare earth embargo.",tr:"Neredeyse tam mineral ithalat bağımlılığı. 2010 Çin nadir toprak ambargosundan beri stoklama stratejisi."}},
DE:{importDependency:.85,criticalImports:["rareEarth","lithium","cobalt","copper","silicon"],topSupplier:"CN",note:{en:"Heavy reliance on China for processed minerals. EU Critical Raw Materials Act response.",tr:"İşlenmiş minerallerde Çin'e ağır bağımlılık. AB Kritik Hammaddeler Yasası ile yanıt."}},
GB:{importDependency:.82,criticalImports:["rareEarth","lithium","cobalt","tungsten"],topSupplier:"CN",note:{en:"Post-Brexit supply chain restructuring. Critical Minerals Strategy 2023.",tr:"Brexit sonrası tedarik zinciri yeniden yapılanması. 2023 Kritik Mineraller Stratejisi."}},
FR:{importDependency:.78,criticalImports:["rareEarth","lithium","cobalt","titanium"],topSupplier:"CN",note:{en:"Significant uranium processing (12% global). EU-aligned diversification.",tr:"Önemli uranyum işleme kapasitesi (küresel %12). AB uyumlu çeşitlendirme."}},
IN:{importDependency:.55,criticalImports:["lithium","cobalt","nickel","rareEarth"],topSupplier:"CN",note:{en:"Domestic bauxite mining, growing refining. Lithium discovery in J&K.",tr:"Yerli boksit madenciliği, büyüyen rafineri. J&K'da lityum keşfi."}},
IT:{importDependency:.88,criticalImports:["rareEarth","lithium","cobalt","copper","silicon"],topSupplier:"CN",note:{en:"Heavy import dependency. EU Critical Raw Materials Act beneficiary.",tr:"Ağır ithalat bağımlılığı. AB Kritik Hammaddeler Yasası'ndan yararlanıyor."}},
BR:{importDependency:.20,criticalImports:["rareEarth","tungsten"],topSupplier:"CN",note:{en:"Major producer: bauxite, niobium (90% global), graphite, lithium. Resource-rich.",tr:"Büyük üretici: boksit, niyobyum (küresel %90), grafit, lityum. Kaynak zengini."}},
CA:{importDependency:.35,criticalImports:["rareEarth","graphite","silicon"],topSupplier:"CN",note:{en:"Strong mining sector: nickel, uranium, aluminum. US allied supply chain partner.",tr:"Güçlü madencilik: nikel, uranyum, alüminyum. ABD müttefik tedarik ortağı."}},
KR:{importDependency:.90,criticalImports:["rareEarth","lithium","cobalt","nickel","graphite"],topSupplier:"CN",note:{en:"Battery supply chain heavily China-dependent.",tr:"Batarya tedarik zinciri Çin'e bağımlı."}},
RU:{importDependency:.12,criticalImports:["rareEarth"],topSupplier:"CN",note:{en:"Major producer: nickel, titanium, uranium, tungsten, antimony. Sanctions disrupt trade.",tr:"Büyük üretici: nikel, titanyum, uranyum, tungsten, antimon. Yaptırımlar ticareti aksatıyor."}},
AU:{importDependency:.40,criticalImports:["rareEarth","graphite","silicon"],topSupplier:"CN",note:{en:"Top global ore exporter (33%). Lithium, bauxite, titanium mining powerhouse.",tr:"En büyük küresel cevher ihracatçısı (%33). Lityum, boksit, titanyum madencilik devi."}},
MX:{importDependency:.50,criticalImports:["rareEarth","lithium","cobalt"],topSupplier:"CN",note:{en:"Graphite and copper mining. Lithium nationalization debate.",tr:"Grafit ve bakır madenciliği. Lityum kamulaştırma tartışması."}},
ID:{importDependency:.30,criticalImports:["rareEarth","lithium","silicon"],topSupplier:"CN",note:{en:"Dominant nickel producer (55% global mining). Downstream processing push.",tr:"Baskın nikel üreticisi (küresel madenciliğin %55'i). Aşağı akış işleme atılımı."}},
SA:{importDependency:.70,criticalImports:["rareEarth","lithium","cobalt","copper","silicon"],topSupplier:"CN",note:{en:"Oil-rich but mineral-poor. Vision 2030 mining diversification.",tr:"Petrol zengini ama mineral fakir. Vizyon 2030 madencilik çeşitlendirmesi."}},
TR:{importDependency:.55,criticalImports:["rareEarth","lithium","cobalt","nickel"],topSupplier:"CN",note:{en:"Boron global leader (73%). Antimony, chromite production. Strategic mineral leverage.",tr:"Bor dünya lideri (%73). Antimon, kromit üretimi. Stratejik mineral kaldıracı."}},
AR:{importDependency:.45,criticalImports:["rareEarth","copper","silicon"],topSupplier:"CN",note:{en:"Lithium Triangle member (6% global mining). Growing extraction.",tr:"Lityum Üçgeni üyesi (küresel madenciliğin %6'sı). Büyüyen çıkarma."}},
ZA:{importDependency:.25,criticalImports:["rareEarth","lithium","silicon"],topSupplier:"CN",note:{en:"Platinum group metals leader. Titanium, chromite production. Mining economy.",tr:"Platin grubu metaller lideri. Titanyum, kromit üretimi. Madencilik ekonomisi."}}
};

// Get minerals a country produces (>=5% share in mining or processing)
function countryProduces(code){
  const result=[];
  for(const[mk,m]of Object.entries(minerals)){
    if(m.mining[code]>=5)result.push({key:mk,type:"mining",share:m.mining[code]});
    if(m.processing[code]>=5)result.push({key:mk,type:"processing",share:m.processing[code]});
  }
  return result;
}

// Bilateral mineral overlap analysis
function mineralOverlap(cA,cB){
  const pA=mineralProfiles[cA],pB=mineralProfiles[cB];
  if(!pA||!pB)return{complementarity:0,competition:0,supplyChainRisk:50,aSuppliesB:[],bSuppliesA:[],sharedDependency:[],chinaExposure:50};

  const prodsA=countryProduces(cA).map(p=>p.key);
  const prodsB=countryProduces(cB).map(p=>p.key);

  // A supplies B: minerals B needs that A produces
  const aSuppliesB=pB.criticalImports.filter(m=>prodsA.includes(m));
  // B supplies A: minerals A needs that B produces
  const bSuppliesA=pA.criticalImports.filter(m=>prodsB.includes(m));
  // Shared dependency: both import the same minerals
  const sharedDependency=pA.criticalImports.filter(m=>pB.criticalImports.includes(m));

  // Complementarity: how well they can serve each other (0-100)
  const totalNeeds=new Set([...pA.criticalImports,...pB.criticalImports]).size;
  const totalSupply=aSuppliesB.length+bSuppliesA.length;
  const complementarity=totalNeeds>0?Math.min(100,Math.round(totalSupply/totalNeeds*100)):0;

  // Competition: shared dependencies as fraction of union of imports
  const competition=totalNeeds>0?Math.round(sharedDependency.length/totalNeeds*100):0;

  // Supply chain risk: weighted average of import dependencies
  const supplyChainRisk=Math.round((pA.importDependency+pB.importDependency)/2*100);

  // China exposure: average of how much each relies on CN
  const cnShareA=pA.topSupplier==="CN"?pA.importDependency*100:pA.importDependency*30;
  const cnShareB=pB.topSupplier==="CN"?pB.importDependency*100:pB.importDependency*30;
  const chinaExposure=Math.round((cnShareA+cnShareB)/2);

  return{complementarity,competition,supplyChainRisk,aSuppliesB,bSuppliesA,sharedDependency,chinaExposure};
}

// Country mineral security score (0-100)
function countryMineralScore(code){
  const prof=mineralProfiles[code];
  if(!prof)return 50;

  const depScore=(1-prof.importDependency)*60;

  // Production diversity: count minerals with >=5% share
  const prods=countryProduces(code);
  const uniqueMinerals=new Set(prods.map(p=>p.key)).size;
  const divScore=Math.min(25,Math.round(uniqueMinerals/12*25));

  // Processing share: sum of all processing shares
  let procTotal=0;
  for(const[mk,m]of Object.entries(minerals)){
    if(m.processing[code])procTotal+=m.processing[code];
  }
  const procScore=Math.min(15,Math.round(procTotal/100*15));

  return Math.max(0,Math.min(100,Math.round(depScore+divScore+procScore)));
}

// Herfindahl-Hirschman Index for a mineral's mining concentration
function supplyChainHHI(mineralKey){
  const m=minerals[mineralKey];
  if(!m)return 0;
  const shares=Object.values(m.mining);
  return Math.round(shares.reduce((s,v)=>s+(v/100)*(v/100),0)*10000);
}

// Get mineral name in current language
function mineralName(key){
  const m=minerals[key];
  if(!m)return key;
  return(lang==="tr"?m.name.tr:m.name.en)||key;
}

// Generate mineral profile HTML for country profiles
function mineralProfileHTML(code){
  const prof=mineralProfiles[code];
  if(!prof)return"";
  const score=countryMineralScore(code);
  const prods=countryProduces(code);
  const depPct=Math.round(prof.importDependency*100);
  const depColor=depPct>70?"var(--neg)":depPct>40?"var(--warn)":"var(--pos)";

  let h='<div class="mineral-section"><div class="mineral-title">'+T("mineralTitle")+'</div>';

  // Security score
  h+='<div class="mineral-stat"><span class="mineral-stat-k">'+T("mineralSecurity")+'</span><span class="mineral-stat-v" style="font-size:1.1rem;font-weight:700;color:'+(score>60?"var(--pos)":score>35?"var(--warn)":"var(--neg)")+'">'+score+'/100</span></div>';

  // Import dependency bar
  h+='<div class="mineral-stat"><span class="mineral-stat-k">'+T("mineralImportDep")+'</span><span class="mineral-stat-v" style="color:'+depColor+'">'+depPct+'%</span></div>';
  h+='<div class="mineral-dep-bar"><div class="mineral-dep-fill" style="width:'+depPct+'%;background:'+depColor+'"></div></div>';

  // Produces
  if(prods.length>0){
    h+='<div style="margin-bottom:8px"><div class="mineral-stat-k" style="font-family:var(--font-mono);font-size:.58rem;margin-bottom:4px">'+T("mineralProduces")+'</div><div style="display:flex;flex-wrap:wrap">';
    prods.forEach(p=>{
      const cls=p.type==="mining"?"mining":"processing";
      h+='<span class="mineral-badge '+cls+'">'+mineralName(p.key)+' '+p.share+'% ('+T("mineral"+p.type.charAt(0).toUpperCase()+p.type.slice(1))+')</span>';
    });
    h+='</div></div>';
  }

  // Critical imports
  if(prof.criticalImports.length>0){
    h+='<div style="margin-bottom:8px"><div class="mineral-stat-k" style="font-family:var(--font-mono);font-size:.58rem;margin-bottom:4px">'+T("mineralCriticalImports")+'</div><div style="display:flex;flex-wrap:wrap">';
    prof.criticalImports.forEach(m=>{
      const hhi=supplyChainHHI(m);
      h+='<span class="mineral-badge import">'+mineralName(m)+(hhi>5000?' ⚠':'')+'</span>';
    });
    h+='</div></div>';
  }

  // Top supplier
  const sup=prof.topSupplier;
  const supName=C[sup]?C[sup].f+' '+(lang==='tr'?(cTR[sup]||C[sup].n):C[sup].n):sup;
  h+='<div class="mineral-stat"><span class="mineral-stat-k">'+T("mineralTopSupplier")+'</span><span class="mineral-stat-v">'+supName+'</span></div>';

  // Note
  const note=lang==="tr"?prof.note.tr:prof.note.en;
  h+='<div class="detail-note" style="margin-top:8px">'+note+'</div>';

  // HHI warnings
  const highHHI=prof.criticalImports.filter(m=>supplyChainHHI(m)>5000);
  if(highHHI.length>0){
    h+='<div class="china-exposure-warn">'+T("mineralHHIWarn")+': '+highHHI.map(m=>mineralName(m)).join(', ')+'</div>';
  }

  h+='</div>';
  return h;
}

// Generate bilateral mineral detail HTML for economic card expansion
function mineralBilateralHTML(cA,cB){
  const ov=mineralOverlap(cA,cB);
  const nA=cN(cA),nB=cN(cB);

  let h='<div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--border)">';
  h+='<div style="font-family:var(--font-mono);font-size:.58rem;text-transform:uppercase;letter-spacing:.12em;color:var(--econ);margin-bottom:8px">'+T("mineralTitle")+'</div>';

  // Complementarity & risk bars
  h+='<div class="detail-compare"><span class="detail-compare-label">'+T("mineralSupplyCompat")+'</span><span class="detail-compare-val" style="color:'+(ov.complementarity>40?"var(--pos)":"var(--t3)")+'">'+ov.complementarity+'%</span></div>';
  h+='<div class="detail-compare"><span class="detail-compare-label">'+T("mineralChinaExposure")+'</span><span class="detail-compare-val" style="color:'+(ov.chinaExposure>60?"var(--neg)":"var(--warn)")+'">'+ov.chinaExposure+'%</span></div>';

  // A supplies B
  if(ov.aSuppliesB.length>0){
    h+='<div style="margin:6px 0"><span style="font-family:var(--font-mono);font-size:.55rem;color:var(--t3)">'+nA+' '+T("mineralAtoB")+' '+nB+':</span><div style="display:flex;flex-wrap:wrap;margin-top:2px">';
    ov.aSuppliesB.forEach(m=>{h+='<span class="mineral-badge mining">'+mineralName(m)+'</span>'});
    h+='</div></div>';
  }
  // B supplies A
  if(ov.bSuppliesA.length>0){
    h+='<div style="margin:6px 0"><span style="font-family:var(--font-mono);font-size:.55rem;color:var(--t3)">'+nB+' '+T("mineralBtoA")+' '+nA+':</span><div style="display:flex;flex-wrap:wrap;margin-top:2px">';
    ov.bSuppliesA.forEach(m=>{h+='<span class="mineral-badge processing">'+mineralName(m)+'</span>'});
    h+='</div></div>';
  }
  // Shared dependencies
  if(ov.sharedDependency.length>0){
    h+='<div style="margin:6px 0"><span style="font-family:var(--font-mono);font-size:.55rem;color:var(--t3)">'+T("mineralCompetition")+':</span><div style="display:flex;flex-wrap:wrap;margin-top:2px">';
    ov.sharedDependency.forEach(m=>{h+='<span class="mineral-badge shared">'+mineralName(m)+'</span>'});
    h+='</div></div>';
  }

  h+='</div>';
  return h;
}
