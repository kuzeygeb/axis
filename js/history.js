// AXIS — Dynamic Historical Context API (Wikipedia)
// Depends on: core.js (lang, cN, C)

const _wikiCache = {};

async function fetchWikiRelations(cA, cB) {
  const cacheKey = cA+"_"+cB+"_"+lang;
  if(_wikiCache[cacheKey] !== undefined) return _wikiCache[cacheKey]; // return if cached (even if null)
  if(_wikiCache[cB+"_"+cA+"_"+lang] !== undefined) return _wikiCache[cB+"_"+cA+"_"+lang];

  const nA_en = typeof C !== "undefined" && C[cA] ? (C[cA].n || cA) : (typeof cN === "function" ? cN(cA) : cA);
  const nB_en = typeof C !== "undefined" && C[cB] ? (C[cB].n || cB) : (typeof cN === "function" ? cN(cB) : cB);
  
  const nA_locale = typeof cN === "function" ? cN(cA) : nA_en;
  const nB_locale = typeof cN === "function" ? cN(cB) : nB_en;

  let trTitles = [];
  let enTitles = [
    nA_en + "–" + nB_en + " relations", // En dash
    nB_en + "–" + nA_en + " relations",
    nA_en + "-" + nB_en + " relations", // Hyphen
    nB_en + "-" + nA_en + " relations"
  ];

  if (lang === "tr") {
    // Turkish Wikipedia usually names articles "A-B ilişkileri"
    trTitles = [
      nA_locale + "-" + nB_locale + " ilişkileri",
      nB_locale + "-" + nA_locale + " ilişkileri",
      nA_en + "-" + nB_en + " ilişkileri", // Try with EN names but TR suffix
      nB_en + "-" + nA_en + " ilişkileri"
    ];
  }

  // Helper to fetch from a specific Wikipedia language endpoint
  async function attemptFetch(titlesList, wikiLang) {
    for (let i = 0; i < titlesList.length; i++) {
      const tUrl = encodeURIComponent(titlesList[i]);
      const url = `https://${wikiLang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=${tUrl}&format=json&origin=*`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        // Wikipedia returns '-1' for missing pages
        if (pageId !== "-1" && pages[pageId].extract) {
          let ext = pages[pageId].extract;
          ext = ext.replace(/<span class="mw-empty-elt"><\/span>/gi, ""); // Clean up empty span
          ext = ext.replace(/class="([^"]+)"/g, ""); // Strip any problematic classes
          return { title: pages[pageId].title, html: ext, srcLang: wikiLang };
        }
      } catch(e) {
        console.warn("[history.js] Wiki fetch error:", e);
      }
    }
    return null;
  }

  let result = null;

  // 1. Try Turkish Wikipedia if lang == tr
  if (lang === "tr") {
    result = await attemptFetch(trTitles, "tr");
  }

  // 2. Fallback to English Wikipedia if TR fails or lang == en
  if (!result) {
    result = await attemptFetch(enTitles, "en");
    if (result && lang === "tr") {
      // Prepend a disclaimer that we fell back to English
      result.html = "<div style='font-size:0.65rem; color:var(--amber); margin-bottom:12px; font-family:var(--font-mono); letter-spacing:.05em;'><i>⚠ Geniş Kapsamlı Türkçe Makale Bulunamadı — Küresel (İngilizce) Arşivden Çekildi</i></div>" + result.html;
    }
  }

  _wikiCache[cacheKey] = result;
  return result;
}
