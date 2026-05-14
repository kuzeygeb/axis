// AXIS — Sensitivity analysis
// Depends on: core.js (customWeights, defaultWeights, weightLabels, computeAxis, computeAxisCustom, getVerdict, selA, selB, getD, cN, T), ui.js (exportBar, sensWeightList, srcPanel)

function buildSensSliders(){
  const ct=document.getElementById("sensSliders");
  ct.innerHTML="";
  const keys=Object.keys(defaultWeights);
  keys.forEach(k=>{
    const row=document.createElement("div");row.className="sens-row";
    const pct=Math.round(customWeights[k]*100);
    row.innerHTML='<label>'+T(weightLabels[k])+'</label><input type="range" min="0" max="50" value="'+pct+'" data-key="'+k+'" oninput="onSensSlider(this)"><span class="sens-val" id="sensVal_'+k+'">'+pct+'%</span>';
    ct.appendChild(row);
  });
  const resetBtn=document.createElement("button");
  resetBtn.className="sel-reset";resetBtn.style.marginTop="4px";resetBtn.textContent=T("sensReset");
  resetBtn.onclick=()=>{customWeights={...defaultWeights};buildSensSliders()};
  ct.appendChild(resetBtn);
  document.getElementById("sensAcNote").textContent=T("sensAcNote");
  document.getElementById("sensNote").textContent=T("sensNote");
  updateSensTotal();
}

function onSensSlider(el){
  const key=el.dataset.key;
  const newVal=parseInt(el.value)/100;
  const oldVal=customWeights[key];
  const diff=newVal-oldVal;
  customWeights[key]=newVal;
  const others=Object.keys(customWeights).filter(k=>k!==key);
  const othersSum=others.reduce((s,k)=>s+customWeights[k],0);
  if(othersSum>0){
    others.forEach(k=>{
      customWeights[k]=Math.max(0,customWeights[k]-diff*(customWeights[k]/othersSum));
    });
  }
  const total=Object.values(customWeights).reduce((s,v)=>s+v,0);
  if(total>0)Object.keys(customWeights).forEach(k=>{customWeights[k]=customWeights[k]/total});
  Object.keys(customWeights).forEach(k=>{
    const pct=Math.round(customWeights[k]*100);
    const slider=document.querySelector('.sens-row input[data-key="'+k+'"]');
    const label=document.getElementById("sensVal_"+k);
    if(slider&&slider.dataset.key!==key)slider.value=pct;
    if(label)label.textContent=pct+"%";
  });
  updateSensTotal();
}

function updateSensTotal(){
  const total=Object.values(customWeights).reduce((s,v)=>s+Math.round(v*100),0);
  const el=document.getElementById("sensTotalNum");
  if(el)el.textContent=total+"%";
}

function runSensitivity(){
  if(!selA||!selB)return;
  const D=getD(),a=D[selA],b=D[selB];
  const rDef=computeAxis(selA,selB);
  const rCust=computeAxisCustom(selA,selB,customWeights);
  const vDef=getVerdict(rDef.composite);
  const vCust=getVerdict(rCust.composite);
  const diff=Math.round((rCust.composite-rDef.composite)*10)/10;
  const diffCol=diff>0?"var(--pos)":diff<0?"var(--neg)":"var(--t3)";
  const diffSign=diff>0?"+":"";
  const p=document.getElementById("results");
  let h=exportBar()+'<div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap">'+
    '<span style="font-size:2rem">'+a.f+'</span><span style="font-size:1.3rem;font-weight:600">'+cN(selA)+"</span>"+
    '<span style="font-family:monospace;font-size:.7rem;color:var(--amber);padding:4px 12px;border:1px solid var(--amber);border-radius:16px">'+T("sensTitle")+"</span>"+
    '<span style="font-size:2rem">'+b.f+'</span><span style="font-size:1.3rem;font-weight:600">'+cN(selB)+"</span></div>";
  h+='<div class="sens-compare">';
  h+='<div class="sens-col default"><div class="sens-col-label">'+T("sensDefault")+'</div>';
  h+='<div class="sens-col-score" style="color:'+vDef.c+'">'+rDef.composite+'</div>';
  h+='<div class="sens-col-verdict" style="background:'+vDef.c+'22;color:'+vDef.c+'">'+vDef.t+'</div>';
  h+=sensWeightList(defaultWeights);
  h+='</div>';
  h+='<div class="sens-col custom"><div class="sens-col-label">'+T("sensCustom")+' <span style="color:'+diffCol+';font-size:.8rem;margin-left:8px">'+diffSign+diff+'</span></div>';
  h+='<div class="sens-col-score" style="color:'+vCust.c+'">'+rCust.composite+'</div>';
  h+='<div class="sens-col-verdict" style="background:'+vCust.c+'22;color:'+vCust.c+'">'+vCust.t+'</div>';
  h+=sensWeightList(customWeights);
  h+='</div></div>';
  h+='<div class="sens-impact"><div class="sens-impact-title">'+T("sensImpact")+'</div>';
  const layers=["military","economic","lobby","cultural","strategic","behavioral"];
  layers.forEach(k=>{
    const defScore=rDef[k==="lobby"?"lobby":k].score||rDef[k].score;
    const defW=defaultWeights[k];
    const custW=customWeights[k];
    const defContrib=Math.round(defScore*defW*10)/10;
    const custContrib=Math.round(defScore*custW*10)/10;
    const layerDiff=Math.round((custContrib-defContrib)*10)/10;
    const ldCol=layerDiff>0?"var(--pos)":layerDiff<0?"var(--neg)":"var(--t3)";
    const ldSign=layerDiff>0?"+":"";
    h+='<div class="sens-impact-row">';
    h+='<span class="sens-impact-name">'+T(weightLabels[k])+'</span>';
    h+='<div class="sens-impact-bars">';
    h+='<div class="sens-impact-bar def" style="width:'+Math.max(2,defContrib*4)+'px" title="'+T("sensDefault")+': '+defContrib+'"></div>';
    h+='<div class="sens-impact-bar cust" style="width:'+Math.max(2,custContrib*4)+'px" title="'+T("sensCustom")+': '+custContrib+'"></div>';
    h+='</div>';
    h+='<span style="font-size:.6rem;color:var(--t3);min-width:70px">'+defContrib+' → '+custContrib+'</span>';
    h+='<span class="sens-impact-diff" style="color:'+ldCol+'">'+ldSign+layerDiff+'</span>';
    h+='</div>';
  });
  h+='</div>';
  h+='<div class="sens-note" style="margin-bottom:20px">'+T("sensNote")+'</div>';
  h+=srcPanel();
  p.innerHTML=h;
  p.classList.add("show");p.scrollIntoView({behavior:"smooth",block:"start"});
}
