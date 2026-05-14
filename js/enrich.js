// AXIS — Data Enrichment for 193 countries
// Depends on: core.js (C), world.js (WORLD)
// Applies strategic defaults, governance estimates, and nuclear/alliance data

var ENRICH={status:"idle"};

function enrichCountries(){
  if(typeof C==="undefined"||!WORLD.loaded){ENRICH.status="waiting";return}
  ENRICH.status="enriching";
  var enriched=0;

  // ═══ NUCLEAR STATES ═══
  var nuclearStates=["US","RU","CN","GB","FR","IN","PK","IL","KP"];
  nuclearStates.forEach(function(code){if(C[code])C[code].nuc=1});

  // ═══ ALLIANCE ASSIGNMENTS (non-G20 only — G20 already has static data) ═══
  var allianceMap={
    NATO:["US","CA","GB","FR","DE","IT","TR","ES","PL","NL","BE","NO","DK","PT","CZ","HU","RO","BG","HR","SK","SI","AL","ME","MK","LT","LV","EE","LU","IS","GR","FI","SE"],
    EU:["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"],
    BRICS:["BR","RU","IN","CN","ZA","EG","ET","IR","SA","AE"],
    ASEAN:["BN","KH","ID","LA","MY","MM","PH","SG","TH","VN"],
    AU_UNION:["DZ","AO","BJ","BW","BF","BI","CV","CM","CF","TD","KM","CG","CD","CI","DJ","EG","GQ","ER","SZ","ET","GA","GM","GH","GN","GW","KE","LS","LR","LY","MG","MW","ML","MR","MU","MA","MZ","NA","NE","NG","RW","ST","SN","SC","SL","SO","ZA","SS","SD","TZ","TG","TN","UG","ZM","ZW"],
    GCC:["SA","AE","QA","KW","BH","OM"],
    MERCOSUR:["BR","AR","UY","PY"],
    CSTO:["RU","AM","BY","KZ","KG","TJ"]
  };
  Object.keys(allianceMap).forEach(function(alliance){
    allianceMap[alliance].forEach(function(code){
      if(!C[code])return;
      if(C[code].isNSA)return; // BUG-7: Skip Non-State Actors
      if(!C[code].al)C[code].al=[];
      if(C[code].al.indexOf(alliance)<0)C[code].al.push(alliance);
    });
  });

  // ═══ DEMOCRACY & FREEDOM ESTIMATES (non-G20 with defaults) ═══
  // Use governance score from WB if available to improve dem/fh estimates
  Object.keys(C).forEach(function(code){
    var c=C[code];if(!c||c.isG20||c.isNSA)return; // BUG-7: Skip NSAs
    if(c.governance&&c.governance>0){
      // Estimate democracy from governance (0-100 scale)
      if(c.dem===5)c.dem=Math.round(c.governance/10*100)/100;// rough: gov 0-100 → dem 0-10
      if(c.fh===50)c.fh=c.governance;// gov is already 0-100
      if(c.cpi===40)c.cpi=Math.round(c.governance*0.8);// rough correlation
    }
    enriched++;
  });

  ENRICH.status="done";
  console.log("[ENRICH] ✓ Enriched "+enriched+" countries (alliances, nuclear, governance estimates)");
}

// Auto-run when WORLD finishes loading
(function waitForWorld(){
  if(typeof WORLD!=="undefined"&&WORLD.loaded){enrichCountries();return}
  setTimeout(waitForWorld,300);
})();
