// AXIS — Boot sequence splash screen
// Depends on: DOM elements #splash, #splashLines, #splashBar, #app-wrap

(function(){
  if(sessionStorage.getItem("axis-booted")){
    const sp=document.getElementById("splash");if(sp)sp.style.display="none";
    const aw=document.getElementById("app-wrap");if(aw){aw.classList.add("visible")}
    setTimeout(function(){if(typeof parseHash==="function")parseHash()},100);
    return;
  }
  const isT=typeof lang!=="undefined"&&lang==="tr";
  const lines=isT?["> AXIS SİSTEM v0.6 SÜRÜM 2603","> ANA MODÜLLER BAŞLATILIYOR....... OK","> G20 VERİ SETİ [19 DÜĞÜM]....... OK","> ANALİZ MOTORU [7 KATMAN]........ OK","> GDELT MEDYA AKIŞI............... BEKLEMEDE","> MİNERAL TEDARİK ZİNCİRİ........ OK","> OYUN TEORİSİ MOTORU............. OK","> HARİTA ARAYÜZÜ.................. HAZIR","> TÜM SİSTEMLER OPERASYONEL"]:["> AXIS SYSTEM v0.6 BUILD 2603","> INIT CORE MODULES.............. OK","> LOADING G20 DATASET [19 NODES]. OK","> ANALYSIS ENGINE [7 LAYERS]..... OK","> GDELT MEDIA FEED............... STANDBY","> MINERAL SUPPLY CHAIN........... OK","> GAME THEORY ENGINE............. OK","> MAP INTERFACE.................. READY","> ALL SYSTEMS OPERATIONAL"];
  const container=document.getElementById("splashLines");
  const bar=document.getElementById("splashBar");
  if(!container||!bar)return;
  let lineIdx=0,charIdx=0;
  const lineEls=[];
  lines.forEach(()=>{const el=document.createElement("div");el.className="splash-line";container.appendChild(el);lineEls.push(el)});
  function typeNext(){
    if(lineIdx>=lines.length){
      bar.style.width="100%";
      setTimeout(()=>{
        const sp=document.getElementById("splash");if(sp)sp.classList.add("done");
        setTimeout(()=>{
          if(sp)sp.style.display="none";
          const aw=document.getElementById("app-wrap");if(aw)aw.classList.add("visible");
          sessionStorage.setItem("axis-booted","1");
          setTimeout(function(){if(typeof parseHash==="function")parseHash()},100);
        },600);
      },400);
      return;
    }
    const el=lineEls[lineIdx];el.classList.add("typed");
    const txt=lines[lineIdx];
    if(charIdx<txt.length){
      el.textContent=txt.substring(0,charIdx+1)+"█";
      charIdx++;
      setTimeout(typeNext,12+Math.random()*15);
    }else{
      el.textContent=txt;
      bar.style.width=Math.round(((lineIdx+1)/lines.length)*100)+"%";
      lineIdx++;charIdx=0;
      setTimeout(typeNext,120+Math.random()*80);
    }
  }
  typeNext();
})();
