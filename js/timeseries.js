// AXIS — Historical Time Series Module (GDP & Military)
// Phase 3 Advanced Analytical Expansion
// Depends on: core.js, ui.js, data/translations.js

async function fetchWBHistory(codeA, codeB, indicator) {
    const cacheKey = "ts_" + indicator + "_" + codeA + "_" + codeB;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.ts < 7 * 86400000) return parsed.data; // 7 days cache
        } catch(e){}
    }
    
    // The World Bank accepts 2-letter codes separated by a semicolon
    const url = "https://api.worldbank.org/V2/country/" + codeA + ";" + codeB + "/indicator/" + indicator + "?format=json&per_page=300&MRV=15";
    try {
        const resp = await fetch(url);
        if(!resp.ok) throw new Error("WB Error: "+resp.status);
        const json = await resp.json();
        if(!json || !json[1]) throw new Error("No data");
        // Sort descending locally to align chronological lines: older to newer
        const dataA = json[1].filter(function(d){return d.country.id===codeA||d.countryiso3code===codeA}).sort(function(a,b){return a.date-b.date});
        const dataB = json[1].filter(function(d){return d.country.id===codeB||d.countryiso3code===codeB}).sort(function(a,b){return a.date-b.date});
        const result = { A: dataA, B: dataB };
        localStorage.setItem(cacheKey, JSON.stringify({ts: Date.now(), data: result}));
        return result;
    } catch(e) {
        console.warn("[TimeSeries] Fetch failed:", e);
        return { A:[], B:[] };
    }
}

function drawTimeSeriesChart(dataA, dataB, labelTitle, fmt) {
    const w = 600, h = 180, padX = 50, padY = 20, padTop = 30;
    
    // Merge valid years
    const ptsA = dataA.filter(function(d){return d.value !== null});
    const ptsB = dataB.filter(function(d){return d.value !== null});
    
    if (ptsA.length === 0 && ptsB.length === 0) {
        return '<div style="text-align:center;color:var(--t3);padding:20px 0;font-family:var(--font-mono)">' + (lang==='tr'?'Veri Yok':'No Data Available') + '</div>';
    }
    
    const allVals = [].concat(ptsA.map(function(d){return d.value}), ptsB.map(function(d){return d.value}));
    const minVal = Math.max(0, Math.min.apply(null, allVals) * 0.9); // slight floor pad
    const maxVal = Math.max.apply(null, allVals) * 1.1; // 10% ceiling
    
    const range = (maxVal - minVal) || 1;
    
    // Find min/max years
    const allDates = [].concat(ptsA.map(function(d){return +d.date}), ptsB.map(function(d){return +d.date}));
    const minYear = Math.min.apply(null, allDates);
    const maxYear = Math.max.apply(null, allDates);
    const yearRange = Math.max(1, maxYear - minYear);
    
    function mapX(year) { return padX + ((year - minYear) / yearRange) * (w - padX * 2); }
    function mapY(val) { return h - padY - ((val - minVal) / range) * (h - padY - padTop); }
    
    function formatValue(v) {
        if(fmt === 'B') return '$' + (v / 1e9).toFixed(1) + 'B';
        if(fmt === 'M') return '$' + (v / 1e6).toFixed(1) + 'M';
        return Math.round(v);
    }

    const pathA = ptsA.map(function(d){return mapX(+d.date)+","+mapY(d.value)}).join(' ');
    const pathB = ptsB.map(function(d){return mapX(+d.date)+","+mapY(d.value)}).join(' ');
    
    let svg = '<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="100%" style="overflow:visible;font-family:var(--font-mono)">';
    
    // Title
    svg += '<text x="'+padX+'" y="15" fill="var(--t3)" font-size="11" letter-spacing="0.1em" font-weight="700">'+labelTitle+'</text>';
    
    // Grid lines / axes
    const midY = mapY((minVal + maxVal)/2);
    const topY = mapY(maxVal);
    const botY = mapY(minVal);
    
    svg += '<line x1="'+padX+'" y1="'+botY+'" x2="'+(w-padX+20)+'" y2="'+botY+'" stroke="var(--border)" stroke-width="1"/>';
    svg += '<line x1="'+padX+'" y1="'+midY+'" x2="'+(w-padX+20)+'" y2="'+midY+'" stroke="var(--border)" stroke-dasharray="4,4" opacity="0.5"/>';
    
    // Y-labels
    svg += '<text x="'+(padX-8)+'" y="'+(botY+3)+'" fill="var(--t3)" font-size="10" text-anchor="end">'+formatValue(minVal)+'</text>';
    svg += '<text x="'+(padX-8)+'" y="'+(midY+3)+'" fill="var(--t3)" font-size="10" text-anchor="end">'+formatValue((minVal+maxVal)/2)+'</text>';
    svg += '<text x="'+(padX-8)+'" y="'+(topY+3)+'" fill="var(--t3)" font-size="10" text-anchor="end">'+formatValue(maxVal)+'</text>';
    
    // X-labels (years) - Start, middle, and End to avoid crowding
    svg += '<text x="'+padX+'" y="'+h+'" fill="var(--t3)" font-size="10" text-anchor="middle">'+minYear+'</text>';
    if (yearRange > 5) {
        const midYear = Math.round((minYear+maxYear)/2);
        svg += '<text x="'+mapX(midYear)+'" y="'+h+'" fill="var(--border)" font-size="10" text-anchor="middle">'+midYear+'</text>';
    }
    svg += '<text x="'+(w-padX)+'" y="'+h+'" fill="var(--t3)" font-size="10" text-anchor="middle">'+maxYear+'</text>';
    
    // Chart paths
    if(ptsA.length>0) {
        svg += '<polyline points="'+pathA+'" fill="none" stroke="var(--amber)" stroke-width="2.5" filter="drop-shadow(0 0 4px rgba(255,176,0,0.3))"/>';
        ptsA.forEach(function(d){
            svg += '<circle cx="'+mapX(+d.date)+'" cy="'+mapY(d.value)+'" r="3" fill="var(--bg)" stroke="var(--amber)" stroke-width="1.5"/>';
        });
    }
    if(ptsB.length>0) {
        svg += '<polyline points="'+pathB+'" fill="none" stroke="var(--blue)" stroke-width="2.5" filter="drop-shadow(0 0 4px rgba(64,196,255,0.3))"/>';
        ptsB.forEach(function(d){
            svg += '<circle cx="'+mapX(+d.date)+'" cy="'+mapY(d.value)+'" r="3" fill="var(--bg)" stroke="var(--blue)" stroke-width="1.5"/>';
        });
    }
    
    svg += '</svg>';
    return svg;
}

// Global trigger function to mount to UI
async function loadAndRenderTimeSeries(codeA, codeB) {
    const container = document.getElementById("tsContent");
    const btn = document.getElementById("tsLoadBtn");
    if(!container) return;
    
    // UI Loading state
    if(btn) btn.style.display = "none";
    container.style.display = "block";
    container.innerHTML = '<div style="text-align:center;padding:30px;color:var(--t3);font-family:var(--font-mono)">' + (lang==='tr'?'API\'den Son 15 Yılın Verileri Çekiliyor... (World Bank)':'Fetching 15-Year Data from WB API...') + '</div>';
    
    try {
        const gdpData = await fetchWBHistory(codeA, codeB, "NY.GDP.MKTP.CD");
        const milData = await fetchWBHistory(codeA, codeB, "MS.MIL.XPND.CD");
        
        const gdpLabel = lang === 'tr' ? '15-YIL GSYİH TRENDİ (SABİT USD)' : '15-YEAR GDP TREND (CURRENT USD)';
        const milLabel = lang === 'tr' ? 'ASKERİ HARCAMA (USD)' : 'MILITARY EXPENDITURE (USD)';
        
        let html = '<div style="display:flex;flex-wrap:wrap;gap:20px">';
        
        html += '<div style="flex:1;min-width:300px;background:var(--card-bg);border:1px solid var(--border);border-radius:4px;padding:24px 16px;">';
        html += drawTimeSeriesChart(gdpData.A, gdpData.B, gdpLabel, 'B');
        html += '</div>';

        html += '<div style="flex:1;min-width:300px;background:var(--card-bg);border:1px solid var(--border);border-radius:4px;padding:24px 16px;">';
        html += drawTimeSeriesChart(milData.A, milData.B, milLabel, 'B');
        html += '</div>';
        
        html += '</div>';
        
        // Legend
        html += '<div style="display:flex;justify-content:center;gap:24px;margin-top:16px;font-family:var(--font-mono);font-size:var(--text-sm)">'+
            '<span style="display:flex;align-items:center;gap:6px"><div style="width:12px;height:3px;background:var(--amber)"></div> '+cN(codeA)+'</span>'+
            '<span style="display:flex;align-items:center;gap:6px"><div style="width:12px;height:3px;background:var(--blue)"></div> '+cN(codeB)+'</span>'+
        '</div>';
        
        container.innerHTML = html;
        
    } catch(e) {
        container.innerHTML = '<div style="color:var(--neg);padding:20px;text-align:center;font-family:var(--font-mono)">' + (lang==='tr'?'Veri çekilemedi. Bağlantıyı kontrol edin.':'Failed to load data. Network error.') + '</div>';
    }
}
