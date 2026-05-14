// AXIS — Expandable card detail panels for 7 bilateral layers
// Depends on: core.js (getD, selA, selB, computeAxis, cN, T, lang, behLabels, C, B, bK), data/gdelt.js

// Store last result for detail rendering
let _lastBilResult=null;
let _lastGdeltData=null;

function setLastBilResult(r,gd){_lastBilResult=r;_lastGdeltData=gd||null}

function toggleDetail(layer){
  const card=document.querySelector('.p-card[data-layer="'+layer+'"]');
  if(!card)return;
  const wasExpanded=card.classList.contains("expanded");
  // Close all
  document.querySelectorAll(".p-card.expanded").forEach(c=>{c.classList.remove("expanded")});
  if(wasExpanded)return;
  // Fill detail
  const slot=document.getElementById("detail-"+layer);
  if(slot&&_lastBilResult){
    slot.innerHTML=buildDetail(layer,_lastBilResult,_lastGdeltData);
  }
  card.classList.add("expanded");
  // Scroll into view after animation
  setTimeout(function(){card.scrollIntoView({behavior:"smooth",block:"nearest"})},150);
}

function compareBar(label,valA,valB,maxVal){
  const pctA=Math.round((valA/maxVal)*100);
  const pctB=Math.round((valB/maxVal)*100);
  return'<div class="detail-compare"><span class="detail-compare-label">'+label+'</span>'+
    '<span class="detail-compare-val a">'+valA+'</span>'+
    '<div class="detail-compare-barwrap"><div class="detail-compare-bar a" style="width:'+pctA+'%"></div><div class="detail-compare-bar b" style="width:'+pctB+'%"></div></div>'+
    '<span class="detail-compare-val b">'+valB+'</span></div>';
}

function buildDetail(layer,r,gd){
  const D=getD(),a=D[selA],b=D[selB];
  switch(layer){
    case"military":return militaryDetail(a,b,r);
    case"economic":return economicDetail(a,b,r);
    case"lobby":return lobbyDetail(a,b,r);
    case"cultural":return culturalDetail(a,b,r);
    case"strategic":return strategicDetail(a,b,r);
    case"behavioral":return behavioralDetail(a,b,r);
    case"gdelt":return gdeltDetail(gd||(r&&r.media?r.media:null));
    case"history":return historyDetail(a,b,r);
    default:return"";
  }
}

function historyDetail(a,b,r){
  setTimeout(async function(){
    const el = document.getElementById("detail-history");
    if(!el) return;
    try {
      el.innerHTML = '<div class="detail-note" style="text-align:center;color:var(--amber)"><div class="ai-loading">'+T("histLoad")+'<div class="ai-loading-bar"><div class="ai-loading-bar-fill" style="background:var(--amber)"></div></div></div></div>';
      const wiki = await fetchWikiRelations(selA, selB);
      if(!wiki || !wiki.html) {
        el.innerHTML = '<div class="detail-note" style="color:var(--warn)">' + T("histFail") + '</div>';
        return;
      }
      let h = '<div style="margin-bottom:8px;font-family:var(--font-mono);font-size:.65rem;color:var(--amber);text-transform:uppercase;letter-spacing:.05em">'+T("histApiSrc")+' Wikipedia ('+wiki.srcLang.toUpperCase()+') | '+wiki.title+'</div>';
      h += '<div class="detail-note" style="max-height:350px;overflow-y:auto;padding-right:8px;font-size:.85rem;line-height:1.5;color:var(--t2)">' + wiki.html + '</div>';
      el.innerHTML = h;
    } catch(e) {
      el.innerHTML = '<div class="detail-note" style="color:var(--neg)">'+T("histApiErr")+'</div>';
    }
  }, 50);
  return '<div class="detail-note" style="text-align:center;color:var(--t3)">'+T("histInit")+'</div>';
}

function militaryDetail(a,b,r){
  let h="";
  h+=compareBar(T("ml")+" ($B)",a.mil,b.mil,Math.max(a.mil,b.mil));
  h+=compareBar(T("ml")+"/GDP %",a.mp,b.mp,10);
  h+=compareBar(T("gd")+" ($B)",a.gdp,b.gdp,Math.max(a.gdp,b.gdp));
  // Nuclear status
  let nucText;
  if(a.nuc&&b.nuc)nucText=T("detailNuclearBoth");
  else if(a.nuc||b.nuc)nucText=T("detailNuclearAsym");
  else nucText=T("detailNuclearNone");
  h+='<div class="detail-note">'+nucText+'</div>';
  // UNSC
  if(a.usc&&b.usc)h+='<div class="detail-note">'+T("detailUnsc")+' '+cN(selA)+' ✓ | '+cN(selB)+' ✓</div>';
  else if(a.usc||b.usc)h+='<div class="detail-note">'+T("detailUnsc")+' '+(a.usc?cN(selA):cN(selB))+' ✓</div>';
  h+='<div class="detail-formula">'+T("detailFormula")+': '+T("detailFormDesc")+'</div>';
  return h;
}

function economicDetail(a,b,r){
  let h="";
  const trade=r.economic.tv;
  h+=compareBar(T("gd")+" ($B)",a.gdp,b.gdp,Math.max(a.gdp,b.gdp));
  h+=compareBar(T("to")+" %",a.to,b.to,100);
  // Trade context
  const minGdp=Math.min(a.gdp,b.gdp);
  const intensity=minGdp>0?Math.round(trade/minGdp*10000)/100:0;
  let tradeCtx;
  if(trade>=200)tradeCtx=T("detailTradeHigh");
  else if(trade>=50)tradeCtx=T("detailTradeMed");
  else tradeCtx=T("detailTradeLow");
  h+='<div class="detail-note">'+tradeCtx+' — $'+trade+'B ('+(lang==="tr"?"yoğunluk":"intensity")+': '+intensity+'%)</div>';
  h+='<div class="detail-formula">'+T("detailFormula")+': TradeIndex×65% + TradeOpenness×35%</div>';
  // Mineral supply chain integration
  if(typeof mineralBilateralHTML==="function")h+=mineralBilateralHTML(selA,selB);
  return h;
}

function lobbyDetail(a,b,r){
  let h="";
  h+=compareBar("CPI",a.cpi,b.cpi,100);
  h+=compareBar(T("dm"),a.dem,b.dem,10);
  h+=compareBar(T("cv"),a.cs,b.cs,1);
  h+='<div class="detail-note">'+T("detailLobbyNote")+'</div>';
  h+='<div class="detail-formula">'+T("detailFormula")+': CivSoc×40% + CPI×30% + Democracy×30%</div>';
  return h;
}

function culturalDetail(a,b,r){
  let h="";
  const dims=[["pdi","detailHofPdi"],["idv","detailHofIdv"],["mas","detailHofMas"],["uai","detailHofUai"],["lto","detailHofLto"]];
  dims.forEach(([k,lbl])=>{
    h+=compareBar(T(lbl),a.hof[k]||50,b.hof[k]||50,100);
  });
  const dist=r.cultural.hd;
  h+='<div class="detail-note">'+(dist<20?T("detailCulturalClose"):T("detailCulturalFar"))+' (Hofstede: '+dist+')</div>';
  if(r.cultural.sr)h+='<div class="detail-note">'+(lang==="tr"?"Aynı bölge bonusu: +20":"Same region bonus: +20")+'</div>';
  h+='<div class="detail-formula">'+T("detailFormula")+': CulturalProximity×70% + RegionBonus + SimilarityBonus</div>';
  return h;
}

function strategicDetail(a,b,r){
  let h="";
  // Shared orgs as badges
  const so=r.strategic.so||[];
  if(so.length>0){
    h+='<div style="margin-bottom:8px">';
    so.forEach(o=>{h+='<span class="detail-badge">'+o+'</span>'});
    h+='</div>';
  }
  // UN voting bar
  h+=compareBar("UN "+T("uv"),Math.round((r.strategic.unA||0)*100),100,100);
  // Tension
  const tenColors={low:"var(--pos)",medium:"var(--warn)",high:"var(--amber)",critical:"var(--neg)",unknown:"var(--t3)"};
  const ten=r.strategic.ten||"unknown";
  h+='<div class="detail-note">'+(lang==="tr"?"Gerilim: ":"Tension: ")+'<span style="color:'+tenColors[ten]+'">'+tT(ten)+'</span></div>';
  // Context note from bilateral data
  if(r.bil&&r.bil.nt)h+='<div class="detail-note" style="font-style:italic">'+r.bil.nt+'</div>';
  h+='<div class="detail-formula">'+T("detailFormula")+': UNvoting×40% + SharedAlliances×40% + Bonus - TensionPenalty</div>';
  return h;
}

function behavioralDetail(a,b,r){
  let h="";
  const bl=behLabels[lang]||behLabels.en;
  const dims=Object.keys(bl);
  let maxGap=0,maxGapKey="",minGap=Infinity,minGapKey="";
  dims.forEach(k=>{
    const va=a.beh[k]||5,vb=b.beh[k]||5;
    const gap=Math.abs(va-vb);
    if(gap>maxGap){maxGap=gap;maxGapKey=k}
    if(gap<minGap){minGap=gap;minGapKey=k}
    const gapColor=gap>4?"var(--neg)":gap>2?"var(--warn)":"var(--pos)";
    h+='<div class="detail-compare"><span class="detail-compare-label">'+bl[k]+'</span>'+
      '<span class="detail-compare-val a">'+va+'</span>'+
      '<div class="detail-compare-barwrap"><div class="detail-compare-bar a" style="width:'+(va*10)+'%"></div><div class="detail-compare-bar b" style="width:'+(vb*10)+'%"></div></div>'+
      '<span class="detail-compare-val b">'+vb+'</span>'+
      '<span style="font-size:.5rem;min-width:18px;text-align:center;color:'+gapColor+'">±'+gap+'</span></div>';
  });
  h+='<div class="detail-highlight gap">'+T("detailBehGap")+': <strong>'+bl[maxGapKey]+'</strong> ('+(a.beh[maxGapKey]||5)+' vs '+(b.beh[maxGapKey]||5)+', Δ'+maxGap+')</div>';
  h+='<div class="detail-highlight align">'+T("detailBehAlign")+': <strong>'+bl[minGapKey]+'</strong> ('+(a.beh[minGapKey]||5)+' vs '+(b.beh[minGapKey]||5)+', Δ'+minGap+')</div>';
  h+='<div class="detail-formula">'+T("detailFormula")+': Crisis×20% + Status×20% + Risk×15% + DipStyle×15% + Predict×10% + Decision×10% + Alliance×10%</div>';
  return h;
}

function gdeltDetail(gd){
  if(!gd||!gd.fetched)return'<div class="detail-note">'+T("gdeltUnavailable")+'</div>';
  let h="";
  // Tone gauge: simple inline display
  const tonePos=Math.max(0,Math.min(100,((gd.avgTone+10)/20)*100));
  h+='<div style="margin:8px 0"><div style="display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:.6rem"><span style="color:var(--neg)">-10</span><div style="flex:1;height:6px;background:linear-gradient(90deg,var(--neg),var(--t3),var(--pos));border-radius:3px;position:relative"><div style="position:absolute;top:-3px;left:'+tonePos+'%;width:12px;height:12px;background:var(--cyan);border-radius:50%;transform:translateX(-6px);box-shadow:0 0 6px var(--cyan)"></div></div><span style="color:var(--pos)">+10</span></div></div>';
  // Trend
  const tDir=gd.trendDirection;
  const tLabel=tDir==="improving"?T("gdeltImproving"):tDir==="deteriorating"?T("gdeltDeteriorating"):T("gdeltStable");
  h+='<div class="detail-note">'+T("gdeltTrend")+': <strong>'+tLabel+'</strong></div>';
  // Recent articles (top 5)
  if(gd.recentArticles&&gd.recentArticles.length>0){
    h+='<div style="margin-top:8px">';
    gd.recentArticles.slice(0,5).forEach(a=>{
      const d=a.date?(a.date.substring(0,10)):"";
      h+='<div style="font-family:var(--font-mono);font-size:.6rem;padding:3px 0;border-bottom:1px solid rgba(0,229,255,.05)"><span style="color:var(--t3)">'+d+'</span> <span style="color:var(--cyan);opacity:.6">'+a.domain+'</span> ';
      if(a.url)h+='<a href="'+a.url+'" target="_blank" rel="noopener" style="color:var(--t2);text-decoration:none">'+((a.title||"").substring(0,70))+'</a>';
      else h+=(a.title||"");
      h+='</div>';
    });
    h+='</div>';
  }
  return h;
}
