// AXIS — AHP Weight Validation (Saaty 1980)
// © 2026 Kuzey Çağan Gebrecioğlu

var AHP_LAYERS=["military","economic","lobby","cultural","strategic","behavioral","gdelt"];
var AHP_LABELS={en:{military:"Military",economic:"Economic",lobby:"Lobby",cultural:"Cultural",strategic:"Strategic",behavioral:"Behavioral",gdelt:"Media"},tr:{military:"Askeri",economic:"Ekonomik",lobby:"Lobi",cultural:"Kültürel",strategic:"Stratejik",behavioral:"Davranış",gdelt:"Medya"}};
var SAATY_SCALE={"1/9":1/9,"1/7":1/7,"1/5":1/5,"1/3":1/3,"1":1,"3":3,"5":5,"7":7,"9":9};
var RI=[0,0,0.58,0.9,1.12,1.24,1.32,1.41,1.45,1.49];

var DEFAULT_PAIRWISE=[[1,.5,3,3,1,2,2],[2,1,3,3,1,2,2],[1/3,1/3,1,1,1/3,.5,1],[1/3,1/3,1,1,1/3,.5,1],[1,1,3,3,1,2,2],[.5,.5,2,2,.5,1,1],[.5,.5,1,1,.5,1,1]];
var currentPairwise=DEFAULT_PAIRWISE.map(function(r){return r.slice()});

function computeAHP(matrix){var n=matrix.length;var colSums=[];for(var j=0;j<n;j++){var s=0;for(var i=0;i<n;i++)s+=matrix[i][j];colSums.push(s)}var norm=matrix.map(function(row,i){return row.map(function(v,j){return v/colSums[j]})});var weights=norm.map(function(row){return row.reduce(function(s,v){return s+v},0)/n});var Aw=matrix.map(function(row){return row.reduce(function(s,v,j){return s+v*weights[j]},0)});var lambdaMax=Aw.reduce(function(s,v,i){return s+v/weights[i]},0)/n;var CI=(lambdaMax-n)/(n-1);var CR=n>2?CI/RI[n-1]:0;var wMap={};AHP_LAYERS.forEach(function(l,i){wMap[l]=Math.round(weights[i]*1000)/1000});return{weights:weights,lambdaMax:lambdaMax,CI:CI,CR:CR,consistent:CR<0.10,weightMap:wMap}}

var DEFAULT_AHP=computeAHP(DEFAULT_PAIRWISE);

function formatReciprocal(val){if(val>=1)return Math.round(val).toString();return"1/"+Math.round(1/val)}

function showAHPPanel(){var t=lang==="tr";var h='<div class="ahp-panel"><div class="ahp-title">'+(t?"AHP AĞIRLIK VALİDASYONU":"AHP WEIGHT VALIDATION")+'</div><div class="ahp-subtitle">'+(t?"Saaty (1980) Analitik Hiyerarşi Süreci":"Saaty (1980) Analytic Hierarchy Process")+'</div>';
h+='<div class="ahp-matrix-wrap"><table class="ahp-matrix"><tr><th></th>';AHP_LAYERS.forEach(function(l){h+='<th>'+(t?AHP_LABELS.tr[l]:AHP_LABELS.en[l])+'</th>'});h+='</tr>';
for(var i=0;i<7;i++){h+='<tr><td class="ahp-row-label">'+(t?AHP_LABELS.tr[AHP_LAYERS[i]]:AHP_LABELS.en[AHP_LAYERS[i]])+'</td>';for(var j=0;j<7;j++){if(i===j)h+='<td class="ahp-diag">1</td>';else if(j>i){h+='<td><select class="ahp-select" data-i="'+i+'" data-j="'+j+'" onchange="updateAHPMatrix()">';Object.keys(SAATY_SCALE).forEach(function(k){var sel=Math.abs(SAATY_SCALE[k]-currentPairwise[i][j])<0.15?" selected":"";h+='<option value="'+k+'"'+sel+'>'+k+'</option>'});h+='</select></td>'}else h+='<td class="ahp-recip" id="ahpCell_'+i+'_'+j+'">'+formatReciprocal(currentPairwise[i][j])+'</td>'}h+='</tr>'}h+='</table></div>';
h+='<div class="ahp-results" id="ahpResults"></div>';
h+='<div class="ahp-presets"><div class="ahp-presets-title">'+(t?"Hazır Uzman Profilleri:":"Expert Presets:")+'</div>';
h+='<button class="ahp-preset-btn" onclick="loadAHPPreset(\'realist\')">'+(t?"Realist":"Realist")+'</button>';
h+='<button class="ahp-preset-btn" onclick="loadAHPPreset(\'liberal\')">'+(t?"Liberal":"Liberal")+'</button>';
h+='<button class="ahp-preset-btn" onclick="loadAHPPreset(\'constructivist\')">'+(t?"Konstrüktivist":"Constructivist")+'</button>';
h+='<button class="ahp-preset-btn" onclick="loadAHPPreset(\'balanced\')">'+(t?"Dengeli":"Balanced")+'</button></div>';
h+='<button class="ahp-apply-btn" onclick="applyAHPWeights()">'+(t?"BU AĞIRLIKLARI UYGULA":"APPLY THESE WEIGHTS")+'</button></div>';return h}

function updateAHPMatrix(){document.querySelectorAll(".ahp-select").forEach(function(sel){var i=+sel.dataset.i,j=+sel.dataset.j;var val=SAATY_SCALE[sel.value];currentPairwise[i][j]=val;currentPairwise[j][i]=1/val;var cell=document.getElementById("ahpCell_"+j+"_"+i);if(cell)cell.textContent=formatReciprocal(1/val)});renderAHPResults(computeAHP(currentPairwise))}

function renderAHPResults(result){var el=document.getElementById("ahpResults");if(!el)return;var t=lang==="tr";var h='<div class="ahp-result-title">'+(t?"TÜRETİLMİŞ AĞIRLIKLAR":"DERIVED WEIGHTS")+'</div>';
if(!result.consistent)h+='<div class="ahp-cr-warn">⚠ CR = '+result.CR.toFixed(4)+' > 0.10 — '+(t?"Tutarsız!":"Inconsistent!")+'</div>';
else h+='<div class="ahp-cr-ok">✓ CR = '+result.CR.toFixed(4)+' < 0.10 — '+(t?"Tutarlı":"Consistent")+'</div>';
h+='<div class="ahp-cr-detail">λmax='+result.lambdaMax.toFixed(3)+' CI='+result.CI.toFixed(4)+' CR='+result.CR.toFixed(4)+'</div>';
h+='<div class="ahp-weight-bars">';var defs={military:16,economic:20,lobby:10,cultural:10,strategic:20,behavioral:12,gdelt:12};
Object.entries(result.weightMap).sort(function(a,b){return b[1]-a[1]}).forEach(function(e){var pct=Math.round(e[1]*100);var diff=pct-(defs[e[0]]||0);var dc=diff>0?"var(--green)":diff<0?"var(--neg)":"var(--t3)";h+='<div class="ahp-weight-row"><span class="ahp-weight-label">'+(t?AHP_LABELS.tr[e[0]]:AHP_LABELS.en[e[0]])+'</span><div class="ahp-weight-bar-track"><div class="ahp-weight-bar-fill" style="width:'+pct+'%"></div></div><span class="ahp-weight-val">'+pct+'%</span><span class="ahp-weight-diff" style="color:'+dc+'">'+(diff>0?"+":"")+diff+'</span></div>'});
h+='</div>';el.innerHTML=h}

var AHP_PRESETS={realist:[[1,.5,5,5,1,3,3],[2,1,5,5,2,3,3],[1/5,1/5,1,1,1/5,1/3,1],[1/5,1/5,1,1,1/5,1/3,1/3],[1,.5,5,5,1,3,3],[1/3,1/3,3,3,1/3,1,1],[1/3,1/3,1,3,1/3,1,1]],liberal:[[1,1/3,2,2,.5,1,2],[3,1,5,3,1,3,3],[.5,1/5,1,1,1/3,.5,1],[.5,1/3,1,1,1/3,1,1],[2,1,3,3,1,2,2],[1,1/3,2,1,.5,1,1],[.5,1/3,1,1,.5,1,1]],constructivist:[[1,1,2,.5,1,.5,1],[1,1,2,.5,1,.5,1],[.5,.5,1,1/3,.5,1/3,1],[2,2,3,1,2,1,2],[1,1,2,.5,1,.5,1],[2,2,3,1,2,1,2],[1,1,1,.5,1,.5,1]],balanced:DEFAULT_PAIRWISE.map(function(r){return r.slice()})};

function loadAHPPreset(name){currentPairwise=AHP_PRESETS[name].map(function(r){return r.slice()});document.querySelectorAll(".ahp-select").forEach(function(sel){var i=+sel.dataset.i,j=+sel.dataset.j;var val=currentPairwise[i][j];var closest="1";var minD=Infinity;Object.entries(SAATY_SCALE).forEach(function(e){if(Math.abs(e[1]-val)<minD){minD=Math.abs(e[1]-val);closest=e[0]}});sel.value=closest});for(var i=0;i<7;i++)for(var j=0;j<i;j++){var cell=document.getElementById("ahpCell_"+i+"_"+j);if(cell)cell.textContent=formatReciprocal(currentPairwise[i][j])}renderAHPResults(computeAHP(currentPairwise))}

function applyAHPWeights(){var result=computeAHP(currentPairwise);if(!result.consistent&&!confirm(lang==="tr"?"CR>0.10. Yine de uygulansın mı?":"CR>0.10. Apply anyway?"))return;Object.entries(result.weightMap).forEach(function(e){if(typeof customWeights!=="undefined")customWeights[e[0]]=e[1]});alert(lang==="tr"?"AHP ağırlıkları uygulandı.":"AHP weights applied.")}
