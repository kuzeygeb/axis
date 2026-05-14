// AXIS — Profile grid and detail views (193-country edition)
// Depends on: core.js (getD, cN, cR, C, lang, T), data/profiles.js, data/factbook.js, data/behavioral.js, ui.js (behGrid), world.js (WORLD)

var profileCountry=null;

// ═══ Value formatter — 0/undefined → '—' ═══
function fmtVal(val,prefix,suffix){
  if(val===undefined||val===null||val===0)return'—';
  return(prefix||'')+val+(suffix||'');
}

// ═══ Alliance / group constants ═══
var PROFILE_GROUPS={
  NATO:["US","CA","GB","FR","DE","IT","TR","ES","PL","NL","BE","NO","DK","PT","CZ","HU","RO","BG","HR","SK","SI","AL","ME","MK","LT","LV","EE","LU","IS","GR","FI","SE"],
  BRICS:["BR","RU","IN","CN","ZA","EG","ET","IR","SA","AE"],
  EU:["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"],
  NUCLEAR:["US","RU","CN","GB","FR","IN","PK","IL","KP"]
};

var REGION_MAP={
  "Europe":["Europe & Central Asia","Europe"],
  "Asia":["East Asia & Pacific","South Asia","East Asia","South Asia","Southeast Asia"],
  "Middle East":["Middle East & North Africa","Middle East","North Africa"],
  "Americas":["Latin America & Caribbean","North America","South America","Central America","Caribbean"],
  "Africa":["Sub-Saharan Africa","Africa"],
  "Oceania":["Oceania","East Asia & Pacific"]
};

function getCountryRegionGroup(code){
  var c=C[code];if(!c)return"Other";
  var r=c.region||c.r||"";
  // Special cases
  if(code==="AU"||code==="NZ"||code==="FJ"||code==="PG"||code==="WS"||code==="TO"||code==="VU"||code==="SB"||code==="KI"||code==="MH"||code==="FM"||code==="PW"||code==="NR"||code==="TV")return"Oceania";
  if(REGION_MAP["Europe"].some(function(x){return r.indexOf(x)>=0}))return"Europe";
  if(REGION_MAP["Middle East"].some(function(x){return r.indexOf(x)>=0})){
    // Distinguish ME from Africa
    var meCountries=["SA","AE","QA","KW","BH","OM","YE","IQ","IR","SY","JO","LB","IL","PS","TR","CY","EG","LY","TN","DZ","MA"];
    if(meCountries.indexOf(code)>=0)return"Middle East";
  }
  if(REGION_MAP["Africa"].some(function(x){return r.indexOf(x)>=0}))return"Africa";
  if(REGION_MAP["Americas"].some(function(x){return r.indexOf(x)>=0}))return"Americas";
  if(REGION_MAP["Asia"].some(function(x){return r.indexOf(x)>=0}))return"Asia";
  return"Other";
}

function isCrisisCountry(code){
  var c=C[code];if(!c)return false;
  return c.mp>4||c.dem<3||c.fh<20;
}

// ═══ Profile Grid (193 countries) ═══
function showProfileGrid(){
  // Veri henüz yüklenmemişse bekle ve yeniden dene
  if(typeof WORLD!=="undefined"&&!WORLD.loaded){
    console.log("[PROFILES] Waiting for world data...");
    setTimeout(function(){showProfileGrid()},500);return;
  }
  var pv=document.getElementById("profilesView");
  var codes=Object.keys(C);

  // Search + filter bar
  var h='<div class="prof-search-bar">';
  h+='<input type="text" id="profSearch" class="prof-search-input" placeholder="'+(lang==="tr"?"Ülke ara... (193 ülke)":"Search countries... (193 countries)")+'" autocomplete="off">';
  h+='<div class="prof-filter-row">';
  var filters=[
    ["all",lang==="tr"?"Tümü":"All"],
    ["g20","G20"],
    ["nuclear",lang==="tr"?"Nükleer":"Nuclear"],
    ["crisis",lang==="tr"?"Kriz":"Crisis"],
    ["nato","NATO"],
    ["brics","BRICS"],
    ["eu","EU"]
  ];
  filters.forEach(function(f){
    h+='<button class="prof-filter-btn'+(f[0]==="all"?" active":"")+'" data-filter="'+f[0]+'">'+f[1]+'</button>';
  });
  h+='</div></div>';

  // G20 section
  h+='<div id="profResults">';
  h+=buildProfileSections(codes,"all","");
  h+='</div>';

  pv.innerHTML=h;
  pv.style.display="block";

  // Wire search
  var searchInput=document.getElementById("profSearch");
  if(searchInput){
    searchInput.addEventListener("input",function(){
      var q=this.value.toLowerCase().trim();
      var activeFilter=pv.querySelector(".prof-filter-btn.active");
      var filt=activeFilter?activeFilter.getAttribute("data-filter"):"all";
      document.getElementById("profResults").innerHTML=buildProfileSections(codes,filt,q);
    });
  }
  // Wire filters
  pv.querySelectorAll(".prof-filter-btn").forEach(function(btn){
    btn.addEventListener("click",function(){
      pv.querySelectorAll(".prof-filter-btn").forEach(function(b){b.classList.remove("active")});
      btn.classList.add("active");
      var filt=btn.getAttribute("data-filter");
      var q=(document.getElementById("profSearch")||{}).value||"";
      document.getElementById("profResults").innerHTML=buildProfileSections(codes,filt,q.toLowerCase().trim());
    });
  });
}

function buildProfileSections(codes,filter,query){
  var filtered=codes.filter(function(code){
    var c=C[code];if(!c)return false;
    // Query filter
    if(query){
      var name=(c.n||"").toLowerCase();
      var cLow=code.toLowerCase();
      var region=(c.region||c.r||"").toLowerCase();
      if(name.indexOf(query)<0&&cLow.indexOf(query)<0&&region.indexOf(query)<0)return false;
    }
    // Group filter
    if(filter==="g20")return WORLD.G20_CODES.indexOf(code)>=0;
    if(filter==="nuclear")return PROFILE_GROUPS.NUCLEAR.indexOf(code)>=0;
    if(filter==="crisis")return isCrisisCountry(code);
    if(filter==="nato")return PROFILE_GROUPS.NATO.indexOf(code)>=0;
    if(filter==="brics")return PROFILE_GROUPS.BRICS.indexOf(code)>=0;
    if(filter==="eu")return PROFILE_GROUPS.EU.indexOf(code)>=0;

    // ═══ GLOBAL FILTER SYNC ═══
    var gf = window.currentGlobalFilter || "all";
    if (gf !== "all") {
      var sub = c.subregion || "";
      var reg = c.region || "";
      if (gf === "NGO") { if(!c.isNSA) return false; }
      else if (gf === "Europe") { if(reg !== "Europe") return false; }
      else if (gf === "Asia") { if(reg !== "Asia" || sub === "Western Asia") return false; }
      else if (gf === "Middle East") { if(reg !== "Asia" || sub !== "Western Asia") return false; }
      else if (gf === "N. America") { if(reg !== "Americas" || (sub.indexOf("North")<0 && sub.indexOf("Central")<0 && sub.indexOf("Caribbean")<0)) return false; }
      else if (gf === "S. America") { if(reg !== "Americas" || sub.indexOf("South")<0) return false; }
      else if (gf === "Africa") { if(reg !== "Africa") return false; }
      else if (gf === "Oceania") { if(reg !== "Oceania") return false; }
    }
    return true;

  });

  if(filtered.length===0)return'<div style="padding:20px;text-align:center;color:var(--t3);font-family:var(--font-mono);font-size:.75rem">'+(lang==="tr"?"Sonuç bulunamadı":"No results found")+'</div>';

  // Sort by GDP descending
  filtered.sort(function(a,b){return(C[b].gdp||0)-(C[a].gdp||0)});

  var h='';
  // G20 section first (only in "all" filter)
  if(filter==="all"&&!query){
    var g20=filtered.filter(function(c){return WORLD.G20_CODES.indexOf(c)>=0});
    var nonG20=filtered.filter(function(c){return WORLD.G20_CODES.indexOf(c)<0});
    h+='<div class="prof-region-header"><span class="prof-region-icon">★</span> G20 <span class="prof-region-count">'+g20.length+'</span></div>';
    h+='<div class="prof-grid-select">';
    g20.forEach(function(code){h+=renderCountryCard(code)});
    h+='</div>';
    // Group by region
    var regions=["Europe","Asia","Americas","Middle East","Africa","Oceania","Other"];
    regions.forEach(function(reg){
      var regCodes=nonG20.filter(function(c){return getCountryRegionGroup(c)===reg});
      if(regCodes.length===0)return;
      var regionLabels={
        "Europe":lang==="tr"?"Avrupa":"Europe",
        "Asia":lang==="tr"?"Asya":"Asia",
        "Americas":lang==="tr"?"Amerikalar":"Americas",
        "Middle East":lang==="tr"?"Orta Doğu":"Middle East",
        "Africa":lang==="tr"?"Afrika":"Africa",
        "Oceania":lang==="tr"?"Okyanusya":"Oceania",
        "Other":lang==="tr"?"Diğer":"Other"
      };
      h+='<div class="prof-region-header"><span class="prof-region-icon">◆</span> '+regionLabels[reg]+' <span class="prof-region-count">'+regCodes.length+'</span></div>';
      h+='<div class="prof-grid-select">';
      regCodes.forEach(function(code){h+=renderCountryCard(code)});
      h+='</div>';
    });
  }else{
    h+='<div class="prof-region-header"><span class="prof-region-count">'+filtered.length+(lang==="tr"?" ülke":" countries")+'</span></div>';
    h+='<div class="prof-grid-select">';
    filtered.forEach(function(code){h+=renderCountryCard(code)});
    h+='</div>';
  }
  return h;
}

function renderCountryCard(code){
  var c=C[code];if(!c)return'';
  var fc=(typeof _flagMap!=="undefined"&&_flagMap[code])?_flagMap[code]:code.toLowerCase();
  var imgSrc = 'https://flagcdn.com/w40/'+fc+'.png';
  if(c.isNSA) {
    imgSrc = 'assets/' + code.toLowerCase() + '.png'; 
  }
  var isG20=WORLD.G20_CODES.indexOf(code)>=0;
  var crisis=isCrisisCountry(code);
  var h='<div class="prof-grid-btn'+(crisis?' prof-crisis':'')+(isG20?' prof-g20':'')+(c.isNSA?' prof-nsa':'')+'" data-profile-code="'+code+'">';
  h+='<img src="'+imgSrc+'" style="height:24px;border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,.3)" '+ (c.isNSA ?'':'onerror="this.style.display=\'none\'"') +'>';
  h+='<span class="pgn">'+(c.n||cN(code))+'</span>';
  h+='<span class="prof-card-gdp">' + (c.isNSA && c.type==='corp' ? 'VAL: ~$10T' : '$'+(c.gdp||0)+'B') + '</span>';

  // Badges
  var badges='';
  if(isG20)badges+='<span class="prof-badge prof-badge-g20">G20</span>';
  if(c.nuc)badges+='<span class="prof-badge prof-badge-nuc">☢</span>';
  if(crisis)badges+='<span class="prof-badge prof-badge-crisis">⚠</span>';
  if(badges)h+='<div class="prof-badges">'+badges+'</div>';
  h+='</div>';
  return h;
}

// ═══ Detailed Profile (193 countries) ═══
function showProfile(code){
  // Veri henüz yüklenmemişse bekle ve yeniden dene
  if(typeof WORLD!=="undefined"&&!WORLD.loaded){
    console.log("[PROFILES] Waiting for world data...");
    setTimeout(function(){showProfile(code)},500);return;
  }
  try{
  var D=getD(),c=D[code]||C[code];
  if(!c){ 
    console.warn("[PROFILES] No base data for", code);
    // Fallback if country is not in C yet but is in world data
    c = { n: cN(code), f: code.toLowerCase(), r: "N/A" };
  }
  
  // High-priority Qualitative Data
  var hasProfile=typeof profiles!=="undefined"&&profiles[code];
  var hasWorldProfile=typeof PROFILES_WORLD!=="undefined"&&PROFILES_WORLD[code];
  var p=hasProfile?profiles[code]:(hasWorldProfile?PROFILES_WORLD[code]:{});
  
  // Behavioral Fallback (if not in C[code].beh)
  if(!c.beh && typeof B!=="undefined" && B[code]) c.beh = B[code];

  // CIA World Factbook data
  var fb=(typeof factbook!=="undefined"&&factbook[code])?factbook[code]:{};
  var fbt=(typeof factbookTR!=="undefined"&&factbookTR[code])?factbookTR[code]:{};

  var ptr={};try{ptr=(typeof profilesTR!=="undefined"&&profilesTR[code])?profilesTR[code]:{}}catch(e){ptr={}}
function gt(trVal,enVal){return(lang==="tr"&&trVal)?trVal:enVal}
  var fc=(typeof _flagMap!=="undefined"&&_flagMap[code])?_flagMap[code]:code.toLowerCase();
  var isG20=WORLD.G20_CODES.indexOf(code)>=0;
  var crisis=isCrisisCountry(code);
  var pv=document.getElementById("profilesView");

  var h='<button class="prof-back" data-action="profileBack">'+(lang==="tr"?"< Tüm ülkelere dön":"< Back to all countries")+'</button>';
  h+='<div class="prof-full">';

  // Header
  h+='<div class="prof-full-header">';
  var detailLogo = c.isNSA ? 'assets/'+code.toLowerCase()+'.png' : 'https://flagcdn.com/w80/'+fc+'.png';
  h+='<img src="'+detailLogo+'" style="height:48px;border-radius:3px;box-shadow:0 2px 8px rgba(0,0,0,.4);margin-right:8px" onerror="this.style.display=\'none\'">';
  h+='<div><div class="prof-full-name">'+(c.n||cN(code))+'</div>';

  h+='<div class="prof-full-meta">'+(p.system||"")+(p.leader?" | "+p.leader:"")+'</div>';
  if(c.capital||p.capital)h+='<div class="prof-full-meta">'+(lang==="tr"?"Başkent: ":"Capital: ")+(c.capital||p.capital||"N/A")+' | '+(c.region||c.r||"")+'</div>';
  // Status badges
  var sb='';
  if(isG20)sb+='<span class="prof-badge prof-badge-g20">G20</span>';
  if(c.nuc)sb+='<span class="prof-badge prof-badge-nuc">☢ '+(lang==="tr"?"Nükleer":"Nuclear")+'</span>';
  if(crisis)sb+='<span class="prof-badge prof-badge-crisis">⚠ '+(lang==="tr"?"Kriz":"Crisis")+'</span>';
  if(c.al&&c.al.length>0)c.al.forEach(function(a){sb+='<span class="prof-badge prof-badge-alliance">'+a+'</span>'});
  if(sb)h+='<div style="margin-top:6px">'+sb+'</div>';
  h+='</div></div>';

  // ─── Quantitative Overview ───
  var t=lang==="tr";
  h+='<div class="prof-section"><div class="prof-section-title">'+(t?"Nicel Genel Bakış":"Quantitative Overview")+'</div>';
  h+='<div class="prof-quant-grid">';
  
  if (c.isNSA) {
    if (c.type === "corp") {
      h+=profQuant("AUM",fmtVal(c.gdp,'$','T'),"var(--gold)");
      h+=profQuant(t?"Çalışan Sayısı":"Global Employees",fmtVal(c.pop,'','K'));
      h+=profQuant(t?"Lobi & Güvenlik":"Lobbying & Security", (c.mil?'$'+c.mil+'B':'N/A'),"var(--mil)");
      h+=profQuant(t?"Pazar Etkisi":"Market Influence",fmtVal(c.to,'','%'));
      h+=profQuant("ESG Score",fmtVal(c.cpi,'','/100'),"var(--pos)");
      h+=profQuant(t?"Yönetim Biçimi":"Governance", "Board/CEO", null, ".75rem");
    } else if (c.type === "paramilitary") {
      h+=profQuant(t?"Operasyonel Bütçe":"Op. Budget",fmtVal(c.gdp,'$','B'),"var(--econ)");
      h+=profQuant(t?"Aktif Güç":"Active Force",fmtVal(c.pop,'','K'));
      h+=profQuant(t?"Taktik Kapasite":"Tactical Capacity",c.mil?c.mil+' / 10':"—","var(--mil)");
      h+=profQuant(t?"Bölgesel Erişim":"Regional Reach",fmtVal(c.to,'','%'));
      h+=profQuant(t?"Komuta Birliği":"Command Unity",fmtVal(c.dem,'','/10'),"var(--amber)");
    } else if (c.type === "igo") {
      h+=profQuant(t?"Yıllık Bütçe":"Annual Budget",fmtVal(c.gdp,'$','B'),"var(--econ)");
      h+=profQuant(t?"Personel/Barış G.":"Staff/Peacekeepers",fmtVal(c.pop,'','K'));
      h+=profQuant(t?"Barış Koruma Büt.":"PKO Budget",c.mil?'$'+c.mil+'B':"—","var(--mil)");
      h+=profQuant(t?"Üye Uyumu":"Member Alignment",fmtVal(c.to,'','%'));
      h+=profQuant(t?"Kurul Konsensüsü":"Assy. Consensus",fmtVal(c.dem,'','/10'),"var(--pos)");
    }
  } else {
    h+=profQuant("GDP",fmtVal(c.gdp,'$','B'),"var(--econ)");
    h+=profQuant(t?"Nüfus":"Population",fmtVal(c.pop,'','M'));
    h+=profQuant(t?"Askeri":"Military",c.mil?'$'+c.mil+'B ('+c.mp+'%)':"—","var(--mil)");
    h+=profQuant(t?"Ticaret Aç.":"Trade Open.",fmtVal(c.to,'','%'));
    h+=profQuant("GDP/"+(t?"kişi":"capita"),fmtVal(c.gdpPC,'$',''));
    h+=profQuant(t?"Büyüme":"Growth",fmtVal(c.gdpGrowth,'','%'));
    h+=profQuant("CPI",fmtVal(c.cpi,'','/100'));
    h+=profQuant(t?"Demokrasi":"Democracy",fmtVal(c.dem,'','/10'));
    h+=profQuant(t?"Özgürlük":"Freedom",fmtVal(c.fh,'','/100'));
  }
  h+=profQuant(t?"Bölge":"Region",(c.region||c.r||"N/A"),null,".72rem");
  h+='</div></div>';


  // ─── Governance Indicators ───
  h+='<div class="prof-section"><div class="prof-section-title">'+(t?"Yönetişim Göstergeleri":"Governance Indicators")+'</div>';
  h+='<div class="prof-quant-grid">';
  
  if (c.isNSA) {
    var unityScore = c.dem || 0; var unityColor = unityScore >= 70 ? "var(--pos)" : unityScore >= 40 ? "var(--amber)" : "var(--neg)";
    var autScore = c.fh || 0; var autColor = autScore >= 60 ? "var(--pos)" : autScore >= 30 ? "var(--amber)" : "var(--neg)";
    
    if (c.type === "corp") {
      h+=profQuant(t?"Yönetim Kurulu İstikrarı":"Board Stability", unityScore+'/100', unityColor);
      h+=profQuant(t?"Uyum Endeksi":"Compliance Index", (c.cpi||0)+'/100');
      h+=profQuant(t?"Siyasi Etki":"Political Leverage", autScore+'/100', autColor);
    } else if (c.type === "paramilitary") {
      h+=profQuant(t?"Komuta Birliği":"Command Unity", unityScore+'/100', unityColor);
      h+=profQuant(t?"Operasyonel Özerklik":"Op. Autonomy", autScore+'/100', autColor);
      h+=profQuant(t?"İstihbarat Gücü":"Intel Capability", (c.cpi||0)+'/100');
    } else {
       h+=profQuant(t?"Konsey Konsensüsü":"Council Consensus", unityScore+'/100', unityColor);
       h+=profQuant(t?"Diplomatik Ağırlık":"Diplomatic Weight", autScore+'/100', autColor);
    }
  } else {
    var demScore=c.dem||0;var demColor=demScore>=7?"var(--pos)":demScore>=4?"var(--amber)":"var(--neg)";
    h+=profQuant(t?"Demokrasi Endeksi":"Democracy Index",demScore+'/10',demColor);
    var cpiScore=c.cpi||0;var cpiColor=cpiScore>=60?"var(--pos)":cpiScore>=35?"var(--amber)":"var(--neg)";
    h+=profQuant(t?"Yolsuzluk Alg.":"Corruption Perc.",cpiScore+'/100',cpiColor);
    var fhScore=c.fh||0;var fhColor=fhScore>=60?"var(--pos)":fhScore>=30?"var(--amber)":"var(--neg)";
    h+=profQuant(t?"Özgürlük Evi":"Freedom House",fhScore+'/100',fhColor);
    var regType=demScore>=8?(t?"Tam Demokrasi":"Full Democracy"):demScore>=6?(t?"Kusurlu Demokrasi":"Flawed Democracy"):demScore>=4?(t?"Hibrit Rejim":"Hybrid Regime"):(t?"Otoriter":"Authoritarian");
    h+=profQuant(t?"Rejim Tipi":"Regime Type",regType,demColor,".7rem");
  }
  h+='</div></div>';


  // ─── Economic Depth ───
  h+='<div class="prof-section"><div class="prof-section-title">'+(t?"Ekonomik Derinlik":"Economic Depth")+'</div>';
  h+='<div class="prof-quant-grid">';
  if (c.isNSA) {
    if (c.type === "corp") {
      h+=profQuant(t?"Toplam Varlık":"Total Assets",fmtVal(c.gdp,'$','T'), "var(--gold)");
      h+=profQuant(t?"Gelir Artışı":"Revenue Growth", "+4.2%", "var(--pos)");
      h+=profQuant(t?"Pazar Dominansı":"Market Dominance", "82%", "var(--pos)");
      h+=profQuant(t?"Sermaye Likiditesi":"Liquidity", "HIGH");
    } else if (c.type === "paramilitary") {
      h+=profQuant(t?"Bütçe Likiditesi":"Budget Liquidity", fmtVal(c.gdp,'$','B'), "var(--econ)");
      h+=profQuant(t?"Kayıt Dışı Entegrasyon":"Grey Market Integ.", "85%", "var(--amber)");
      h+=profQuant(t?"Harcama Verimliliği":"Spending Efficiency", "HIGH");
    } else {
      h+=profQuant(t?"Üye Katkıları":"Member Contrib.", fmtVal(c.gdp,'$','B'), "var(--econ)");
      h+=profQuant(t?"Fon Kullanımı":"Fund Utilization", "92%", "var(--pos)");
    }
  } else {
    h+=profQuant("GDP (Nominal)",fmtVal(c.gdp,'$','B'),"var(--econ)");
    h+=profQuant("GDP/"+(t?"kişi":"capita"),fmtVal(c.gdpPC,'$',''),"var(--econ)");
    h+=profQuant(t?"Büyüme Oranı":"Growth Rate",fmtVal(c.gdpGrowth,'','%'),c.gdpGrowth>0?"var(--pos)":"var(--neg)");
    h+=profQuant(t?"Ticaret Açıklığı":"Trade Openness",fmtVal(c.to,'','%'));
    h+=profQuant(t?"Askeri Harcama":"Mil. Spending",c.mil?'$'+c.mil+'B ('+c.mp+'% GDP)':"—","var(--mil)");
    if(c.incomeLevel)h+=profQuant(t?"Gelir Grubu":"Income Level",c.incomeLevel,null,".7rem");
  }
  h+='</div></div>';


  // ─── Overview (if has profile data) ───
  if(p.overview){
    h+='<div class="prof-section"><div class="prof-section-title">'+(lang==="tr"?"Genel Bakış":"Overview")+'</div>';
    h+='<div class="prof-text">'+gt(ptr.overview,p.overview)+'</div></div>';
  }
  var fpText=p.fpOrientation||p.foreignPolicy;
  if(fpText){
    h+='<div class="prof-section"><div class="prof-section-title">'+(lang==="tr"?"Dış Politika Yönelimi":"Foreign Policy Orientation")+'</div>';
    h+='<div class="prof-text">'+gt(ptr.fpOrientation,fpText)+'</div></div>';
  }
  var issueData=p.issues||p.currentIssues;
  if(issueData){
    h+='<div class="prof-section"><div class="prof-section-title">'+(lang==="tr"?"Güncel Sorunlar":"Current Issues")+'</div>';
    h+='<ul class="prof-issues">';
    var issueList=(lang==="tr"&&ptr.issues)?ptr.issues:issueData;
    issueList.forEach(function(issue){h+='<li>'+issue+'</li>'});
    h+='</ul></div>';
  }
  var relText=p.keyRelations||p.keyRelationships;
  if(relText){
    h+='<div class="prof-section"><div class="prof-section-title">'+(lang==="tr"?"Temel İlişkiler":"Key Relationships")+'</div>';
    h+='<div class="prof-text">'+gt(ptr.keyRelations,relText)+'</div></div>';
  }
  var econText=p.econNote||p.economicProfile;
  if(econText){
    h+='<div class="prof-section"><div class="prof-section-title">'+(lang==="tr"?"Ekonomik Profil":"Economic Profile")+'</div>';
    h+='<div class="prof-text">'+gt(ptr.econNote,econText)+'</div></div>';
  }
  // ─── PROF Enhanced Render (strat-card) ───
  // Note: This manual legacy fallback block is now removed.
  // The injection engine in data/profiles-world.js now populates
  // DISCOURSE, B, and behReasons globally, meaning the native
  // renderDiscourseProfile() and behGrid() functions will naturally
  // render the immersive US-style profiles for all 193 countries.

  // ─── Alliances & Networks ───
  var alliances=c.al||[];
  if(alliances.length>0||PROFILE_GROUPS.NATO.indexOf(code)>=0||PROFILE_GROUPS.BRICS.indexOf(code)>=0||PROFILE_GROUPS.EU.indexOf(code)>=0){
    h+='<div class="prof-section"><div class="prof-section-title">'+(lang==="tr"?"İttifaklar ve Ağlar":"Alliances & Networks")+'</div>';
    h+='<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">';
    if(alliances.length>0)alliances.forEach(function(a){h+='<span class="prof-badge prof-badge-alliance">'+a+'</span>'});
    // Auto-detect memberships
    if(PROFILE_GROUPS.NATO.indexOf(code)>=0&&alliances.indexOf("NATO")<0)h+='<span class="prof-badge prof-badge-alliance">NATO</span>';
    if(PROFILE_GROUPS.EU.indexOf(code)>=0&&alliances.indexOf("EU")<0)h+='<span class="prof-badge prof-badge-alliance">EU</span>';
    if(PROFILE_GROUPS.BRICS.indexOf(code)>=0&&alliances.indexOf("BRICS")<0)h+='<span class="prof-badge prof-badge-alliance">BRICS</span>';
    h+='</div>';
    // UN alignment
    if(c.usc!==undefined)h+='<div style="font-size:.72rem;color:var(--t3);font-family:var(--font-mono)">'+(lang==="tr"?"ABD ile BM Oy Uyumu: ":"UN Voting Alignment w/ US: ")+(c.cs!==undefined?(c.cs*100).toFixed(0)+"%":"N/A")+'</div>';
    h+='</div>';
  }

  // ─── Geographic Info ───
  h+='<div class="prof-section"><div class="prof-section-title">'+(lang==="tr"?"Coğrafi Bilgi":"Geographic Info")+'</div>';
  h+='<div class="prof-quant-grid">';
  h+=profQuant(lang==="tr"?"Enlem/Boylam":"Lat/Lng",(c.lat||0).toFixed(1)+"° / "+(c.lng||0).toFixed(1)+"°");
  if(c.capital||fb.capital)h+=profQuant(lang==="tr"?"Başkent":"Capital",c.capital||fb.capital||"N/A");
  if(fb.area||c.area)h+=profQuant(lang==="tr"?"Yüzölçümü":"Area",(fb.area||c.area||"N/A"));
  if(c.landlocked)h+=profQuant(lang==="tr"?"Kara ile Çevrili":"Landlocked","✓","var(--amber)");
  if(c.region||c.r)h+=profQuant(lang==="tr"?"Bölge":"Region",c.region||c.r||"");
  if(c.subregion)h+=profQuant(lang==="tr"?"Alt Bölge":"Subregion",c.subregion,null,".7rem");
  h+='</div></div>';

  // ─── Hofstede Cultural Dimensions ───
  if(c.hof){
    h+='<div class="prof-section"><div class="prof-section-title">'+(lang==="tr"?"Hofstede Kültürel Boyutlar":"Hofstede Cultural Dimensions")+'</div>';
    h+='<div class="prof-quant-grid">';
    var hofLabels={pdi:lang==="tr"?"Güç Mesafesi":"Power Distance",idv:lang==="tr"?"Bireycilik":"Individualism",mas:lang==="tr"?"Maskülenite":"Masculinity",uai:lang==="tr"?"Belirsizlik K.":"Uncertainty Av.",lto:lang==="tr"?"Uzun Vadeli Y.":"Long-term Orient.",ind:lang==="tr"?"Hoşgörü":"Indulgence"};
    Object.keys(hofLabels).forEach(function(k){
      var val=c.hof[k];if(val===undefined)return;// skip missing dimensions
      h+=profQuantBar(hofLabels[k],val);
    });
    if(c._hofstedeSource)h+='<div style="font-size:.55rem;color:var(--t3);font-family:var(--font-mono);margin-top:4px">'+(c._hofstedeSource==="research"?(lang==="tr"?"Kaynak: Hofstede araştırma verileri":"Source: Hofstede research data"):(lang==="tr"?"Kaynak: Bölgesel tahmin":"Source: Regional estimate"))+'</div>';
    h+='</div></div>';
  }

  // ─── CIA World Factbook (G20 detailed) ───
  if(fb.capital){
    h+='<div class="prof-section"><div class="prof-section-title">CIA World Factbook</div>';
    h+='<div class="prof-quant-grid">';
    h+=profQuant(lang==="tr"?"Kıyı Şeridi":"Coastline",fb.coastline||"N/A");
    h+=profQuant(lang==="tr"?"Nüfus Artışı":"Pop. Growth",fb.popGrowth||"N/A");
    h+=profQuant(lang==="tr"?"Doğum Oranı":"Birth Rate",fb.birthRate||"N/A");
    h+=profQuant(lang==="tr"?"Yaşam Bek.":"Life Expect.",fb.lifeExp||"N/A");
    h+=profQuant(lang==="tr"?"Kent Nüfusu":"Urban Pop.",fb.urbanPop||"N/A");
    h+=profQuant(lang==="tr"?"Yönetim":"Gov. Type",gt(fbt.govType,fb.govType||"N/A"),null,".68rem");
    h+='</div>';
    h+='<div style="margin-top:12px">';
    var fbPairs=[[lang==="tr"?"İklim":"Climate",gt(fbt.climate,fb.climate)],[lang==="tr"?"Arazi":"Terrain",gt(fbt.terrain,fb.terrain)],[lang==="tr"?"Doğal Kaynaklar":"Natural Resources",gt(fbt.natResources,fb.natResources)],[lang==="tr"?"Etnik Gruplar":"Ethnic Groups",gt(fbt.ethnicGroups,fb.ethnicGroups)],[lang==="tr"?"Diller":"Languages",gt(fbt.languages,fb.languages)],[lang==="tr"?"Dinler":"Religions",gt(fbt.religions,fb.religions)],[lang==="tr"?"Askeri Kollar":"Military Branches",gt(fbt.milBranches,fb.milBranches)],[lang==="tr"?"Anlaşmazlıklar":"Disputes",gt(fbt.disputes,fb.disputes)]];
    fbPairs.forEach(function(f){if(f[1]){h+='<div style="margin-bottom:8px"><span style="font-family:var(--font-mono);font-size:.6rem;text-transform:uppercase;letter-spacing:.08em;color:var(--amber)">'+f[0]+'</span><div style="font-size:.75rem;color:var(--t2);line-height:1.6;margin-top:2px">'+f[1]+'</div></div>'}});
    h+='</div>';
    h+='<div style="font-size:.6rem;color:var(--t3);font-family:var(--font-mono)">Source: CIA World Factbook (Public Domain)</div>';
    h+='</div>';
  }

  // Critical Mineral Profile
  if(typeof mineralProfileHTML==="function")h+=mineralProfileHTML(code);
  // Diplomatic Discourse Profile
  if(typeof renderDiscourseProfile==="function")h+=renderDiscourseProfile(code);
  // Leader comparison
  if(typeof renderLeaderComparison==="function")h+=renderLeaderComparison(code);

  // ─── Behavioral Profile ───
  if(c.beh){
    h+='<div class="prof-section"><div class="prof-section-title">'+(lang==="tr"?"Davranışsal Profil":"Behavioral Profile")+'</div>';
    if(typeof behGrid==="function")h+=behGrid(code);
    h+='</div>';
  }

  // ─── Data source note ───
  h+='<div style="margin-top:16px;padding:8px;border-top:1px solid var(--border);font-size:.6rem;color:var(--t3);font-family:var(--font-mono)">';
  h+=(lang==="tr"?"Veri Kaynağı: ":"Data Source: ")+(c._source||"mixed")+" | ";
  h+=(isG20?(lang==="tr"?"G20 Detaylı Profil":"G20 Detailed Profile"):(lang==="tr"?"API Tabanlı Profil":"API-based Profile"));
  h+='</div>';

  h+='</div>'; // .prof-full
  pv.innerHTML=h;
  pv.scrollTo({top:0,behavior:"smooth"});
  window.scrollTo({top:pv.offsetTop-60,behavior:"smooth"});
  }catch(err){
    console.error("showProfile error:",err);
    document.getElementById("profilesView").innerHTML='<div style="padding:20px;color:var(--neg)">Error: '+err.message+'</div>';
  }
}

function syncProfilesGrid(region) {
  var pv=document.getElementById("profilesView");
  if(!pv) return;
  var isGrid = pv.querySelector(".prof-grid-select") || pv.querySelector(".prof-filter-bar");
  if(isGrid) {
    if(typeof showProfileGrid === "function") {
       showProfileGrid();
    }
  }
}
window.syncProfilesGrid = syncProfilesGrid;


// ═══ Helpers ═══
function profQuant(label,value,color,fontSize){
  return'<div class="prof-quant"><div class="prof-quant-label">'+label+'</div><div class="prof-quant-val" style="'+(color?'color:'+color+';':'')+(fontSize?'font-size:'+fontSize:'')+'">'+value+'</div></div>';
}

function profQuantBar(label,value){
  var color=value>66?"var(--pos)":value>33?"var(--amber)":"var(--neg)";
  return'<div class="prof-quant"><div class="prof-quant-label">'+label+'</div><div class="prof-quant-val" style="font-size:.8rem">'+value+'<span style="color:var(--t3);font-size:.65rem">/100</span></div>'+
    '<div style="width:100%;height:3px;background:var(--border);border-radius:2px;margin-top:2px"><div style="width:'+value+'%;height:100%;background:'+color+';border-radius:2px"></div></div></div>';
}

// Event delegation for profile cards — wire up via click delegation
document.addEventListener("click",function(e){
  var btn=e.target.closest("[data-profile-code]");
  if(btn){showProfile(btn.getAttribute("data-profile-code"));return}
  var back=e.target.closest("[data-action='profileBack']");
  if(back){showProfileGrid();return}
});

// Alias — ui.js showProfileGrid çağırıyor
if (typeof showProfileGrid === 'undefined') {
  window.showProfileGrid = typeof showProfiles === 'function' ? showProfiles : function() {};
}
