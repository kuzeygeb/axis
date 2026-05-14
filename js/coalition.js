// AXIS — Coalition analysis, network criticality
// Depends on: core.js, ui.js, ai.js, animations.js, network.js

function coalInterp(members,avg,minScore,minPair,tGDP){
  const D=getD();let t="";
  const isT=lang==="tr";
  if(avg>=60)t+="<strong>"+T("coalInterp")+":</strong> "+(isT?"Bu koalisyon güçlü bir iç uyum göstermektedir":"This coalition shows strong internal cohesion")+" ("+avg+"/100). ";
  else if(avg>=40)t+="<strong>"+T("coalInterp")+":</strong> "+(isT?"Orta düzey uyum":"Moderate cohesion")+" ("+avg+"/100)"+(isT?" — belirgin zayıf noktalar mevcuttur":" with notable weak points")+". ";
  else t+="<strong>"+T("coalInterp")+":</strong> "+(isT?"Düşük uyum":"Low cohesion")+" ("+avg+"/100)"+(isT?" — bu koalisyon temel yapısal sorunlarla karşı karşıyadır":" — fundamental structural challenges")+". ";
  t+=(isT?"En zayıf halka":"The weakest link is")+" <strong>"+minPair+"</strong> — "+minScore+"/100. ";
  let esc=[],deE=[],rev=[],unp=[];
  members.forEach(c=>{const b=D[c].beh;if(b.crisis<=3)esc.push(cN(c));if(b.crisis>=8)deE.push(cN(c));if(b.status<=3)rev.push(cN(c));if(b.predict<=3)unp.push(cN(c))});
  if(esc.length>0)t+="<br><br><span style='color:var(--neg)'>⚠ "+(isT?"Tırmanma riski:":"Escalation risk:")+"</span> "+esc.join(", ")+(isT?" tırmandırıcı kriz davranışı sergilemektedir.":" show escalatory crisis behavior.")+" ";
  if(rev.length>0)t+=(isT?"Revizyonist üyeler (":"Revisionist members (")+rev.join(", ")+")"+(isT?" statükocu üyelerle iç gerilim yaratabilir.":" may create internal tension.")+". ";
  if(unp.length>0)t+=(isT?"Öngörülemez aktörler (":"Unpredictable actors (")+unp.join(", ")+")"+(isT?" koalisyon güvenilirliğini azaltmaktadır.":" reduce coalition reliability.")+" ";
  if(deE.length===members.length)t+=(isT?"Tüm üyeler yatıştırıcı — düşük iç çatışma riski.":"All members are de-escalatory — low internal conflict risk.")+" ";
  t+="<br><br>"+(isT?"Toplam GSYİH":"Combined GDP")+": <strong>$"+(tGDP/1000).toFixed(1)+"T</strong>";
  return t;
}

function networkAnalysis(members){
  const results=[];let fullSum=0,fullCnt=0;
  for(let i=0;i<members.length;i++)for(let j=i+1;j<members.length;j++){fullSum+=computeAxis(members[i],members[j]).composite;fullCnt++}
  const fullAvg=Math.round(fullSum/fullCnt*10)/10;
  members.forEach(m=>{
    const rem=members.filter(x=>x!==m);let s=0,c=0;
    for(let i=0;i<rem.length;i++)for(let j=i+1;j<rem.length;j++){s+=computeAxis(rem[i],rem[j]).composite;c++}
    const withoutAvg=c>0?Math.round(s/c*10)/10:0;
    let bSum=0,bCnt=0;members.forEach(o=>{if(o!==m){bSum+=computeAxis(m,o).composite;bCnt++}});
    results.push({code:m,fullAvg,withoutAvg,delta:Math.round((withoutAvg-fullAvg)*10)/10,avgLink:bCnt>0?Math.round(bSum/bCnt*10)/10:0});
  });
  return results;
}

function netPanel(members){
  const data=networkAnalysis(members),D=getD();
  const most=data.reduce((a,b)=>b.delta>a.delta?b:a,data[0]);
  const least=data.reduce((a,b)=>Math.abs(b.delta)<Math.abs(a.delta)?b:a,data[0]);
  let h='<div class="net-panel"><div class="net-title">'+T("netTitle")+'</div>';
  h+='<table class="net-table"><tr><th></th><th>'+T("netMember")+'</th><th>'+T("netCurrent")+'</th><th>'+T("netWithout")+'</th><th>'+T("netDelta")+'</th><th>'+(lang==="tr"?"Ort. Bağ":"Avg Link")+'</th></tr>';
  data.forEach(d=>{
    const dcol=d.delta>0?"net-pos":d.delta<0?"net-neg":"net-neut";
    h+='<tr class="'+(d.code===most.code?"net-critical":"")+'"><td class="net-flag">'+D[d.code].f+'</td><td>'+cN(d.code)+'</td><td>'+d.fullAvg+'</td><td>'+d.withoutAvg+'</td><td class="'+dcol+'">'+(d.delta>0?"+":"")+d.delta+'</td><td>'+d.avgLink+'</td></tr>';
  });
  h+='</table><div class="net-insight">'+T("netCritical")+': <strong>'+cN(most.code)+'</strong> ('+(most.delta>0?"+":"")+most.delta+') — '+T("netLeast")+': <strong>'+cN(least.code)+'</strong> ('+(least.delta>0?"+":"")+least.delta+')</div></div>';
  return h;
}

// ═══ Template helpers ═══
function coalHeaderTemplate(members,tGDP,tMil,tPop,avg){
  const D=getD();
  return'<div class="coal-summary"><div class="coal-title">'+T("ct")+' — '+members.map(c=>D[c].f).join(' ')+'</div>'+
    '<div style="font-size:.85rem;color:var(--t2);margin-bottom:16px">'+T("mb")+': '+members.map(c=>cN(c)).join(', ')+'</div>'+
    '<div class="coal-stats">'+
    '<div class="coal-stat"><div class="coal-stat-label">'+T("tg")+'</div><div class="coal-stat-val" style="color:var(--econ)">$'+(tGDP/1000).toFixed(1)+'T</div></div>'+
    '<div class="coal-stat"><div class="coal-stat-label">'+T("tm")+'</div><div class="coal-stat-val" style="color:var(--mil)">$'+tMil+'B</div></div>'+
    '<div class="coal-stat"><div class="coal-stat-label">'+T("pp")+'</div><div class="coal-stat-val" style="color:var(--cyan)">'+(tPop/1000).toFixed(2)+'B</div></div>'+
    '<div class="coal-stat"><div class="coal-stat-label">'+T("ah")+'</div><div class="coal-stat-val" style="color:'+(avg>=55?"var(--pos)":avg>=35?"var(--warn)":"var(--neg)")+'">'+avg+'</div></div></div></div>';
}

function coalMatrixTemplate(members){
  const D=getD();
  let mtx='<table><tr><th></th>'+members.map(c=>'<th>'+D[c].f+' '+D[c].c+'</th>').join('')+'</tr>';
  members.forEach(a=>{
    mtx+='<tr><th>'+D[a].f+' '+D[a].c+'</th>';
    members.forEach(b=>{
      if(a===b)mtx+='<td class="diag">-</td>';
      else{const r=computeAxis(a,b);mtx+='<td class="'+(r.composite>=60?"hi":r.composite>=35?"md":"lo")+'">'+r.composite+'</td>'}
    });
    mtx+='</tr>';
  });
  return mtx+'</table>';
}

// ═══ Main render ═══
function runCoalition(){
  if(coalMembers.length<3)return;
  const D=getD();let tGDP=0,tMil=0,tPop=0;
  coalMembers.forEach(c=>{const d=D[c];tGDP+=d.gdp;tMil+=d.mil;tPop+=d.pop});
  let sum=0,min=Infinity,minP="",cnt=0;
  for(let i=0;i<coalMembers.length;i++)for(let j=i+1;j<coalMembers.length;j++){
    const r=computeAxis(coalMembers[i],coalMembers[j]);sum+=r.composite;cnt++;
    if(r.composite<min){min=r.composite;minP=cN(coalMembers[i])+" — "+cN(coalMembers[j])}}
  const avg=Math.round(sum/cnt*10)/10;
  const p=document.getElementById("results");

  p.innerHTML=exportBar()+
    coalHeaderTemplate(coalMembers,tGDP,tMil,tPop,avg)+
    '<div class="weak-link"><div class="weak-link-t">⚠ '+T("wl")+'</div><div style="font-size:.9rem;color:var(--t2)">'+minP+' — <span style="font-family:monospace;color:var(--neg)">'+min+'</span>/100</div></div>'+
    '<div class="ai"><div class="ai-badge">'+T("ai")+'</div><div class="ai-txt">'+coalInterp(coalMembers,avg,min,minP,tGDP)+'</div>'+aiBtn(T("aiDeepCoal"),"runAICoalition()")+'<div id="aiCoalContainer"></div></div>'+
    '<div id="coalNetworkGraph" class="network-container"></div>'+
    '<div class="coal-matrix"><div style="font-family:monospace;font-size:.6rem;text-transform:uppercase;letter-spacing:.12em;color:var(--t3);margin-bottom:12px">'+T("cm")+'</div>'+coalMatrixTemplate(coalMembers)+'</div>'+
    netPanel(coalMembers)+
    '<div class="profiles">'+coalMembers.map(c=>profCard(c)).join('')+'</div>'+srcPanel();

  p.classList.add("show");p.scrollIntoView({behavior:"smooth",block:"start"});
  if(typeof pushState==="function")pushState("coalition/"+coalMembers.join(","));
  applyStagger(".coal-matrix td",0);applyStagger(".coal-matrix th",0);applyStagger(".prof",0);
  if(typeof renderNetworkGraph==="function")renderNetworkGraph("coalNetworkGraph",coalMembers,computeAxis,false);
}
