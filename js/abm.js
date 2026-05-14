// AXIS — Agent-Based Modeling v2.0
// IR Theory-Grounded Simulation Engine
// © 2026 Kuzey Çağan Gebrecioğlu

var ABM={agents:{},round:0,maxRounds:15,history:[],running:false,speed:2000,intervalId:null,issues:[],globalTension:30};

var ESCALATION_LADDER=[
{level:0,label:{en:"Normalized Relations",tr:"Normal İlişkiler"},color:"#00ff41"},
{level:1,label:{en:"Political Tension",tr:"Siyasi Gerilim"},color:"#44dd00"},
{level:2,label:{en:"Diplomatic Protests",tr:"Diplomatik Protestolar"},color:"#88cc00"},
{level:3,label:{en:"Ambassador Recall",tr:"Büyükelçi Geri Çağırma"},color:"#bbaa00"},
{level:4,label:{en:"Economic Sanctions",tr:"Ekonomik Yaptırımlar"},color:"#ddaa00"},
{level:5,label:{en:"Trade War",tr:"Ticaret Savaşı"},color:"#ffbb00"},
{level:6,label:{en:"Military Posturing",tr:"Askeri Gövde Gösterisi"},color:"#ff8800"},
{level:7,label:{en:"Proxy Conflict",tr:"Vekalet Çatışması"},color:"#ff6600"},
{level:8,label:{en:"Limited Military Clash",tr:"Sınırlı Askeri Çatışma"},color:"#ff4400"},
{level:9,label:{en:"Conventional War",tr:"Konvansiyonel Savaş"},color:"#ff0000"},
{level:10,label:{en:"Nuclear Threshold",tr:"Nükleer Eşik"},color:"#cc0000"}];

var ACTIONS={
diplomatic_overture:{cat:"diplomacy",tension:-3,cost:1,desc:{en:"$A sends diplomatic overture to $B",tr:"$A $B'ye diplomatik açılım yapıyor"}},
summit_proposal:{cat:"diplomacy",tension:-5,cost:3,desc:{en:"$A proposes bilateral summit with $B",tr:"$A $B ile ikili zirve teklif ediyor"}},
mediation_offer:{cat:"diplomacy",tension:-4,cost:2,desc:{en:"$A offers to mediate between $B and $C",tr:"$A $B ile $C arasında arabuluculuk teklif ediyor"}},
multilateral_initiative:{cat:"diplomacy",tension:-3,cost:4,desc:{en:"$A launches multilateral initiative at UN",tr:"$A BM'de çok taraflı girişim başlatıyor"}},
back_channel:{cat:"diplomacy",tension:-2,cost:1,desc:{en:"$A opens back-channel with $B",tr:"$A $B ile gizli diplomasi kanalı açıyor"}},
trade_agreement:{cat:"economic",tension:-4,cost:2,desc:{en:"$A signs trade agreement with $B",tr:"$A $B ile ticaret anlaşması imzalıyor"}},
economic_sanctions:{cat:"economic",tension:8,cost:5,desc:{en:"$A imposes sanctions on $B",tr:"$A $B'ye yaptırım uyguluyor"}},
currency_manipulation:{cat:"economic",tension:4,cost:3,desc:{en:"$A weaponizes currency against $B",tr:"$A para birimini $B'ye karşı silah olarak kullanıyor"}},
energy_leverage:{cat:"economic",tension:5,cost:2,desc:{en:"$A uses energy as leverage against $B",tr:"$A enerji arzını $B'ye karşı kaldıraç olarak kullanıyor"}},
development_aid:{cat:"economic",tension:-3,cost:4,desc:{en:"$A extends aid to $B",tr:"$A $B'ye kalkınma yardımı sunuyor"}},
military_exercise:{cat:"military",tension:6,cost:4,desc:{en:"$A conducts exercises near $B",tr:"$A $B sınırında tatbikat yapıyor"}},
arms_buildup:{cat:"military",tension:3,cost:6,desc:{en:"$A accelerates military modernization",tr:"$A askeri modernizasyonu hızlandırıyor"}},
arms_sale:{cat:"military",tension:2,cost:-3,desc:{en:"$A sells weapons to $B",tr:"$A $B'ye silah satıyor"}},
naval_deployment:{cat:"military",tension:7,cost:5,desc:{en:"$A deploys naval force near $B",tr:"$A $B yakınına deniz kuvveti konuşlandırıyor"}},
proxy_support:{cat:"military",tension:8,cost:4,desc:{en:"$A supports proxy forces against $B",tr:"$A $B'ye karşı vekil güçlere destek sağlıyor"}},
nuclear_signal:{cat:"military",tension:10,cost:2,desc:{en:"$A issues nuclear signal toward $B",tr:"$A $B'ye nükleer caydırıcılık sinyali gönderiyor"}},
ceasefire_proposal:{cat:"military",tension:-8,cost:1,desc:{en:"$A proposes ceasefire with $B",tr:"$A $B ile ateşkes teklif ediyor"}},
disinformation_campaign:{cat:"info",tension:4,cost:2,desc:{en:"$A launches disinfo campaign targeting $B",tr:"$A $B'yi hedef alan dezenformasyon kampanyası başlatıyor"}},
cyber_operation:{cat:"info",tension:5,cost:3,desc:{en:"$A conducts cyber op against $B",tr:"$A $B altyapısına siber operasyon düzenliyor"}},
public_diplomacy:{cat:"info",tension:-2,cost:2,desc:{en:"$A launches public diplomacy toward $B",tr:"$A $B'ye kamu diplomasisi kampanyası başlatıyor"}},
narrative_warfare:{cat:"info",tension:3,cost:1,desc:{en:"$A promotes counter-narrative against $B",tr:"$A $B'ye karşı karşı-anlatı yayıyor"}},
alliance_formation:{cat:"alliance",tension:3,cost:3,desc:{en:"$A forms alliance with $B against $C",tr:"$A $C'ye karşı $B ile ittifak kuruyor"}},
alliance_abandonment:{cat:"alliance",tension:6,cost:1,desc:{en:"$A withdraws from commitment to $B",tr:"$A $B'ye taahhüdünden çekiliyor"}},
bandwagoning:{cat:"alliance",tension:-2,cost:1,desc:{en:"$A bandwagons with $B",tr:"$A $B ile bandwagoning yapıyor"}},
balancing_coalition:{cat:"alliance",tension:4,cost:3,desc:{en:"$A initiates balancing against $B",tr:"$A $B'ye karşı dengeleme başlatıyor"}},
domestic_rally:{cat:"domestic",tension:2,cost:0,desc:{en:"$A uses crisis for rally-around-the-flag",tr:"$A krizi bayrak etrafında toplanma için kullanıyor"}},
regime_survival:{cat:"domestic",tension:5,cost:2,desc:{en:"$A diverts with foreign aggression",tr:"$A dış saldırganlıkla dikkati çeliyor"}}};

function assignIRTheory(code,beh){var r=beh.risk||5,s=beh.status||5,d=beh.dipStyle||5,p=beh.predict||5;var sc={offensiveRealist:r*2+(10-s)*1.5+(10-d),defensiveRealist:(Math.abs(5-r)<2?10:5)+s*1.5+5,liberalInstitutionalist:(10-r)*1.5+d*2+s*.5,constructivist:d*1.5+p*1.5+(10-r)*.5};var sorted=Object.entries(sc).sort(function(a,b){return b[1]-a[1]});var total=Object.values(sc).reduce(function(s,v){return s+v},0);var weights={};Object.entries(sc).forEach(function(e){weights[e[0]]=Math.round(e[1]/total*100)});return{primary:sorted[0][0],secondary:sorted[1][0],weights:weights}}

function generateStartingIssues(codes){var issues=[];if(codes.indexOf("US")>=0&&codes.indexOf("CN")>=0)issues.push({id:"trade_war",parties:["US","CN"],label:{en:"US-China Trade War",tr:"ABD-Çin Ticaret Savaşı"},intensity:7,type:"economic"});if(codes.indexOf("US")>=0&&codes.indexOf("RU")>=0)issues.push({id:"ukraine",parties:["US","RU"],label:{en:"Ukraine Conflict",tr:"Ukrayna Çatışması"},intensity:8,type:"military"});if(codes.indexOf("CN")>=0&&codes.indexOf("JP")>=0)issues.push({id:"taiwan",parties:["CN","JP"],label:{en:"Taiwan Strait",tr:"Tayvan Boğazı"},intensity:6,type:"military"});if(codes.indexOf("TR")>=0&&codes.indexOf("RU")>=0)issues.push({id:"syria",parties:["TR","RU"],label:{en:"Syria Post-Assad",tr:"Suriye Esad Sonrası"},intensity:5,type:"territorial"});if(codes.indexOf("IN")>=0&&codes.indexOf("CN")>=0)issues.push({id:"lac",parties:["IN","CN"],label:{en:"LAC Border",tr:"LAC Sınırı"},intensity:5,type:"territorial"});issues.push({id:"energy",parties:codes.filter(function(c){return["SA","RU","US","CA","AU","BR"].indexOf(c)>=0}),label:{en:"Energy Markets",tr:"Enerji Piyasaları"},intensity:6,type:"economic"});return issues}

function initAgents(countryCodes){ABM.agents={};ABM.round=0;ABM.history=[];ABM.globalTension=30;ABM.issues=generateStartingIssues(countryCodes);countryCodes.forEach(function(code){var c=C[code]||{};var beh=c.beh||{};var ir=assignIRTheory(code,beh);ABM.agents[code]={code:code,name:c.n||code,gdp:c.gdp||1000,mil:c.mil||50,nuclear:c.nuc||false,beh:{crisis:beh.crisis||5,risk:beh.risk||5,status:beh.status||5,dipStyle:beh.dipStyle||5,predict:beh.predict||5,decis:beh.decis||5,alliance:beh.alliance||5,twoLvl:beh.twoLvl||5},irTheory:ir,stability:70+Math.random()*20,influence:Math.min(100,Math.round((c.gdp||1000)/200+(c.mil||50)/8)),resources:80+Math.round(Math.random()*40),domesticPressure:20+Math.round(Math.random()*30),reputation:50,escalationLevel:{},trustLevel:{},memory:[],stats:{aggressiveActs:0,cooperativeActs:0,betrayals:0,agreements:0}};countryCodes.forEach(function(other){if(other===code)return;var axis=50;try{if(typeof computeAxis==="function")axis=computeAxis(code,other).composite}catch(e){}ABM.agents[code].escalationLevel[other]=axis<25?5:axis<40?3:axis<55?2:axis<70?1:0;ABM.agents[code].trustLevel[other]=Math.min(100,Math.round(axis))})})}

function selectTarget(agent,others){var best={code:others[0],priority:0};others.forEach(function(code){var p=0;p+=(agent.escalationLevel[code]||0)*15;ABM.issues.forEach(function(issue){if(issue.parties.indexOf(agent.code)>=0&&issue.parties.indexOf(code)>=0)p+=issue.intensity*5});p+=agent.memory.filter(function(m){return(m.by===code||m.with===code||m.against===code)&&m.round>=ABM.round-2}).length*3;p+=Math.random()*10;if(p>best.priority)best={code:code,priority:p}});return best}

function selectThirdParty(agent,others,target){var cands=others.filter(function(c){return c!==target});if(!cands.length)return null;return cands.sort(function(a,b){return(agent.trustLevel[b]||0)-(agent.trustLevel[a]||0)})[0]}

function buildAction(key,agent,target,third){var tpl=ACTIONS[key];if(!tpl)tpl=ACTIONS.diplomatic_overture;var tn=ABM.agents[target]?ABM.agents[target].name:target;var thn=third&&ABM.agents[third]?ABM.agents[third].name:"";return{type:key,target:target,thirdParty:third,cat:tpl.cat,tension:tpl.tension,cost:tpl.cost,desc:{en:tpl.desc.en.replace("$A",agent.name).replace("$B",tn).replace("$C",thn),tr:tpl.desc.tr.replace("$A",agent.name).replace("$B",tn).replace("$C",thn)},theory:agent.irTheory.primary,round:ABM.round}}

function decideAction(agent,allCodes){
    var others=allCodes.filter(function(c){return c!==agent.code});
    var tgt=selectTarget(agent,others);
    var third=selectThirdParty(agent,others,tgt.code);
    var targetAgent=ABM.agents[tgt.code];
    var theory=agent.irTheory.primary;
    var esc=agent.escalationLevel[tgt.code]||0;
    var inLoss=agent.stability<40||agent.resources<30;
    
    // 2-Level Game Emergency (Domestic Threat / Diversionary War Theory)
    if(agent.domesticPressure>75&&agent.beh.twoLvl>6){
        agent.stats.aggressiveActs++;
        var rsAct=buildAction(agent.beh.risk>7?"regime_survival":"domestic_rally",agent,tgt.code,third);
        rsAct.eu=99;rsAct.motive=lang==="tr"?"İç Baskıyı Kırmak (İki-Seviyeli Oyun)":"Divert Domestic Pressure (Two-Level Game)";
        return rsAct;
    }
    
    var possibleActions=Object.keys(ACTIONS);
    var bestAction=null;
    var maxEu=-9999;
    var bestMotive="";

    possibleActions.forEach(function(acKey){
        var tpl=ACTIONS[acKey];
        if(agent.resources<Math.max(0,tpl.cost))return; // Cannot afford
        
        var eu=0;
        var motive="";
        var relativePower=agent.influence-(targetAgent?targetAgent.influence:0);
        var targetIsStronger=relativePower<-10;
        var recentBetray=agent.memory.some(function(m){return m.round>=ABM.round-3&&m.type==="betrayal"&&m.by===tgt.code});
        var recentAggression=agent.memory.some(function(m){return m.round>=ABM.round-3&&m.type==="aggression"&&m.by===tgt.code});
        
        if(theory==="offensiveRealist"){
            // Priority: Hegemony, maximize power gap
            eu+=(tpl.tension>0&&relativePower>0)?tpl.tension*2.5:0;
            eu-=tpl.cost*1.5;
            if(tpl.cat==="military")eu+=12;
            if(tpl.cat==="economic"&&tpl.tension>0)eu+=10; // Leverage/Sanctions
            if(esc>=6&&tpl.cat==="military")eu+=15; // Escalate dominance
            if(targetIsStronger&&tpl.cat==="alliance"&&tpl.tension>0)eu+=14; // Balance threat
            motive=lang==="tr"?"Göreli Gücü (Relative Power) Maksimize Etmek":"Relative Power Maximization";
        }
        else if(theory==="defensiveRealist"){
            // Priority: State survival, stability, minimize unprovoked conflict
            eu-=tpl.tension*1.8;
            eu-=tpl.cost*1.2;
            if(inLoss&&tpl.cat==="economic"&&tpl.tension<=0)eu+=15; // Heal economy
            if(targetIsStronger&&tpl.cat==="alliance"&&tpl.tension>0)eu+=16; // External balancing
            if(esc>=5&&tpl.tension<0)eu+=12; // De-escalation
            if(tpl.cat==="military"&&tpl.tension<5&&relativePower<0)eu+=10; // Arms buildup (Security Dilemma)
            if(recentAggression&&tpl.tension>0)eu+=tpl.tension*2; // Defensive retaliation
            motive=lang==="tr"?"Devletin Bekası ve Güvenlik Arayışı":"State Survival & Defense";
        }
        else if(theory==="liberalInstitutionalist"){
            // Priority: Absolute gains, cooperation, treaties
            eu+=(tpl.tension<0)?Math.abs(tpl.tension)*2.5:-tpl.tension*2;
            if(recentBetray&&tpl.type==="economic_sanctions")eu+=25; // Institutional punishment
            if(tpl.cat==="economic"&&tpl.tension<0)eu+=15; // Trade, Aid
            if(tpl.cat==="diplomacy")eu+=12; // Summits, mediation
            motive=lang==="tr"?"Mutlak Kazanç ve Kurumsallaşma (Absolute Gains)":"Absolute Gains & Treaties";
        }
        else if(theory==="constructivist"){
            // Priority: Norms, narrative, trust building
            eu+=(tpl.tension<0)?Math.abs(tpl.tension)*1.5:-tpl.tension;
            if(tpl.cat==="info")eu+=15; // Public diplomacy, narrative warfare
            if(tpl.cat==="diplomacy")eu+=10;
            if(recentBetray&&tpl.type==="narrative_warfare")eu+=18; // Normative punishment
            motive=lang==="tr"?"Norm İnşası ve İtibar (Reputation)":"Norm Building & Reputation";
        }
        
        // Structural constraints
        if(tpl.type==="nuclear_signal"){
            if(!agent.nuclear||(targetAgent&&!targetAgent.nuclear))eu=-999;
            else if(esc<8)eu=-999;
            else eu+=35; // Brinkmanship
        }
        
        // Bounded rationality noise
        eu+=Math.random()*4;
        
        if(eu>maxEu){
            maxEu=eu;
            bestAction=tpl.type;
            bestMotive=motive;
        }
    });

    if(!bestAction)bestAction="diplomatic_overture";
    
    var finalAct=buildAction(bestAction,agent,tgt.code,third);
    finalAct.eu=Math.round(maxEu*10)/10;
    finalAct.motive=bestMotive;
    
    if(finalAct.tension>3)agent.stats.aggressiveActs++;
    else if(finalAct.tension<0)agent.stats.cooperativeActs++;
    
    return finalAct;
}

function applyAction(agent,action,allCodes){var target=action.target?ABM.agents[action.target]:null;agent.resources=Math.max(0,agent.resources-Math.max(0,action.cost));
if(target&&action.tension!==0){var ce=agent.escalationLevel[action.target]||0;agent.escalationLevel[action.target]=Math.max(0,Math.min(10,ce+Math.sign(action.tension)*Math.ceil(Math.abs(action.tension)/3)));var te=target.escalationLevel[agent.code]||0;var pm=target.beh.crisis>5?.7:1.3;target.escalationLevel[agent.code]=Math.max(0,Math.min(10,te+Math.sign(action.tension)*Math.ceil(Math.abs(action.tension)/3*pm)))}
if(target){if(action.tension<0)target.trustLevel[agent.code]=Math.min(100,(target.trustLevel[agent.code]||50)+Math.abs(action.tension));else if(action.tension>3)target.trustLevel[agent.code]=Math.max(0,(target.trustLevel[agent.code]||50)-action.tension*2)}
switch(action.type){case"economic_sanctions":if(target){target.resources-=12;target.domesticPressure+=8;agent.reputation-=3}break;case"trade_agreement":if(target){agent.resources+=8;target.resources+=6;agent.stats.agreements++;action.success=true}break;case"military_exercise":agent.influence+=2;if(target)target.domesticPressure+=3;break;case"proxy_support":if(target){target.stability-=8;agent.reputation-=5}break;case"nuclear_signal":ABM.globalTension+=15;allCodes.forEach(function(c){if(c!==agent.code&&ABM.agents[c])ABM.agents[c].domesticPressure+=5});break;case"ceasefire_proposal":if(target){var ac=(target.beh.dipStyle/10)*(1-target.beh.risk/15);action.success=Math.random()<ac;if(action.success){agent.escalationLevel[action.target]=Math.max(0,(agent.escalationLevel[action.target]||0)-3);target.escalationLevel[agent.code]=Math.max(0,(target.escalationLevel[agent.code]||0)-3);agent.reputation+=5;agent.stats.agreements++}}break;case"alliance_formation":if(target){agent.stats.agreements++;if(action.thirdParty&&ABM.agents[action.thirdParty])ABM.agents[action.thirdParty].escalationLevel[agent.code]=Math.min(10,(ABM.agents[action.thirdParty].escalationLevel[agent.code]||0)+1)}break;case"alliance_abandonment":if(target){target.trustLevel[agent.code]=Math.max(0,(target.trustLevel[agent.code]||50)-30);agent.reputation-=10;agent.stats.betrayals++;target.memory.push({round:ABM.round,type:"betrayal",by:agent.code})}break;case"disinformation_campaign":if(target){target.domesticPressure+=5;target.stability-=3;agent.reputation-=4}break;case"cyber_operation":if(target){target.resources-=8;target.stability-=5}break;case"development_aid":if(target){target.resources+=10;target.stability+=5;agent.reputation+=5;agent.resources-=5}break;case"arms_sale":if(target){agent.resources+=8;target.mil=Math.round(target.mil*1.03)}break;case"energy_leverage":if(target){target.resources-=10;target.domesticPressure+=5}break;case"domestic_rally":agent.domesticPressure-=15;agent.stability+=5;break;case"regime_survival":agent.domesticPressure-=20;if(target)agent.escalationLevel[action.target]=Math.min(10,(agent.escalationLevel[action.target]||0)+2);break}
if(action.tension<0&&target){agent.memory.push({round:ABM.round,type:"cooperation",with:action.target});target.memory.push({round:ABM.round,type:"cooperation",with:agent.code})}
if(action.tension>5&&target){agent.memory.push({round:ABM.round,type:"aggression",against:action.target});target.memory.push({round:ABM.round,type:"aggression",by:agent.code})}
if(agent.memory.length>10)agent.memory=agent.memory.slice(-10)}

function updateAgentState(agent){agent.resources=Math.min(120,agent.resources+2+Math.round((agent.gdp||1000)/5000));var vals=Object.values(agent.escalationLevel);var avgE=vals.length?vals.reduce(function(s,v){return s+v},0)/vals.length:0;if(avgE>5)agent.stability=Math.max(5,agent.stability-2);else if(avgE<2)agent.stability=Math.min(95,agent.stability+1);agent.domesticPressure=Math.max(5,agent.domesticPressure-2);if(agent.reputation>55)agent.reputation--;if(agent.reputation<45)agent.reputation++;agent.influence=Math.min(100,Math.round((agent.gdp||1000)/200*.3+(agent.mil||50)/8*.2+agent.reputation*.2+agent.resources*.15+agent.stability*.15))}

function generateShock(){var shocks=[{type:"oil_crash",desc:{en:"Oil prices crash 25%",tr:"Petrol fiyatları %25 çöktü"}},{type:"pandemic",desc:{en:"New pandemic threat",tr:"Yeni pandemi tehdidi"}},{type:"tech_shift",desc:{en:"AI breakthrough shifts balance",tr:"AI atılımı dengeyi kaydırdı"}},{type:"climate",desc:{en:"Climate disaster hits region",tr:"İklim felaketi bölgeyi vurdu"}},{type:"un_resolution",desc:{en:"UNSC passes binding resolution",tr:"BMGK bağlayıcı karar aldı"}},{type:"assassination",desc:{en:"Senior official assassinated",tr:"Üst düzey yetkili suikaste uğradı"}},{type:"financial",desc:{en:"Financial contagion spreads",tr:"Finansal bulaşma yayıldı"}},{type:"nuclear_test",desc:{en:"Nuclear test detected",tr:"Nükleer test tespit edildi"}},{type:"diplomatic_brkthru",desc:{en:"Surprise diplomatic breakthrough",tr:"Sürpriz diplomatik atılım"}}];return shocks[Math.floor(Math.random()*shocks.length)]}

function applyShock(shock,codes){var exp=["SA","RU","CA","AU","BR","ID","MX"];codes.forEach(function(code){var a=ABM.agents[code];if(!a)return;switch(shock.type){case"oil_crash":if(exp.indexOf(code)>=0)a.resources-=15;else a.resources+=8;break;case"pandemic":a.resources-=8;a.stability-=5;break;case"tech_shift":if(["US","CN","JP","DE","KR"].indexOf(code)>=0)a.influence+=8;break;case"climate":if(Math.random()<.3){a.resources-=20;a.stability-=10}break;case"un_resolution":Object.keys(a.escalationLevel).forEach(function(k){a.escalationLevel[k]=Math.max(0,a.escalationLevel[k]-1)});break;case"assassination":if(Math.random()<.2){a.stability-=20;a.domesticPressure+=25}break;case"financial":a.resources-=12;break;case"nuclear_test":ABM.globalTension=Math.min(100,ABM.globalTension+15);Object.keys(a.escalationLevel).forEach(function(k){a.escalationLevel[k]=Math.min(10,(a.escalationLevel[k]||0)+1)});break;case"diplomatic_brkthru":Object.keys(a.escalationLevel).forEach(function(k){a.escalationLevel[k]=Math.max(0,a.escalationLevel[k]-2)});break}})}

function runRound(){ABM.round++;var log={round:ABM.round,events:[]};var codes=Object.keys(ABM.agents);var shuffled=codes.slice().sort(function(){return Math.random()-.5});shuffled.forEach(function(code){var a=ABM.agents[code];var action=decideAction(a,codes);log.events.push({actor:code,action:action});applyAction(a,action,codes)});codes.forEach(function(code){updateAgentState(ABM.agents[code])});var avgE=codes.reduce(function(s,c){return s+Object.values(ABM.agents[c].escalationLevel).reduce(function(ss,v){return ss+v},0)},0)/(codes.length*Math.max(1,codes.length-1));ABM.globalTension=Math.round(avgE*10);if(ABM.round%2===0&&Math.random()<.3){var shock=generateShock();log.events.push({actor:"SYSTEM",action:{type:"shock",desc:shock.desc,shock:shock}});applyShock(shock,codes)}ABM.issues.forEach(function(issue){var mx=0;issue.parties.forEach(function(p){issue.parties.forEach(function(q){if(p!==q&&ABM.agents[p])mx=Math.max(mx,ABM.agents[p].escalationLevel[q]||0)})});issue.intensity=Math.max(1,Math.min(10,mx))});ABM.history.push(log);return log}

function showABM(){var mv=document.getElementById("abmView");if(!mv)return;var t=lang==="tr";var h='<div class="abm-container"><div class="abm-header"><div class="abm-title">'+(t?"AJAN TABANLI SİMÜLASYON v2.0":"AGENT-BASED SIMULATION v2.0")+'</div><div class="abm-subtitle">'+(t?"IR Teorisi Tabanlı — Tırmanma Merdiveni, Hafıza, Prospect Theory":"IR Theory-Grounded — Escalation Ladder, Memory, Prospect Theory")+'</div></div>';
h+='<div class="abm-select"><div class="abm-select-title">'+(t?"Simülasyon ülkelerini seçin (3-8):":"Select simulation countries (3-8):")+'</div><div class="abm-country-grid">';Object.keys(C).forEach(function(code){h+='<button class="abm-country-btn" data-code="'+code+'" onclick="toggleABMCountry(this)"><img src="https://flagcdn.com/w20/'+(_flagMap[code]||code.toLowerCase())+'.png" width="16" height="11"> '+(C[code].n||code)+'</button>'});h+='</div></div>';
h+='<div class="abm-controls"><button class="abm-btn start" onclick="startABM()">▶ '+(t?"BAŞLAT":"START")+'</button><button class="abm-btn pause" onclick="pauseABM()" style="display:none" id="abmPauseBtn">'+(t?"⏸ DURAKLAT":"⏸ PAUSE")+'</button><button class="abm-btn reset" onclick="resetABM()">↻ '+(t?"SIFIRLA":"RESET")+'</button><div class="abm-speed"><label>'+(t?"Hız:":"Speed:")+'</label><input type="range" min="500" max="3000" value="2000" step="250" onchange="ABM.speed=+this.value" class="abm-slider"></div><div class="abm-round-counter" id="abmRoundNum">'+(t?"Tur: 0/15":"Round: 0/15")+'</div></div>';
h+='<div class="abm-sim-area" id="abmSimArea" style="display:none"><div class="abm-agents-grid" id="abmAgentsGrid"></div><div class="abm-log-panel"><div class="abm-log-title">'+(t?"OLAY GÜNLÜĞÜ":"EVENT LOG")+'</div><div class="abm-log" id="abmLog"></div></div></div>';
h+='<div class="abm-ai" id="abmAiSection" style="display:none"><button class="disc-ai-btn" onclick="runABMAI()">🧠 '+(t?"AI Simülasyon Analizi":"AI Simulation Analysis")+'</button><div id="abmAiResult"></div></div></div>';mv.innerHTML=h}

var abmSelectedCountries=[];
function toggleABMCountry(btn){var code=btn.dataset.code;var idx=abmSelectedCountries.indexOf(code);if(idx>=0){abmSelectedCountries.splice(idx,1);btn.classList.remove("selected")}else if(abmSelectedCountries.length<8){abmSelectedCountries.push(code);btn.classList.add("selected")}}

function startABM(){if(abmSelectedCountries.length<3){alert(lang==="tr"?"En az 3 ülke seçin":"Select at least 3 countries");return}initAgents(abmSelectedCountries);ABM.running=true;document.getElementById("abmSimArea").style.display="grid";document.getElementById("abmPauseBtn").style.display="inline-flex";document.getElementById("abmAiSection").style.display="block";renderAgents();ABM.intervalId=setInterval(function(){if(!ABM.running)return;if(ABM.round>=ABM.maxRounds){pauseABM();return}var log=runRound();renderAgents();renderLog(log);document.getElementById("abmRoundNum").textContent=(lang==="tr"?"Tur: ":"Round: ")+ABM.round+"/"+ABM.maxRounds},ABM.speed)}

function pauseABM(){ABM.running=!ABM.running;var btn=document.getElementById("abmPauseBtn");if(btn)btn.textContent=ABM.running?(lang==="tr"?"⏸ DURAKLAT":"⏸ PAUSE"):(lang==="tr"?"▶ DEVAM":"▶ RESUME")}
function resetABM(){ABM.running=false;if(ABM.intervalId)clearInterval(ABM.intervalId);ABM.round=0;ABM.history=[];abmSelectedCountries=[];showABM()}

function mBar(label,val,color){return'<div class="abm-mini-bar"><span class="abm-mini-label">'+label+'</span><div class="abm-mini-track"><div class="abm-mini-fill" style="width:'+Math.max(0,Math.min(100,val))+'%;background:'+color+'"></div></div><span class="abm-mini-val">'+Math.round(val)+'</span></div>'}

function renderAgents(){var grid=document.getElementById("abmAgentsGrid");if(!grid)return;var t=lang==="tr";var h='<div class="abm-global-bar" style="grid-column:1/-1"><span class="abm-global-label">'+(t?"KÜRESEL GERİLİM":"GLOBAL TENSION")+'</span><div class="abm-global-track"><div class="abm-global-fill" style="width:'+ABM.globalTension+'%;background:'+(ABM.globalTension>60?"var(--neg)":ABM.globalTension>35?"var(--amber)":"var(--green)")+'"></div></div><span class="abm-global-val">'+ABM.globalTension+'%</span></div>';
Object.values(ABM.agents).forEach(function(agent){var maxE=Math.max.apply(null,Object.values(agent.escalationLevel).concat([0]));var escInfo=ESCALATION_LADDER[Math.min(10,maxE)];var thLbl={offensiveRealist:t?"Saldırgan Realizm":"Off. Realism",defensiveRealist:t?"Savunmacı Realizm":"Def. Realism",liberalInstitutionalist:t?"Liberal Kurumsalcılık":"Lib. Institutionalism",constructivist:t?"Konstrüktivizm":"Constructivism"}[agent.irTheory.primary]||agent.irTheory.primary;
h+='<div class="abm-agent-card" style="border-top:2px solid '+escInfo.color+'"><div class="abm-agent-hdr"><img src="https://flagcdn.com/w20/'+(_flagMap[agent.code]||agent.code.toLowerCase())+'.png" width="16" height="11"> <span class="abm-agent-name">'+agent.name+'</span><span class="abm-agent-status" style="color:'+escInfo.color+'">'+(t?escInfo.label.tr:escInfo.label.en)+'</span></div>';
h+='<div class="abm-theory-tag">'+thLbl+' ('+agent.irTheory.weights[agent.irTheory.primary]+'%)</div>';
h+='<div class="abm-agent-bars">'+mBar(t?"İstikrar":"Stability",agent.stability,agent.stability>50?"var(--green)":"var(--neg)")+mBar(t?"Kaynak":"Resources",agent.resources,"var(--cyan)")+mBar(t?"Etki":"Influence",agent.influence,"var(--amber)")+mBar(t?"İç Baskı":"Dom.Press",agent.domesticPressure,agent.domesticPressure>50?"var(--neg)":"var(--t3)")+mBar(t?"İtibar":"Reputation",agent.reputation,agent.reputation>50?"var(--green)":"var(--amber)")+'</div>';
h+='<div class="abm-agent-stats"><span title="'+(t?"Agresif":"Aggressive")+'">⚔'+agent.stats.aggressiveActs+'</span><span title="'+(t?"İşbirlikçi":"Cooperative")+'">🤝'+agent.stats.cooperativeActs+'</span><span title="'+(t?"Anlaşma":"Agreements")+'">📝'+agent.stats.agreements+'</span>';if(agent.stats.betrayals>0)h+='<span style="color:var(--neg)">⚡'+agent.stats.betrayals+'</span>';h+='</div></div>'});grid.innerHTML=h}

function acColor(type){var t=ACTIONS[type];if(!t)return"var(--t3)";if(t.tension>=6)return"var(--neg)";if(t.tension>=3)return"#ff6600";if(t.tension>0)return"var(--amber)";if(t.tension<=-4)return"var(--green)";return"var(--cyan)"}

function renderLog(roundLog){var log=document.getElementById("abmLog");if(!log)return;var t=lang==="tr";var icons={diplomacy:"🕊",economic:"💰",military:"⚔",info:"📡",alliance:"🔗",domestic:"🏛"};var h='<div class="abm-log-round">'+(t?"══ Tur ":"══ Round ")+roundLog.round+' ══</div>';
roundLog.events.forEach(function(evt){
  var isSys=evt.actor==="SYSTEM";
  var color=isSys?"var(--neg)":acColor(evt.action.type);
  var icon=isSys?"⚡":(icons[evt.action.cat]||"•");
  h+='<div class="abm-log-event" style="border-left-color:'+color+'">';
  if(isSys){
    h+='<span class="abm-log-system">⚡ '+(t?"SİSTEM":"SYSTEM")+':</span> '+(t?evt.action.desc.tr:evt.action.desc.en)
  }else{
    var thLbl={offensiveRealist:"Off. Realism",defensiveRealist:"Def. Realism",liberalInstitutionalist:"Lib. Inst.",constructivist:"Construct."}[evt.action.theory]||evt.action.theory;
    var thTag=evt.action.theory?' <span class="abm-log-theory" style="opacity:0.6;font-size:0.7em;margin-left:4px">['+thLbl+']</span>':"";
    var expU=evt.action.eu!==undefined?'<span style="color:var(--amber);margin-left:6px;font-size:0.7em">[EU: '+evt.action.eu+']</span>':"";
    h+=icon+" "+(t?evt.action.desc.tr:evt.action.desc.en)+thTag+expU;
    if(evt.action.success===false)h+=' <span class="abm-log-fail">✗</span>';
    if(evt.action.success===true)h+=' <span class="abm-log-success">✓</span>';
    if(evt.action.motive)h+='<div style="margin-top:4px;font-size:0.75rem;color:var(--t3);border-left:2px solid var(--amber);padding-left:8px"><i>'+(t?"Hedef: ":"Motive: ")+evt.action.motive+'</i></div>';
  }
  h+='</div>'
});
log.innerHTML=h+log.innerHTML;while(log.children.length>80)log.removeChild(log.lastChild)}

async function runABMAI(){var el=document.getElementById("abmAiResult");if(!el)return;var key=getGroqKey();var t=lang==="tr";if(!key){el.innerHTML='<div class="disc-ai-err">'+T("aiNoKey")+'</div>';return}el.innerHTML='<div class="disc-ai-loading">'+(t?"SİMÜLASYON ANALİZİ...":"ANALYZING SIMULATION...")+'</div>';var s="ABM v2.0 after "+ABM.round+" rounds. Global tension: "+ABM.globalTension+"%\n";Object.values(ABM.agents).forEach(function(a){var maxE=Math.max.apply(null,Object.values(a.escalationLevel).concat([0]));s+=a.name+": theory="+a.irTheory.primary+", escMax="+maxE+", stab="+Math.round(a.stability)+", res="+Math.round(a.resources)+", rep="+Math.round(a.reputation)+", domPress="+Math.round(a.domesticPressure)+"\n";var th=Object.entries(a.escalationLevel).sort(function(x,y){return y[1]-x[1]}).slice(0,2).map(function(e){return e[0]+":L"+e[1]}).join(",");s+="  escalation: "+th+" | acts: agg="+a.stats.aggressiveActs+" coop="+a.stats.cooperativeActs+" agree="+a.stats.agreements+"\n"});s+="\nActive issues: "+ABM.issues.map(function(i){return i.label.en+"("+i.intensity+")"}).join(", ")+"\n\nLast 3 rounds:\n";ABM.history.slice(-3).forEach(function(rd){rd.events.forEach(function(e){s+="R"+rd.round+": "+e.action.desc.en+"\n"})});try{var text=await callGroq("You are AXIS, an IR simulation analyst specializing in agent-based models. Analyze: 1) Emerging bloc formations based on IR theory alignments 2) Escalation risks using Kahn's escalation ladder 3) Two-level game dynamics 4) Prospect theory effects 5) System polarity assessment. Write in "+(t?"Turkish":"English")+". Under 250 words.",s);el.innerHTML='<div class="disc-ai-text">'+text.replace(/\n/g,"<br>")+'</div><div class="disc-ai-disclaimer">'+T("aiDisclaimer")+'</div>'}catch(e){el.innerHTML='<div class="disc-ai-err">'+T("aiError")+'</div>'}}
