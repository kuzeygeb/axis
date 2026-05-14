// AXIS — Live Data Integration Engine v2.0
// 5 API: World Bank · IMF WEO · REST Countries · ACLED · UN Comtrade
// © 2026 Kuzey Çağan Gebrecioğlu

var LIVE={status:{},fetched:{},metadata:{},errors:[],bilateral:{},conflicts:[],countryMeta:{},
CACHE:{worldbank:{key:"axis_wb",ttl:864e5},imf:{key:"axis_imf",ttl:864e5},restcountries:{key:"axis_restc",ttl:6048e5},acled:{key:"axis_acled",ttl:216e5},comtrade:{key:"axis_comtrade",ttl:864e5}},
codeMap:{US:"USA",CN:"CHN",JP:"JPN",DE:"DEU",GB:"GBR",FR:"FRA",IN:"IND",IT:"ITA",BR:"BRA",CA:"CAN",KR:"KOR",RU:"RUS",AU:"AUS",MX:"MEX",ID:"IDN",SA:"SAU",TR:"TUR",AR:"ARG",ZA:"ZAF"},
wbCode:{US:"US",CN:"CN",JP:"JP",DE:"DE",GB:"GB",FR:"FR",IN:"IN",IT:"IT",BR:"BR",CA:"CA",KR:"KR",RU:"RU",AU:"AU",MX:"MX",ID:"ID",SA:"SA",TR:"TR",AR:"AR",ZA:"ZA"}};

function liveGetCache(api){try{var c=LIVE.CACHE[api];if(!c)return null;var r=localStorage.getItem(c.key);if(!r)return null;var d=JSON.parse(r);if(!d||!d.ts||Date.now()-d.ts>c.ttl){localStorage.removeItem(c.key);return null}return d.data}catch(e){return null}}
function liveSetCache(api,data){try{var c=LIVE.CACHE[api];if(c)localStorage.setItem(c.key,JSON.stringify({ts:Date.now(),data:data}))}catch(e){}}
function clearAllLiveCache(){Object.keys(LIVE.CACHE).forEach(function(k){localStorage.removeItem(LIVE.CACHE[k].key)});console.log("[AXIS LIVE] All caches cleared")}

// === API 1: WORLD BANK ===
var WB_IND={gdp:{wb:"NY.GDP.MKTP.CD",unit:1e9,dec:0},mil:{wb:"MS.MIL.XPND.CD",unit:1e9,dec:1},milPct:{wb:"MS.MIL.XPND.GD.ZS",unit:1,dec:2},tradeOpen:{wb:"NE.TRD.GNFS.ZS",unit:1,dec:1},pop:{wb:"SP.POP.TOTL",unit:1e6,dec:1},inflation:{wb:"FP.CPI.TOTL.ZG",unit:1,dec:1},internet:{wb:"IT.NET.USER.ZS",unit:1,dec:1}};

async function fetchWorldBank(){
// Eski G20-only cache tespit — ülke sayısı uyuşmuyorsa temizle
var cached=liveGetCache("worldbank");
if(cached){var cachedCount=Object.keys(cached).length;var totalCount=Object.keys(C).length;
if(totalCount>30&&cachedCount<totalCount*0.5){console.log("[WB] Cache stale ("+cachedCount+" vs "+totalCount+") — refetching");localStorage.removeItem(LIVE.CACHE.worldbank.key);cached=null}
if(cached){console.log("[WB] Cache ("+cachedCount+" countries)");applyWorldBank(cached);LIVE.status.worldbank="done";updateLiveStatusBar();return}}
LIVE.status.worldbank="fetching";updateLiveStatusBar();
// TÜM C[] ülkeleri için fetch — /country/all/ endpoint'i ile
var result={};var base="https://api.worldbank.org/v2";var keys=Object.keys(WB_IND);
for(var ki=0;ki<keys.length;ki++){var key=keys[ki];var ind=WB_IND[key];
try{var url=base+"/country/all/indicator/"+ind.wb+"?format=json&per_page=300&MRV=1";
var resp=await fetch(url);if(!resp.ok){console.warn("[WB] HTTP "+resp.status+" for "+key);continue}
var json=await resp.json();if(!json||!json[1]){console.warn("[WB] No data for "+key);continue}
var applied=0;json[1].forEach(function(rec){if(rec.value===null)return;
var iso2=rec.countryiso2code||"";if(!iso2)return;
if(!result[iso2])result[iso2]={};
result[iso2][key]=Math.round(rec.value/ind.unit*Math.pow(10,ind.dec))/Math.pow(10,ind.dec);
if(!LIVE.metadata[key]||parseInt(rec.date)>parseInt((LIVE.metadata[key].year||"0")))LIVE.metadata[key]={year:rec.date,source:"World Bank",indicator:ind.wb};
applied++});
console.log("[WB] ✓ "+key+" ("+applied+")")
}catch(e){console.warn("[WB] ✗ "+key+": "+e.message);LIVE.errors.push("WB/"+key)}
if(ki<keys.length-1)await new Promise(function(r){setTimeout(r,200)})}
if(Object.keys(result).length>0){liveSetCache("worldbank",result);applyWorldBank(result);LIVE.status.worldbank="done";console.log("[WB] Complete: "+Object.keys(result).length+" countries")}else LIVE.status.worldbank="error";updateLiveStatusBar()}

function applyWorldBank(data){if(typeof C==="undefined")return;var applied=0;Object.keys(data).forEach(function(code){if(!C[code])return;var d=data[code];if(d.gdp>0)C[code].gdp=d.gdp;if(d.mil>0)C[code].mil=d.mil;if(d.milPct>0)C[code].mp=d.milPct;if(d.tradeOpen>0)C[code].to=d.tradeOpen;if(d.pop>0)C[code].pop=d.pop;if(d.inflation!==undefined)C[code].inflation=d.inflation;if(d.internet>0)C[code].internet=d.internet;C[code]._live=true;applied++;if(!LIVE.fetched[code])LIVE.fetched[code]={};Object.assign(LIVE.fetched[code],d)});console.log("[WB] Applied to "+applied+" C[] countries")}

// === API 2: IMF equivalents via World Bank (IMF datamapper has no CORS) ===
var IMF_VIA_WB={growth:{wb:"NY.GDP.MKTP.KD.ZG",unit:1,dec:2},debt:{wb:"GC.DOD.TOTL.GD.ZS",unit:1,dec:1},currentAcc:{wb:"BN.CAB.XOKA.GD.ZS",unit:1,dec:2},unemployment:{wb:"SL.UEM.TOTL.ZS",unit:1,dec:1}};

async function fetchIMF(){var cached=liveGetCache("imf");if(cached){console.log("[IMF] Cache");applyIMF(cached);LIVE.status.imf="done";updateLiveStatusBar();return cached}LIVE.status.imf="fetching";updateLiveStatusBar();
var codes=Object.values(LIVE.wbCode).join(";");var base="https://api.worldbank.org/v2";var result={};
await Promise.all(Object.entries(IMF_VIA_WB).map(function(entry){var key=entry[0],ind=entry[1];var url=base+"/country/"+codes+"/indicator/"+ind.wb+"?format=json&per_page=300&MRV=3";
return fetch(url).then(function(r){return r.json()}).then(function(json){if(!json||!json[1])return;json[1].forEach(function(rec){if(rec.value===null)return;var iso2=rec.countryiso2code||(rec.country&&rec.country.id);var ax=null;for(var k in LIVE.wbCode)if(LIVE.wbCode[k]===iso2){ax=k;break}if(!ax)return;if(!result[ax])result[ax]={};var val=Math.round(rec.value/ind.unit*Math.pow(10,ind.dec))/Math.pow(10,ind.dec);if(!result[ax][key])result[ax][key]={};result[ax][key][rec.date]=val;if(!result[ax][key+"_year"]||parseInt(rec.date)>parseInt(result[ax][key+"_year"])){result[ax][key+"_latest"]=val;result[ax][key+"_year"]=rec.date}});
var yrs=[];Object.keys(result).forEach(function(c){if(result[c][key+"_year"])yrs.push(result[c][key+"_year"])});yrs.sort();LIVE.metadata["imf_"+key]={year:yrs.length?yrs[yrs.length-1]:"?",source:"World Bank (IMF equivalent)",indicator:ind.wb};console.log("[IMF] ✓ "+key+" ("+ind.wb+") — via World Bank")}).catch(function(e){console.warn("[IMF] ✗ "+key+": "+e.message);LIVE.errors.push("IMF/"+key)})}));
if(Object.keys(result).length>0){liveSetCache("imf",result);applyIMF(result);LIVE.status.imf="done";console.log("[IMF] Complete: "+Object.keys(result).length+" countries (via World Bank)")}else LIVE.status.imf="error";updateLiveStatusBar();return result}

function applyIMF(data){if(typeof C==="undefined")return;Object.keys(data).forEach(function(code){if(!C[code])return;var d=data[code];if(d.growth_latest!==undefined)C[code].gdpGrowth=d.growth_latest;if(d.growth_forecast!==undefined)C[code].gdpGrowthForecast=d.growth_forecast;if(d.debt_latest!==undefined)C[code].govDebt=d.debt_latest;if(d.currentAcc_latest!==undefined)C[code].currentAccount=d.currentAcc_latest;if(d.unemployment_latest!==undefined)C[code].unemployment=d.unemployment_latest;C[code]._liveIMF=true;if(!LIVE.fetched[code])LIVE.fetched[code]={};Object.assign(LIVE.fetched[code],d)})}

// === API 3: REST COUNTRIES — replaced by World Bank in world.js ===
async function fetchRestCountries(){LIVE.status.restcountries="done";updateLiveStatusBar();console.log("[RESTC] Skipped — data loaded via World Bank in world.js");return null}

function applyRestCountries(data){if(typeof C==="undefined")return;LIVE.countryMeta=data;Object.keys(data).forEach(function(code){if(!C[code])return;var d=data[code];C[code].region2=d.region;C[code].subregion=d.subregion;C[code].borders=d.borders;C[code].languages=d.languages;C[code].currencies=d.currencies;C[code].capital2=d.capital;C[code].area2=d.area;C[code]._liveRC=true})}

// === API 4: ACLED (key required) ===
async function fetchACLED(){var key=localStorage.getItem("acledKey"),email=localStorage.getItem("acledEmail");if(!key||!email){console.log("[ACLED] No key — skip");LIVE.status.acled="no_key";updateLiveStatusBar();return}
var cached=liveGetCache("acled");if(cached){console.log("[ACLED] Cache ("+cached.length+")");applyACLED(cached);LIVE.status.acled="done";updateLiveStatusBar();return}LIVE.status.acled="fetching";updateLiveStatusBar();
var end=new Date().toISOString().split("T")[0];var start=new Date(Date.now()-90*864e5).toISOString().split("T")[0];
try{var resp=await fetch("https://api.acleddata.com/acled/read?key="+encodeURIComponent(key)+"&email="+encodeURIComponent(email)+"&event_date="+start+"|"+end+"&event_date_where=BETWEEN&limit=2000&fields=event_date|event_type|country|iso|latitude|longitude|fatalities");if(!resp.ok)throw new Error("HTTP "+resp.status);var json=await resp.json();if(json.success===false)throw new Error(json.error||"API error");
var isoNums={US:840,CN:156,JP:392,DE:276,GB:826,FR:250,IN:356,IT:380,BR:76,CA:124,KR:410,RU:643,AU:36,MX:484,ID:360,SA:682,TR:792,AR:32,ZA:710};
var result=(json.data||[]).map(function(evt){var ax=null;var iso=parseInt(evt.iso);for(var k in isoNums)if(isoNums[k]===iso){ax=k;break}return{date:evt.event_date,type:evt.event_type,country:evt.country,countryCode:ax,lat:parseFloat(evt.latitude),lng:parseFloat(evt.longitude),fatalities:parseInt(evt.fatalities)||0}});
console.log("[ACLED] ✓ "+result.length+" events");LIVE.metadata.acled={year:"live",source:"ACLED",events:result.length};liveSetCache("acled",result);applyACLED(result);LIVE.status.acled="done"}catch(e){console.warn("[ACLED] ✗ "+e.message);LIVE.errors.push("ACLED");LIVE.status.acled="error"}updateLiveStatusBar()}

function applyACLED(events){LIVE.conflicts=events;if(typeof C==="undefined")return;var by={};events.forEach(function(evt){var c=evt.countryCode;if(!c)return;if(!by[c])by[c]={events:0,fatalities:0};by[c].events++;by[c].fatalities+=evt.fatalities});Object.keys(by).forEach(function(c){if(!C[c])return;C[c].acledEvents=by[c].events;C[c].acledFatalities=by[c].fatalities;C[c]._liveACLED=true})}

function getLiveHeatmapData(){if(!LIVE.conflicts||!LIVE.conflicts.length)return null;return LIVE.conflicts.filter(function(e){return e.lat&&e.lng&&!isNaN(e.lat)}).map(function(e){var w=.3;if(e.fatalities>0)w+=Math.min(e.fatalities*.1,1);if(e.type==="Battles")w+=.3;if(e.type==="Explosions/Remote violence")w+=.5;return[e.lat,e.lng,Math.min(w,1)]})}

// === API 5: UN COMTRADE (key required) ===
async function fetchComtrade(){var key=localStorage.getItem("comtradeKey");if(!key){console.log("[COMTRADE] No key — skip");LIVE.status.comtrade="no_key";updateLiveStatusBar();return}
var cached=liveGetCache("comtrade");if(cached){console.log("[COMTRADE] Cache");applyComtrade(cached);LIVE.status.comtrade="done";updateLiveStatusBar();return}LIVE.status.comtrade="fetching";updateLiveStatusBar();
var isoNum={US:842,CN:156,JP:392,DE:276,GB:826,FR:251,IN:699,IT:381,BR:76,CA:124,KR:410,RU:643,AU:36,MX:484,ID:360,SA:682,TR:792,AR:32,ZA:710};
var pairs=[["US","CN"],["US","JP"],["US","DE"],["US","GB"],["US","CA"],["US","MX"],["CN","JP"],["CN","KR"],["CN","DE"],["CN","AU"],["CN","RU"],["DE","FR"],["DE","GB"],["TR","DE"],["TR","US"],["TR","RU"],["SA","CN"],["IN","SA"],["RU","IN"],["JP","AU"]];
var yr=new Date().getFullYear()-1;var result={};
for(var i=0;i<pairs.length;i++){var cA=pairs[i][0],cB=pairs[i][1];var rp=isoNum[cA],pt=isoNum[cB];if(!rp||!pt)continue;
try{var resp=await fetch("https://comtradeapi.un.org/data/v1/get/C/A/"+rp+"/"+yr+"/"+pt+"?cmdCode=TOTAL&flowCode=X,M&subscription-key="+encodeURIComponent(key));var json=await resp.json();if(json&&json.data&&json.data.length>0){var exp=0,imp=0;json.data.forEach(function(r){if(r.flowCode==="X")exp+=(r.primaryValue||0);if(r.flowCode==="M")imp+=(r.primaryValue||0)});var tot=(exp+imp)/1e9;result[cA+"_"+cB]={exports:Math.round(exp/1e9*10)/10,imports:Math.round(imp/1e9*10)/10,total:Math.round(tot*10)/10,year:yr};console.log("[COMTRADE] ✓ "+cA+"-"+cB+": $"+tot.toFixed(1)+"B")}}catch(e){}
if(i<pairs.length-1)await new Promise(function(r){setTimeout(r,300)})}
if(Object.keys(result).length>0){LIVE.metadata.comtrade={year:yr+"",source:"UN Comtrade",pairs:Object.keys(result).length};liveSetCache("comtrade",result);applyComtrade(result);LIVE.status.comtrade="done";console.log("[COMTRADE] "+Object.keys(result).length+" pairs")}else LIVE.status.comtrade="error";updateLiveStatusBar()}

function applyComtrade(data){if(typeof B==="undefined"||typeof bK==="undefined")return;LIVE.bilateral=data;Object.keys(data).forEach(function(pk){var d=data[pk];var parts=pk.split("_");var key=bK(parts[0],parts[1]);var pair=B[key];if(pair&&d.total>0){pair.trade=d.total;pair._liveTrade=true}})}

// === STATUS BAR ===
function updateLiveStatusBar(){var el=document.getElementById("statusLive");if(!el)return;var t=typeof lang!=="undefined"&&lang==="tr";var sts=LIVE.status;var total=Object.keys(sts).length;if(!total){el.innerHTML='<span class="sq" style="background:var(--t3)"></span> STATIC';return}
var done=0,fetching=0;Object.values(sts).forEach(function(s){if(s==="done")done++;else if(s==="fetching")fetching++});
if(fetching>0){el.innerHTML='<span class="sq" style="background:var(--amber);animation:blink .5s infinite"></span> '+(t?"VERİ: ":"DATA: ")+done+"/"+total;el.style.color="var(--amber)"}else if(done>0){el.innerHTML='<span class="sq" style="background:var(--green)"></span> '+(t?"CANLI ":"LIVE ")+done+"/"+total;el.style.color="var(--green)"}else{el.innerHTML='<span class="sq" style="background:var(--neg)"></span> '+(t?"STATİK":"STATIC");el.style.color="var(--neg)"}}

// === LIVE DATA PANEL ===
function renderLiveDataPanel(){var total=Object.keys(LIVE.status).length;if(!total)return"";var t=typeof lang!=="undefined"&&lang==="tr";
var h='<div style="background:var(--card-bg);border:1px solid var(--border);border-left:3px solid var(--green);border-radius:2px;padding:16px;margin-bottom:8px;grid-column:1/-1">';
h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="color:var(--green)">📡</span><span style="font-family:var(--font-mono);font-size:var(--text-sm);text-transform:uppercase;letter-spacing:.12em;color:var(--green)">'+(t?"Canlı Veri — 5 API":"Live Data — 5 APIs")+"</span></div>";
var apis=[{k:"worldbank",n:"World Bank",d:t?"GDP, Askeri, Ticaret, Nüfus":"GDP, Military, Trade, Pop"},{k:"imf",n:"IMF/WB",d:t?"Büyüme, Kamu Borcu, Cari Denge, İşsizlik":"Growth, Govt Debt, Current Acc., Unemployment"},{k:"restcountries",n:"REST Countries",d:t?"Bölge, Sınırlar, Dil":"Region, Borders, Languages"},{k:"acled",n:"ACLED",d:t?"Çatışma Olayları":"Conflict Events"},{k:"comtrade",n:"UN Comtrade",d:t?"İkili Ticaret":"Bilateral Trade"}];
h+='<table class="live-table"><tr><th>API</th><th>'+(t?"Veri":"Data")+"</th><th>"+(t?"Durum":"Status")+"</th></tr>";
apis.forEach(function(api){var st=LIVE.status[api.k]||"—";var color=st==="done"?"var(--green)":st==="fetching"?"var(--amber)":st==="no_key"?"var(--t3)":"var(--neg)";var label=st==="done"?"✓":st==="fetching"?"◌":st==="no_key"?(t?"🔑":"🔑"):"✗";h+="<tr><td style='font-weight:700'>"+api.n+"</td><td>"+api.d+"</td><td style='color:"+color+";font-weight:700'>"+label+"</td></tr>"});h+="</table>";
if(LIVE.errors.length>0)h+='<div class="live-errors">'+(t?"⚠ ":"⚠ ")+LIVE.errors.join(", ")+"</div>";
var lc=Object.keys(typeof C!=="undefined"?C:{}).filter(function(c){return C[c]&&C[c]._live}).length;var done2=Object.values(LIVE.status).filter(function(s){return s==="done"}).length;
var totalC=Object.keys(typeof C!=="undefined"?C:{}).length;
h+='<div class="live-summary">'+(t?"API: ":"APIs: ")+"<b>"+done2+"/"+total+"</b> · "+(t?"Ülke: ":"Countries: ")+"<b>"+lc+"/"+totalC+"</b>";if(LIVE.conflicts.length>0)h+=" · "+(t?"Çatışma: ":"Conflicts: ")+"<b>"+LIVE.conflicts.length+"</b>";h+="</div></div>";return h}

// === SETTINGS API KEY FIELDS ===
function renderAPIKeyFields(){if(document.getElementById("acledKeyInput"))return;var parent=document.querySelector(".settings-modal");if(!parent)return;var saveBtn=parent.querySelector(".settings-save");if(!saveBtn)return;var t=typeof lang!=="undefined"&&lang==="tr";
var af=document.createElement("div");af.className="settings-field";af.innerHTML='<label class="settings-label">ACLED API Key</label><input class="settings-input" type="text" id="acledKeyInput" placeholder="ACLED key..." value="'+(localStorage.getItem("acledKey")||"")+'"><input class="settings-input" type="email" id="acledEmailInput" placeholder="ACLED email" value="'+(localStorage.getItem("acledEmail")||"")+'" style="margin-top:4px"><div class="settings-hint">'+(t?"Ücretsiz: ":"Free: ")+'<a href="https://developer.acleddata.com" target="_blank">developer.acleddata.com</a></div>';
var cf=document.createElement("div");cf.className="settings-field";cf.innerHTML='<label class="settings-label">UN Comtrade Key</label><input class="settings-input" type="text" id="comtradeKeyInput" placeholder="Subscription key..." value="'+(localStorage.getItem("comtradeKey")||"")+'"><div class="settings-hint">'+(t?"Ücretsiz: ":"Free: ")+'<a href="https://comtradeapi.un.org" target="_blank">comtradeapi.un.org</a></div>';
var ca=document.createElement("div");ca.className="settings-field";ca.innerHTML='<button id="clearLiveCacheBtn" style="padding:6px 12px;background:var(--amber);color:var(--bg);border:none;border-radius:2px;cursor:pointer;font-family:var(--font-mono);font-size:var(--text-sm);text-transform:uppercase;font-weight:700">'+(t?"Önbelleği Temizle":"Clear Cache")+'</button>';
saveBtn.parentNode.insertBefore(af,saveBtn);saveBtn.parentNode.insertBefore(cf,saveBtn);saveBtn.parentNode.insertBefore(ca,saveBtn);
document.getElementById("clearLiveCacheBtn").addEventListener("click",function(){clearAllLiveCache();this.textContent=(t?"Temizlendi!":"Cleared!");setTimeout(()=>this.textContent=(t?"Önbelleği Temizle":"Clear Cache"),2000)});}

// === ORCHESTRATOR ===
async function fetchAllLiveData(){
  console.log("[AXIS LIVE] \u2550\u2550\u2550 Starting 5 API fetches for "+Object.keys(C).length+" countries \u2550\u2550\u2550");
  await fetchWorldBank().catch(function(e){ console.error("[WB FETCH] Error:", e) });
  await Promise.all([
    fetchIMF().catch(function(){}),
    fetchRestCountries().catch(function(){}),
    fetchACLED().catch(function(){}),
    fetchComtrade().catch(function(){})
  ]);
  console.log("[AXIS LIVE] \u2550\u2550\u2550 Complete \u2550\u2550\u2550",JSON.stringify(LIVE.status));
  renderAPIKeyFields();
  if(typeof updateMarkers==="function") updateMarkers(); // Refresh markers if GSYH changed sizing
}

// === STARTUP ===
function startLiveData(){
  // Wait for world.js to finish loading 193 countries into C[]
  if(typeof WORLD!=="undefined" && !WORLD.loaded){
    console.log("[AXIS LIVE] Queuing live data after worldLoaded event...");
    window.addEventListener("worldLoaded", function(){
      fetchAllLiveData();
    }, { once: true });
    return;
  }
  // Fallback if world is already loaded or not present
  if(typeof C!=="undefined" && Object.keys(C).length > 20){
    fetchAllLiveData();
  } else {
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(fetchAllLiveData, 1500) });
  }
}

startLiveData();

// Settings modal integration
document.addEventListener("DOMContentLoaded",function(){var origToggle=typeof toggleSettings==="function"?toggleSettings:null;if(origToggle)window.toggleSettings=function(){origToggle();setTimeout(renderAPIKeyFields,100)};
var saveBtn=document.getElementById("settingsSaveBtn");if(saveBtn)saveBtn.addEventListener("click",function(){var ak=document.getElementById("acledKeyInput"),ae=document.getElementById("acledEmailInput"),ck=document.getElementById("comtradeKeyInput");if(ak&&ak.value.trim())localStorage.setItem("acledKey",ak.value.trim());if(ae&&ae.value.trim())localStorage.setItem("acledEmail",ae.value.trim());if(ck&&ck.value.trim())localStorage.setItem("comtradeKey",ck.value.trim())})});
