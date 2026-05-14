// AXIS — Bilateral analysis rendering (7-layer with GDELT)
// Depends on: core.js, ui.js, ai.js, animations.js, data/gdelt.js, details.js, network.js, gametheory.js

// ═══ GDELT helpers ═══
function gdeltTrendLabel(dir){return dir==="improving"?T("gdeltImproving"):dir==="deteriorating"?T("gdeltDeteriorating"):T("gdeltStable")}
function gdeltTrendColor(dir){return dir==="improving"?"var(--pos)":dir==="deteriorating"?"var(--neg)":"var(--t3)"}
function toneColor(v){return v>=0?"var(--pos)":"var(--neg)"}

function gdeltSparkline(timeline){
  if(!timeline||timeline.length<2)return'<div class="gdelt-sparkline"><svg></svg></div>';
  const w=300,h=60,pad=2,vals=timeline.map(d=>d.value);
  const mn=Math.min(...vals,-2),mx=Math.max(...vals,2),range=mx-mn||1;
  const xStep=(w-pad*2)/(vals.length-1),yScale=(h-pad*2)/range,zeroY=pad+mx*yScale;
  const pts=vals.map((v,i)=>(pad+i*xStep).toFixed(1)+","+(pad+(mx-v)*yScale).toFixed(1));
  return'<div class="gdelt-sparkline"><svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none">'+
    '<line class="zero-line" x1="'+pad+'" y1="'+zeroY.toFixed(1)+'" x2="'+(w-pad)+'" y2="'+zeroY.toFixed(1)+'"/>'+
    '<polygon class="tone-area-pos" points="'+pts.join(" ")+' '+(w-pad)+','+zeroY+' '+pad+','+zeroY+'"/>'+
    '<polyline class="tone-line" points="'+pts.join(" ")+'"/></svg></div>';
}

function gdeltNewsPanel(articles){
  if(!articles||articles.length===0)return'';
  let h='<div class="gdelt-news"><div class="gdelt-news-title">\u{1F4E1} '+T("gdeltNews")+'</div>';
  articles.forEach(a=>{
    h+='<div class="gdelt-news-item"><span class="gdelt-news-date">'+(a.date?(a.date.substring(0,10)):"")+'</span><span class="gdelt-news-domain">'+(a.domain||"")+'</span>';
    h+=a.url?'<a class="gdelt-news-link" href="'+a.url+'" target="_blank" rel="noopener">'+((a.title||"").substring(0,90))+'</a>':'<span class="gdelt-news-link">'+(a.title||"")+'</span>';
    h+='</div>';
  });
  return h+'</div>';
}

function gdeltCardLoading(){return pCard("\u{1F4E1}",T("pG"),"12%","--cyan","-",[[T("gdeltToneAvg"),T("gdeltLoading")],[T("gdeltTone7d"),"..."],[T("gdeltArticles"),"..."],[T("gdeltTrend"),"..."]],"gdelt")}

function gdeltCard(media){
  if(!media||!media.fetched)return pCard("\u{1F4E1}",T("pG"),"12%","--cyan","\u2014",[[T("gdeltToneAvg"),T("gdeltUnavailable")]],"gdelt");
  const ts=media.avgTone>=0?"+":"",t7s=media.recentTone>=0?"+":"";
  return pCard("\u{1F4E1}",T("pG"),"12%","--cyan",media.score,[
    [T("gdeltToneAvg"),'<span style="color:'+toneColor(media.avgTone)+'">'+ts+media.avgTone+'</span>'],
    [T("gdeltTone7d"),'<span style="color:'+toneColor(media.recentTone)+'">'+t7s+media.recentTone+'</span>'],
    [T("gdeltArticles"),media.totalArticles.toLocaleString()],
    [T("gdeltTrend"),'<span style="color:'+gdeltTrendColor(media.trendDirection)+'">'+gdeltTrendLabel(media.trendDirection)+'</span>']
  ],"gdelt");
}

// ═══ Template helpers ═══
function headerTemplate(cA,cB,badgeText,badgeColor,extra){
  return'<div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;flex-wrap:wrap">'+
    '<span style="display:inline-flex;align-items:center;gap:6px">'+flagImg(cA,24)+'<span style="font-size:1.2rem;font-weight:600;font-family:var(--font-mono)">'+cN(cA)+'</span></span>'+
    '<span style="font-family:var(--font-mono);font-size:.65rem;color:'+badgeColor+';padding:3px 10px;border:1px solid '+badgeColor+';border-radius:2px;letter-spacing:.08em">'+badgeText+'</span>'+
    '<span style="display:inline-flex;align-items:center;gap:6px">'+flagImg(cB,24)+'<span style="font-size:1.2rem;font-weight:600;font-family:var(--font-mono)">'+cN(cB)+'</span></span>'+
    (extra||'')+'</div>';
}

function compositeTemplate(r,v,sd,warn){
  var sdHtml=sd?'<span id="compStdDev" style="font-size:1.5rem;opacity:0.6;font-weight:400;margin-left:8px">\u00B1 '+sd+'</span>':"";
  var twHtml=typeof getTheoryWarning==="function"?getTheoryWarning():"";
  return'<div class="comp" id="compBlock"><div class="comp-label">'+T("cl")+' <span class="detail-badge" style="background:var(--amber-dim);color:var(--amber);margin-left:8px">'+(lang==="tr"?"TAHMİN MODELİ":"ESTIMATION MODEL")+'</span></div><div class="comp-sub">'+T("cs")+'</div>'+
    '<div class="comp-row"><div class="comp-num" style="color:'+v.c+'"><span id="compNum">'+r.composite+'</span>'+sdHtml+'</div><div class="comp-max">/ 100</div>'+
    '<div class="comp-verd" id="compVerd" style="background:'+v.c+'22;color:'+v.c+'">'+v.t+'</div></div>'+
    '<div style="font-size:0.75rem;color:var(--t3);margin:12px 0 8px;font-family:var(--font-mono);line-height:1.4;border-left:2px solid var(--amber);padding-left:12px;opacity:0.8"><i>'+twHtml+'</i></div>'+
    (warn||"")+
    '<div class="comp-bar"><div class="comp-fill" id="compFill" style="width:'+r.composite+'%;background:linear-gradient(90deg,'+v.c+','+v.c+'88)"></div></div>'+
    '<div id="perceptionWarnSlot"></div></div>';
}

function layerCardsTemplate(cA,cB,r){
  const D=getD(),a=D[cA],b=D[cB];
  
  // ═══ ADAPTIVE LABELS & METRICS ═══
  const t = lang === "tr";
  let milLabel = T("pM");
  let milIcon = "\u2694";
  let milClass = "--mil";
  
  if (a.isNSA || b.isNSA) {
    if (a.type === "corp" || b.type === "corp") {
      milLabel = t ? "F\u0130NANSAL ETK\u0130 \u0026 LOB\u0130" : "FINANCIAL \u0026 LOBBY POWER";
      milIcon = "\u{1F4B0}"; milClass = "--econ";
    } else if (a.type === "igo" || b.type === "igo") {
      milLabel = t ? "KURUMSAL N\u00DCFUZ" : "INSTITUTIONAL INFLUENCE";
      milIcon = "\u{1F3DB}"; milClass = "--lobby";
    } else {
      milLabel = t ? "PARAM\u0130L\u0130TER G\u00DC\u00C7" : "PARAMILITARY POWER";
    }
  }

  function getMilRows(codeA, codeB, res) {
    const pA = D[codeA], pB = D[codeB];
    const rows = [];
    
    // Header pairs
    rows.push([pA.c + " " + (t?"DOKTR\u0130N":"DOCTRINE"), pA.isNSA ? (pA.type.toUpperCase()) : "SOVEREIGN"]);
    rows.push([pB.c + " " + (t?"DOKTR\u0130N":"DOCTRINE"), pB.isNSA ? (pB.type.toUpperCase()) : "SOVEREIGN"]);
    
    // Core comparison
    if(pA.type === "corp" || pB.type === "corp") {
       rows.push([t?"VARLIK G\u00DC\u00C7 PAR\u0130TES\u0130":"ASSET POWER PARITY", (pA.gdp/pB.gdp*100).toFixed(0)+"%"]);
       if(pA.type === "corp") rows.push([pA.c + " AUM", "$10.5T (Est)"]);
       if(pB.type === "corp") rows.push([pB.c + " AUM", "$10.5T (Est)"]);
       rows.push([t?"ALADD\u0130N R\u0130SK KAPSAMI":"ALADDIN RISK COVERAGE", "95%"]);
    } else {
       rows.push([T("pb"), (res.military.milR * 100).toFixed(1) + "%"]);
       rows.push([t?"DEN\u0130Z G\u00DC\u00C7 PROJEKS\u0130YONU":"NAVAL POWER PROJECTION", (pA.mil>50?"BLUE WATER":"LITTORAL")]);
       rows.push([T("bn"), res.military.bn ? "\u2713" : "\u2717"]);
       rows.push([T("bu"), res.military.bu ? "\u2713" : "\u2717"]);
    }
    
    rows.push([pA.c + " VAL", pA.isNSA ? "~$"+pA.gdp+"B" : "$"+pA.mil+"B"]);
    rows.push([pB.c + " VAL", pB.isNSA ? "~$"+pB.gdp+"B" : "$"+pB.mil+"B"]);
    return rows;
  }
  
  // Unified Information Stream (Replaces Tabs)
  const allCards = [
    pCard(milIcon, milLabel, "16%", milClass, r.military.score, getMilRows(cA, cB, r), "military"),
    pCard("\u25C8",T("pE"),"20%","--econ",r.economic.score,[
      [a.c+" "+(t?"KR\u0130T\u0130K TEKNOLOJ\u0130":"CRITICAL TECHNOLOGY"), a.type==="corp" ? "DOMINANT" : (a.to>100?"HIGH":"MED")],
      [b.c+" "+(t?"KR\u0130T\u0130K TEKNOLOJ\u0130":"CRITICAL TECHNOLOGY"), b.type==="corp" ? "DOMINANT" : (b.to>100?"HIGH":"MED")],
      [a.c+" "+T("op"),a.to+"%"],[b.c+" "+T("op"),b.to+"%"],
      [a.c+" "+T("gd"),"$"+a.gdp+"B"],[b.c+" "+T("gd"),"$"+b.gdp+"B"]
    ],"economic"),
    pCard("\u25C9",T("pL"),"10%","--lobby",r.lobby.score,[
      [T("ac"),r.lobby.cpiA.toFixed(0)+"/100"],[T("ad"),r.lobby.demA.toFixed(2)+"/10"],
      [a.c+" "+T("cv"),a.cs.toFixed(2)],[b.c+" "+T("cv"),b.cs.toFixed(2)]
    ],"lobby"),
    pCard("\u25C6",T("pC"),"10%","--cult",r.cultural.score,[
      [T("hd"),""+r.cultural.hd],[T("sr"),r.cultural.sr?"\u2713":"\u2717"]
    ],"cultural"),
    pCard("\u2B22",T("pS"),"20%","--strat",r.strategic.score,[
      [T("uv"), a.isNSA||b.isNSA ? "N/A MAPPED" : ((r.strategic.unA||0)*100).toFixed(0)+"%"],
      [T("sa"),""+r.strategic.shA],[T("tl"),tT(r.strategic.ten)],[T("sf"),r.strategic.so.join(", ")]
    ],"strategic"),
    pCard("\u{1F9E0}",T("pB"),"12%","--beh",r.behavioral.score,[
      [T("behCompat"),r.behavioral.score+"/100"],
      [a.c+" "+behLabels[lang].predict,""+a.beh.predict+"/10"],[b.c+" "+behLabels[lang].predict,""+b.beh.predict+"/10"],
      [a.c+" "+behLabels[lang].risk,""+a.beh.risk+"/10"],[b.c+" "+behLabels[lang].risk,""+b.beh.risk+"/10"]
    ],"behavioral"),
    pCard("\u{1F4DC}",T("pH"),"API","--amber","\u2014",[
      [T("histSource"),"Wikipedia REST API"],[T("histQuery"),"Live Fetch"]
    ],"history")
  ];

  let panes = '<div class="params" id="paramsBlock">' + allCards.join("")
    +'<div id="gdeltCardSlot">'+gdeltCardLoading()+'</div>'
    +'</div>';

  return panes;
}





function interpretationTemplate(cA,cB,r){
  return'<div class="ai"><div class="ai-badge">'+T("ai")+'</div><div class="ai-txt">'+genInterp(cA,cB,r)+'</div>'+
    aiBtn(T("aiDeepBil"),"runAIBilateral()")+'<div id="aiBilContainer"></div></div>';
}

// ═══ Main render ═══
async function runBilateral(){
  if(!selA||!selB)return;
  const r6=computeAxis(selA,selB),v6=getVerdict(r6.composite);
  // Advanced engine
  if(typeof computeAxisAdvanced==="function"){try{var adv=computeAxisAdvanced(selA,selB);console.log("AXIS Advanced Engine:",adv)}catch(e){console.warn("Engine error:",e)}}
  const p=document.getElementById("results");

  let stdDev=0,mcWarning="";
  try{if(typeof monteCarloAxis==="function"){var mc=monteCarloAxis(selA,selB,200);stdDev=mc.stdDev;if(stdDev>=8)mcWarning='<div style="font-size:0.6rem;color:var(--warn);margin-bottom:8px;font-family:var(--font-mono);letter-spacing:.05em">\u26A0 '+(lang==="tr"?"Y\u00DCKSEK VER\u0130 G\u00DCR\u00DCLT\u00DCS\u00DC / BEL\u0130RS\u0130ZL\u0130K":"HIGH DATA NOISE / UNCERTAINTY")+'</div>'}}catch(e){}

  // Phase 1: sync render
  p.innerHTML=exportBar()+
    headerTemplate(selA,selB,T("bil").toLowerCase(),"var(--t3)",confBadge(selA,selB))+
    compositeTemplate(r6,v6,stdDev,mcWarning)+
    layerCardsTemplate(selA,selB,r6)+
    '<div id="gdeltSparkSlot"></div>'+
    (typeof renderMediaBiasWarning==="function"?renderMediaBiasWarning(selA,selB):"")+
    '<div id="tsBlock" style="margin-bottom:24px;border:1px dashed var(--border);padding:16px;text-align:center;border-radius:4px;transition:border-color .3s">'+
      '<button id="tsLoadBtn" onclick="loadAndRenderTimeSeries(\''+selA+'\',\''+selB+'\')" style="padding:10px 20px;background:var(--card-bg);color:var(--t1);border:1px solid var(--border);border-radius:3px;font-family:var(--font-mono);font-size:var(--text-base);cursor:pointer;transition:.2s;box-shadow:var(--glow)">'+(lang==='tr'?'Tarihsel Trendleri Y\u00FCkle \uD83D\uDCCA (Son 15 Y\u0131l)':'Load Historical Trends \uD83D\uDCCA (Last 15 Years)')+'</button>'+
      '<div id="tsContent" style="display:none;margin-top:20px;text-align:left"></div>'+
    '</div>'+
    interpretationTemplate(selA,selB,r6)+
    '<div id="gdeltNewsSlot"></div>'+
    '<div id="bilNetworkGraph" class="network-container network-mini" style="display:none"></div>'+
    '<div id="gtBilContainer"></div>'+
    (typeof renderDiscourseCard==="function"?renderDiscourseCard(selA,selB):"")+
    (typeof renderTimeline==="function"?renderTimeline(selA,selB):"")+
    '<div id="gkgSlot"></div>'+
    (typeof renderAdvancedAnalysis==="function"?renderAdvancedAnalysis(selA,selB):"")+
    (typeof renderLiveDataPanel==="function"?renderLiveDataPanel():"")+
    '<div class="profiles">'+profCard(selA)+profCard(selB)+'</div>'+srcPanel();

  p.classList.add("show"); // HUD: no scrollIntoView - layout is fixed
  if(typeof pushState==="function")pushState("bilateral/"+selA+"/"+selB);
  applyStagger(".p-card",0);
  setLastBilResult(r6,null);
  if(typeof findSharedAllianceMembers==="function"&&typeof renderNetworkGraph==="function"){
    const am=findSharedAllianceMembers(selA,selB);
    if(am){document.getElementById("bilNetworkGraph").style.display="block";renderNetworkGraph("bilNetworkGraph",am,computeAxis,true)}
  }
  if(typeof renderGameTheory==="function")renderGameTheory("gtBilContainer",selA,selB);
  const compNum=p.querySelector("#compNum");if(compNum)countUp(compNum,r6.composite,800);

  // Async GKG thematic
  if(typeof fetchGKGThemes==="function"){fetchGKGThemes(selA,selB).then(function(td){var gh=typeof renderGKGCard==="function"?renderGKGCard(selA,selB,td):"";var slot=document.getElementById("gkgSlot");if(slot&&gh)slot.innerHTML=gh}).catch(function(){})}

  // Phase 2: async GDELT
  try{
    const r7=await computeAxisWithGDELT(selA,selB);
    setLastBilResult(r7,r7.gdeltData||null);
    const slot=document.getElementById("gdeltCardSlot");if(slot)slot.innerHTML=gdeltCard(r7.media);
    const sparkSlot=document.getElementById("gdeltSparkSlot");if(sparkSlot&&r7.media&&r7.media.fetched)sparkSlot.innerHTML=gdeltSparkline(r7.media.toneTimeline);
    const newsSlot=document.getElementById("gdeltNewsSlot");if(newsSlot&&r7.media&&r7.media.fetched)newsSlot.innerHTML=gdeltNewsPanel(r7.media.recentArticles);
    if(r7.media&&r7.media.fetched){
      const perceptionDiff = r7.media.score - r6.composite;
      if (Math.abs(perceptionDiff) >= 15) {
          const pSlot=document.getElementById("perceptionWarnSlot");
          if(pSlot) pSlot.innerHTML='<div style="margin-top:16px;padding:12px;background:rgba(255,171,0,0.06);border:1px solid rgba(255,171,0,0.5);border-radius:4px;font-family:var(--font-mono)"><strong style="color:var(--amber)">'+(lang==="tr"?"\u26A0\uFE0F ALGI VE GER\u00C7EKL\u0130K UYUMSUZLU\u011EU":"\u26A0\uFE0F PERCEPTION-REALITY DISSONANCE")+'</strong><br><span style="font-size:0.8rem;color:var(--t2);line-height:1.4;display:block;margin-top:6px">'+(lang==="tr"?"Medya tonlamas\u0131 ("+Math.round(r7.media.score)+") ile yap\u0131sal eksen ("+r6.composite+") aras\u0131nda <b>%"+Math.round(Math.abs(perceptionDiff))+"</b> fark var. Olas\u0131 sebep: Arka kap\u0131 diplomasisi veya asimetrik tehdit asimilasyonu.":"Media tone ("+Math.round(r7.media.score)+") diverges from structural reality ("+r6.composite+") by <b>"+Math.round(Math.abs(perceptionDiff))+"%</b>. Causes: Backchannel diplomacy, manipulation, or asymmetric threat assimilation.")+"</span></div>";
      }
      const v7=getVerdict(r7.composite);
      const cn=document.getElementById("compNum");if(cn){cn.parentElement.style.color=v7.c;countUp(cn,r7.composite,600)}
      const cv=document.getElementById("compVerd");if(cv){cv.style.background=v7.c+"22";cv.style.color=v7.c;cv.textContent=v7.t}
      const cf=document.getElementById("compFill");if(cf){cf.style.width=r7.composite+"%";cf.style.background="linear-gradient(90deg,"+v7.c+","+v7.c+"88)"}
    }
    // Disinfo analysis after GDELT articles loaded
    if(typeof triggerDisinfoAnalysis==="function"){var diHtml=triggerDisinfoAnalysis(selA,selB);if(diHtml){var diSlot=document.getElementById("gkgSlot");if(diSlot)diSlot.innerHTML+=diHtml}}
    const sg=document.getElementById("statusGdelt");
    if(sg)sg.innerHTML=r7.media&&r7.media.fetched?'<span class="sq" style="background:var(--cyan)"></span> '+T("gdeltOnline"):'<span class="sq" style="background:var(--neg)"></span> '+T("gdeltOffline");
  }catch(e){
    const slot=document.getElementById("gdeltCardSlot");if(slot)slot.innerHTML=gdeltCard(null);
    const sg=document.getElementById("statusGdelt");if(sg)sg.innerHTML='<span class="sq" style="background:var(--neg)"></span> '+T("gdeltOffline");
  }
}
