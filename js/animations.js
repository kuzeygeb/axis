// AXIS — Counting animation and stagger utilities
// No dependencies — pure DOM/animation helpers

function countUp(el,target,duration){
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches){el.textContent=target;return}
  const start=0,startTime=performance.now();
  const isFloat=String(target).includes(".");
  function tick(now){
    const elapsed=now-startTime;
    const progress=Math.min(elapsed/duration,1);
    const eased=1-Math.pow(1-progress,3);
    const current=start+(target-start)*eased;
    el.textContent=isFloat?current.toFixed(1):Math.round(current);
    // Subtle scale bounce near end
    if(progress>=.7&&progress<1){
      el.style.transform="scale("+(1+(1-progress)*.03)+")";
    }else if(progress>=1){
      el.style.transform="scale(1)";
    }
    if(progress<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function applyStagger(selector,baseDelay){
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  document.querySelectorAll(selector).forEach((el,i)=>{
    el.style.animationDelay=(baseDelay+i*40)+"ms";
  });
}
