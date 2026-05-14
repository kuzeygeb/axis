// AXIS — Discourse Analysis UI + Groq AI Live Analysis
// Depends on: data/discourse.js (DISCOURSE), core.js (lang, C, T, cN), ai.js (getGroqKey), ui.js (ICONS)

function secColor(level){return level>=8?"var(--neg)":level>=5?"var(--amber)":"var(--green)"}

function axisRow(label,valA,valB,match){
  return'<div class="disc-axis-row'+(match?" match":" mismatch")+'"><span class="disc-axis-label">'+label+'</span><span class="disc-axis-val">'+valA+'</span><span class="disc-axis-vs">'+(match?"=":"≠")+'</span><span class="disc-axis-val">'+valB+'</span></div>';
}

function formatIranStance(stance,t){
  var m={"initiator":t?"Başlatıcı":"Initiator","active_participant":t?"Aktif Katılımcı":"Active Participant","active_support":t?"Aktif Destek":"Active Support","US_aligned_support":t?"ABD Hizalı":"US-Aligned","US_Israel_aligned":t?"ABD/İsrail Hizalı":"US/Israel-Aligned","cautious_support":t?"Temkinli Destek":"Cautious Support","cautious_western_alignment":t?"Temkinli Batı":"Cautious Western","western_aligned":t?"Batı Hizalı":"Western-Aligned","victim_of_strikes_US_aligned":t?"Saldırı Hedefi":"Strike Victim","selective_condemnation":t?"Seçici Kınama":"Selective Condemn","neutral_concerned":t?"Tarafsız/Endişeli":"Neutral/Concerned","non-intervention_principle":t?"Müdahalesizlik":"Non-intervention","both_sides_condemned":t?"İki Tarafı Kınadı":"Both Condemned","condemned_all_violence":t?"Tüm Şiddeti Kınadı":"All Violence Condemned","critical_of_escalation":t?"Tırmanma Eleştirisi":"Escalation Critical","verbal_condemnation_only":t?"Sözel Kınama":"Verbal Only","verbal_condemnation_beneficiary":t?"Sözel Kınama/Yararlanıcı":"Verbal/Beneficiary","condemned_strikes_mediator_role":t?"Kınadı + Arabulucu":"Condemned + Mediator","condemned_US_Israel":t?"ABD/İsrail Kınadı":"Condemned US/Israel"};
  return m[stance]||stance;
}

function formatBrics(status,t){
  var m={"core_member":t?"Çekirdek Üye":"Core Member","2026_chair":t?"2026 Başkanı":"2026 Chair","founding_leader":t?"Kurucu Lider":"Founding Leader","new_full_member":t?"Yeni Tam Üye":"New Full Member","partner_not_full":t?"Ortak":"Partner","ambiguous_member":t?"Belirsiz":"Ambiguous","non_member":t?"Üye Değil":"Non-member","non_member_interested":t?"İlgili":"Interested","withdrew":t?"Çekildi":"Withdrew","opponent":t?"Karşıt":"Opponent"};
  return m[status]||status;
}

function renderDiscourseCard(codeA,codeB){
  var a=DISCOURSE[codeA],b=DISCOURSE[codeB];
  if(!a||!b)return"";
  var t=lang==="tr";
  var score=getDiscourseAlignment(codeA,codeB);
  var color=score>=65?"var(--green)":score>=40?"var(--amber)":"var(--neg)";
  var label=score>=65?(t?"UYUMLU SÖYLEM":"ALIGNED DISCOURSE"):score>=40?(t?"KARIŞIK SİNYALLER":"MIXED SIGNALS"):(t?"KARŞIT ANLATILA":"COUNTER-NARRATIVES");
  var discIcon=ICONS&&ICONS.discourse?ICONS.discourse:"🗣";
  var h='<div class="disc-card" style="background:var(--card-bg);border:1px solid var(--border);border-left:3px solid '+color+';border-radius:2px;padding:16px;margin-bottom:20px">';
  h+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="color:'+color+'">'+discIcon+'</span><span style="font-family:var(--font-mono);font-size:.6rem;text-transform:uppercase;letter-spacing:.12em;color:'+color+'">'+(t?"Diplomatik Söylem Analizi":"Diplomatic Discourse Analysis")+'</span><span style="margin-left:auto;font-family:var(--font-mono);font-size:1.2rem;font-weight:700;color:'+color+'">'+score+'</span></div>';
  h+='<div class="disc-score-bar"><div class="disc-score-fill" style="width:'+score+'%;background:'+color+'"></div></div>';
  h+='<div class="disc-verdict" style="color:'+color+'">'+label+'</div>';
  h+='<div class="disc-compare">';
  h+='<div class="disc-col"><div class="disc-col-title">'+cN(codeA)+'</div><div class="disc-col-leader">'+a.leader+'</div>';
  (t?a.dominantFrames.tr:a.dominantFrames.en).slice(0,3).forEach(function(f){h+='<div class="disc-frame">'+f+'</div>'});
  h+='<div class="disc-sec-level">'+(t?"Güvenlikleştirme":"Securitization")+': <span style="color:'+secColor(a.securitization.level)+'">'+a.securitization.level+'/10</span></div></div>';
  h+='<div class="disc-col"><div class="disc-col-title">'+cN(codeB)+'</div><div class="disc-col-leader">'+b.leader+'</div>';
  (t?b.dominantFrames.tr:b.dominantFrames.en).slice(0,3).forEach(function(f){h+='<div class="disc-frame">'+f+'</div>'});
  h+='<div class="disc-sec-level">'+(t?"Güvenlikleştirme":"Securitization")+': <span style="color:'+secColor(b.securitization.level)+'">'+b.securitization.level+'/10</span></div></div>';
  h+='</div>';
  if(a.counterNarrativeTo.indexOf(codeB)>=0||b.counterNarrativeTo.indexOf(codeA)>=0){
    h+='<div class="disc-counter-warn">⚠ '+(t?"Bu iki ülke birbirinin anlatısına doğrudan karşı söylem üretiyor":"These two countries produce direct counter-narratives to each other")+'</div>';
  }
  h+='<div class="disc-axes"><div class="disc-axes-title">'+(t?"Kritik Eksen Pozisyonları":"Critical Axis Positions")+'</div>';
  h+=axisRow(t?"İran Savaşı":"Iran War",formatIranStance(a.iranWarStance,t),formatIranStance(b.iranWarStance,t),a.iranWarStance===b.iranWarStance);
  h+=axisRow(t?"Filistin Tanıma":"Palestine Recognition",a.palestineRecognition?"✓":"✗",b.palestineRecognition?"✓":"✗",a.palestineRecognition===b.palestineRecognition);
  h+=axisRow("BRICS",formatBrics(a.bricsMembership,t),formatBrics(b.bricsMembership,t),a.bricsMembership===b.bricsMembership);
  h+='</div>';
  
  if (typeof generateSynthesizedCorpus === "function" && typeof analyzeDiplomaticTone === "function") {
      var corpusA = generateSynthesizedCorpus(codeA);
      var corpusB = generateSynthesizedCorpus(codeB);
      var combinedCorpus = corpusA + " " + corpusB;
      var toneResult = analyzeDiplomaticTone(combinedCorpus);
      if (toneResult) {
          h += renderToneBar(toneResult);
      }
  }

  h+='<div class="disc-ai-section">';
  var hasKey=!!getGroqKey();
  h+='<button class="disc-ai-btn" onclick="runDiscourseAI(\''+codeA+'\',\''+codeB+'\')"'+(hasKey?'':' disabled')+'>🧠 '+(t?"AI Söylem Derinlemesine Analiz":"AI Deep Discourse Analysis")+'</button>';
  if(!hasKey)h+='<div style="font-family:var(--font-mono);font-size:.5rem;color:var(--t3);margin-top:4px;text-align:center">'+T("aiNoKey")+'</div>';
  h+='<div id="discAiResult"></div></div>';
  h+='</div>';
  return h;
}

function renderDiscourseProfile(code){
  var p=DISCOURSE[code];if(!p)return"";
  var t=lang==="tr";
  var h='<div class="disc-profile-section">';
  h+='<div class="disc-profile-title">'+(t?"DİPLOMATİK SÖYLEM PROFİLİ":"DIPLOMATIC DISCOURSE PROFILE")+'</div>';
  h+='<div class="disc-profile-leader">'+p.leader+' <span class="disc-since">('+(t?"görev başlangıcı: ":"in office since: ")+p.leaderSince+')</span></div>';
  h+='<div class="disc-sub-title">'+(t?"Baskın Söylem Çerçeveleri":"Dominant Discourse Frames")+'</div>';
  h+='<div class="disc-frames-grid">';
  (t?p.dominantFrames.tr:p.dominantFrames.en).forEach(function(f,i){h+='<div class="disc-frame-tag" style="animation-delay:'+(i*60)+'ms">'+f+'</div>'});
  h+='</div>';
  h+='<div class="disc-sub-title">'+(t?"Güvenlikleştirme Düzeyi":"Securitization Level")+'</div>';
  h+='<div class="disc-sec-bar-wrap"><div class="disc-sec-bar"><div class="disc-sec-fill" style="width:'+(p.securitization.level*10)+'%;background:'+secColor(p.securitization.level)+'"></div></div><span class="disc-sec-num" style="color:'+secColor(p.securitization.level)+'">'+p.securitization.level+'/10</span></div>';
  h+='<div class="disc-sec-themes">';
  (t?p.securitization.themes.tr:p.securitization.themes.en).forEach(function(th){h+='<span class="disc-sec-chip">'+th+'</span>'});
  h+='</div>';
  h+='<div class="disc-sub-title">'+(t?"Anlatı Stili":"Narrative Style")+'</div>';
  h+='<div class="disc-narrative">'+(t?p.narrativeStyle.tr:p.narrativeStyle.en)+'</div>';
  if(p.rhetoricalDevices){
    h+='<div class="disc-sub-title">'+(t?"Retorik Araçlar":"Rhetorical Devices")+'</div><div class="disc-devices">';
    (t?p.rhetoricalDevices.tr:p.rhetoricalDevices.en).forEach(function(d){h+='<div class="disc-device">'+d+'</div>'});
    h+='</div>';
  }
  if(p.keyTerms){
    h+='<div class="disc-sub-title">'+(t?"Anahtar Terim Frekansı":"Key Term Frequency")+'</div><div class="disc-terms">';
    Object.entries(p.keyTerms).sort(function(a,b){return b[1]-a[1]}).slice(0,8).forEach(function(e){
      h+='<div class="disc-term-row"><span class="disc-term-label">'+e[0].replace(/_/g," ")+'</span><div class="disc-term-bar"><div class="disc-term-fill" style="width:'+e[1]+'%"></div></div><span class="disc-term-val">'+e[1]+'</span></div>';
    });
    h+='</div>';
  }
  h+='<div class="disc-sub-title">'+(t?"Mart 2026 Kritik Pozisyonlar":"March 2026 Critical Positions")+'</div><div class="disc-positions">';
  h+='<div class="disc-pos-row"><span class="disc-pos-label">'+(t?"İran Savaşı":"Iran War")+'</span><span class="disc-pos-val">'+formatIranStance(p.iranWarStance,t)+'</span></div>';
  h+='<div class="disc-pos-row"><span class="disc-pos-label">'+(t?"Filistin Tanıma":"Palestine Recognition")+'</span><span class="disc-pos-val">'+(p.palestineRecognition?"✓ "+(t?"Evet":"Yes"):"✗ "+(t?"Hayır":"No"))+'</span></div>';
  h+='<div class="disc-pos-row"><span class="disc-pos-label">BRICS</span><span class="disc-pos-val">'+formatBrics(p.bricsMembership,t)+'</span></div></div>';
  if(p.unga80){h+='<div class="disc-sub-title">UNGA 80 (Sept 2025)</div><div class="disc-unga">'+p.unga80+'</div>'}
  
  if (typeof generateSynthesizedCorpus === "function" && typeof analyzeDiplomaticTone === "function") {
      var corpus = generateSynthesizedCorpus(code);
      var toneResult = analyzeDiplomaticTone(corpus);
      if (toneResult) {
          h += renderToneBar(toneResult);
      }
  }

  h+='<div class="disc-sub-title">'+(t?"Söylem Uyumu":"Discourse Alignment")+'</div><div class="disc-align-row"><span class="disc-align-label">'+(t?"Uyumlu:":"Aligns with:")+'</span>';
  p.alignsWith.forEach(function(c){var cc=c.replace(/_partial/g,"").replace(/_cautious/g,"").replace(/_engaging/g,"");var partial=c.indexOf("_")>=0;h+='<span class="disc-align-chip'+(partial?" partial":"")+'">'+cc+(partial?" ~":"")+'</span>'});
  h+='</div>';
  if(p.counterNarrativeTo.length>0){
    h+='<div class="disc-align-row counter"><span class="disc-align-label">'+(t?"Karşıt anlatı:":"Counter-narrative:")+'</span>';
    p.counterNarrativeTo.forEach(function(c){h+='<span class="disc-counter-chip">'+c.replace(/_partial/g,"").replace(/_tariff_policy/g,"")+'</span>'});
    h+='</div>';
  }
  h+='</div>';
  return h;
}

async function runDiscourseAI(codeA,codeB){
  var el=document.getElementById("discAiResult");if(!el)return;
  var key=getGroqKey();var t=lang==="tr";
  if(!key){el.innerHTML='<div class="disc-ai-err">'+T("aiNoKey")+'</div>';return}
  el.innerHTML='<div class="disc-ai-loading">'+(t?"SÖYLEM ANALİZİ YAPILIYOR...":"ANALYZING DISCOURSE...")+'</div>';
  var a=DISCOURSE[codeA],b=DISCOURSE[codeB];
  var nA=cN(codeA),nB=cN(codeB);
  var sysPrompt="You are AXIS, an expert IR discourse analyst. Analyze diplomatic discourse dynamics between two countries. Be specific, cite 2025-2026 events. Use IR theory. Write in "+(t?"Turkish":"English")+". Under 300 words. Structure: 1) Discourse Compatibility 2) Frame Collision Points 3) Rhetorical Strategy Comparison 4) Key Signal to Watch.";
  var userPrompt=nA+" vs "+nB+" (March 2026)\n"+nA+": Leader: "+a.leader+", Frames: "+a.dominantFrames.en.join(", ")+", Securitization: "+a.securitization.level+"/10, Iran: "+a.iranWarStance+", Palestine: "+a.palestineRecognition+", BRICS: "+a.bricsMembership+", Counter: "+a.counterNarrativeTo.join(",")+"\n"+nB+": Leader: "+b.leader+", Frames: "+b.dominantFrames.en.join(", ")+", Securitization: "+b.securitization.level+"/10, Iran: "+b.iranWarStance+", Palestine: "+b.palestineRecognition+", BRICS: "+b.bricsMembership+", Counter: "+b.counterNarrativeTo.join(",")+"\nAlignment score: "+getDiscourseAlignment(codeA,codeB)+"/100";
  try{
    var text=await callGroq(sysPrompt,userPrompt);
    el.innerHTML='<div class="disc-ai-text">'+text.replace(/\n/g,"<br>")+'</div><div class="disc-ai-disclaimer">'+T("aiDisclaimer")+'</div>';
  }catch(e){
    el.innerHTML='<div class="disc-ai-err">'+T("aiError")+'</div>';
  }
}
