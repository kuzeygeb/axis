// AXIS — Export functions (CSV, PDF/Print)
// Depends on: core.js (selA, selB, coalMembers, getD, cN, computeAxis, B, bK)

function exportCSV(){
  let csv="";
  if(selA&&selB){
    const D=getD(),a=D[selA],b=D[selB],r=computeAxis(selA,selB);
    csv+="AXIS Bilateral Analysis\n";
    csv+="Country A,"+cN(selA)+"\nCountry B,"+cN(selB)+"\n";
    csv+="Composite Score,"+r.composite+"\n\n";
    csv+="Layer,Score\n";
    csv+="Military,"+r.military.score+"\n";
    csv+="Economic,"+r.economic.score+"\n";
    csv+="Lobby,"+r.lobby.score+"\n";
    csv+="Cultural,"+r.cultural.score+"\n";
    csv+="Strategic,"+r.strategic.score+"\n";
    csv+="Behavioral,"+r.behavioral.score+"\n\n";
    csv+="Details\n";
    csv+="Bilateral Trade,$"+r.economic.tv+"B\n";
    csv+="UN Voting Alignment,"+(r.strategic.unA*100).toFixed(0)+"%\n";
    csv+="Shared Alliances,"+r.strategic.shA+"\n";
    csv+="Tension,"+r.strategic.ten+"\n";
    csv+="Hofstede Distance,"+r.cultural.hd+"\n";
    csv+="Data Confidence,"+(B[bK(selA,selB)]?"HIGH":"ESTIMATED")+"\n\n";
    csv+="Country Data\n";
    csv+="Code,Name,GDP(B$),Mil(B$),Pop(M),TradeOpen%,CPI,Democracy,FreedomH,Region\n";
    [selA,selB].forEach(c=>{const d=D[c];csv+=c+","+d.n+","+d.gdp+","+d.mil+","+d.pop+","+d.to+","+d.cpi+","+d.dem+","+d.fh+","+d.r+"\n"});
  } else if(coalMembers.length>=3){
    const D=getD();
    csv+="AXIS Coalition Analysis\n";
    csv+="Members,"+coalMembers.map(c=>cN(c)).join(" | ")+"\n\n";
    csv+="Cohesion Matrix\n";
    csv+=","+coalMembers.join(",")+"\n";
    coalMembers.forEach(a=>{
      csv+=a;
      coalMembers.forEach(b=>{csv+=","+(a===b?"-":computeAxis(a,b).composite)});
      csv+="\n";
    });
    csv+="\nCountry Data\n";
    csv+="Code,Name,GDP(B$),Mil(B$),Pop(M),TradeOpen%,CPI,Democracy,FreedomH,Region\n";
    coalMembers.forEach(c=>{const d=D[c];csv+=c+","+d.n+","+d.gdp+","+d.mil+","+d.pop+","+d.to+","+d.cpi+","+d.dem+","+d.fh+","+d.r+"\n"});
  }
  if(!csv)return;
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download="axis-analysis-"+new Date().toISOString().slice(0,10)+".csv";
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportPDF(){
  window.print();
}
