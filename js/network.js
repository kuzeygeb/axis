// AXIS — Coalition Network Graph (D3.js v7 force-directed)
// Depends on: D3.js v7, core.js (C, cN, computeAxis, lang, T, mode), data/translations.js (blocs)

let _netSim=null;
let _netSvg=null;

function destroyNetwork(containerId){
  if(_netSim){_netSim.stop();_netSim=null}
  const el=document.getElementById(containerId);
  if(el){el.innerHTML=""}
  _netSvg=null;
}

function renderNetworkGraph(containerId,members,computeAxisFn,mini){
  destroyNetwork(containerId);
  const container=document.getElementById(containerId);
  if(!container||!members||members.length<2)return;
  if(typeof d3==="undefined"){console.warn("D3.js not loaded");return}

  const isSmall=mini||false;
  const svgH=isSmall?250:400;

  // Title + legend
  const titleKey=isSmall?"netGraphBil":"netGraph";
  container.innerHTML='<div class="network-title">'+T(titleKey)+'</div>';

  // Tooltip div
  const ttDiv=document.createElement("div");
  ttDiv.className="network-tooltip";
  container.appendChild(ttDiv);

  // Build nodes
  const nodes=members.map(code=>{
    const c=C[code];
    return{id:code,name:cN(code),flag:c.f,gdp:c.gdp,mil:c.mil,
      r:Math.max(isSmall?15:20,Math.min(isSmall?35:45,c.gdp/600))};
  });

  // Build edges
  const edges=[];
  for(let i=0;i<members.length;i++){
    for(let j=i+1;j<members.length;j++){
      const r=computeAxisFn(members[i],members[j]);
      edges.push({source:members[i],target:members[j],score:r.composite,tension:r.strategic?r.strategic.ten:"unknown"});
    }
  }

  // SVG setup
  const rect=container.getBoundingClientRect();
  const svgW=Math.max(300,rect.width-24);
  const svg=d3.select(container).append("svg")
    .attr("viewBox","0 0 "+svgW+" "+svgH)
    .attr("preserveAspectRatio","xMidYMid meet")
    .style("height",svgH+"px");
  _netSvg=svg;

  // CSS var colors
  const cs=getComputedStyle(document.documentElement);
  const colPos=cs.getPropertyValue("--pos").trim()||"#00e676";
  const colWarn=cs.getPropertyValue("--warn").trim()||"#ffab00";
  const colNeg=cs.getPropertyValue("--neg").trim()||"#ff1744";
  const colCyan=cs.getPropertyValue("--cyan").trim()||"#00e5ff";
  const colBg3=cs.getPropertyValue("--bg3").trim()||"#151b22";
  const colT2=cs.getPropertyValue("--t2").trim()||"#7da67e";
  const colT3=cs.getPropertyValue("--t3").trim()||"#4a6a4a";

  function edgeColor(score){return score>=60?colPos:score>=35?colWarn:colNeg}

  // Edge group
  const edgeG=svg.append("g").attr("class","edges");
  const link=edgeG.selectAll("line").data(edges).enter().append("line")
    .attr("class","edge-line")
    .attr("stroke",d=>edgeColor(d.score))
    .attr("stroke-width",d=>Math.max(1,d.score/25))
    .attr("stroke-opacity",.6)
    .attr("stroke-dasharray",d=>d.tension==="critical"?"4,2":"none");

  // Edge labels (score)
  const showLabels=edges.length<=10;
  const edgeLabel=svg.append("g").selectAll("text").data(edges).enter().append("text")
    .attr("class","edge-label")
    .attr("font-size","8px")
    .attr("fill",colT3)
    .attr("opacity",showLabels?0.7:0)
    .text(d=>d.score);

  // Node group
  const nodeG=svg.append("g").attr("class","nodes");
  const node=nodeG.selectAll("g").data(nodes).enter().append("g").attr("class","node");

  // Circles
  node.append("circle")
    .attr("class","node-circle")
    .attr("r",d=>d.r)
    .attr("fill",colBg3)
    .attr("stroke",colCyan)
    .attr("stroke-width",2);

  // Flag emoji
  node.append("text")
    .attr("class","node-label")
    .attr("dy","0.35em")
    .attr("font-size",d=>Math.max(12,d.r*0.8)+"px")
    .text(d=>d.flag);

  // Country code label below
  node.append("text")
    .attr("class","node-label")
    .attr("dy",d=>d.r+12+"px")
    .attr("font-size","9px")
    .attr("fill",colT2)
    .text(d=>d.id);

  // Force simulation
  const sim=d3.forceSimulation(nodes)
    .force("link",d3.forceLink(edges).id(d=>d.id).distance(d=>Math.max(60,200-d.score*1.5)))
    .force("charge",d3.forceManyBody().strength(-300))
    .force("center",d3.forceCenter(svgW/2,svgH/2))
    .force("collide",d3.forceCollide().radius(d=>d.r+10))
    .alphaDecay(0.02);
  _netSim=sim;

  // Reduced motion: instant settle
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches){
    sim.alpha(0).stop();
    for(let i=0;i<300;i++)sim.tick();
    updatePositions();
  }

  sim.on("tick",updatePositions);

  function updatePositions(){
    // Clamp to SVG bounds
    nodes.forEach(d=>{
      d.x=Math.max(d.r,Math.min(svgW-d.r,d.x));
      d.y=Math.max(d.r,Math.min(svgH-d.r,d.y));
    });
    link.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y)
        .attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);
    edgeLabel.attr("x",d=>(d.source.x+d.target.x)/2).attr("y",d=>(d.source.y+d.target.y)/2-4);
    node.attr("transform",d=>"translate("+d.x+","+d.y+")");
  }

  // Drag
  const drag=d3.drag()
    .on("start",function(event,d){if(!event.active)sim.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y})
    .on("drag",function(event,d){d.fx=event.x;d.fy=event.y})
    .on("end",function(event,d){if(!event.active)sim.alphaTarget(0);d.fx=null;d.fy=null});
  node.call(drag);

  // Hover: highlight connected
  node.on("mouseenter",function(event,d){
    const connected=new Set();
    edges.forEach(e=>{
      const s=typeof e.source==="object"?e.source.id:e.source;
      const t=typeof e.target==="object"?e.target.id:e.target;
      if(s===d.id)connected.add(t);
      if(t===d.id)connected.add(s);
    });
    node.select("circle").attr("stroke-opacity",n=>n.id===d.id||connected.has(n.id)?1:0.15);
    link.attr("stroke-opacity",e=>{
      const s=typeof e.source==="object"?e.source.id:e.source;
      const t=typeof e.target==="object"?e.target.id:e.target;
      return s===d.id||t===d.id?0.9:0.08;
    });
    edgeLabel.attr("opacity",e=>{
      const s=typeof e.source==="object"?e.source.id:e.source;
      const t=typeof e.target==="object"?e.target.id:e.target;
      return s===d.id||t===d.id?1:0;
    });
    d3.select(this).select("circle").transition().duration(150).attr("r",d.r*1.3);
    // Tooltip
    ttDiv.innerHTML='<div class="tt-name">'+d.flag+" "+d.name+'</div>'+
      '<div class="tt-row"><span>'+T("netGdp")+'</span><span class="tt-val">$'+d.gdp+'B</span></div>'+
      '<div class="tt-row"><span>'+T("netMil")+'</span><span class="tt-val">$'+d.mil+'B</span></div>'+
      '<div class="tt-row"><span>'+T("netNodeTooltip")+'</span><span class="tt-val">'+connected.size+'</span></div>';
    ttDiv.style.left=(event.offsetX+15)+"px";
    ttDiv.style.top=(event.offsetY-10)+"px";
    ttDiv.classList.add("visible");
  }).on("mouseleave",function(event,d){
    node.select("circle").attr("stroke-opacity",1);
    link.attr("stroke-opacity",0.6);
    edgeLabel.attr("opacity",showLabels?0.7:0);
    d3.select(this).select("circle").transition().duration(150).attr("r",d.r);
    ttDiv.classList.remove("visible");
  });

  // Edge hover
  link.on("mouseenter",function(event,d){
    const s=typeof d.source==="object"?d.source.id:d.source;
    const t=typeof d.target==="object"?d.target.id:d.target;
    ttDiv.innerHTML='<div class="tt-name">'+s+" — "+t+'</div><div class="tt-row"><span>'+T("netEdgeScore")+'</span><span class="tt-val">'+d.score+'/100</span></div>';
    ttDiv.style.left=(event.offsetX+15)+"px";
    ttDiv.style.top=(event.offsetY-10)+"px";
    ttDiv.classList.add("visible");
    d3.select(this).attr("stroke-width",Math.max(3,d.score/15));
  }).on("mouseleave",function(event,d){
    ttDiv.classList.remove("visible");
    d3.select(this).attr("stroke-width",Math.max(1,d.score/25));
  });

  // Legend
  const legend=document.createElement("div");
  legend.className="network-legend";
  legend.innerHTML='<div class="network-legend-item"><div class="network-legend-line strong"></div>'+T("netLegendStrong")+'</div>'+
    '<div class="network-legend-item"><div class="network-legend-line moderate"></div>'+T("netLegendMod")+'</div>'+
    '<div class="network-legend-item"><div class="network-legend-line weak"></div>'+T("netLegendWeak")+'</div>'+
    '<div class="network-legend-item" style="margin-left:auto;opacity:.5">'+T("netDrag")+'</div>';
  container.appendChild(legend);
}

function updateNetworkTheme(){
  if(!_netSvg)return;
  const cs=getComputedStyle(document.documentElement);
  const colCyan=cs.getPropertyValue("--cyan").trim();
  const colBg3=cs.getPropertyValue("--bg3").trim();
  const colT2=cs.getPropertyValue("--t2").trim();
  _netSvg.selectAll(".node-circle").attr("fill",colBg3).attr("stroke",colCyan);
  _netSvg.selectAll(".node-label").filter(function(){return d3.select(this).attr("font-size")==="9px"}).attr("fill",colT2);
}

// Find shared alliance members for bilateral mini-graph
function findSharedAllianceMembers(cA,cB){
  const aAl=C[cA]?C[cA].al:[];
  const bAl=C[cB]?C[cB].al:[];
  const shared=aAl.filter(a=>bAl.includes(a));
  if(shared.length===0)return null;
  // Find the bloc with most members
  let best=null,bestSize=0;
  for(const[bk,bv]of Object.entries(blocs)){
    if(shared.includes(bv.l)||shared.some(s=>s.toLowerCase()===bk.toLowerCase())){
      if(bv.m.length>bestSize&&bv.m.includes(cA)&&bv.m.includes(cB)){
        best=bv.m;bestSize=bv.m.length;
      }
    }
  }
  // Fallback: check bloc membership directly
  if(!best){
    for(const[bk,bv]of Object.entries(blocs)){
      if(bv.m.includes(cA)&&bv.m.includes(cB)&&bv.m.length>bestSize){
        best=bv.m;bestSize=bv.m.length;
      }
    }
  }
  if(best&&best.length>6)best=best.slice(0,6);
  return best&&best.length>=2?best:null;
}
