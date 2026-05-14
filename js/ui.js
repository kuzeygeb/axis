// AXIS — UI controls, rendering helpers, theme, clock
// Depends on: core.js, map.js, sensitivity.js, profiles.js, chat.js, export.js

// SVG Icons — monochrome, stroke-based, 16x16
const ICONS={
military:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="8" y1="11" x2="8" y2="14"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="11" y1="8" x2="14" y2="8"/></svg>',
economic:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="8" width="3" height="7" rx=".5"/><rect x="6" y="4" width="3" height="11" rx=".5"/><rect x="11" y="1" width="3" height="14" rx=".5"/></svg>',
lobby:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="4" r="2.5"/><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5"/></svg>',
cultural:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><ellipse cx="8" cy="8" rx="3" ry="6"/><line x1="2" y1="8" x2="14" y2="8"/></svg>',
strategic:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 1L14 5v6l-6 4-6-4V5z"/><circle cx="8" cy="8" r="2"/></svg>',
behavioral:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="1,8 3,4 5,10 7,3 9,12 11,6 13,9 15,8"/></svg>',
media:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="2"/><path d="M8 1v3M8 12v3M1 8h3M12 8h3"/><circle cx="8" cy="8" r="6" stroke-dasharray="2,2"/></svg>',
discourse:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 10a1.5 1.5 0 01-1.5 1.5H5l-3 3V3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5z"/></svg>',
thematic:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v3m0 8v3m7-7h-3M4 8H1m11.5-5.5l-2 2M6.5 10.5l-2 2m9 0l-2-2M6.5 5.5l-2-2"/></svg>',
timeline:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="8" y1="1" x2="8" y2="15"/><line x1="4" y1="5" x2="12" y2="5"/><circle cx="6" cy="9" r="1.5" fill="currentColor"/><circle cx="11" cy="3" r="1" fill="currentColor"/></svg>',
disinfo:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5"/><line x1="14" y1="14" x2="11" y2="11"/><line x1="5" y1="5" x2="9" y2="9"/><line x1="9" y1="5" x2="5" y2="9"/></svg>',
abm:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="3" r="2"/><circle cx="3" cy="13" r="2"/><circle cx="13" cy="13" r="2"/><line x1="8" y1="5" x2="3" y2="11"/><line x1="8" y1="5" x2="13" y2="11"/><line x1="3" y1="13" x2="13" y2="13"/></svg>',
montecarlo:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 14h12M4 14V7m3 7V4m3 10V1m3 13v-4"/></svg>',
theory:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 1L1 5l7 3 7-3-7-4zM1 11l7 4 7-4M1 8l7 3 7-3"/></svg>',
geo:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6.5"/><line x1="1.5" y1="8" x2="14.5" y2="8"/><ellipse cx="8" cy="8" rx="3" ry="6.5"/></svg>',
cascade:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="2.5" r="1.5"/><circle cx="4" cy="8" r="1.5"/><circle cx="12" cy="8" r="1.5"/><circle cx="2" cy="13.5" r="1.5"/><circle cx="8" cy="13.5" r="1.5"/><circle cx="14" cy="13.5" r="1.5"/><line x1="8" y1="4" x2="4" y2="6.5"/><line x1="8" y1="4" x2="12" y2="6.5"/><line x1="4" y1="9.5" x2="2" y2="12"/><line x1="4" y1="9.5" x2="8" y2="12"/><line x1="12" y1="9.5" x2="14" y2="12"/></svg>',
alliance:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 14.5s5.5-3 5.5-7V3.5L8 1.5l-5.5 2v4c0 4 5.5 7 5.5 7z"/></svg>'
};

// Flag images from flagcdn
// _flagMap defined in map.js (loaded before ui.js)
function flagImg(code,w){
  const c=C[code];
  if(c && c.isNSA) {
    const src = 'assets/' + code.toLowerCase() + '.png';
    return '<img src="'+src+'" width="'+(w||24)+'" style="border-radius:1px;vertical-align:middle;object-fit:contain" alt="'+code+'">';
  }
  const cc=_flagMap[code]||(code||'').toLowerCase();
  const sz=w||16;
  return'<img src="https://flagcdn.com/w20/'+cc+'.png" width="'+sz+'" height="'+Math.round(sz*0.75)+'" alt="'+code+'" style="border-radius:1px;vertical-align:middle" crossorigin="anonymous" onerror="this.outerHTML=\''+((C[code]&&C[code].f)||'')+'\'">';
}


function setMode(m){
  mode=m; selA=null; selB=null; coalMembers=[]; workingData=null; workingB=null;
  if(typeof destroyNetwork==="function"){destroyNetwork("coalNetworkGraph");destroyNetwork("bilNetworkGraph")}
  
  // Tab indicators
  document.querySelectorAll(".mode-tab").forEach(t=>{
    const isActive = t.dataset.mode === m;
    t.classList.toggle("on", isActive);
    t.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  // Top control bars
  document.getElementById("presets").classList.toggle("show", m==="coalition");
  document.getElementById("scenCtrl").classList.toggle("show", m==="scenario");
  document.getElementById("sensCtrl").classList.toggle("show", m==="sensitivity");
  
  // Element references
  const mapEl = document.getElementById("map");
  const selEl = document.getElementById("selBar");
  const paneLeft = document.querySelector(".pane-left");
  
  // Explicit View Management
  const views = {
    results: document.getElementById("results"),
    profiles: document.getElementById("profilesView"),
    chat: document.getElementById("chatView"),
    meth: document.getElementById("methView"),
    abm: document.getElementById("abmView")
  };

  // Hide all results-level views by default
  Object.values(views).forEach(v => { if(v) { v.style.display="none"; v.classList.remove("show"); } });

  const nonMapModes = ["profiles", "chat", "methodology", "abm", "backtest"];
  const isMapMode = !nonMapModes.includes(m);
  const mapRail = document.getElementById("mapToggleRail");
  if(paneLeft) paneLeft.style.display = isMapMode ? "" : "none";
  if(mapRail) mapRail.style.display = isMapMode ? "" : "none";
  if(mapEl) mapEl.style.display = isMapMode ? "block" : "none";
  if(selEl) selEl.style.display = isMapMode ? "flex" : "none";

  // Mode-Specific Show/Initialize
  if(m === "profiles"){
    if(views.profiles) { views.profiles.style.display="flex"; views.profiles.classList.add("show"); }
    showProfileGrid();
  } else if(m === "chat"){
    if(views.chat){ views.chat.style.display="flex"; views.chat.classList.add("show"); }
    initChat();
  } else if(m === "methodology"){
    if(views.meth) { views.meth.style.display="flex"; views.meth.classList.add("show"); }
    showMethodology();
  } else if(m === "abm"){
    if(views.abm) { views.abm.style.display="flex"; views.abm.classList.add("show"); }
    if(typeof showABM === "function") showABM();
  } else if(m === "backtest"){
    if(views.results) { views.results.style.display="flex"; views.results.classList.add("show"); }
    if(typeof runHistoricalSimulation === "function") runHistoricalSimulation();
  } else {
    // Map modes (bilateral, coalition, scenario, sensitivity)
    if(views.results) { views.results.style.display="flex"; views.results.classList.add("show"); }
    // Handle map invalidation
    if(mapEl){
      mapEl.style.animation="none";
      setTimeout(function(){
        mapEl.style.animation="mapReset .4s ease";
        if(typeof map!=="undefined"&&map&&map.invalidateSize)map.invalidateSize();
      },10);
    }
    if(m === "sensitivity") buildSensSliders();
    updateUI();
  }
}

function setLang(l){lang=l;document.documentElement.lang=l==="tr"?"tr":"en";document.getElementById("lEN").classList.toggle("on",l==="en");document.getElementById("lTR").classList.toggle("on",l==="tr");
  document.getElementById("logoSub").textContent=T("sub");document.getElementById("tabBil").textContent=T("bil");
  document.getElementById("tabCoal").textContent=T("coal");document.getElementById("tabScen").textContent=T("scen");document.getElementById("tabSens").textContent=T("sens");document.getElementById("tabChat").textContent=T("chat");document.getElementById("tabProf").textContent=lang==="tr"?"PROFİLLER":"PROFILES";document.getElementById("tabMeth").textContent=T("meth");var abmTab=document.getElementById("tabAbm");if(abmTab)abmTab.textContent=lang==="tr"?"SİMÜLASYON":"ABM";
  document.getElementById("scenLabel").textContent=T("sl");
  var ss=document.getElementById("statusSys");if(ss)ss.textContent=l==="tr"?"SİSTEM AKTİF":"SYS ONLINE";
  var sn=document.getElementById("statusNodes");if(sn)sn.textContent=l==="tr"?"193 DÜĞÜM":"193 NODES";
  var sl2=document.getElementById("statusLayers");if(sl2)sl2.textContent=l==="tr"?"7 KATMAN":"7 LAYERS";
  var ftR=document.getElementById("ftRights");if(ftR)ftR.textContent=T("ftRights");
  var ftA=document.getElementById("ftAcad");if(ftA)ftA.textContent=T("ftAcad");
  var ftD=document.getElementById("ftDataTitle");if(ftD)ftD.textContent=T("ftData");
  buildPresets();buildScenarios();
  if(mode==="sensitivity")buildSensSliders();
  if(mode==="methodology"&&typeof showMethodology==="function")showMethodology();
  if(mode==="abm"&&typeof showABM==="function")showABM();
  if(mode==="profiles"){showProfileGrid()}else{updateUI()}}

function buildPresets(){const p=document.getElementById("presets");p.innerHTML="";Object.entries(blocs).forEach(([k,b])=>{const btn=document.createElement("button");btn.className="preset-btn";btn.textContent=b.l;btn.onclick=()=>{coalMembers=[...b.m];updateUI()};p.appendChild(btn)})}
function buildScenarios(){const s=document.getElementById("scenSelect");s.innerHTML="";Object.entries(scenarios).forEach(([k,v])=>{const o=document.createElement("option");o.value=k;o.textContent=lang==="tr"?v.tr:v.en;s.appendChild(o)})}
function applyScenario(){const k=document.getElementById("scenSelect").value;if(k==="none"){workingData=null;workingB=null;return}workingData=deepCopy();workingB=deepCopyB();if(scenarios[k].fn)scenarios[k].fn(workingData,workingB)}
function resetBil(){selA=null;selB=null;workingData=null;workingB=null;document.getElementById("results").classList.remove("show");updateUI()}
function resetCoal(){coalMembers=[];document.getElementById("results").classList.remove("show");updateUI()}
function remCoal(c){coalMembers.splice(coalMembers.indexOf(c),1);updateUI()}
function remA(){selA=null;updateUI()}
function remB(){selB=null;updateUI()}

function updateUI(){
  updateMarkers();
  const tabs = {
    tabBil: "tabBil", tabCoal: "tabCoal", tabScen: "tabScen", tabSens: "tabSens",
    tabChat: "tabChat", tabProf: "tabProf", tabAbm: "tabAbm", tabMeth: "tabMeth",
    tabBacktest: "tabBacktest"
  };
  Object.keys(tabs).forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = T(tabs[id]);
  });

  const bar=document.getElementById("selBar");
  if(!bar)return;
  let hint="", chips="";
  if(mode==="bilateral"||mode==="sensitivity"||mode==="scenario"){
    hint=mode==="scenario"?T("hSc"):T("hBi");
    if(selA) chips+='<span class="sel-chip">'+cN(selA)+'</span>';
    if(selB) chips+='<span class="sel-chip">'+cN(selB)+'</span>';
    const goFn=mode==="sensitivity"?"runSensitivity()":mode==="scenario"?"runScenarioAnalysis()":"runBilateral()";
    bar.innerHTML=chips+(!selA||!selB?'<span class="sel-hint">'+hint+"</span>":"")+
      '<button class="sel-go" '+(selA&&selB?"":"disabled")+' onclick="'+goFn+'">'+T("go")+"</button>"+
      '<button class="sel-reset" onclick="resetBil()">'+T("rst")+"</button>";
  } else {
    hint=T("hCo");
    coalMembers.forEach(c=>{chips+='<span class="sel-chip coal">'+C[c].f+" "+cN(c)+' <span class="x" onclick="remCoal(\''+c+'\')">x</span></span>'});
    bar.innerHTML=chips+(coalMembers.length<3?'<span class="sel-hint">'+hint+"</span>":"")+
      '<button class="sel-go" '+(coalMembers.length>=3?"":"disabled")+' onclick="runCoalition()">'+T("go")+"</button>"+
      '<button class="sel-reset" onclick="resetCoal()">'+T("rst")+"</button>";
  }
}

function genInterp(cA,cB,r){const X=tx[lang],aN=cN(cA),bN=cN(cB),bil=r.bil;let t="";
  if(r.composite>=65)t+=X.iH(aN,bN);else if(r.composite>=40)t+=X.iM(aN,bN);else t+=X.iL(aN,bN);
  if(r.economic.score>=60)t+=X.eH(bil.trade);else if(bil.trade>20)t+=X.eM(bil.trade);else t+=X.eL(bil.trade);
  if(r.strategic.shA>=3)t+=X.sH(r.strategic.shA,bil.so.join(", "));else if(r.strategic.shA>=1)t+=X.sM(bil.so.join(", "));
  if(bil.ten==="critical")t+=X.tC;else if(bil.ten==="high")t+=X.tH;
  if(r.cultural.hd<20)t+=X.cC(r.cultural.hd);else if(r.cultural.hd>40)t+=X.cF(r.cultural.hd);
  if(r.behavioral.score>=65)t+=X.bH(r.behavioral.score);else if(r.behavioral.score>=40)t+=X.bM(r.behavioral.score);else t+=X.bL(r.behavioral.score);
  t+='<br><br><em style="color:var(--t3)">'+T("cx")+": "+bil.nt+"</em>";return t}

function behGrid(code){const D=getD(),c=D[code],bl=behLabels[lang]||behLabels.en;
  const reasons=behReasons[code]||{};
  let h='<div class="beh-grid">';
  for(const[k,label]of Object.entries(bl)){
    const v=c.beh[k]||5;
    const reason=reasons[k]||{};
    const reasonText=lang==="tr"?(reason.tr||reason.en||""):(reason.en||"");
    h+='<div class="beh-item-full">';
    h+='<div class="beh-item-row"><span class="beh-label">'+label+'</span><div class="beh-bar-bg"><div class="beh-bar-fill" style="width:'+v*10+'%"></div></div><span class="beh-val">'+v+'</span></div>';
    if(reasonText)h+='<div class="beh-reason">'+reasonText+'</div>';
    h+='</div>'}
  return h+"</div>"}

function pCard(icon,name,wt,cv,score,dets,layer){
  const lid=layer?' data-layer="'+layer+'" onclick="toggleDetail(\''+layer+'\')"':'';
  const svgIcon=layer&&ICONS[layer]?ICONS[layer]:icon;
  return '<div class="p-card"'+lid+'><div class="p-head"><div class="p-icon" style="background:var('+cv+')15;color:var('+cv+')">'+svgIcon+'</div><div class="p-wt">'+T("wt")+" "+wt+'</div></div><div class="p-name">'+name+'</div><div class="p-score" style="color:var('+cv+')">'+score+'</div><div class="p-bar"><div class="p-bar-f" style="width:'+score+'%;background:var('+cv+')"></div></div><div class="p-dets">'+dets.map(function(d){return'<div class="p-det"><span class="p-det-k">'+d[0]+'</span><span class="p-det-v">'+d[1]+"</span></div>"}).join("")+"</div>"+(layer?'<div class="p-card-detail" id="detail-'+layer+'"></div>':"")+"</div>"}

function profCard(code){const D=getD(),c=D[code];
  return '<div class="prof"><div class="prof-h"><span class="prof-flag">'+c.f+'</span><span class="prof-n">'+cN(code)+"</span></div>"+
  '<div class="prof-s"><span class="prof-s-k">'+T("gd")+'</span><span class="prof-s-v">$'+c.gdp+"B</span></div>"+
  '<div class="prof-s"><span class="prof-s-k">'+T("pp")+'</span><span class="prof-s-v">'+c.pop+"M</span></div>"+
  '<div class="prof-s"><span class="prof-s-k">'+T("ml")+'</span><span class="prof-s-v">$'+c.mil+"B</span></div>"+
  '<div class="prof-s"><span class="prof-s-k">'+T("to")+'</span><span class="prof-s-v">'+c.to+"%</span></div>"+
  '<div class="prof-s"><span class="prof-s-k">'+T("cp")+'</span><span class="prof-s-v">'+c.cpi+"/100</span></div>"+
  '<div class="prof-s"><span class="prof-s-k">'+T("dm")+'</span><span class="prof-s-v">'+c.dem+"/10</span></div>"+
  '<div class="prof-s"><span class="prof-s-k">'+T("rg")+'</span><span class="prof-s-v">'+cR(c.r)+"</span></div>"+
  '<div style="margin-top:8px;font-family:monospace;font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;color:var(--beh)">'+T("behTitle")+"</div>"+
  behGrid(code)+"</div>"}

function srcPanel(){return '<div class="transp"><div class="transp-t">'+T("tt")+'</div><div class="src-grid">'+
  '<div class="src-i"><span class="src-dot"></span>'+T("sWB")+'<span class="src-yr">2023</span></div>'+
  '<div class="src-i"><span class="src-dot"></span>'+T("sSI")+'<span class="src-yr">2023</span></div>'+
  '<div class="src-i"><span class="src-dot"></span>'+T("sCP")+'<span class="src-yr">2023</span></div>'+
  '<div class="src-i"><span class="src-dot"></span>'+T("sVD")+'<span class="src-yr">2023</span></div>'+
  '<div class="src-i"><span class="src-dot"></span>'+T("sFH")+'<span class="src-yr">2024</span></div>'+
  '<div class="src-i"><span class="src-dot"></span>'+T("sHF")+'<span class="src-yr">2023</span></div>'+
  '<div class="src-i"><span class="src-dot"></span>'+T("sUN")+'<span class="src-yr">2023</span></div>'+
  '<div class="src-i"><span class="src-dot" style="background:var(--beh)"></span>'+T("sBH")+'<span class="src-yr">2024</span></div>'+
  '<div class="src-i"><span class="src-dot" style="background:var(--warn)"></span>'+T("sBL")+'<span class="src-yr">est.</span></div>'+
  '<div class="src-i"><span class="src-dot" style="background:var(--cyan)"></span>'+T("sGDELT")+'<span class="src-yr">live</span></div></div></div>'}

function confBadge(cA,cB){
  const hasData=!!B[bK(cA,cB)];
  if(hasData)return'<div class="conf-badge high"><span class="conf-icon">✓</span>'+T("confLabel")+': '+T("confHigh")+'</div><div class="conf-desc">'+T("confHighDesc")+'</div>';
  return'<div class="conf-badge est"><span class="conf-icon">⚠</span>'+T("confLabel")+': '+T("confEst")+'</div><div class="conf-desc">'+T("confEstDesc")+'</div>';
}

function exportBar(){
  return '<div class="exp-bar">'+
    '<button class="exp-btn" onclick="exportCSV()"><span class="exp-icon">↓</span>'+T("expCSV")+'</button>'+
    '<button class="exp-btn" onclick="exportPDF()"><span class="exp-icon">⎙</span>'+T("expPDF")+'</button>'+
    '<button class="exp-btn" onclick="copyLink()"><span class="exp-icon">📋</span>'+T("copyLink")+'</button></div>';
}

function sensWeightList(w){
  let h='<div style="margin-top:8px">';
  Object.keys(w).forEach(k=>{
    const pct=Math.round(w[k]*100);
    h+='<div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:.65rem;padding:2px 0;color:var(--t2)"><span>'+T(weightLabels[k])+'</span><span style="color:var(--t1)">'+pct+'%</span></div>';
  });
  return h+'</div>';
}

// FEATURE-1: Layout Toggle (Horizontal ↔ Vertical)
let hudLayout = localStorage.getItem('axisLayout') || 'horizontal';
function toggleHudLayout(){
  hudLayout = hudLayout === 'horizontal' ? 'vertical' : 'horizontal';
  localStorage.setItem('axisLayout', hudLayout);
  const body = document.querySelector('.hud-body');
  const btn = document.getElementById('layoutToggleBtn');
  if(body) body.classList.toggle('vertical', hudLayout === 'vertical');
  if(btn) btn.title = hudLayout === 'vertical' ? 'Switch to Horizontal Layout' : 'Switch to Vertical Layout';
  if(btn) btn.textContent = hudLayout === 'vertical' ? '⊞' : '⊟';
  // Invalidate Leaflet map after layout change
  setTimeout(function(){if(typeof map!=="undefined"&&map&&map.invalidateSize)map.invalidateSize();}, 300);
}
// Apply saved layout on load
(function(){
  if(hudLayout === 'vertical'){
    const body = document.querySelector('.hud-body');
    if(body) body.classList.add('vertical');
  }
})();

// Theme
let theme="dark";
function toggleTheme(){
  theme=theme==="dark"?"light":theme==="light"?"institutional":"dark";
  document.documentElement.setAttribute("data-theme",theme);
  document.getElementById("themeBtn").textContent=theme==="dark"?"◐":theme==="light"?"◑":"🏛";
  if(typeof updateNetworkTheme==="function")updateNetworkTheme();
  if(typeof updateChoroplethTheme==="function")updateChoroplethTheme();
}
// Status bar clock
function updateClock(){
  const d=new Date();
  const ts=d.toISOString().replace("T"," ").substr(0,19)+" UTC";
  const el=document.getElementById("statusTime");
  if(el)el.textContent=ts;
}
setInterval(updateClock,1000);updateClock();

buildPresets();buildScenarios();updateUI();

// Touch swipe for mode tabs
(function(){
  const mb=document.querySelector('.mode-bar');if(!mb)return;
  let sx=0;const modes=['bilateral','coalition','scenario','sensitivity','chat','profiles','abm','methodology'];
  mb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  mb.addEventListener('touchend',function(e){
    const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)<50)return;
    const ci=modes.indexOf(mode);
    if(d<0&&ci<modes.length-1)setMode(modes[ci+1]);
    else if(d>0&&ci>0)setMode(modes[ci-1]);
  },{passive:true});
})();

