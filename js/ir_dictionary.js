// AXIS — Diplomatic NLP Lexicon (Loughran-McDonald logic tailored for IR)
// © 2026 Kuzey Çağan Gebrecioğlu

const IR_LEXICON = {
    COERCIVE: {
        key: "COERCIVE",
        label: { en: "Coercive", tr: "Zorlayıcı" },
        weight: 1.5,
        color: "#ff8800", // Orange
        terms: ["sanction", "sanctions", "ultimatum", "retaliate", "retaliation", "consequence", "consequences", "red line", "redline", "coercion", "pressure", "embargo", "boycott", "isolate", "price cap", "veto", "withdraw", "suspend"]
    },
    ASSERTIVE: {
        key: "ASSERTIVE",
        label: { en: "Assertive", tr: "Kararlı/İddialı" },
        weight: 1.0,
        color: "#00b0ff", // Blue
        terms: ["sovereignty", "demand", "assert", "defend", "unacceptable", "condemn", "reject", "vital interest", "right to", "unwavering", "resilience", "national interest", "territorial integrity", "unilateral", "principles"]
    },
    CONCILIATORY: {
        key: "CONCILIATORY",
        label: { en: "Conciliatory", tr: "Uzlaştırıcı" },
        weight: 1.2,
        color: "#00ff41", // Green
        terms: ["dialogue", "mutual", "benefit", "partnership", "cooperate", "cooperation", "de-escalate", "deescalation", "roadmap", "negotiate", "diplomacy", "constructive", "welcome", "peace", "stability", "multilateral", "consensus", "agreement", "treaty"]
    },
    HESITANT: {
        key: "HESITANT",
        label: { en: "Hesitant", tr: "Temkinli" },
        weight: 0.8,
        color: "var(--t3)", // Grey
        terms: ["monitor", "review", "concern", "deliberate", "urge", "call upon", "abstain", "assess", "wait", "caution", "complex", "closely", "developments", "gravely"]
    },
    HOSTILE: {
        key: "HOSTILE",
        label: { en: "Hostile", tr: "Düşmanca" },
        weight: 2.0, // High impact
        color: "#ff2244", // Red
        terms: ["attack", "destroy", "enemy", "provocation", "regime", "terrorism", "terrorist", "threat", "aggression", "violation", "escalation", "strike", "hostile", "war", "conflict", "casualties", "unprovoked", "invasion"]
    }
};

// Generates a mock or combined corpus of recent rhetoric
function generateSynthesizedCorpus(countryCode) {
    if (typeof DISCOURSE === 'undefined' || !DISCOURSE[countryCode]) return "";
    let d = DISCOURSE[countryCode];
    let corpus = "";
    
    if (d.dominantFrames && d.dominantFrames.en) corpus += d.dominantFrames.en.join(" ") + " ";
    if (d.securitization && d.securitization.themes && d.securitization.themes.en) corpus += d.securitization.themes.en.join(" ") + " ";
    if (d.narrativeStyle && d.narrativeStyle.en) corpus += d.narrativeStyle.en + " ";
    if (d.keyTerms) corpus += Object.keys(d.keyTerms).join(" ") + " ";
    if(d.rhetoricalDevices && d.rhetoricalDevices.en) corpus += d.rhetoricalDevices.en.join(" ") + " ";
    if(d.unga80) corpus += d.unga80 + " ";
    
    // Inject some synthetic context to ensure terms trigger given the profile
    if(d.securitization.level > 7) corpus += "threat escalation consequences provocation ";
    if(d.bricsMembership === "core_member") corpus += "multilateral partnership sovereignty mutual benefit ";
    
    return corpus;
}

// Parses text and scores it based on the lexicon
function analyzeDiplomaticTone(textCorpus) {
    if (!textCorpus) return null;
    let lowerText = textCorpus.toLowerCase();
    
    let counts = { COERCIVE: 0.1, ASSERTIVE: 0.1, CONCILIATORY: 0.1, HESITANT: 0.1, HOSTILE: 0.1 }; // 0.1 laplace smoothing
    let totalScore = 0.5;
    
    Object.keys(IR_LEXICON).forEach(cat => {
        IR_LEXICON[cat].terms.forEach(term => {
            // Count occurrences of term as word boundary (or close to it)
            // Using split ensures we don't need fully isolated words for pluralities
            let appearances = lowerText.split(term).length - 1;
            if (appearances > 0) {
                counts[cat] += appearances * IR_LEXICON[cat].weight;
                totalScore += appearances * IR_LEXICON[cat].weight;
            }
        });
    });
    
    let breakdown = {};
    Object.keys(counts).forEach(cat => {
        let pct = (counts[cat] / totalScore) * 100;
        breakdown[cat] = {
            raw: counts[cat],
            percent: pct,
            label: lang==="tr"?IR_LEXICON[cat].label.tr:IR_LEXICON[cat].label.en,
            color: IR_LEXICON[cat].color
        };
    });
    
    // Sort array by highest percent
    let sortedBreakdown = Object.keys(breakdown).map(k => ({cat: k, ...breakdown[k]})).sort((a,b) => b.percent - a.percent);
    
    let warning = null;
    if (counts.HOSTILE + counts.COERCIVE > counts.CONCILIATORY * 3) {
         warning = lang==="tr"?"DİPLOMATİK ÇIKMAZ: Yüksek Zorlayıcı/Düşmanca Ton!":"DIPLOMATIC DEADLOCK: High Coercive/Hostile Tone!";
    } else if (counts.CONCILIATORY > (counts.HOSTILE + counts.COERCIVE) * 2) {
         warning = lang==="tr"?"UYUMLU DİPLOMASİ SİNYALİ":"CONCILIATORY DIPLOMACY SIGNALED";
    }
    
    return {
        totalScore: totalScore,
        breakdown: breakdown,
        sorted: sortedBreakdown,
        dominant: sortedBreakdown[0].cat,
        warning: warning
    };
}

// Helper to render the horizontal bar chart
function renderToneBar(toneResult) {
  if (!toneResult) return "";
  let h = '<div style="margin-top:16px; margin-bottom:12px;">';
  h += '<div style="font-family:var(--font-mono); font-size: 0.65rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--t2); margin-bottom:8px;">'+(lang==="tr"?"SÖZCÜK DUYGU / TON ANALİZİ (IR LEXICON)":"LEXICAL SENTIMENT / TONE (IR LEXICON)")+'</div>';
  
  // The stacked bar
  h += '<div style="width: 100%; height: 8px; display: flex; border-radius: 2px; overflow: hidden; margin-bottom:12px; border:1px solid var(--border)">';
  toneResult.sorted.forEach(item => {
      // Show segments > 5%
      if(item.percent > 4) {
          h += '<div style="height: 100%; width:'+item.percent+'%; background:'+item.color+';" title="'+item.label+' ('+item.percent.toFixed(1)+'%)"></div>';
      }
  });
  h += '</div>';
  
  // Legend
  h += '<div style="display:flex; flex-wrap:wrap; gap:12px; font-family:var(--font-mono); font-size: 0.7rem; color:var(--t2);">';
  toneResult.sorted.slice(0,3).forEach(item => { // top 3
      h += '<div style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; background:'+item.color+'; border-radius:50%;"></span>'+item.label+': '+item.percent.toFixed(0)+'%</div>';
  });
  h += '</div>';
  
  // Warning Box
  if (toneResult.warning) {
      let isNegative = toneResult.warning.includes("DEADLOCK") || toneResult.warning.includes("ÇIKMAZ");
      let wColor = isNegative ? "var(--neg)" : "var(--green)";
      let wBg = isNegative ? "rgba(255,23,68,0.1)" : "rgba(0,255,65,0.1)";
      h += '<div style="margin-top:12px; padding:8px; border-left:3px solid '+wColor+'; background:'+wBg+'; color:'+wColor+'; font-family:var(--font-mono); font-size:0.75rem; font-weight:700;">⚠ '+toneResult.warning+'</div>';
  }
  
  h += '</div>';
  return h;
}
