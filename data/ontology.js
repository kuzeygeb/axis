// AXIS — Asymmetric Ontology Engine (State vs Non-State Actors)
// © 2026 Kuzey Çağan Gebrecioğlu

const ONTOLOGY_NSA = {
  // ═════ MEGA-CORPORATIONS (TECH & FINANCE) ═════
  NSA_TSMC: {
    n: "TSMC",
    type: "corp",
    f: "⬢", // BUG-6: display icon for chips/headers
    flag: "⬢",
    desc: { bg: "Taiwan Semiconductor Manufacturing Company. The world's most valuable semiconductor foundry, controlling over 60% of the global market for contract chipmaking and 90% of advanced chips. A critical chokepoint in the global economy and US-China geopolitical competition." },
    c: "var(--econ)",
    lat: 24.77, lng: 120.99,
    gdp: 700, // proxy (market cap in billions)
    mil: 0,
    mp: 0,
    to: 100, // maximum trade openness dependency
    pop: 0.07, // employees in millions
    gdpPC: 10000000, 
    cpi: 85, dem: 50, fh: 80, civSoc: 50, nuc: 0, usc: 0, cs: 10,
    al: ["US_Tech_Ecosystem", "Western_Supply_Chain"],
    hof: { pdi: 60, idv: 30, mas: 60, uai: 70, lto: 90, ind: 40 },
    beh: { decis: 8, crisis: 4, risk: 2, status: 9, alliance: 8, twoLvl: 3, dipStyle: 8, predict: 9 },
    region: "Asia", subregion: "Eastern Asia"
  },
  NSA_BLK: {
    n: "BlackRock",
    type: "corp",
    f: "⬡", // BUG-6: display icon
    flag: "⬡",
    desc: { bg: "BlackRock, Inc. The world's largest asset manager, with over $10 trillion in assets under management. Possesses immense structural power over global capital flows, sovereign debt, and corporate governance (ESG) standards worldwide." },
    c: "var(--amber)",
    lat: 40.75, lng: -73.97, // NYC
    gdp: 10000, // proxy (AUM in billions)
    mil: 0,
    mp: 0,
    to: 100,
    pop: 0.02,
    gdpPC: 0,
    cpi: 70, dem: 50, fh: 70, civSoc: 50, nuc: 0, usc: 0, cs: 10,
    al: ["Wall_Street", "US_Treasury"],
    hof: { pdi: 50, idv: 80, mas: 70, uai: 40, lto: 60, ind: 60 },
    beh: { decis: 9, crisis: 8, risk: 4, status: 10, alliance: 9, twoLvl: 7, dipStyle: 9, predict: 8 },
    region: "Americas", subregion: "North America"
  },
  NSA_SPACE: {
    n: "SpaceX / Starlink",
    type: "corp",
    f: "◈", // BUG-6: display icon
    flag: "◈",
    desc: { bg: "SpaceX. A private aerospace manufacturer operating the Starlink satellite internet constellation. Has become a critical geopolitical actor by providing unilateral communications infrastructure in war zones (e.g., Ukraine) independent of sovereign control." },
    c: "var(--cyan)",
    lat: 33.91, lng: -118.32, // Hawthorne, CA
    gdp: 180, // proxy (market cap)
    mil: 5, // dual-use proxy power
    mp: 50, // high R&D to proxy defense ratio
    to: 80,
    pop: 0.01,
    gdpPC: 0,
    cpi: 60, dem: 10, fh: 50, civSoc: 20, nuc: 0, usc: 0, cs: 8,
    al: ["US_DOD", "NASA"],
    hof: { pdi: 70, idv: 90, mas: 80, uai: 20, lto: 80, ind: 50 },
    beh: { decis: 10, crisis: 8, risk: 10, status: 8, alliance: 5, twoLvl: 2, dipStyle: 1, predict: 2 },
    region: "Americas", subregion: "North America"
  },

  // ═════ PRIVATE MILITARY / PROXY ACTORS ═════
  NSA_WAGNER: {
    n: "Wagner PMC (Africa Corps)",
    type: "pmc",
    f: "◆", // BUG-6: display icon
    flag: "◆",
    desc: { bg: "The Wagner Group (now rebranded or restructuring as Africa Corps). A Russian state-funded paramilitary organization. Used for deniable operations, resource extraction, and regime security in Africa (Mali, CAR, Sudan) and force projection in Ukraine." },
    c: "var(--neg)",
    lat: 17.57, lng: -3.99, // Mali (Proxy activity center)
    gdp: 2, // proxy for funding
    mil: 20, // very high relative military proxy power
    mp: 100, // 100% military
    to: 5,
    pop: 0.05, // 50k personnel
    gdpPC: 0,
    cpi: 0, dem: 0, fh: 0, civSoc: 0, nuc: 0, usc: 0, cs: 1,
    al: ["Russia_MOD"],
    hof: { pdi: 100, idv: 10, mas: 100, uai: 90, lto: 10, ind: 0 },
    beh: { decis: 9, crisis: 10, risk: 10, status: 4, alliance: 8, twoLvl: 1, dipStyle: 0, predict: 3 },
    region: "Africa", subregion: "Sahel"
  }
};

// Apply Ontology to the Main Matrix
(function(){
  if(typeof C==="undefined") return;
  var applied=0;
  Object.keys(ONTOLOGY_NSA).forEach(function(code){
    var src = ONTOLOGY_NSA[code];
    C[code] = {
      n: src.n,
      f: "", 
      c: code,
      r: src.region,
      gdp: src.gdp,
      mil: src.mil,
      mp: src.mp,
      to: src.to,
      pop: src.pop,
      gdpPC: src.gdpPC,
      lat: src.lat,
      lng: src.lng,
      region: src.region,
      subregion: src.subregion,
      capital: "HQ",
      cpi: src.cpi,
      dem: src.dem,
      fh: src.fh,
      civSoc: src.civSoc,
      nuc: src.nuc,
      usc: src.usc,
      cs: src.cs,
      al: src.al,
      hof: src.hof,
      beh: src.beh,
      flag: "⬢", // Hexagon marker instead of flag
      isG20: false,
      isNSA: true, // Mark heavily for the engine
      nsaType: src.type,
      _source: "ontology"
    };

    // Auto-patch PROFILES_WORLD if exists, to avoid crashing detail views
    if (typeof PROFILES_WORLD !== "undefined") {
      PROFILES_WORLD[code] = {
        overview: src.desc.bg,
        foreignPolicy: "Driven by corporate/organizational interests rather than sovereign statecraft. Asymmetric actor.",
        currentIssues: ["Regulatory friction with host/target states.", "Supply chain vulnerabilities.", "Geopolitical weaponization."],
        keyRelationships: "Translates structural power (financial, military, technological) into political leverage across multiple state jurisdictions.",
        economicProfile: "Valuation/Budget: ~$" + src.gdp + "B. Concentrated market dominance.",
        discourse: {
          leader: "Board of Directors / Command Structure",
          polarity: 0,
          tone: "Pragmatic, transactional.",
        }
      };
    }

    // Auto-patch CTR (Translations)
    if (typeof cTR !== "undefined") {
      cTR[code] = src.n;
    }
    
    applied++;
  });
  console.log("[ONTOLOGY] Applied Asymmetric Actors: " + applied + " entities injected.");
})();
