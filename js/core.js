// AXIS — Core state, utilities, computation engine
// Depends on: data/countries.js (C), data/bilateral.js (B, bK), data/translations.js (tx, cTR, rTR, tTR, behLabels, weightLabels→defined here)

let lang="en";

function T(k){return tx[lang][k]||tx.en[k]||k}
function cN(c){return lang==="tr"?(cTR[c]||C[c].n):C[c].n}
function cR(r){return lang==="tr"?(rTR[r]||r):r}
function tT(t){return lang==="tr"?(tTR[t]||(t||"?").toUpperCase()):(t||"N/A").toUpperCase()}

let mode="bilateral",selA=null,selB=null,coalMembers=[],markers={},workingData=null,workingB=null;

// Sensitivity analysis state — 7 layers (media = GDELT real-time)
const defaultWeights={military:.16,economic:.20,lobby:.10,cultural:.10,strategic:.20,behavioral:.12,media:.12};
let customWeights={...defaultWeights};
const weightLabels={military:"pM",economic:"pE",lobby:"pL",cultural:"pC",strategic:"pS",behavioral:"pB",media:"pG"};

let activeTheory="baseline";
const THEORY_WEIGHTS={
  baseline:defaultWeights,
  realism:{military:.35,economic:.30,lobby:.05,cultural:.05,strategic:.15,behavioral:.05,media:.05},
  liberalism:{military:.10,economic:.20,lobby:.25,cultural:.10,strategic:.20,behavioral:.05,media:.10},
  constructivism:{military:.05,economic:.10,lobby:.10,cultural:.20,strategic:.15,behavioral:.20,media:.20}
};
function setActiveTheory(t){activeTheory=t;if(typeof updateUI==="function"){updateUI()};if(typeof updateChoropleth==="function"){updateMarkers()}}
function getActiveWeights(){return THEORY_WEIGHTS[activeTheory]||THEORY_WEIGHTS.baseline}

function getTheoryWarning(theory) {
    const t = theory || activeTheory;
    if (t === "realism") return (lang==="tr") ? "ONTOLOJİK SINIRLILIK: Bu skor Realist varsayımlarla (Sert Güç & Ekonomi manipülasyonu) hesaplanmıştır. Kültürel bağları, kurumları ve diplomatik söylemi dışlar." : "ONTOLOGICAL LIMITATION: Calculated under Realist assumptions (Hard Power & Economics). Excludes cultural ties, institutions, and discourse.";
    if (t === "liberalism") return (lang==="tr") ? "ONTOLOJİK SINIRLILIK: Kurumsal/Liberal lens ile hesaplanmıştır. Asimetrik askeri şokları (Realizm) azımsayabilir, devlet-dışı aktörler ve anlaşmalara güvenir." : "ONTOLOGICAL LIMITATION: Institutional/Liberal lens. May underestimate asymmetric military shocks (Realism), relies on non-state actors and treaties.";
    if (t === "constructivism") return (lang==="tr") ? "ONTOLOJİK SINIRLILIK: Konstrüktivist hesaplama. Kültürel kimlik, otonom davranış uyumu ve medya inşasına ağırlık verir; rasyonel maddi çıkarları eksik ölçer." : "ONTOLOGICAL LIMITATION: Constructivist calculation. Heavily weights cultural identity, behavioral alignment, and media framing; under-measures rational material interests.";
    return (lang==="tr") ? "EKLEKTİK MODEL: Bu tahmin (estimation), çoklu IR teorilerinin (Military, Culture, Media) birleştirilmiş sentezidir. Ontolojik olarak kesin bir doğruluk (ground truth) barındırmaz." : "ECLECTIC MODEL: This estimation is a hybrid synthesis of multiple IR theories. Lacks absolute ontological ground truth.";
}

function getD(){return workingData||C}
function getB(){return workingB||B}
function deepCopy(){const d={};for(const[k,v]of Object.entries(C))d[k]={...v,hof:{...v.hof},beh:{...v.beh},al:[...v.al]};return d}
function deepCopyB(){const copy={};for(const[k,v]of Object.entries(B))copy[k]={...v,so:v.so?[...v.so]:[]};return copy}

function norm(v,mn,mx){return Math.max(0,Math.min(100,((v-mn)/(mx-mn))*100))}
function hofDist(a,b){const d=["pdi","idv","mas","uai","lto"];let s=0;d.forEach(k=>{s+=Math.pow((a[k]||50)-(b[k]||50),2)});return Math.sqrt(s/d.length)}

// Behavioral compatibility score (0-100)
function behCompat(a,b){
  const ba=a.beh,bb=b.beh;
  const crisisScore=100-Math.abs(ba.crisis-bb.crisis)*10;
  const riskScore=100-Math.abs(ba.risk-bb.risk)*10;
  const statusScore=100-Math.abs(ba.status-bb.status)*10;
  const dipScore=100-Math.abs(ba.dipStyle-bb.dipStyle)*10;
  const predScore=(ba.predict+bb.predict)*5;
  const decisScore=100-Math.abs(ba.decis-bb.decis)*8;
  const alScore=100-Math.abs(ba.alliance-bb.alliance)*8;
  return Math.round(Math.max(0,Math.min(100,(crisisScore*0.2+riskScore*0.15+statusScore*0.2+dipScore*0.15+predScore*0.1+decisScore*0.1+alScore*0.1))));
}

function computeAxis(cA,cB){
  const D=getD(),a=D[cA],b=D[cB];
  const bil=getB()[bK(cA,cB)]||{trade:1,unA:.3,so:["G20"],ten:"unknown",nt:"Limited data."};
  const milR=Math.min(a.mil,b.mil)/Math.max(a.mil,b.mil);
  const avgGdp=norm((a.gdp+b.gdp)/2,400,27360);
  const nuc=(a.nuc&&b.nuc)?15:(a.nuc||b.nuc)?5:0;
  const unsc=(a.usc&&b.usc)?10:0;
  let milScore=milR*40+avgGdp*.25+nuc+unsc;
  
  // Adaptive NSA Military logic
  if(a.isNSA || b.isNSA) {
    if(a.type==="corp" || b.type==="corp") milScore = 10; // Fixed minimal "Private Security" floor
    if(a.type==="igo" || b.type==="igo") milScore = 20; // "Peacekeeping/Sanction" potential
  }

  const trI=norm(bil.trade,0,800),trO=norm((a.to+b.to)/2,20,95);
  const econScore=trI*.65+trO*.35;
  const civA=((a.cs+b.cs)/2)*100;
  const cpiA=norm((a.cpi+b.cpi)/2,20,90),demA=norm((a.dem+b.dem)/2,1,10);
  const lobbyScore=civA*.4+cpiA*.3+demA*.3;
  const hD=hofDist(a.hof,b.hof),culP=norm(60-hD,0,60);
  const sR=(a.r===b.r)?20:0;
  const culturalScore=culP*.7+sR+(culP>50?10:0);
  const unAl=(bil.unA||.3)*100;
  const shA=a.al.filter(x=>b.al.includes(x)).length;
  const alSc=norm(shA,0,5);
  const tPen=bil.ten==="critical"?-25:bil.ten==="high"?-15:bil.ten==="medium"?-5:0;
  const strategicScore=Math.max(0,unAl*.4+alSc*.4+(shA>0?15:0)+tPen);
  const behScore=behCompat(a,b);
  let aw=getActiveWeights();
  
  // ═══ NSA ADAPTIVE WEIGHTING ═══
  if(a.isNSA || b.isNSA) {
    aw = Object.assign({}, aw); // Clone
    if(a.type==="corp" || b.type==="corp") {
      let m = aw.military; aw.military = 0; aw.economic += m * 0.7; aw.lobby += m * 0.3;
    } else if(a.type==="igo" || b.type==="igo") {
      let m = aw.military; aw.military = 0; aw.cultural += m * 0.5; aw.lobby += m * 0.5;
    } else if(a.type==="paramilitary" || b.type==="paramilitary") {
      let e = aw.economic; aw.economic *= 0.3; aw.military += e * 0.7;
    }
  }

  const wNorm=aw.military+aw.economic+aw.lobby+aw.cultural+aw.strategic+aw.behavioral;
  const composite=milScore*(aw.military/wNorm)+econScore*(aw.economic/wNorm)+lobbyScore*(aw.lobby/wNorm)+culturalScore*(aw.cultural/wNorm)+strategicScore*(aw.strategic/wNorm)+behScore*(aw.behavioral/wNorm);
  return{composite:Math.round(composite*10)/10,
    military:{score:Math.round(milScore*10)/10,milR:milR,bn:a.nuc&&b.nuc,bu:a.usc&&b.usc},
    economic:{score:Math.round(econScore*10)/10,tv:bil.trade},
    lobby:{score:Math.round(lobbyScore*10)/10,civA:civA,cpiA:(a.cpi+b.cpi)/2,demA:(a.dem+b.dem)/2},
    cultural:{score:Math.round(culturalScore*10)/10,hd:Math.round(hD*10)/10,sr:a.r===b.r},
    strategic:{score:Math.round(strategicScore*10)/10,unA:bil.unA,shA:shA,ten:bil.ten,so:bil.so||[]},
    behavioral:{score:behScore},
    bil:bil};
}

// Async wrapper: 6-layer sync + GDELT 7th layer
async function computeAxisWithGDELT(cA,cB){
  const r=computeAxis(cA,cB);
  let gd;
  try{gd=await fetchGDELT(cA,cB)}catch(e){gd=gdeltEmpty()}
  const mediaScore=gd.fetched?gdeltToAxisScore(gd):50;
  // Recompute composite with 7 layers
  const aw=getActiveWeights();
  const comp7=r.military.score*aw.military+r.economic.score*aw.economic+r.lobby.score*aw.lobby+r.cultural.score*aw.cultural+r.strategic.score*aw.strategic+r.behavioral.score*aw.behavioral+mediaScore*aw.media;
  return{...r,
    composite:gd.fetched?Math.round(comp7*10)/10:r.composite,
    media:{score:mediaScore,fetched:gd.fetched,avgTone:gd.avgTone,recentTone:gd.recentTone,trendDirection:gd.trendDirection,totalArticles:gd.totalArticles,recentArticles:gd.recentArticles||[],toneTimeline:gd.toneTimeline||[]},
    gdeltData:gd};
}

function computeAxisCustom(cA,cB,w){
  const r=computeAxis(cA,cB);
  const mediaScore=(r.media&&r.media.score)||50;
  const custom=r.military.score*(w.military||0)+r.economic.score*(w.economic||0)+r.lobby.score*(w.lobby||0)+r.cultural.score*(w.cultural||0)+r.strategic.score*(w.strategic||0)+r.behavioral.score*(w.behavioral||0)+mediaScore*(w.media||0);
  return{...r,composite:Math.round(custom*10)/10};
}

function getVerdict(s){if(s>=75)return{t:T("vD"),c:"var(--pos)"};if(s>=55)return{t:T("vS"),c:"var(--blue)"};if(s>=40)return{t:T("vM"),c:"var(--warn)"};if(s>=25)return{t:T("vL"),c:"var(--purple)"};return{t:T("vA"),c:"var(--neg)"}}

// Data source citation tooltips
function dataSourceTooltip(type){var s={gdp:{src:"World Bank WDI",yr:"2024",conf:"high"},military:{src:"SIPRI",yr:"2024",conf:"high"},trade:{src:"UN Comtrade (est.)",yr:"2024",conf:"medium"},cpi:{src:"Transparency Intl CPI",yr:"2024",conf:"high"},hofstede:{src:"Hofstede Insights",yr:"2023",conf:"medium"},unVoting:{src:"UNGA Voting (Voeten)",yr:"2024",conf:"high"},gdelt:{src:"GDELT DOC 2.0",yr:"Live",conf:"medium"},behavioral:{src:"Author IR assessment",yr:"2026",conf:"low"},minerals:{src:"USGS MCS 2026",yr:"2025",conf:"high"}}[type];if(!s)return"";var cc={high:"var(--green)",medium:"var(--amber)",low:"var(--neg)"}[s.conf]||"var(--t3)";return'<span class="data-cite"><span class="cite-icon">ⓘ</span><span class="cite-tooltip"><span class="cite-source">'+s.src+'</span><span class="cite-year">'+s.yr+'</span><span class="cite-conf" style="color:'+cc+'">'+s.conf+'</span></span></span>'}
