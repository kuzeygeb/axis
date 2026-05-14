// AXIS — GDELT DOC 2.0 API Integration
// Real-time media tone analysis for bilateral relations
// API: Free, no key, CORS enabled — browser-direct fetch

const gdeltNames={
  US:"United States",CN:"China",JP:"Japan",DE:"Germany",
  GB:"United Kingdom",FR:"France",IN:"India",IT:"Italy",
  BR:"Brazil",CA:"Canada",KR:"South Korea",RU:"Russia",
  AU:"Australia",MX:"Mexico",ID:"Indonesia",SA:"Saudi Arabia",
  TR:"Turkey",AR:"Argentina",ZA:"South Africa"
};

const GDELT_CACHE_TTL=2*60*60*1000; // 2 hours

function gdeltCacheKey(cA,cB){return"gdelt_"+[cA,cB].sort().join("-")}

function gdeltGetCache(cA,cB){
  try{
    const raw=sessionStorage.getItem(gdeltCacheKey(cA,cB));
    if(!raw)return null;
    const data=JSON.parse(raw);
    if(Date.now()-data.timestamp>GDELT_CACHE_TTL)return null;
    return data;
  }catch(e){return null}
}

function gdeltSetCache(cA,cB,data){
  try{sessionStorage.setItem(gdeltCacheKey(cA,cB),JSON.stringify(data))}catch(e){}
}

function gdeltQuery(cA,cB){
  const nA=gdeltNames[cA]||cA;
  const nB=gdeltNames[cB]||cB;
  return encodeURIComponent('"'+nA+'"')+"%20"+encodeURIComponent('"'+nB+'"');
}

// Inflight promise cache — prevents duplicate concurrent requests for same pair
const gdeltInflight={};

async function fetchGDELT(cA,cB){
  const key=[cA,cB].sort().join("-");

  const cached=gdeltGetCache(cA,cB);
  if(cached){
    console.log("GDELT cache hit:",cA,cB);
    return cached;
  }

  if(gdeltInflight[key]){
    console.log("GDELT inflight hit:",cA,cB);
    return gdeltInflight[key];
  }

  gdeltInflight[key]=_doFetchGDELT(cA,cB);
  try{
    return await gdeltInflight[key];
  }finally{
    delete gdeltInflight[key];
  }
}

// Helper: create a fetch with its own independent AbortController
function _gdeltFetch(url,timeoutMs){
  const ctrl=new AbortController();
  const timer=setTimeout(()=>ctrl.abort(),timeoutMs);
  return fetch(url,{signal:ctrl.signal,mode:"cors"}).finally(()=>clearTimeout(timer));
}

async function _doFetchGDELT(cA,cB){
  const q=gdeltQuery(cA,cB);
  const base="https://api.gdeltproject.org/api/v2/doc/doc?query="+q;

  console.log("GDELT fetching:",cA,cB);

  let toneTimeline=[],recentArticles=[];
  let avgTone=0,recentTone=0;
  let toneOk=false,articlesOk=false;

  // PARALLEL: Tone (30s) + Articles (15s) — each with independent AbortController
  const toneURL=base+"&mode=timelinetone&timespan=3m&format=json&TIMELINESMOOTH=5";
  const artURL=base+"&mode=artlist&maxrecords=10&timespan=7d&format=json&sort=datedesc";
  console.log("GDELT tone URL:",toneURL);
  console.log("GDELT articles URL:",artURL);

  const [toneResult,artResult]=await Promise.allSettled([
    _gdeltFetch(toneURL,30000),   // tone: 30s timeout
    _gdeltFetch(artURL,15000)     // articles: 15s timeout
  ]);

  // --- Parse tone ---
  if(toneResult.status==="fulfilled"){
    try{
      const res=toneResult.value;
      if(res.ok){
        const text=await res.text();
        console.log("GDELT tone raw (first 500):",text.substring(0,500));
        const data=JSON.parse(text);
        if(data&&data.timeline&&Array.isArray(data.timeline)&&data.timeline.length>0){
          const dataArr=data.timeline[0].data||[];
          console.log("GDELT tone data points:",dataArr.length);
          toneTimeline=dataArr.map(d=>({date:d.date||"",value:parseFloat(d.value)||0}));
          if(toneTimeline.length>0){
            avgTone=toneTimeline.reduce((s,d)=>s+d.value,0)/toneTimeline.length;
            const recent=toneTimeline.slice(-7);
            recentTone=recent.reduce((s,d)=>s+d.value,0)/recent.length;
            console.log("GDELT avgTone:",avgTone,"recentTone:",recentTone);
            toneOk=true;
          }
        }else{console.warn("GDELT tone: unexpected structure",data)}
      }else{console.warn("GDELT tone HTTP error:",res.status)}
    }catch(e){console.error("GDELT tone error:",e.message)}
  }else{console.warn("GDELT tone rejected:",toneResult.reason&&toneResult.reason.message)}

  // --- Parse articles ---
  if(artResult.status==="fulfilled"){
    try{
      const res=artResult.value;
      if(res.ok){
        const text=await res.text();
        const data=JSON.parse(text);
        console.log("GDELT articles parsed, count:",data&&data.articles?data.articles.length:0);
        if(data&&Array.isArray(data.articles)){
          recentArticles=data.articles.slice(0,10).map(a=>({
            title:a.title||"",url:a.url||"",domain:a.domain||"",
            date:a.seendate||"",tone:parseFloat(a.tone)||0
          }));
          articlesOk=recentArticles.length>0;
        }
      }else{console.warn("GDELT articles HTTP error:",res.status)}
    }catch(e){console.error("GDELT articles error:",e.message)}
  }else{console.warn("GDELT articles rejected:",artResult.reason&&artResult.reason.message)}

  // Trend direction
  let trendDirection="stable";
  if(toneTimeline.length>=30){
    const last30=toneTimeline.slice(-30);
    const prev=toneTimeline.slice(0,-30);
    if(prev.length>0){
      const delta=(last30.reduce((s,d)=>s+d.value,0)/last30.length)-(prev.reduce((s,d)=>s+d.value,0)/prev.length);
      if(delta>0.5)trendDirection="improving";
      else if(delta<-0.5)trendDirection="deteriorating";
    }
  }

  // Result logic:
  // tone OK + articles OK   → full result
  // tone OK + articles FAIL  → tone data, empty articles
  // tone FAIL + articles OK  → avgTone 0, show articles
  // both FAIL                → fetched: false
  const result={
    avgTone:Math.round(avgTone*100)/100,
    recentTone:Math.round(recentTone*100)/100,
    toneTimeline:toneTimeline,
    totalArticles:recentArticles.length,
    recentArticles:recentArticles,
    trendDirection:trendDirection,
    fetched:toneOk||articlesOk,
    toneAvailable:toneOk,
    timestamp:Date.now()
  };

  console.log("GDELT final:",toneOk?"TONE OK":"TONE FAIL",articlesOk?"ART OK":"ART FAIL","fetched:",result.fetched);

  if(result.fetched){
    gdeltSetCache(cA,cB,result);
  }

  return result;
}

// GDELT tone → AXIS score (0-100)
function gdeltToAxisScore(gdeltData){
  if(!gdeltData||!gdeltData.fetched)return 50;
  const tone=gdeltData.avgTone;
  const clamped=Math.max(-10,Math.min(10,tone));
  let score=Math.round((clamped+10)*5);
  if(gdeltData.trendDirection==="improving")score+=5;
  else if(gdeltData.trendDirection==="deteriorating")score-=5;
  return Math.max(0,Math.min(100,score));
}

function gdeltEmpty(){
  return{avgTone:0,recentTone:0,toneTimeline:[],totalArticles:0,recentArticles:[],trendDirection:"stable",fetched:false,toneAvailable:false,timestamp:0};
}
