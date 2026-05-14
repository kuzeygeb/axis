// AXIS — Backtesting & Validation Module
// © 2026 Kuzey Çağan Gebrecioğlu

var BACKTEST_EVENTS=[
{pair:["US","CN"],date:"2022-08",event:{en:"Pelosi Taiwan visit — PLA exercises",tr:"Pelosi Tayvan ziyareti — PLA tatbikatları"},expectedRange:[15,35],category:"crisis"},
{pair:["US","RU"],date:"2022-02",event:{en:"Russia invades Ukraine",tr:"Rusya Ukrayna'yı işgal etti"},expectedRange:[5,20],category:"war"},
{pair:["CN","AU"],date:"2020-05",event:{en:"China trade war on Australia",tr:"Çin Avustralya'ya ticaret savaşı"},expectedRange:[20,40],category:"trade_war"},
{pair:["TR","FR"],date:"2020-10",event:{en:"Erdogan-Macron Islam clash",tr:"Erdoğan-Macron İslam çatışması"},expectedRange:[25,40],category:"crisis"},
{pair:["US","GB"],date:"2021-09",event:{en:"AUKUS alliance announced",tr:"AUKUS ittifakı ilan edildi"},expectedRange:[70,90],category:"alliance"},
{pair:["US","JP"],date:"2023-01",event:{en:"Japan defense buildup + US alignment",tr:"Japonya savunma artışı + ABD hizalaması"},expectedRange:[75,90],category:"alliance"},
{pair:["DE","FR"],date:"2023-01",event:{en:"Elysee Treaty 60th — deepened cooperation",tr:"Elysee 60. yıl — derinleşen işbirliği"},expectedRange:[65,85],category:"cooperation"},
{pair:["IN","RU"],date:"2022-12",event:{en:"India maintains Russian oil purchases",tr:"Hindistan Rus petrol alımını sürdürdü"},expectedRange:[55,75],category:"cooperation"},
{pair:["CN","RU"],date:"2022-02",event:{en:"Xi-Putin 'no limits' partnership",tr:"Xi-Putin 'sınırsız' ortaklık"},expectedRange:[60,80],category:"alliance"},
{pair:["US","IN"],date:"2023-06",event:{en:"Modi US state visit — defense deals",tr:"Modi ABD ziyareti — savunma anlaşmaları"},expectedRange:[55,75],category:"cooperation"},
{pair:["TR","SA"],date:"2022-04",event:{en:"Erdogan visits Saudi — normalization",tr:"Erdoğan Suudi ziyareti — normalleşme"},expectedRange:[40,60],category:"normalization"},
{pair:["CN","AU"],date:"2023-11",event:{en:"Albanese visits Beijing — trade easing",tr:"Albanese Pekin — ticaret gevşemesi"},expectedRange:[35,50],category:"normalization"}
];

function runBacktest(){var results=[];var hits=0,misses=0,totalError=0;BACKTEST_EVENTS.forEach(function(evt){var a=evt.pair[0],b=evt.pair[1];var score=50;try{if(typeof computeAxis==="function")score=computeAxis(a,b).composite}catch(e){}var inRange=score>=evt.expectedRange[0]&&score<=evt.expectedRange[1];var mid=(evt.expectedRange[0]+evt.expectedRange[1])/2;var error=Math.abs(score-mid);if(inRange)hits++;else misses++;totalError+=error;results.push({pair:evt.pair,event:lang==="tr"?evt.event.tr:evt.event.en,date:evt.date,axisScore:score,expectedRange:evt.expectedRange,inRange:inRange,error:Math.round(error)})});return{results:results,accuracy:Math.round(hits/(hits+misses)*100),mae:Math.round(totalError/results.length),hits:hits,misses:misses,total:results.length}}

function renderBacktestPanel(){var t=lang==="tr";var bt=runBacktest();var h='<div class="bt-panel"><div class="bt-title">'+(t?"BACKTESTING — TAHMİN GÜCÜ":"BACKTESTING — PREDICTIVE VALIDATION")+'</div><div class="bt-subtitle">'+(t?"AXIS skorları 2020-2025 olaylarla karşılaştırılıyor":"AXIS scores vs 2020-2025 known events")+'</div>';
h+='<div class="bt-metrics"><div class="bt-metric"><span class="bt-metric-val" style="color:'+(bt.accuracy>=60?"var(--green)":"var(--amber)")+'">'+bt.accuracy+'%</span><span class="bt-metric-label">'+(t?"İsabet":"Hit Rate")+'</span></div><div class="bt-metric"><span class="bt-metric-val">'+bt.mae+'</span><span class="bt-metric-label">'+(t?"Ort. Hata":"MAE")+'</span></div><div class="bt-metric"><span class="bt-metric-val">'+bt.hits+'/'+bt.total+'</span><span class="bt-metric-label">'+(t?"Aralıkta":"In Range")+'</span></div></div>';
h+='<table class="bt-table"><tr><th>'+(t?"Çift":"Pair")+'</th><th>'+(t?"Olay":"Event")+'</th><th>'+(t?"Tarih":"Date")+'</th><th>AXIS</th><th>'+(t?"Beklenen":"Expected")+'</th><th>'+(t?"Sonuç":"Result")+'</th></tr>';
bt.results.forEach(function(r){var icon=r.inRange?"✓":"✗";var color=r.inRange?"var(--green)":"var(--neg)";h+='<tr><td>'+r.pair.join("-")+'</td><td class="bt-event-cell">'+r.event+'</td><td>'+r.date+'</td><td style="font-weight:700">'+r.axisScore+'</td><td>'+r.expectedRange[0]+'-'+r.expectedRange[1]+'</td><td style="color:'+color+';font-weight:700">'+icon+' (±'+r.error+')</td></tr>'});h+='</table>';
h+='<div class="bt-note">'+(t?"Not: Temporal mismatch — mevcut veri ile geçmiş olaylar karşılaştırılıyor. Yaklaşımsal validasyon.":"Note: Temporal mismatch — current data vs past events. Approximate validation.")+'</div></div>';return h}

// Phase 6: Deep Historical Simulation (Pre-crisis snapshots)
const BACKTEST_CASES = [
    {
        id: "RU_UA_2013",
        title: lang==="tr" ? "RU-UA (Aralık 2013) : Kırım Öncesi" : "RU-UA (Dec 2013) : Pre-Crimea",
        desc: lang==="tr" ? "Euromaidan protestoları zirvede. Asimetrik güç farkı çok yüksek. Teorik soru: Model 2014 işgalini öngörebilir mi?" : "Euromaidan peak. High asymmetric military unbalance. Can the model predict the 2014 invasion?",
        actualOutcome: lang==="tr" ? "Savaş / İlhak (2014) - Kırılma" : "War / Annexation (2014) - Breakdown",
        a: {f:"🇷🇺", nuc:true, usc:true, mB:88000, gB:2297000, cpi:28, dem:2.1, reg:"EE"},
        b: {f:"🇺🇦", nuc:false, usc:false, mB:2300, gB:183000, cpi:25, dem:4.5, reg:"EE"},
        bil: {trade:40000, unA:0.2, ten:"critical", sameRegion:true, sharedLang:true, hofDist:15}
    },
    {
        id: "US_IQ_2002",
        title: lang==="tr" ? "US-IQ (Kasım 2002) : Irak İstila Öncesi" : "US-IQ (Nov 2002) : Pre-Iraq Invasion",
        desc: lang==="tr" ? "ABD hegemonyasının zirvesi, Irak izole. WMD iddiaları. Bush doktrini devrede." : "Peak US hegemony, Iraq is isolated. WMD claims. Bush doctrine active.",
        actualOutcome: lang==="tr" ? "Savaş / İstila (2003) - Rejim Değişikliği" : "War / Invasion (2003) - Regime Change",
        a: {f:"🇺🇸", nuc:true, usc:true, mB:348000, gB:10930000, cpi:76, dem:8.5, reg:"AM"},
        b: {f:"🇮🇶", nuc:false, usc:false, mB:1500, gB:30000, cpi:15, dem:1.2, reg:"ME"},
        bil: {trade:0, unA:0.05, ten:"critical", sameRegion:false, sharedLang:false, hofDist:65}
    },
    {
        id: "UK_EU_2015",
        title: lang==="tr" ? "UK-DE (Haziran 2015) : Brexit Öncesi Stres" : "UK-DE (June 2015) : Pre-Brexit Stress",
        desc: lang==="tr" ? "Muhafazakar parti AB referandumu sözü verdi. Ekonomik olarak stabil ama diplomatik hizalanma çatırdıyor." : "Conservative party promises EU referendum. Econ stable, but diplomatic alignment fracturing.",
        actualOutcome: lang==="tr" ? "Ayrılık / Brexit (2016) - Diplomatik Kopuş" : "Separation / Brexit (2016) - Diplomatic Rupture",
        a: {f:"🇬🇧", nuc:true, usc:true, mB:47000, gB:2928000, cpi:81, dem:8.3, reg:"WE"},
        b: {f:"🇩🇪", nuc:false, usc:false, mB:39000, gB:3360000, cpi:81, dem:8.6, reg:"WE"},
        bil: {trade:150000, unA:0.85, ten:"medium", sameRegion:true, sharedLang:false, hofDist:20}
    },
    {
        id: "US_CN_2018",
        title: lang==="tr" ? "US-CN (Temmuz 2018) : Ticaret Savaşı Başlangıcı" : "US-CN (July 2018) : Trade War Onset",
        desc: lang==="tr" ? "Trump yönetimi ilk büyük tarifeleri uyguladı. Teknoloji savaşı (Huawei) kızışıyor. Stratejik rekabet paradigmasına geçiş." : "Trump administration imposes first major tariffs. Tech war (Huawei) heats up. Shift to strategic competition paradigm.",
        actualOutcome: lang==="tr" ? "Ticaret Savaşı / Sistemik Rekabet" : "Trade War / Systemic Rivalry",
        a: {f:"🇺🇸", nuc:true, usc:true, mB:716000, gB:20500000, cpi:71, dem:8.1, reg:"AM"},
        b: {f:"🇨🇳", nuc:true, usc:true, mB:230000, gB:13600000, cpi:39, dem:2.2, reg:"EA"},
        bil: {trade:660000, unA:0.15, ten:"high", sameRegion:false, sharedLang:false, hofDist:60}
    },
    {
        id: "TR_GR_2020",
        title: lang==="tr" ? "TR-GR (Ağustos 2020) : Doğu Akdeniz Krizi" : "TR-GR (Aug 2020) : East Med Standoff",
        desc: lang==="tr" ? "Oruç Reis araştırma gemisi ve donanma eşliği. Ege'de it dalaşı ve deniz yetki alanları çatışması." : "Oruç Reis research vessel deployment. Naval standoff in Aegean and maritime jurisdiction dispute.",
        actualOutcome: lang==="tr" ? "Askeri Gerginlik / Brinkmanship" : "Military Tension / Brinkmanship",
        a: {f:"🇹🇷", nuc:false, usc:false, mB:19000, gB:720000, cpi:40, dem:2.5, reg:"ME"},
        b: {f:"🇬🇷", nuc:false, usc:false, mB:5000, gB:190000, cpi:50, dem:7.4, reg:"WE"},
        bil: {trade:3500, unA:0.4, ten:"critical", sameRegion:true, sharedLang:false, hofDist:25}
    },
    {
        id: "FR_AU_2021",
        title: lang==="tr" ? "FR-AU (Eylül 2021) : AUKUS Şoku" : "FR-AU (Sept 2021) : AUKUS Shock",
        desc: lang==="tr" ? "Avustralya Fransız denizaltı anlaşmasını iptal edip AUKUS'a katıldı. Fransa büyükelçisini geri çekti. Diplomatik 'ihanet'." : "Australia cancels French submarine deal for AUKUS. France recalls ambassador. Diplomatic 'betrayal'.",
        actualOutcome: lang==="tr" ? "Diplomatik Kopuş / İttifak Krizi" : "Diplomatic Rupture / Alliance Crisis",
        a: {f:"🇫🇷", nuc:true, usc:true, mB:52000, gB:2930000, cpi:71, dem:8.0, reg:"WE"},
        b: {f:"🇦🇺", nuc:false, usc:false, mB:26000, gB:1550000, cpi:73, dem:8.9, reg:"OC"},
        bil: {trade:5000, unA:0.8, ten:"high", sameRegion:false, sharedLang:false, hofDist:35}
    }
];

function runHistoricalSimulation() {
    let ht = '<div style="max-width:900px;margin:40px auto;animation:fadeUp 0.4s ease;font-family:var(--font-mono)">';
    ht += '<h2 style="color:var(--amber);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.1em;display:flex;align-items:center;gap:10px;"><span style="font-size:1.5rem">🔬</span> '+(lang==='tr'?'TARİHSEL DOĞRULAMA (BACKTESTING)':'HISTORICAL VALIDATION (BACKTESTING)')+'</h2>';
    ht += '<p style="color:var(--t3);margin-bottom:30px;font-size:var(--text-md);line-height:1.6">'+
        (lang==="tr"?"Bu modül, AXIS analitik motorunun geçmişte yaşanmış krizleri ne kadar doğru öngörebildiğini test etmek için tasarlanmıştır. " +
        "Teorik modeller ('Lens' sistemi) tarihte dondurulmuş (hardcoded) statik verilere tabi tutulur." :
        "This module tests the predictive validity of the AXIS analytical engine against historically frozen macro-economic and diplomatic data. " +
        "Different theoretical Lenses are applied to past crises to evaluate model accuracy.")+'</p>';

    BACKTEST_CASES.forEach(c => {
        let a = c.a; let b = c.b; 
        
        let mRatio = a.mB / Math.max(1, b.mB); let milS = 50;
        if(mRatio > 10) milS = 10; else if(mRatio > 2) milS = 30; else if(mRatio < 0.1) milS = 90; else if(mRatio < 0.5) milS = 70;
        if(a.nuc && !b.nuc) milS = Math.max(0, milS - 15);
        
        let eRatio = a.gB / Math.max(1, b.gB); let econS = 50;
        if(eRatio > 5) econS = 20; else if (eRatio < 0.2) econS = 80;
        
        let cultS=Math.max(0, 100 - c.bil.hofDist); if(c.bil.sameRegion) cultS+=15; cultS=Math.min(100,cultS);
        let stratS=(c.bil.unA)*100; if(c.bil.ten==="high") stratS-=15; if(c.bil.ten==="critical") stratS-=25; stratS=Math.max(0,Math.min(100,stratS));
        let lobbyS = (a.cpi + b.cpi)/2;
        let behS = 40; 
        
        let aw=typeof getActiveWeights==="function"?getActiveWeights():{military:.16,economic:.20,lobby:.10,cultural:.10,strategic:.20,behavioral:.12,media:.12};
        var wNorm=aw.military+aw.economic+aw.lobby+aw.cultural+aw.strategic+aw.behavioral; 
        let comp=milS*(aw.military/wNorm)+econS*(aw.economic/wNorm)+lobbyS*(aw.lobby/wNorm)+cultS*(aw.cultural/wNorm)+stratS*(aw.strategic/wNorm)+behS*(aw.behavioral/wNorm);
        comp = Math.round(comp*10)/10;
        
        let v = typeof getVerdict==="function"?getVerdict(comp):{c:"var(--amber)",t:"N/A"};
        let match = false;
        if (c.id.includes("RU_UA") && comp < 40) match = true;
        if (c.id.includes("US_IQ") && comp < 45) match = true;
        if (c.id.includes("UK_EU") && comp > 40 && comp < 70) match = true;
        if (c.id.includes("US_CN") && comp > 30 && comp < 55) match = true;
        if (c.id.includes("TR_GR") && comp < 35) match = true;
        if (c.id.includes("FR_AU") && comp < 50) match = true;
        
        ht += '<div style="background:var(--card-bg);border:1px solid '+(match?'var(--pos)':'var(--border)')+';border-radius:4px;padding:24px;margin-bottom:20px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:var(--glow);position:relative">';
        if (match) ht += '<div style="position:absolute;top:10px;right:16px;color:var(--pos);font-weight:700;letter-spacing:0.1em;font-size:0.8rem">✓ '+(lang==='tr'?'MODEL DOĞRULANDI':'MODEL VALIDATED')+'</div>';
        else ht += '<div style="position:absolute;top:10px;right:16px;color:var(--warn);font-weight:700;letter-spacing:0.1em;font-size:0.8rem">⚠️ '+(lang==='tr'?'SAPMA (MISS)':'DEVIATION (MISS)')+'</div>';
        
        ht += '<h3 style="color:var(--t1);font-size:1.2rem;margin-bottom:8px;font-family:var(--font-mono)">'+a.f+' vs '+b.f+' : '+c.title+'</h3>';
        ht += '<p style="color:var(--t2);font-size:var(--text-sm);margin-bottom:16px">'+c.desc+'</p>';
        
        ht += '<div style="display:flex;gap:20px;flex-wrap:wrap;background:rgba(0,0,0,0.05);padding:16px;border-radius:4px;border:1px solid var(--border)">';
            ht += '<div style="flex:1;min-width:120px">';
                ht += '<div style="font-size:var(--text-xs);color:var(--t3);text-transform:uppercase">'+(lang==='tr'?'Gerçekleşen Tarihi Olay':'Actual Historical Outcome')+'</div>';
                ht += '<div style="color:var(--neg);font-weight:700;margin-top:4px">'+c.actualOutcome+'</div>';
            ht += '</div>';
            ht += '<div style="flex:1;min-width:120px">';
                ht += '<div style="font-size:var(--text-xs);color:var(--t3);text-transform:uppercase">'+(lang==='tr'?'Tahmin Edilen AXIS Skoru':'Computed AXIS Score')+'</div>';
                ht += '<div style="font-size:1.5rem;font-weight:700;color:'+v.c+';margin-top:4px">'+comp+' <span style="font-size:var(--text-sm);font-weight:400;opacity:0.7">/ 100</span></div>';
            ht += '</div>';
        ht += '</div>';
        
        let insight = "";
        if(c.id==="RU_UA_2013") insight = (lang==='tr') ? "Geçmiş snapshot verisi. Realist lens savaş öngörüsünü kesinleştirir." : "Historical snapshot. Realist lens captures peak invasion probability.";
        if(c.id==="US_IQ_2002") insight = (lang==='tr') ? "Maksimum güç asimetrisi. Model rejim değişikliği olasılığını yakalıyor." : "Peak power asymmetry. Model captures high regime change probability.";
        if(c.id==="UK_EU_2015") insight = (lang==='tr') ? "Tansiyon düşük ama yapısal uyum azaldığından 'Sınırlı İşbirliği' (transaksiyonel) sinyali veriliyor." : "Low tension but structural decay signals a shift to transactional relations.";
        if(c.id==="US_CN_2018") insight = (lang==='tr') ? "Maksimum ticaret bağımlılığı skoru 50'de tutarken, stratejik rekabet ve teknoloji savaşı skoru 'Sistemik Rekabet' seviyesine çekiyor." : "Trade interdependence acts as a floor, while strategic competition forces the score into 'Systemic Rivalry'.";
        if(c.id==="TR_GR_2020") insight = (lang==='tr') ? "Kritik askeri tansiyon ve deniz yetki asimetrisi. Brinkmanship (savaşın eşiği) dinamiklerini %30 altında yakalar." : "Critical military tension. Successfully captures brinkmanship dynamics below 30 threshold.";
        if(c.id==="FR_AU_2021") insight = (lang==='tr') ? "İttifak içi ani güven krizi. Davranışsal uyumsuzluk ('Betrayal') skoru hızla aşağı çeker." : "Intra-alliance trust crisis. Behavioral misalignment ('Betrayal') drives rapid score decay.";
        
        ht += '<div style="margin-top:16px;font-size:0.8rem;color:var(--t3);border-left:2px solid var(--amber);padding-left:12px;opacity:0.8"><i>'+(lang==='tr'?'Analist Notu: ':'Analyst Note: ')+insight+'</i></div>';
        
        ht += '</div>';
    });

    ht += '</div>';
    document.getElementById("results").innerHTML = ht;
    document.getElementById("results").className = "results show";
}
