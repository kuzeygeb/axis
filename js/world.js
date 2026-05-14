// AXIS — World Country Loader (19 → 193)
// © 2026 Kuzey Çağan Gebrecioğlu

var WORLD={allCountries:{},loaded:false,G20_CODES:["US","CN","JP","DE","GB","FR","IN","IT","BR","CA","KR","RU","AU","MX","ID","SA","TR","AR","ZA"],CACHE_KEY:"axis_world193",CACHE_TTL:7*864e5};
var ISO3_TO_ISO2={};

async function loadWorldCountries(){var cached=null;try{var raw=localStorage.getItem(WORLD.CACHE_KEY);if(raw){var p=JSON.parse(raw);if(p&&p.ts&&Date.now()-p.ts<WORLD.CACHE_TTL)cached=p.data;else localStorage.removeItem(WORLD.CACHE_KEY)}}catch(e){}
if(cached&&cached.countries&&Object.keys(cached.countries).length>50){console.log("[WORLD] Cache — "+Object.keys(cached.countries).length+" countries");applyWorldCountries(cached.countries,cached.iso3map);return}
console.log("[WORLD] Loading 193 countries...");
try{var rcResp=await fetch("https://api.worldbank.org/v2/country?format=json&per_page=300");if(!rcResp.ok)throw new Error("WB Countries HTTP "+rcResp.status);var rcJson=await rcResp.json();var rcData=(rcJson&&rcJson[1])?rcJson[1]:[];
var countries={};var iso3map={};rcData.forEach(function(c){if(!c.iso2Code||!c.id||c.id.length!==3)return;if(!c.region||c.region.id==="NA"||c.region.value==="Aggregates")return;var code=c.iso2Code;var iso3=c.id;iso3map[iso3]=code;ISO3_TO_ISO2[iso3]=code;countries[code]={n:c.name||code,iso3:iso3,region:c.region?c.region.value:"",subregion:c.adminregion?c.adminregion.value:"",incomeLevel:c.incomeLevel?c.incomeLevel.value:"",capital:c.capitalCity||"",lat:c.latitude?parseFloat(c.latitude):0,lng:c.longitude?parseFloat(c.longitude):0,borders:[],languages:[],currencies:[],area:0,landlocked:false,pop:0,flag:"",isG20:WORLD.G20_CODES.indexOf(code)>=0,_source:WORLD.G20_CODES.indexOf(code)>=0?"static+api":"api"}});
console.log("[WORLD] WB Countries: "+Object.keys(countries).length+" countries");
// Indicator verisi livedata.js tarafından çekilecek — world.js sadece ülke listesi
Object.keys(countries).forEach(function(code){countries[code].flag="https://flagcdn.com/w40/"+code.toLowerCase()+".png"});
try{localStorage.setItem(WORLD.CACHE_KEY,JSON.stringify({ts:Date.now(),data:{countries:countries,iso3map:iso3map}}))}catch(e){}
applyWorldCountries(countries,iso3map);console.log("[WORLD] ✓ Complete: "+Object.keys(countries).length+" countries")}catch(e){console.error("[WORLD] ✗ Fatal: "+e.message)}}

function applyWorldCountries(countries,iso3map){if(typeof C==="undefined")return;WORLD.allCountries=countries;ISO3_TO_ISO2=iso3map||{};var added=0;
Object.keys(countries).forEach(function(code){var wc=countries[code];if(C[code]){if(!C[code].region)C[code].region=wc.region;if(!C[code].subregion)C[code].subregion=wc.subregion;if(!C[code].borders)C[code].borders=wc.borders;if(!C[code].languages)C[code].languages=wc.languages;if(!C[code].iso3)C[code].iso3=wc.iso3;if(!C[code].flag)C[code].flag=wc.flag;if(!C[code].capital)C[code].capital=wc.capital;if(!C[code].incomeLevel)C[code].incomeLevel=wc.incomeLevel;if(!C[code].gdpPC&&wc.gdpPC)C[code].gdpPC=wc.gdpPC;if(!C[code].gdpGrowth&&wc.growth)C[code].gdpGrowth=wc.growth;if(!C[code].governance&&wc.governance)C[code].governance=wc.governance;C[code].isG20=true}else{C[code]={n:wc.n,iso3:wc.iso3,f:"",c:code,r:wc.region,gdp:wc.gdp||0,mil:wc.mil||0,mp:wc.milPct||0,to:wc.tradeOpen||0,pop:wc.pop||0,gdpPC:wc.gdpPC||0,gdpGrowth:wc.growth||0,lat:wc.lat,lng:wc.lng,region:wc.region,subregion:wc.subregion,incomeLevel:wc.incomeLevel||"",borders:wc.borders,languages:wc.languages,currencies:wc.currencies,capital:wc.capital,area:wc.area,flag:wc.flag,governance:wc.governance||0,cpi:40,dem:5,fh:50,nuc:0,usc:0,cs:.5,al:[],hof:{pdi:50,idv:50,mas:50,uai:50,lto:50},beh:{decis:5,crisis:5,risk:5,status:5,alliance:5,twoLvl:5,dipStyle:5,predict:5},isG20:false,_source:"api"};added++}});
if(typeof _flagMap!=="undefined")Object.keys(C).forEach(function(code){if(!_flagMap[code])_flagMap[code]=code.toLowerCase()});
console.log("[WORLD] Applied: "+added+" new countries (total: "+Object.keys(C).length+")");WORLD.loaded=true;
// ═══ GERÇEK HOFSTEDE VERİLERİ (hofstede-insights.com) — ~70 ülke ═══
var hofstedeReal={US:{pdi:40,idv:91,mas:62,uai:46,lto:26,ind:68},GB:{pdi:35,idv:89,mas:66,uai:35,lto:51,ind:69},DE:{pdi:35,idv:67,mas:66,uai:65,lto:83,ind:40},FR:{pdi:68,idv:71,mas:43,uai:86,lto:63,ind:48},IT:{pdi:50,idv:76,mas:70,uai:75,lto:61,ind:30},ES:{pdi:57,idv:51,mas:42,uai:86,lto:48,ind:44},PT:{pdi:63,idv:27,mas:31,uai:99,lto:28,ind:33},NL:{pdi:38,idv:80,mas:14,uai:53,lto:67,ind:68},BE:{pdi:65,idv:75,mas:54,uai:94,lto:82,ind:57},AT:{pdi:11,idv:55,mas:79,uai:70,lto:60,ind:63},CH:{pdi:34,idv:68,mas:70,uai:58,lto:74,ind:66},SE:{pdi:31,idv:71,mas:5,uai:29,lto:53,ind:78},NO:{pdi:31,idv:69,mas:8,uai:50,lto:35,ind:55},DK:{pdi:18,idv:74,mas:16,uai:23,lto:35,ind:70},FI:{pdi:33,idv:63,mas:26,uai:59,lto:38,ind:57},IE:{pdi:28,idv:70,mas:68,uai:35,lto:24,ind:65},GR:{pdi:60,idv:35,mas:57,uai:100,lto:45,ind:50},PL:{pdi:68,idv:60,mas:64,uai:93,lto:38,ind:29},CZ:{pdi:57,idv:58,mas:57,uai:74,lto:70,ind:29},HU:{pdi:46,idv:80,mas:88,uai:82,lto:58,ind:31},RO:{pdi:90,idv:30,mas:42,uai:90,lto:52,ind:20},BG:{pdi:70,idv:30,mas:40,uai:85,lto:69,ind:16},HR:{pdi:73,idv:33,mas:40,uai:80,lto:58,ind:33},RS:{pdi:86,idv:25,mas:43,uai:92,lto:52,ind:28},SI:{pdi:71,idv:27,mas:19,uai:88,lto:49,ind:48},SK:{pdi:100,idv:52,mas:100,uai:51,lto:77,ind:28},LT:{pdi:42,idv:60,mas:19,uai:65,lto:82,ind:16},LV:{pdi:44,idv:70,mas:9,uai:63,lto:69,ind:13},EE:{pdi:40,idv:60,mas:30,uai:60,lto:82,ind:16},RU:{pdi:93,idv:39,mas:36,uai:95,lto:81,ind:20},UA:{pdi:92,idv:25,mas:27,uai:95,lto:55,ind:18},CN:{pdi:80,idv:20,mas:66,uai:30,lto:87,ind:24},JP:{pdi:54,idv:46,mas:95,uai:92,lto:88,ind:42},KR:{pdi:60,idv:18,mas:39,uai:85,lto:100,ind:29},IN:{pdi:77,idv:48,mas:56,uai:40,lto:51,ind:26},TH:{pdi:64,idv:20,mas:34,uai:64,lto:32,ind:45},VN:{pdi:70,idv:20,mas:40,uai:30,lto:57,ind:35},MY:{pdi:100,idv:26,mas:50,uai:36,lto:41,ind:57},SG:{pdi:74,idv:20,mas:48,uai:8,lto:72,ind:46},ID:{pdi:78,idv:14,mas:46,uai:48,lto:62,ind:38},PH:{pdi:94,idv:32,mas:64,uai:44,lto:27,ind:42},PK:{pdi:55,idv:14,mas:50,uai:70,lto:50,ind:0},BD:{pdi:80,idv:20,mas:55,uai:60,lto:47,ind:20},IR:{pdi:58,idv:41,mas:43,uai:59,lto:14,ind:40},IQ:{pdi:95,idv:30,mas:70,uai:85,lto:25,ind:17},SA:{pdi:95,idv:25,mas:60,uai:80,lto:36,ind:52},AE:{pdi:90,idv:25,mas:50,uai:80,lto:23,ind:26},IL:{pdi:13,idv:54,mas:47,uai:81,lto:38,ind:0},EG:{pdi:70,idv:25,mas:45,uai:80,lto:7,ind:4},MA:{pdi:70,idv:46,mas:53,uai:68,lto:14,ind:25},NG:{pdi:80,idv:30,mas:60,uai:55,lto:13,ind:84},GH:{pdi:80,idv:15,mas:40,uai:65,lto:4,ind:72},KE:{pdi:70,idv:25,mas:60,uai:50,lto:13,ind:0},TZ:{pdi:70,idv:25,mas:40,uai:50,lto:34,ind:38},ET:{pdi:70,idv:20,mas:65,uai:55,lto:14,ind:46},ZA:{pdi:49,idv:65,mas:63,uai:49,lto:34,ind:63},BR:{pdi:69,idv:38,mas:49,uai:76,lto:44,ind:59},AR:{pdi:49,idv:46,mas:56,uai:86,lto:20,ind:62},MX:{pdi:81,idv:30,mas:69,uai:82,lto:24,ind:97},CO:{pdi:67,idv:13,mas:64,uai:80,lto:13,ind:83},CL:{pdi:63,idv:23,mas:28,uai:86,lto:31,ind:68},PE:{pdi:64,idv:16,mas:42,uai:87,lto:25,ind:46},VE:{pdi:81,idv:12,mas:73,uai:76,lto:16,ind:100},UY:{pdi:61,idv:36,mas:38,uai:98,lto:26,ind:53},CA:{pdi:39,idv:80,mas:52,uai:48,lto:36,ind:68},AU:{pdi:36,idv:90,mas:61,uai:51,lto:21,ind:71},NZ:{pdi:22,idv:79,mas:58,uai:49,lto:33,ind:75},TR:{pdi:66,idv:37,mas:45,uai:85,lto:46,ind:49},TW:{pdi:58,idv:17,mas:45,uai:69,lto:93,ind:49}};
Object.keys(hofstedeReal).forEach(function(code){if(C[code]){C[code].hof=hofstedeReal[code];C[code]._hofstedeSource="research"}});
console.log("[WORLD] Hofstede: "+Object.keys(hofstedeReal).length+" countries (research data)");
if(typeof addWorldMarkers==="function")addWorldMarkers();
var sn=document.getElementById("statusNodes");if(sn)sn.textContent=Object.keys(C).length+" NODES";
// livedata.js'e sinyal — yeni ülkeler hazır, veri çekilebilir
try{window.dispatchEvent(new Event("worldLoaded"))}catch(e){}}

function computeDynamicBilateral(codeA,codeB){if(typeof B!=="undefined"&&typeof bK==="function"){var existing=B[bK(codeA,codeB)];if(existing)return existing}
var a=C[codeA],b=C[codeB];if(!a||!b)return null;
var dist=1000;if(a.lat&&b.lat)dist=haversineW(a.lat,a.lng||0,b.lat,b.lng||0);if(dist<100)dist=100;
var trade=0;if(a.gdp&&b.gdp){var grav=Math.pow(a.gdp*b.gdp,.8)/Math.pow(dist,1.1)*1e-5;if(a.region===b.region)grav*=1.5;trade=Math.round(Math.min(grav,1000)*10)/10}
var sameRegion=a.region===b.region&&!!a.region;var neighbor=false;if(a.borders&&b.iso3&&a.borders.indexOf(b.iso3)>=0)neighbor=true;if(b.borders&&a.iso3&&b.borders.indexOf(a.iso3)>=0)neighbor=true;
var sharedLang=false;if(a.languages&&b.languages)sharedLang=a.languages.some(function(l){return b.languages&&b.languages.indexOf(l)>=0});
var unV=40;if(sameRegion)unV+=15;if(a.subregion===b.subregion&&a.subregion)unV+=10;if(sharedLang)unV+=5;
return{trade:trade,unA:unV/100,so:[],ten:"low",nt:"Algorithmically estimated bilateral data",sameRegion:sameRegion,neighbor:neighbor,sharedLang:sharedLang,hofDist:sameRegion?30:50,_dynamic:true}}

function haversineW(lat1,lon1,lat2,lon2){var R=6371;var dLat=(lat2-lat1)*Math.PI/180;var dLon=(lon2-lon1)*Math.PI/180;var a2=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);return R*2*Math.atan2(Math.sqrt(a2),Math.sqrt(1-a2))}

function addWorldMarkers(){
  if(!window.map || !window.map._loaded){
    setTimeout(addWorldMarkers, 500); return;
  }
  var map = window.map;
  if(typeof markers==="undefined") window.markers={};
  var existing = {}; Object.keys(markers).forEach(function(c){existing[c]=true});
  var added=0;
  
  Object.keys(C).forEach(function(code){
    if(existing[code]) return;
    var c=C[code]; if(!c.lat || !c.lng || isNaN(c.lat) || c.lat===0) return;
    
    var size=20, op=.55, border="var(--border2)";
    if(c.gdp>50){size=24; op=.65}
    if(c.gdp>200){size=28; op=.75}
    if(c.gdp>500){size=32; op=.85; border="var(--amber)"}
    if(c.gdp>2000){size=36; op=.95; border="var(--gold)"}

    var crisis = (c.mp>4 || c.dem<3 || c.fh<20);
    var crisisRing = crisis ? ' box-shadow:0 0 6px rgba(255,60,60,.5);border-color:var(--neg);' : '';
    var fc = (typeof _flagMap!=="undefined" && _flagMap[code]) ? _flagMap[code] : code.toLowerCase();
    var isG20 = WORLD.G20_CODES.indexOf(code)>=0;
    var g20Badge = isG20 ? '<span style="position:absolute;top:-3px;right:-3px;width:6px;height:6px;background:var(--gold);border-radius:50%"></span>' : '';
    
    var icon = L.divIcon({
      html: '<div class="map-marker world-marker'+(crisis?' crisis-marker':'')+'" id="mk-'+code+'" style="width:'+size+'px;height:'+size+'px;border:1.5px solid '+border+';display:flex;align-items:center;justify-content:center;position:relative;'+crisisRing+'" tabindex="0" role="button" aria-label="'+(c.n||code)+'">'+
            '<img src="https://flagcdn.com/w20/'+fc+'.png" width="'+(size>28?18:14)+'" height="'+(size>28?13:10)+'" style="border-radius:1px;opacity:'+op+'" crossorigin="anonymous" onerror="this.style.display=\'none\'">'+
            g20Badge+'</div>',
      className: "", iconSize: [size, size], iconAnchor: [size/2, size/2]
    });

    try {
      var m = L.marker([c.lat, c.lng], {icon: icon}).addTo(map);
      var tensionLabel = crisis ? (lang==="tr"?"KR\u0130Z":"CRISIS") : (c.dem<5 ? (lang==="tr"?"D\u0130KKAT":"WATCH") : "");
      var popHtml = '<div style="font-weight:600;font-size:13px;margin-bottom:6px">'+
            '<img src="https://flagcdn.com/w20/'+fc+'.png" width="16" height="11" style="border-radius:1px;margin-right:4px;vertical-align:middle" crossorigin="anonymous" onerror="this.style.display=\'none\'"> '+
            (c.n||code)+'</div>'+
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 12px;font-size:11px">'+
            '<span style="color:var(--t3)">GDP</span><span style="font-family:monospace;color:var(--econ)">$'+(c.gdp||"?")+'B</span>'+
            '<span style="color:var(--t3)">'+(lang==="tr"?"Askeri":"Mil.")+'</span><span style="font-family:monospace;color:var(--mil)">$'+(c.mil||"?")+'B</span>'+
            '<span style="color:var(--t3)">'+(lang==="tr"?"N\u00fcfus":"Pop.")+'</span><span style="font-family:monospace">'+(c.pop||"?")+'M</span>'+
            '<span style="color:var(--t3)">'+(lang==="tr"?"B\u00f6lge":"Region")+'</span><span style="font-size:10px">'+(c.region||c.r||"")+'</span>'+
            '</div>';
      if(tensionLabel) popHtml += '<div style="margin-top:4px;padding:2px 6px;font-size:10px;font-weight:600;color:var(--neg);border:1px solid var(--neg);border-radius:2px;display:inline-block">\u26A0 '+tensionLabel+'</div>';
      if(isG20) popHtml += '<div style="margin-top:3px;font-size:10px;color:var(--gold);font-weight:600">\u2605 G20</div>';
      m.bindPopup(popHtml, {closeButton:false, offset:[0,-10], maxWidth:220});
      m.on("click", function(){ if(typeof onMapClick==="function") onMapClick(code) });
      markers[code] = m; added++;
    } catch(e) { console.warn("[WORLD] Marker error for "+code+":", e) }
  });
  console.log("[WORLD] Map: "+added+" new markers (total: "+Object.keys(markers).length+")");
}

// Extend computeAxis for non-G20
var _origCA=typeof computeAxis==="function"?computeAxis:null;
function computeAxisWorld(codeA,codeB){var bothG20=WORLD.G20_CODES.indexOf(codeA)>=0&&WORLD.G20_CODES.indexOf(codeB)>=0;if(bothG20&&_origCA)return _origCA(codeA,codeB);
var a=C[codeA],b=C[codeB];if(!a||!b)return{composite:50,military:{score:50},economic:{score:50},lobby:{score:50},cultural:{score:50},strategic:{score:50},behavioral:{score:50},bil:computeDynamicBilateral(codeA,codeB)||{}};
var pair=computeDynamicBilateral(codeA,codeB)||{trade:0,unA:.3,so:[],ten:"low",nt:"No data"};
var milA=a.mil||.1,milB=b.mil||.1;var milBal=Math.min(milA,milB)/Math.max(milA,milB);var nucB=(a.nuc&&b.nuc)?15:(a.nuc||b.nuc)?5:0;var milS=Math.min(100,milBal*40+20+nucB);
var trN=pair.trade?Math.min(100,pair.trade/5):20;var opN=((a.to||50)+(b.to||50))/4;var econS=trN*.6+opN*.4;
var lobbyS=((a.cpi||40)+(b.cpi||40))/2;
var cultDist=pair.hofDist||50;var cultS=Math.max(0,100-cultDist);if(pair.sameRegion)cultS+=15;if(pair.sharedLang)cultS+=10;cultS=Math.min(100,cultS);
var stratS=(pair.unA||.3)*100;if(pair.ten==="high")stratS-=15;if(pair.ten==="critical")stratS-=25;stratS=Math.max(0,Math.min(100,stratS));
var behA=a.beh||{},behB=b.beh||{};var behS=50;try{if(typeof behCompat==="function")behS=behCompat(a,b)}catch(e){}
var aw=typeof getActiveWeights==="function"?getActiveWeights():{military:.16,economic:.20,lobby:.10,cultural:.10,strategic:.20,behavioral:.12,media:.12};
var comp=milS*aw.military+econS*aw.economic+lobbyS*aw.lobby+cultS*aw.cultural+stratS*aw.strategic+behS*aw.behavioral+50*aw.media;
comp=Math.round(Math.max(0,Math.min(100,comp))*10)/10;
return{composite:comp,military:{score:Math.round(milS*10)/10,milR:milBal,bn:!!(a.nuc&&b.nuc),bu:!!(a.usc&&b.usc)},economic:{score:Math.round(econS*10)/10,tv:pair.trade||0},lobby:{score:Math.round(lobbyS*10)/10,civA:50,cpiA:(a.cpi||40+b.cpi||40)/2,demA:(a.dem||5+b.dem||5)/2},cultural:{score:Math.round(cultS*10)/10,hd:cultDist,sr:!!pair.sameRegion},strategic:{score:Math.round(stratS*10)/10,unA:pair.unA||.3,shA:0,ten:pair.ten||"low",so:pair.so||[]},behavioral:{score:behS},bil:pair}}

if(typeof computeAxis==="function"){window._computeAxisOriginal=computeAxis;window.computeAxis=function(a,b){return computeAxisWorld(a,b)}}

loadWorldCountries();
