// AXIS — Groq API integration, settings, AI analysis functions
// Depends on: core.js (lang, T, selA, selB, getD, cN, computeAxis, coalMembers, workingData), ui.js (applyScenario)

function toggleSettings(){
  const ov=document.getElementById("settingsOverlay");
  ov.classList.toggle("show");
  if(ov.classList.contains("show")){
    document.getElementById("groqKeyInput").value=localStorage.getItem("groq-api-key")||"";
    document.getElementById("settingsTitle").textContent=T("settingsTitle");
    document.getElementById("settingsSaveBtn").textContent=T("settingsSave");
  }
}
function saveGroqKey(){
  const key=document.getElementById("groqKeyInput").value.trim();
  const st=document.getElementById("settingsStatus");
  if(key){localStorage.setItem("groq-api-key",key);st.textContent=T("settingsKeySaved");st.style.color="var(--pos)"}
  else{localStorage.removeItem("groq-api-key");st.textContent=T("settingsKeyCleared");st.style.color="var(--warn)"}
  setTimeout(()=>{st.textContent=""},3000);
}
function getGroqKey(){return localStorage.getItem("groq-api-key")||""}

async function callGroq(systemPrompt,userContent){
  const key=getGroqKey();
  if(!key)throw new Error("no-key");
  const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{
    method:"POST",
    headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},
    body:JSON.stringify({model:"llama-3.3-70b-versatile",max_tokens:2000,temperature:0.7,
      messages:[{role:"system",content:systemPrompt},{role:"user",content:userContent}]})
  });
  if(!res.ok)throw new Error("api-error: "+res.status);
  const data=await res.json();
  return data.choices[0].message.content;
}

function aiLoadingHTML(){
  return '<div class="ai-loading">'+T("aiAnalyzing")+'<div class="ai-loading-bar"><div class="ai-loading-bar-fill"></div></div></div>';
}
function aiResultHTML(text){
  return '<div class="ai-deep-result">'+text.replace(/\n/g,"<br>")+'</div><div class="ai-disclaimer">'+T("aiDisclaimer")+'</div>';
}
function aiNoKeyHTML(){
  return '<div class="ai-nokey">'+T("aiNoKey")+'</div>';
}
function aiBtn(label,onclick){
  const hasKey=!!getGroqKey();
  return '<button class="ai-deep-btn" onclick="'+onclick+'" '+(hasKey?"":"disabled")+'>🧠 '+label+'</button>'+(hasKey?'':'<div class="ai-nokey">'+T("aiNoKey")+'</div>');
}

async function runAIBilateral(){
  const container=document.getElementById("aiBilContainer");
  if(!container)return;
  container.innerHTML=aiLoadingHTML();
  const D=getD(),a=D[selA],b=D[selB],r=computeAxis(selA,selB);
  const langDir=lang==="tr"?"Türkçe yanıt ver.":"Respond in English.";
  const sysPrompt="You are a senior geopolitical intelligence officer. Analyze the relationship between these two states based on the provided AXIS metrics. Adopt a sharp, professional, and clinical tone. Avoid 'As an AI' or 'Balanced overview' clichés. Use IR frameworks (Neorealism, Constructivism, Liberalism) implicitly to provide high-fidelity strategic foresight. Focus on power-projection, stability risks, and behavioral anomalies. 3-4 concise paragraphs. "+langDir;
  const userData=cN(selA)+" vs "+cN(selB)+"\nComposite: "+r.composite+"/100\nMilitary: "+r.military.score+", Economic: "+r.economic.score+", Lobby: "+r.lobby.score+", Cultural: "+r.cultural.score+", Strategic: "+r.strategic.score+", Behavioral: "+r.behavioral.score+"\n"+a.c+" beh: decis="+a.beh.decis+" crisis="+a.beh.crisis+" risk="+a.beh.risk+" status="+a.beh.status+" predict="+a.beh.predict+"\n"+b.c+" beh: decis="+b.beh.decis+" crisis="+b.beh.crisis+" risk="+b.beh.risk+" status="+b.beh.status+" predict="+b.beh.predict+"\nTrade: $"+r.economic.tv+"B, Tension: "+r.strategic.ten+", Shared alliances: "+r.strategic.shA+", UN voting: "+((r.strategic.unA||0)*100).toFixed(0)+"%";
  try{const text=await callGroq(sysPrompt,userData);container.innerHTML=aiResultHTML(text)}
  catch(e){container.innerHTML='<div style="color:var(--warn);font-family:var(--font-mono);font-size:.7rem">'+T("aiError")+'</div>'}
}

async function runAICoalition(){
  const container=document.getElementById("aiCoalContainer");
  if(!container)return;
  container.innerHTML=aiLoadingHTML();
  const D=getD();
  const langDir=lang==="tr"?"Gerekiyorsa Türkçe yanıt ver.":"Respond in English.";
  const sysPrompt="You are a lead strategist evaluating a state-level coalition. Analyze internal cohesion dynamics, free-rider risks (Olson), and 'minimum winning coalition' viability. Contrast with historical precedents. Assess the 'weakest link' countries and their potential for alignment-shift. Professional, dense, intelligence-summary style. "+langDir;
  let userData="Coalition members: "+coalMembers.map(c=>cN(c)).join(", ")+"\n";
  for(let i=0;i<coalMembers.length;i++)for(let j=i+1;j<coalMembers.length;j++){
    const r=computeAxis(coalMembers[i],coalMembers[j]);
    userData+=coalMembers[i]+"-"+coalMembers[j]+": "+r.composite+"/100\n";
  }
  try{const text=await callGroq(sysPrompt,userData);container.innerHTML=aiResultHTML(text)}
  catch(e){container.innerHTML='<div style="color:var(--warn);font-family:var(--font-mono);font-size:.7rem">'+T("aiError")+'</div>'}
}

async function runAIScenario(){
  const container=document.getElementById("aiScenContainer");
  if(!container)return;
  container.innerHTML=aiLoadingHTML();
  const scenKey=document.getElementById("scenSelect").value;
  const scenLabel=lang==="tr"?(scenarios[scenKey]||{}).tr:(scenarios[scenKey]||{}).en;
  const langDir=lang==="tr"?"Gerekiyorsa Türkçe yanıt ver.":"Respond in English.";
  const sysPrompt="Perform a systemic domino-effect analysis for the provided geopolitical scenario. Evaluate 1st-order (direct), 2nd-order (regional), and 3rd-order (global system) impacts. Identify likely 'hedging' behaviors and alliance realignments. Avoid generic AI hedging language. Provide clear strategic foresight. "+langDir;
  let userData="Scenario: "+scenLabel+"\nAnalyzed pair: "+cN(selA)+" - "+cN(selB);
  const rBefore=computeAxis(selA,selB);
  workingData=null;const rPre=computeAxis(selA,selB);applyScenario();const rPost=computeAxis(selA,selB);
  userData+="\nBefore: "+rPre.composite+", After: "+rPost.composite+", Change: "+(rPost.composite-rPre.composite);
  try{const text=await callGroq(sysPrompt,userData);container.innerHTML=aiResultHTML(text)}
  catch(e){container.innerHTML='<div style="color:var(--warn);font-family:var(--font-mono);font-size:.7rem">'+T("aiError")+'</div>'}
}
