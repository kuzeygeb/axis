// AXIS — URL Hash Router for shareable links
// Depends on: core.js (C, selA, selB, coalMembers, mode), ui.js (setMode, updateUI), all analysis modules

function pushState(hash){
  try{history.replaceState(null,'','#'+hash)}catch(e){}
}

function parseHash(){
  const hash=window.location.hash.slice(1);
  if(!hash)return;
  const parts=hash.split('/');
  const m=parts[0];
  try{
    if(m==='bilateral'&&parts[1]&&parts[2]&&C[parts[1]]&&C[parts[2]]){
      setMode('bilateral');selA=parts[1];selB=parts[2];updateUI();runBilateral();
    }else if(m==='coalition'&&parts[1]){
      const members=parts[1].split(',').filter(c=>C[c]);
      if(members.length>=3){setMode('coalition');coalMembers=members;updateUI();runCoalition()}
    }else if(m==='scenario'&&parts[1]&&parts[2]&&parts[3]&&C[parts[2]]&&C[parts[3]]){
      setMode('scenario');selA=parts[2];selB=parts[3];
      const sel=document.getElementById('scenSelect');if(sel)sel.value=parts[1];
      updateUI();runScenarioAnalysis();
    }else if(m==='sensitivity'&&parts[1]&&parts[2]&&C[parts[1]]&&C[parts[2]]){
      setMode('sensitivity');selA=parts[1];selB=parts[2];updateUI();runSensitivity();
    }else if(m==='profiles'&&parts[1]&&C[parts[1]]){
      setMode('profiles');showProfile(parts[1]);
    }else if(m==='profiles'){
      setMode('profiles');
    }else if(m==='chat'){
      setMode('chat');
    }else if(m==='abm'){
      setMode('abm');
    }else if(m==='methodology'){
      setMode('methodology');
    }
  }catch(e){console.warn('Router error:',e)}
}

function copyLink(){
  navigator.clipboard.writeText(window.location.href).then(()=>{
    const btn=event&&event.target?event.target.closest('.exp-btn'):null;
    if(btn){const orig=btn.innerHTML;btn.innerHTML='✓ Copied!';setTimeout(()=>{btn.innerHTML=orig},1500)}
  }).catch(()=>{});
}

window.addEventListener('hashchange',parseHash);
