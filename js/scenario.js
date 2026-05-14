// AXIS — Scenario analysis rendering
// Depends on: core.js, ui.js, ai.js, gametheory.js, data/translations.js (dominoChains, scenarios)

// ═══ Template helpers ═══
function scenarioCompareTemplate(rBefore,rAfter,vBefore,vAfter,diff){
  const diffCol=diff>0?"var(--pos)":diff<0?"var(--neg)":"var(--t3)";
  const diffSign=diff>0?"+":"";
  return'<div class="sens-compare">'+
    '<div class="sens-col default"><div class="sens-col-label" style="color:var(--green)">'+T("scenBefore")+'</div>'+
    '<div class="sens-col-score" style="color:'+vBefore.c+'">'+rBefore.composite+'</div>'+
    '<div class="sens-col-verdict" style="background:'+vBefore.c+'22;color:'+vBefore.c+'">'+vBefore.t+'</div></div>'+
    '<div class="sens-col custom"><div class="sens-col-label" style="color:var(--amber)">'+T("scenAfter")+' <span style="color:'+diffCol+';font-size:.8rem;margin-left:8px">'+diffSign+diff+'</span></div>'+
    '<div class="sens-col-score" style="color:'+vAfter.c+'">'+rAfter.composite+'</div>'+
    '<div class="sens-col-verdict" style="background:'+vAfter.c+'22;color:'+vAfter.c+'">'+vAfter.t+'</div></div></div>';
}

function scenarioLayerDiffTemplate(rBefore,rAfter){
  const layers=[["military","pM"],["economic","pE"],["lobby","pL"],["cultural","pC"],["strategic","pS"],["behavioral","pB"]];
  let h='<div class="scen-diff"><div class="scen-diff-title">'+T("scenAffected")+'</div>';
  h+='<table class="scen-diff-table"><tr><th>'+T("wt")+'</th><th>'+T("scenBefore")+'</th><th>'+T("scenAfter")+'</th><th>'+T("scenChg")+'</th></tr>';
  layers.forEach(([k,lbl])=>{
    const before=rBefore[k].score,after=rAfter[k].score;
    const ld=Math.round((after-before)*10)/10;
    h+='<tr><td>'+T(lbl)+'</td><td>'+before+'</td><td>'+after+'</td><td class="'+(ld>0?"sd-up":ld<0?"sd-dn":"sd-eq")+'">'+(ld>0?"+":"")+ld+'</td></tr>';
  });
  return h+'</table></div>';
}

function scenarioAllPairsTemplate(affectedPairs){
  let h='<div class="scen-diff"><div class="scen-diff-title">'+T("scenAffected")+' ('+(lang==="tr"?"Tüm Çiftler":"All Pairs")+')</div>';
  if(affectedPairs.length===0){
    return h+'<div style="color:var(--t3);font-family:var(--font-mono);font-size:.7rem">'+T("scenNoChange")+'</div></div>';
  }
  h+='<table class="scen-diff-table"><tr><th>'+(lang==="tr"?"Çift":"Pair")+'</th><th>'+T("scenBefore")+'</th><th>'+T("scenAfter")+'</th><th>'+T("scenChg")+'</th></tr>';
  affectedPairs.slice(0,15).forEach(p=>{
    const cls=p.d>0?"sd-up":"sd-dn";
    h+='<tr><td>'+C[p.a].f+' '+p.a+' — '+C[p.b].f+' '+p.b+'</td><td>'+p.bef+'</td><td>'+p.aft+'</td><td class="'+cls+'">'+(p.d>0?"+":"")+p.d+(p.d>0?" ▲":" ▼")+'</td></tr>';
  });
  return h+'</table></div>';
}

function scenarioDominoTemplate(scenKey){
  if(scenKey==="none"||!dominoChains[scenKey])return'';
  const chains=lang==="tr"?dominoChains[scenKey].tr:dominoChains[scenKey].en;
  let h='<div class="domino-chain"><div class="domino-title">'+T("scenDomino")+'</div>';
  chains.forEach(c=>{h+='<div class="domino-item">'+c+'</div>'});
  h+=aiBtn(T("aiDeepScen"),"runAIScenario()")+'<div id="aiScenContainer"></div>';
  return h+'</div>';
}

// ═══ Optimized all-pairs computation ═══
function computeAllPairsDiff(){
  const codes=Object.keys(C);
  // Before: baseline (no scenario)
  workingData=null;workingB=null;
  const beforeCache={};
  for(let i=0;i<codes.length;i++)for(let j=i+1;j<codes.length;j++){
    beforeCache[bK(codes[i],codes[j])]=computeAxis(codes[i],codes[j]).composite;
  }
  // After: apply scenario ONCE
  applyScenario();
  const afterCache={};
  for(let i=0;i<codes.length;i++)for(let j=i+1;j<codes.length;j++){
    afterCache[bK(codes[i],codes[j])]=computeAxis(codes[i],codes[j]).composite;
  }
  // Diff
  const pairs=[];
  for(const key of Object.keys(beforeCache)){
    const d=Math.round((afterCache[key]-beforeCache[key])*10)/10;
    if(d!==0){const[a,b]=key.split("-");pairs.push({a,b,bef:beforeCache[key],aft:afterCache[key],d})}
  }
  pairs.sort((a,b)=>Math.abs(b.d)-Math.abs(a.d));
  return pairs;
}

// ═══ Main render ═══
function runScenarioAnalysis(){
  if(!selA||!selB)return;
  const scenKey=document.getElementById("scenSelect").value;

  // Compute before
  workingData=null;workingB=null;
  const rBefore=computeAxis(selA,selB);

  // Compute after
  applyScenario();
  const rAfter=computeAxis(selA,selB);
  const vBefore=getVerdict(rBefore.composite),vAfter=getVerdict(rAfter.composite);
  const diff=Math.round((rAfter.composite-rBefore.composite)*10)/10;

  // Compute all pairs (optimized — single applyScenario)
  const affectedPairs=computeAllPairsDiff();

  // Ensure scenario is applied for rendering context
  applyScenario();

  const p=document.getElementById("results");
  p.innerHTML=exportBar()+
    headerTemplate(selA,selB,T("sl"),"var(--neg)")+
    scenarioCompareTemplate(rBefore,rAfter,vBefore,vAfter,diff)+
    scenarioLayerDiffTemplate(rBefore,rAfter)+
    scenarioAllPairsTemplate(affectedPairs)+
    scenarioDominoTemplate(scenKey)+
    '<div id="gtScenContainer"></div>'+
    srcPanel();

  p.classList.add("show");p.scrollIntoView({behavior:"smooth",block:"start"});
  if(typeof pushState==="function")pushState("scenario/"+document.getElementById("scenSelect").value+"/"+selA+"/"+selB);
  if(typeof renderGameTheory==="function")renderGameTheory("gtScenContainer",selA,selB);
}
