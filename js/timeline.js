// AXIS — Diplomatic Discourse Timeline
// © 2026 Kuzey Çağan Gebrecioğlu

var TIMELINE_EVENTS={
global:[
{date:"2025-01",label:{en:"Trump inaugurated",tr:"Trump göreve başladı"},type:"political",impact:"high"},
{date:"2025-03",label:{en:"EU ReArm Europe plan €800B",tr:"AB ReArm Europe planı €800M"},type:"security",impact:"high"},
{date:"2025-06",label:{en:"Twelve-Day War (Iran strikes)",tr:"On İki Gün Savaşı (İran saldırıları)"},type:"conflict",impact:"critical"},
{date:"2025-07",label:{en:"BRICS Rio Summit",tr:"BRICS Rio Zirvesi"},type:"diplomacy",impact:"medium"},
{date:"2025-09",label:{en:"UNGA 80th Session",tr:"BM 80. Oturum"},type:"diplomacy",impact:"high"},
{date:"2025-09",label:{en:"France recognizes Palestine",tr:"Fransa Filistin'i tanıdı"},type:"political",impact:"high"},
{date:"2025-10",label:{en:"Xi-Trump Busan Summit",tr:"Xi-Trump Busan Zirvesi"},type:"diplomacy",impact:"high"},
{date:"2025-11",label:{en:"G20 Johannesburg (US boycott)",tr:"G20 Johannesburg (ABD boykot)"},type:"diplomacy",impact:"high"},
{date:"2026-01",label:{en:"US withdraws from Paris Agreement",tr:"ABD Paris Anlaşması'ndan çekildi"},type:"climate",impact:"high"},
{date:"2026-02",label:{en:"Abu Dhabi peace talks (UA-RU-US)",tr:"Abu Dabi barış görüşmeleri (UA-RU-ABD)"},type:"diplomacy",impact:"high"},
{date:"2026-02",label:{en:"2026 Iran War begins (Feb 28)",tr:"2026 İran Savaşı başladı (28 Şubat)"},type:"conflict",impact:"critical"},
{date:"2026-03",label:{en:"Khamenei killed in strike",tr:"Hamaney saldırıda öldürüldü"},type:"conflict",impact:"critical"},
{date:"2026-03",label:{en:"Strait of Hormuz closed",tr:"Hürmüz Boğazı kapatıldı"},type:"energy",impact:"critical"},
{date:"2026-03",label:{en:"France nuclear doctrine shift",tr:"Fransa nükleer doktrin değişikliği"},type:"security",impact:"high"},
{date:"2026-03",label:{en:"Israel invades Lebanon",tr:"İsrail Lübnan'ı işgal etti"},type:"conflict",impact:"critical"}
],
bilateral:{
"US_CN":[{date:"2025-02",label:{en:"US tariffs on China raised to 47.5%",tr:"ABD'nin Çin'e tarifesi %47.5'e yükseldi"},type:"trade",impact:"high"},{date:"2025-10",label:{en:"Trump-Xi Busan: 'G-2' framing",tr:"Trump-Xi Busan: 'G-2' çerçevesi"},type:"diplomacy",impact:"high"},{date:"2025-12",label:{en:"Justice Mission-2025: largest Taiwan exercise",tr:"Justice Mission-2025: en büyük Tayvan tatbikatı"},type:"security",impact:"critical"}],
"US_RU":[{date:"2025-09",label:{en:"Trump calls Russia 'paper tiger' at UNGA",tr:"Trump BM'de Rusya'yı 'kağıt kaplan' dedi"},type:"diplomacy",impact:"high"},{date:"2026-02",label:{en:"Abu Dhabi trilateral talks + POW swap",tr:"Abu Dabi üçlü görüşmeler + esir takası"},type:"diplomacy",impact:"high"}],
"TR_US":[{date:"2025-09",label:{en:"Erdogan-Trump White House meeting",tr:"Erdoğan-Trump Beyaz Saray görüşmesi"},type:"diplomacy",impact:"medium"},{date:"2025-12",label:{en:"F-35/S-400 'most fruitful talks in a decade'",tr:"F-35/S-400 'on yılın en verimli görüşmeleri'"},type:"security",impact:"high"},{date:"2026-03",label:{en:"Turkey denies US airspace for Iran strikes",tr:"Türkiye İran saldırıları için ABD'ye hava sahası vermedi"},type:"conflict",impact:"high"}],
"DE_FR":[{date:"2025-03",label:{en:"ReArm Europe plan jointly pushed",tr:"ReArm Europe planı birlikte itildi"},type:"security",impact:"high"},{date:"2026-03",label:{en:"Macron nuclear doctrine includes Germany",tr:"Macron nükleer doktrini Almanya'yı kapsıyor"},type:"security",impact:"high"}],
"IN_RU":[{date:"2026-02",label:{en:"India-US trade deal (tariffs 50%→18%)",tr:"Hindistan-ABD ticaret anlaşması (tarife %50→%18)"},type:"trade",impact:"high"}]
}};

function formatMonth(dateStr,t){var parts=dateStr.split("-");var months=t?["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"]:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return months[parseInt(parts[1])-1]+" "+parts[0]}

function renderTimeline(codeA,codeB){var t=lang==="tr";var pk1=codeA+"_"+codeB,pk2=codeB+"_"+codeA;var bilEvents=TIMELINE_EVENTS.bilateral[pk1]||TIMELINE_EVENTS.bilateral[pk2]||[];
var all=TIMELINE_EVENTS.global.map(function(e){return Object.assign({},e,{scope:"global"})}).concat(bilEvents.map(function(e){return Object.assign({},e,{scope:"bilateral"})})).sort(function(a,b){return a.date.localeCompare(b.date)}).filter(function(e){return e.date>="2025-01"&&e.date<="2026-03"});
if(all.length===0)return"";
var tlIcon=ICONS&&ICONS.timeline?ICONS.timeline:"📅";
var h='<div style="background:var(--card-bg);border:1px solid var(--border);border-left:3px solid var(--amber);border-radius:2px;padding:16px;margin-bottom:20px">';
h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="color:var(--amber)">'+tlIcon+'</span><span style="font-family:var(--font-mono);font-size:.6rem;text-transform:uppercase;letter-spacing:.12em;color:var(--amber)">'+(t?"Diplomatik Zaman Çizelgesi":"Diplomatic Timeline")+'</span><span style="margin-left:auto;font-family:var(--font-mono);font-size:.55rem;color:var(--t3)">'+(t?"Oca 2025 — Mar 2026":"Jan 2025 — Mar 2026")+'</span></div>';
h+='<div class="tl-track">';var lastM="";
all.forEach(function(evt,i){var month=evt.date;var showM=month!==lastM;lastM=month;var tc={conflict:"var(--neg)",security:"#ff6600",trade:"var(--cyan)",diplomacy:"var(--green)",political:"var(--amber)",climate:"#44aa00",energy:"#ffb000"}[evt.type]||"var(--t3)";var sz={critical:"10px",high:"7px",medium:"5px"}[evt.impact]||"5px";
if(showM)h+='<div class="tl-month">'+formatMonth(month,t)+'</div>';
h+='<div class="tl-event '+evt.scope+'" style="animation-delay:'+(i*30)+'ms"><div class="tl-dot" style="background:'+tc+';width:'+sz+';height:'+sz+'"></div><div class="tl-content"><span class="tl-label">'+(t?evt.label.tr:evt.label.en)+'</span>';
if(evt.scope==="bilateral")h+='<span class="tl-bilateral-badge">'+(t?"İKİLİ":"BILATERAL")+'</span>';
if(evt.impact==="critical")h+='<span class="tl-critical-badge">!</span>';
h+='</div></div>'});
h+='</div></div>';return h}
