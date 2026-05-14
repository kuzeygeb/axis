// AXIS — Game Theory / Nash Equilibrium Analysis Module
// Depends on: core.js (getD, selA, selB, cN, T, lang, C), ui.js (tT), ai.js (aiBtn, aiLoadingHTML, aiResultHTML, callGroq)

const presetGames={
sanctions:{id:"sanctions",name:{en:"Sanctions Standoff",tr:"Yaptırım Restleşmesi"},desc:{en:"Country A considers imposing economic sanctions. Country B must decide whether to comply or retaliate. Models US-Iran, US-Russia type dynamics.",tr:"A ülkesi ekonomik yaptırım uygulamayı düşünüyor. B ülkesi taleplere uyma veya misilleme arasında seçim yapmalı. ABD-İran, ABD-Rusya tipi dinamikleri modelliyor."},playerA:{strategies:{en:["Impose Sanctions","No Sanctions"],tr:["Yaptırım Uygula","Yaptırım Yok"]}},playerB:{strategies:{en:["Comply","Counter-Sanctions"],tr:["Uy","Karşı-Yaptırım"]}},basePayoffs:[[[6,-4],[1,-2]],[[3,3],[4,5]]],nashHint:{en:"Classic asymmetric game. If A is strong enough, sanctions-comply is Nash Equilibrium.",tr:"Klasik asimetrik oyun. A yeterince güçlüyse, yaptırım-uyum Nash Dengesi'dir."},irTheory:{en:"Keohane & Nye (1977) — sanctions effectiveness depends on interdependence asymmetry. Drezner (2003) — sanctions success correlates with sender's economic leverage.",tr:"Keohane & Nye (1977) — yaptırım etkinliği karşılıklı bağımlılık asimetrisine bağlıdır. Drezner (2003) — yaptırım başarısı gönderenin ekonomik kaldıracıyla orantılıdır."}},
military_escalation:{id:"military_escalation",name:{en:"Military Escalation Dilemma",tr:"Askeri Tırmanma İkilemi"},desc:{en:"Two states face a territorial dispute. Each must decide whether to escalate or pursue diplomacy. Classic Chicken Game variant.",tr:"İki devlet toprak anlaşmazlığıyla karşı karşıya. Her biri askeri tırmanma veya diplomasi arasında seçim yapmalı. Klasik Tavuk Oyunu varyantı."},playerA:{strategies:{en:["Escalate","Diplomacy"],tr:["Tırmandır","Diplomasi"]}},playerB:{strategies:{en:["Escalate","Diplomacy"],tr:["Tırmandır","Diplomasi"]}},basePayoffs:[[[-8,-8],[5,-3]],[[-3,5],[2,2]]],nashHint:{en:"Chicken Game: two pure Nash Equilibria plus one mixed. No dominant strategy.",tr:"Tavuk Oyunu: iki saf Nash Dengesi artı bir karma. Baskın strateji yok."},irTheory:{en:"Schelling (1960) — commitment and credible threats. Jervis (1978) — security dilemma spiral model. Fearon (1995) — rationalist explanations for war.",tr:"Schelling (1960) — taahhüt ve inandırıcı tehditler. Jervis (1978) — güvenlik ikilemi sarmal modeli. Fearon (1995) — savaşın rasyonalist açıklamaları."}},
trade_war:{id:"trade_war",name:{en:"Trade War / Prisoner's Dilemma",tr:"Ticaret Savaşı / Mahkum İkilemi"},desc:{en:"Both states benefit from free trade, but each is tempted to impose tariffs for domestic gain. Classic Prisoner's Dilemma.",tr:"Her iki devlet de serbest ticaretten yararlanır, ama her biri iç kazanım için tarife koymaya eğilimlidir. Klasik Mahkum İkilemi."},playerA:{strategies:{en:["Free Trade","Tariffs"],tr:["Serbest Ticaret","Tarife"]}},playerB:{strategies:{en:["Free Trade","Tariffs"],tr:["Serbest Ticaret","Tarife"]}},basePayoffs:[[[4,4],[-2,6]],[[6,-2],[0,0]]],nashHint:{en:"Prisoner's Dilemma: dominant strategy is Tariffs, but mutual Free Trade is Pareto optimal.",tr:"Mahkum İkilemi: baskın strateji Tarife, ama karşılıklı Serbest Ticaret Pareto optimal."},irTheory:{en:"Axelrod (1984) — iteration and reciprocity. Keohane (1984) — institutions solve cooperation problems.",tr:"Axelrod (1984) — tekrar ve karşılıklılık. Keohane (1984) — kurumlar işbirliği sorunlarını çözer."}},
alliance_formation:{id:"alliance_formation",name:{en:"Alliance Formation Game",tr:"İttifak Oluşturma Oyunu"},desc:{en:"State A offers alliance, State B decides whether to join or remain non-aligned. Bandwagoning vs balancing.",tr:"A devleti ittifak teklif ediyor, B devleti katılma veya bağlantısız kalma arasında seçim yapıyor."},playerA:{strategies:{en:["Offer Alliance","No Offer"],tr:["İttifak Teklif Et","Teklif Yok"]}},playerB:{strategies:{en:["Join","Stay Non-Aligned"],tr:["Katıl","Bağlantısız Kal"]}},basePayoffs:[[[5,3],[0,4]],[[2,2],[2,3]]],nashHint:{en:"B's choice depends on threat perception — Walt (1987) balance of threat theory.",tr:"B'nin seçimi tehdit algısına bağlıdır — Walt (1987) tehdit dengesi teorisi."},irTheory:{en:"Walt (1987) — Origins of Alliances. Snyder (1997) — Alliance Politics. Morrow (1991) — alliances as asymmetric exchange.",tr:"Walt (1987) — İttifakların Kökeni. Snyder (1997) — İttifak Politikası. Morrow (1991) — asimetrik değişim olarak ittifaklar."}},
nuclear_brinkmanship:{id:"nuclear_brinkmanship",name:{en:"Nuclear Brinkmanship",tr:"Nükleer Brinksmanship"},desc:{en:"Two nuclear powers in crisis. Each can signal resolve or de-escalate. Miscalculation = catastrophe.",tr:"Krizde iki nükleer güç. Her biri kararlılık sinyali verebilir veya yatıştırabilir. Yanlış hesaplama = felaket."},playerA:{strategies:{en:["Signal Resolve","De-escalate"],tr:["Kararlılık Sinyali","Yatıştır"]}},playerB:{strategies:{en:["Signal Resolve","De-escalate"],tr:["Kararlılık Sinyali","Yatıştır"]}},basePayoffs:[[[-10,-10],[7,-5]],[[-5,7],[1,1]]],nashHint:{en:"Extreme Chicken Game. Mixed strategy Nash: signal probability proportional to resolve/capability. Cuban Missile Crisis archetype.",tr:"Aşırı Tavuk Oyunu. Karma strateji Nash: sinyal olasılığı kararlılık/kapasiteye orantılı. Küba Füze Krizi arketipi."},irTheory:{en:"Schelling (1966) — Arms and Influence. Powell (1990) — Nuclear Deterrence Theory.",tr:"Schelling (1966) — Silahlar ve Etki. Powell (1990) — Nükleer Caydırıcılık Teorisi."}}
};

// Store last selected countries for game rendering
let lastSelA=null,lastSelB=null;

function findNashEquilibria(payoffs){
  const results={pure:[],mixed:null,dominant:{A:null,B:null}};
  for(let i=0;i<2;i++){for(let j=0;j<2;j++){
    const aBR=payoffs[0][j][0]>=payoffs[1][j][0]?0:1;
    const bBR=payoffs[i][0][1]>=payoffs[i][1][1]?0:1;
    if(aBR===i&&bBR===j)results.pure.push({row:i,col:j,payoffA:payoffs[i][j][0],payoffB:payoffs[i][j][1]});
  }}
  if(payoffs[0][0][0]>=payoffs[1][0][0]&&payoffs[0][1][0]>=payoffs[1][1][0])results.dominant.A=0;
  if(payoffs[1][0][0]>=payoffs[0][0][0]&&payoffs[1][1][0]>=payoffs[0][1][0])results.dominant.A=1;
  if(payoffs[0][0][1]>=payoffs[0][1][1]&&payoffs[1][0][1]>=payoffs[1][1][1])results.dominant.B=0;
  if(payoffs[0][1][1]>=payoffs[0][0][1]&&payoffs[1][1][1]>=payoffs[1][0][1])results.dominant.B=1;
  const a00=payoffs[0][0][0],a01=payoffs[0][1][0],a10=payoffs[1][0][0],a11=payoffs[1][1][0];
  const b00=payoffs[0][0][1],b01=payoffs[0][1][1],b10=payoffs[1][0][1],b11=payoffs[1][1][1];
  const denomP=(a00-a01)-(a10-a11),denomQ=(b00-b10)-(b01-b11);
  if(denomP!==0&&denomQ!==0){
    const p=(a11-a01)/denomP,q=(b11-b01)/denomQ;
    if(p>=0&&p<=1&&q>=0&&q<=1){
      const expA=q*(p*a00+(1-p)*a01)+(1-q)*(p*a10+(1-p)*a11);
      const expB=q*(p*b00+(1-p)*b10)+(1-q)*(p*b01+(1-p)*b11);
      results.mixed={probA:[Math.round(q*100),Math.round((1-q)*100)],probB:[Math.round(p*100),Math.round((1-p)*100)],expectedA:Math.round(expA*100)/100,expectedB:Math.round(expB*100)/100};
    }
  }
  return results;
}

function minimax(payoffs){
  const aMin=[Math.min(payoffs[0][0][0],payoffs[0][1][0]),Math.min(payoffs[1][0][0],payoffs[1][1][0])];
  const bMin=[Math.min(payoffs[0][0][1],payoffs[1][0][1]),Math.min(payoffs[0][1][1],payoffs[1][1][1])];
  const aMax=Math.max(...aMin),bMax=Math.max(...bMin);
  return{A:{strategy:aMin.indexOf(aMax),value:aMax},B:{strategy:bMin.indexOf(bMax),value:bMax}};
}

function adjustPayoffs(game,cA,cB){
  const D=getD(),a=D[cA],b=D[cB];
  const pr=(a.gdp+a.mil*10)/(b.gdp+b.mil*10);
  const adj=game.basePayoffs.map(row=>row.map(cell=>[...cell]));
  const ab=Math.round(Math.min(3,Math.max(-3,(pr-1)*2)));
  const rA=Math.round((a.beh.risk-5)*0.3),rB=Math.round((b.beh.risk-5)*0.3);
  adj[0][0][0]+=ab+rA;adj[0][1][0]+=ab+rA;adj[1][0][0]-=rA;
  adj[0][0][1]-=ab+rB;adj[1][0][1]+=rB;adj[1][1][1]-=rB;
  adj.forEach(row=>row.forEach(cell=>{cell[0]=Math.max(-10,Math.min(10,cell[0]));cell[1]=Math.max(-10,Math.min(10,cell[1]))}));
  return adj;
}

function renderGameTheory(containerId,cA,cB){
  const container=document.getElementById(containerId);
  if(!container||!cA||!cB)return;
  lastSelA=cA;lastSelB=cB;
  let h='<div class="gt-panel"><div class="gt-title">'+T("gtTitle")+'</div>';
  h+='<div class="gt-subtitle">'+cN(cA)+' vs '+cN(cB)+'</div>';
  h+='<div class="gt-selector"><select class="gt-select" id="gtGameSelect" onchange="onGameSelect()">';
  Object.entries(presetGames).forEach(([key,game])=>{h+='<option value="'+key+'">'+(lang==="tr"?game.name.tr:game.name.en)+'</option>'});
  h+='</select></div><div id="gtGameArea"></div></div>';
  container.innerHTML=h;
  onGameSelect();
}

function onGameSelect(){
  const sel=document.getElementById("gtGameSelect");
  if(!sel)return;
  const game=presetGames[sel.value];
  if(!game)return;
  const cA=lastSelA||selA,cB=lastSelB||selB;
  if(!cA||!cB)return;
  const adjusted=adjustPayoffs(game,cA,cB);
  const nash=findNashEquilibria(adjusted);
  const mm=minimax(adjusted);
  const area=document.getElementById("gtGameArea");
  if(!area)return;
  const sA=lang==="tr"?game.playerA.strategies.tr:game.playerA.strategies.en;
  const sB=lang==="tr"?game.playerB.strategies.tr:game.playerB.strategies.en;
  let h='<div class="gt-desc">'+(lang==="tr"?game.desc.tr:game.desc.en)+'</div>';
  // Matrix
  h+='<div class="gt-matrix-wrap"><table class="gt-matrix">';
  h+='<tr><th class="gt-corner"></th><th colspan="2" class="gt-player-label" style="color:var(--blue)">'+C[cB].f+' '+cN(cB)+'</th></tr>';
  h+='<tr><th></th><th class="gt-strat-label">'+sB[0]+'</th><th class="gt-strat-label">'+sB[1]+'</th></tr>';
  for(let i=0;i<2;i++){
    h+='<tr>';
    if(i===0)h+='<th rowspan="2" class="gt-player-label" style="color:var(--amber);writing-mode:vertical-lr;transform:rotate(180deg)">'+C[cA].f+' '+cN(cA)+'</th>';
    h+='<th class="gt-strat-label">'+sA[i]+'</th>';
    for(let j=0;j<2;j++){
      const isNE=nash.pure.some(n=>n.row===i&&n.col===j);
      h+='<td class="gt-cell'+(isNE?' gt-nash':'')+'">';
      h+='<span class="gt-payoff-a">'+(adjusted[i][j][0]>0?'+':'')+adjusted[i][j][0]+'</span>';
      h+='<span class="gt-comma">,</span>';
      h+='<span class="gt-payoff-b">'+(adjusted[i][j][1]>0?'+':'')+adjusted[i][j][1]+'</span>';
      if(isNE)h+='<div class="gt-nash-badge">NE</div>';
      h+='</td>';
    }
    h+='</tr>';
  }
  h+='</table></div>';
  // Results
  h+='<div class="gt-results">';
  h+='<div class="gt-result-section"><div class="gt-result-title">'+T("gtPureNash")+'</div>';
  if(nash.pure.length===0){h+='<div class="gt-result-val" style="color:var(--warn)">'+T("gtNoNash")+'</div>'}
  else{nash.pure.forEach(ne=>{h+='<div class="gt-result-val"><span style="color:var(--amber)">'+sA[ne.row]+'</span> / <span style="color:var(--blue)">'+sB[ne.col]+'</span> → ('+ne.payoffA+', '+ne.payoffB+')</div>'})}
  h+='</div>';
  if(nash.mixed){
    h+='<div class="gt-result-section"><div class="gt-result-title">'+T("gtMixedNash")+'</div><div class="gt-result-val">';
    h+='<span style="color:var(--amber)">'+cN(cA)+'</span>: '+sA[0]+' '+nash.mixed.probA[0]+'% / '+sA[1]+' '+nash.mixed.probA[1]+'%<br>';
    h+='<span style="color:var(--blue)">'+cN(cB)+'</span>: '+sB[0]+' '+nash.mixed.probB[0]+'% / '+sB[1]+' '+nash.mixed.probB[1]+'%<br>';
    h+=T("gtExpected")+': A='+nash.mixed.expectedA+', B='+nash.mixed.expectedB;
    h+='</div></div>';
  }
  h+='<div class="gt-result-section"><div class="gt-result-title">'+T("gtDominant")+'</div><div class="gt-result-val">';
  h+=cN(cA)+': '+(nash.dominant.A!==null?'<strong style="color:var(--pos)">'+sA[nash.dominant.A]+'</strong>':T("gtNone"))+'<br>';
  h+=cN(cB)+': '+(nash.dominant.B!==null?'<strong style="color:var(--pos)">'+sB[nash.dominant.B]+'</strong>':T("gtNone"));
  h+='</div></div>';
  h+='<div class="gt-result-section"><div class="gt-result-title">'+T("gtMinimax")+'</div><div class="gt-result-val">';
  h+=cN(cA)+': '+sA[mm.A.strategy]+' ('+T("gtGuaranteed")+': '+mm.A.value+')<br>';
  h+=cN(cB)+': '+sB[mm.B.strategy]+' ('+T("gtGuaranteed")+': '+mm.B.value+')';
  h+='</div></div></div>';
  // Theory
  h+='<div class="gt-theory"><div class="gt-theory-title">'+T("gtTheory")+'</div>';
  h+='<div class="gt-theory-text">'+(lang==="tr"?game.irTheory.tr:game.irTheory.en)+'</div>';
  h+='<div class="gt-theory-hint">'+(lang==="tr"?game.nashHint.tr:game.nashHint.en)+'</div></div>';
  
  // Iterated Game Extension
  h+='<div style="margin-top:16px; border-top:1px solid var(--border); padding-top:16px;">';
  h+='<button class="sel-go" style="width:100%" onclick="runIteratedGame(\''+sel.value+'\', 15)">▶ '+(lang==="tr"?"İTERATİF SİMÜLASYONU BAŞLAT (15 TUR)":"RUN ITERATED SIMULATION (15 ROUNDS)")+'</button>';
  h+='<div id="iteratedGameContainer"></div></div>';
  
  // AI
  if(typeof aiBtn==="function"){h+=aiBtn(T("gtAiAnalysis"),"runAIGameTheory('"+sel.value+"')")+'<div id="aiGtContainer"></div>'}
  area.innerHTML=h;
}

// STRATEGY ASSIGNMENT LOGIC
function getGtStrategyProfile(code) {
  const d = getD()[code];
  if(!d) return "Tit-for-Tat";
  const risk = d.beh.risk || 5;
  const domPress = typeof ABM !== "undefined" && ABM.agents[code] ? ABM.agents[code].domesticPressure : 40; 
  const stab = typeof ABM !== "undefined" && ABM.agents[code] ? ABM.agents[code].stability : 60;
  
  // 1) End of world / domestic crisis -> Shadow of future is zero
  if (domPress > 70 || stab < 30) return "Always Defect";
  // 2) Paranoid / offensive states
  if (risk > 7) return "Grim Trigger";
  // 3) Liberal institutionalists / stable powers
  if (risk < 4 || (d.beh.alliance||5)>6) return "Tit-for-Tat";
  // 4) Default / pragmatist
  return "Pavlov";
}

function runIteratedGame(gameKey, rounds) {
  const containerId="iteratedGameContainer";
  const game = presetGames[gameKey];
  const cA = lastSelA || (typeof selA !== "undefined" ? selA : null);
  const cB = lastSelB || (typeof selB !== "undefined" ? selB : null);
  if (!game || !cA || !cB) return;
  
  const adjPayoffs = adjustPayoffs(game, cA, cB);
  const stratA = getGtStrategyProfile(cA);
  const stratB = getGtStrategyProfile(cB);
  
  // Shadow of the Future (Discount factor Delta)
  const getDelta = (code) => {
    let press=40, stab=70;
    if (typeof ABM!=="undefined" && ABM.agents[code]) {
      press = ABM.agents[code].domesticPressure;
      stab = ABM.agents[code].stability;
    }
    return Math.max(0.1, Math.min(0.99, (stab/100) * (1 - (press/100)*0.5)));
  };
  
  const deltaA = getDelta(cA);
  const deltaB = getDelta(cB);
  
  let historyA = [];
  let historyB = [];
  let totalPayoffA = 0;
  let totalPayoffB = 0;
  let logHtml = '';
  
  const moveA_str = lang==="tr"?game.playerA.strategies.tr:game.playerA.strategies.en;
  const moveB_str = lang==="tr"?game.playerB.strategies.tr:game.playerB.strategies.en;
  
  const getMove = (strat, round, myHist, oppHist, myLastPayoff) => {
      if (strat === "Always Defect") return 1;
      if (strat === "Tit-for-Tat") return round === 0 ? 0 : oppHist[round-1];
      if (strat === "Grim Trigger") return oppHist.includes(1) ? 1 : 0;
      if (strat === "Pavlov") {
          if (round === 0) return 0;
          return myLastPayoff >= 0 ? myHist[round-1] : (myHist[round-1] === 0 ? 1 : 0);
      }
      return 0;
  };

  let lastPayA = 0, lastPayB = 0;

  for (let r=0; r<rounds; r++) {
      let moveA = getMove(stratA, r, historyA, historyB, lastPayA);
      let moveB = getMove(stratB, r, historyB, historyA, lastPayB);
      
      let rawPayA = adjPayoffs[moveA][moveB][0];
      let rawPayB = adjPayoffs[moveA][moveB][1];
      
      let discPayA = rawPayA * Math.pow(deltaA, r);
      let discPayB = rawPayB * Math.pow(deltaB, r);
      
      lastPayA = rawPayA; lastPayB = rawPayB;
      historyA.push(moveA); historyB.push(moveB);
      
      totalPayoffA += discPayA; totalPayoffB += discPayB;
      
      let colorA = moveA === 0 ? "var(--green)" : "var(--neg)";
      let colorB = moveB === 0 ? "var(--blue)" : "var(--amber)";
      let rText = lang==="tr"?"Tur ":"Round ";
      
      logHtml += '<div style="font-family:var(--font-mono); font-size: 0.8rem; margin-bottom: 4px; padding: 4px; border-left: 2px solid var(--border); background: var(--bg2);">';
      logHtml += '<strong style="color:var(--t3)">'+rText+(r+1)+':</strong> ';
      logHtml += '<span style="color:'+colorA+'">'+moveA_str[moveA]+'</span> vs ';
      logHtml += '<span style="color:'+colorB+'">'+moveB_str[moveB]+'</span> ➔ ';
      logHtml += '<span style="color:var(--t1)">'+rawPayA+' / '+rawPayB+'</span>';
      logHtml += '</div>';
  }
  
  let resHtml = '<div style="margin-top: 16px; padding: 12px; border: 1px solid rgba(0,255,65,0.4); border-radius: 4px; background: rgba(0,255,65,0.02); animation: cardEnter 0.4s ease forwards; opacity: 0;">';
  resHtml += '<div style="font-family:var(--font-mono); font-weight:700; color:var(--green); margin-bottom: 8px;">'+(lang==="tr"?"TEKRARLI OYUN (AXELROD SİMÜLASYONU)":"ITERATED GAME (AXELROD SIMULATION)")+'</div>';
  resHtml += '<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px; font-family:var(--font-mono); font-size: 0.85rem; padding-bottom: 12px; border-bottom: 1px dashed var(--border);">';
  resHtml += '<div><span style="color:var(--t3)">'+cN(cA)+' Strateji:</span> <br><strong style="color:var(--amber)">'+stratA+'</strong> <br><span style="color:var(--t2)" title="Shadow of the Future (Discount Factor)">δ (Hedef Ufku)= '+deltaA.toFixed(2)+'</span></div>';
  resHtml += '<div><span style="color:var(--t3)">'+cN(cB)+' Strateji:</span> <br><strong style="color:var(--blue)">'+stratB+'</strong> <br><span style="color:var(--t2)" title="Shadow of the Future (Discount Factor)">δ (Hedef Ufku)= '+deltaB.toFixed(2)+'</span></div>';
  resHtml += '</div>';
  resHtml += '<div style="margin-top: 12px; color:var(--t2); font-family:var(--font-mono); font-size:0.9rem;">';
  resHtml += '<strong>'+cN(cA)+' Toplam (İskontolu) Kazanç:</strong> '+(totalPayoffA>=0?'<span style="color:var(--green)">+'+totalPayoffA.toFixed(1)+'</span>':'<span style="color:var(--neg)">'+totalPayoffA.toFixed(1)+'</span>')+'<br>';
  resHtml += '<strong>'+cN(cB)+' Toplam (İskontolu) Kazanç:</strong> '+(totalPayoffB>=0?'<span style="color:var(--green)">+'+totalPayoffB.toFixed(1)+'</span>':'<span style="color:var(--neg)">'+totalPayoffB.toFixed(1)+'</span>');
  resHtml += '</div>';
  resHtml += '<div style="margin-top: 16px; max-height: 250px; overflow-y: auto; overflow-x: hidden; padding-right:4px;">'+logHtml+'</div>';
  resHtml += '</div>';
  
  const container = document.getElementById(containerId);
  container.innerHTML = resHtml;
  setTimeout(()=>container.scrollIntoView({behavior:'smooth', block:'nearest'}), 100);
}

async function runAIGameTheory(gameKey){
  const container=document.getElementById("aiGtContainer");
  if(!container)return;
  container.innerHTML=aiLoadingHTML();
  const game=presetGames[gameKey];
  const cA=lastSelA||selA,cB=lastSelB||selB;
  const adjusted=adjustPayoffs(game,cA,cB);
  const nash=findNashEquilibria(adjusted);
  const langDir=lang==="tr"?"Türkçe yanıt ver.":"Respond in English.";
  const sysPrompt="Sen bir oyun teorisi ve uluslararası ilişkiler uzmanısın. Verilen oyun matrisi ve Nash Dengesi sonuçlarını bu iki ülke bağlamında analiz et. 1) Tarihsel örnekler 2) Stratejik avantaj 3) Tekrarlanan oyun etkisi 4) Kurumsal mekanizmalar. 3-4 paragraf. "+langDir;
  const userData="Game: "+game.name.en+"\n"+cN(cA)+" vs "+cN(cB)+"\nPayoffs: "+JSON.stringify(adjusted)+"\nNash: "+JSON.stringify(nash)+"\n"+cA+" beh: risk="+getD()[cA].beh.risk+" crisis="+getD()[cA].beh.crisis+"\n"+cB+" beh: risk="+getD()[cB].beh.risk+" crisis="+getD()[cB].beh.crisis;
  try{const text=await callGroq(sysPrompt,userData);container.innerHTML=aiResultHTML(text)}
  catch(e){container.innerHTML='<div style="color:var(--warn);font-family:var(--font-mono);font-size:.7rem">'+T("aiError")+'</div>'}
}