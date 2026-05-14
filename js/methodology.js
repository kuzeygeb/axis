// AXIS — Methodology academic paper page
// Depends on: core.js (lang)

function showMethodology(){
  const mv=document.getElementById("methView");
  if(!mv)return;
  const t=lang==="tr";
  let h='<div class="meth-container">';

  // HEADER
  h+='<div class="meth-header">';
  h+='<div class="meth-logo">AXIS</div>';
  h+='<div class="meth-title">'+(t?"Hesaplamalı Metodolojiler ve Mimari Entegrasyon Çerçevesi":"Computational Methodologies and Architectural Integration Framework")+'</div>';
  h+='<div class="meth-author">'+(t?"Yazar":"Author")+': Kuzey Çağan Gebrecioğlu</div>';
  h+='<div class="meth-date">'+(t?"Mart 2026":"March 2026")+'</div>';
  h+='<div class="meth-copyright">© 2026 Kuzey Çağan Gebrecioğlu. '+(t?"Tüm hakları saklıdır.":"All rights reserved.")+'</div>';
  h+='</div>';

  // ABSTRACT
  h+='<div class="meth-section"><div class="meth-section-title">'+(t?"Özet":"Abstract")+'</div>';
  h+='<div class="meth-text">'+(t?"AXIS (International Relations Analysis Tool), G20 ülkeleri arasındaki ikili ve çok taraflı ilişkileri çok katmanlı hesaplamalı yöntemlerle analiz eden, gerçek zamanlı veri entegrasyonu içeren ve oyun teorisi tabanlı stratejik simülasyonlar sunan bir karar destek platformudur. Bu makale, AXIS'in metodolojik altyapısını, kullanılan hesaplamalı yöntemleri, veri kaynaklarını ve mimari tasarım kararlarını sistematik olarak belgelemektedir.":"AXIS (International Relations Analysis Tool) is a decision support platform that analyzes bilateral and multilateral relations among G20 countries through multi-layered computational methods, real-time data integration, and game theory-based strategic simulations. This paper systematically documents the methodological infrastructure of AXIS, the computational methods employed, data sources, and architectural design decisions.")+'</div></div>';

  // 01: COMPOSITE INDEX
  h+='<div class="meth-section"><div class="meth-section-num">01</div>';
  h+='<div class="meth-section-title">'+(t?"AXIS Bileşik Endeksi":"AXIS Composite Index")+'</div>';
  h+='<div class="meth-text">'+(t?"AXIS'in temel metodolojik yeniliği, ikili ilişkileri tek bir skora indirgeyen çok katmanlı bileşik endeks sistemidir. Yedi analitik katman, ağırlıklı ortalama ile 0–100 arası bir bileşik skora dönüştürülmektedir.":"The core methodological innovation of AXIS is a multi-layered composite index system that reduces bilateral relations to a single score. Seven analytical layers are transformed into a composite score of 0–100 through a weighted average.")+'</div>';
  h+='<table class="meth-table"><tr><th>'+(t?"Katman":"Layer")+'</th><th>'+(t?"Ağırlık":"Weight")+'</th><th>'+(t?"Temel Göstergeler":"Key Indicators")+'</th></tr>';
  var lyrs=t?[["Askeri & Yapısal Güç","%16","Güç dengesi, nükleer statü, BMGK P5, askeri bütçe"],["Ekonomik Karşılıklı Bağımlılık","%20","İkili ticaret hacmi, ticaret açıklığı, GSYİH"],["Lobi & Sivil Toplum","%10","YAE, demokrasi endeksi, sivil toplum güçlülüğü"],["Kimlik & Kültürel Yakınlık","%10","Hofstede kültürel boyutlar mesafesi, bölgesel yakınlık"],["Stratejik Uyum","%20","BM oylama uyumu, ortak ittifaklar, gerilim seviyesi"],["Davranışsal Uyum","%12","8 boyutlu davranışsal profil uyumu"],["Anlık Medya İklimi (GDELT)","%12","GDELT ton skoru, medya trendi, haber hacmi"]]:[["Military & Structural Power","16%","Power balance, nuclear status, UNSC P5, mil. budget"],["Economic Interdependence","20%","Bilateral trade volume, trade openness, GDP"],["Lobby & Civil Society","10%","CPI, democracy index, civil society strength"],["Identity & Cultural Proximity","10%","Hofstede cultural dimensions distance, regional proximity"],["Strategic Alignment","20%","UN voting alignment, shared alliances, tension level"],["Behavioral Compatibility","12%","8-dimension behavioral profile compatibility"],["Real-time Media Climate (GDELT)","12%","GDELT tone score, media trend, article volume"]];
  lyrs.forEach(function(l){h+='<tr><td>'+l[0]+'</td><td>'+l[1]+'</td><td>'+l[2]+'</td></tr>'});
  h+='</table>';
  h+='<div class="meth-formula">Composite = Σ(Layer_Score × Layer_Weight)'+(t?', her katman skoru 0–100 arası normalize edilmiştir.':', where each layer score is normalized to 0–100.')+'</div></div>';

  // 02: LAYER FORMULAS
  h+='<div class="meth-section"><div class="meth-section-num">02</div>';
  h+='<div class="meth-section-title">'+(t?"Katman Hesaplama Formülleri":"Layer Calculation Formulas")+'</div>';
  var fms=t?[["Askeri Katman","milScore = powerBalance × 40 + avgGDP_norm × 25 + nuclearBonus + unscBonus","Güç dengesi = min(milA, milB) / max(milA, milB). Nükleer bonus: ikisi nükleer +15, tek taraf +5. BMGK P5: ikisi P5 +10."],["Ekonomik Katman","econScore = tradeIndex × 0.65 + tradeOpenness × 0.35","tradeIndex: ikili ticaret hacmi 0–800B$ arasında normalize. tradeOpenness: ortalama ticaret açıklığı."],["Lobi Katman","lobbyScore = civSocAvg × 0.40 + cpiAvg × 0.30 + demAvg × 0.30","Sivil toplum gücü, yolsuzluk algı endeksi ve demokrasi endeksi ortalamaları."],["Kültürel Katman","culturalScore = culturalProx × 0.70 + regionBonus + highProxBonus","Hofstede Öklid mesafesi: hofDist = √(Σ(dim_A - dim_B)² / 5). Aynı bölge bonusu +20."],["Stratejik Katman","strategicScore = unVoting × 0.40 + allianceScore × 0.40 + bonus - tensionPenalty","Gerilim cezası: critical=-25, high=-15, medium=-5, low=0."],["Davranışsal Katman","behCompat = ağırlıklı boyut uyum ortalaması","8 davranışsal boyut: kriz(%20), statüko(%20), risk(%15), diplomatik stil(%15), öngörülebilirlik(%10), karar yapısı(%10), ittifak(%10)."],["GDELT Katman","gdeltScore = clamp(0, 100, (avgTone + 10) × 5) ± trendBonus","GDELT tonu -10/+10 → 0/100. Trend iyileşiyorsa +5, kötüleşiyorsa -5."]]:[["Military Layer","milScore = powerBalance × 40 + avgGDP_norm × 25 + nuclearBonus + unscBonus","Power balance = min(milA, milB) / max(milA, milB). Nuclear bonus: both +15, one +5. UNSC P5: both +10."],["Economic Layer","econScore = tradeIndex × 0.65 + tradeOpenness × 0.35","tradeIndex: bilateral trade normalized 0–800B$. tradeOpenness: average trade openness."],["Lobby Layer","lobbyScore = civSocAvg × 0.40 + cpiAvg × 0.30 + demAvg × 0.30","Civil society strength, CPI, and democracy index averages."],["Cultural Layer","culturalScore = culturalProx × 0.70 + regionBonus + highProxBonus","Hofstede Euclidean distance: hofDist = √(Σ(dim_A - dim_B)² / 5). Same region bonus +20."],["Strategic Layer","strategicScore = unVoting × 0.40 + allianceScore × 0.40 + bonus - tensionPenalty","Tension penalty: critical=-25, high=-15, medium=-5, low=0."],["Behavioral Layer","behCompat = weighted dimension compatibility average","8 dimensions: crisis(20%), status(20%), risk(15%), dipStyle(15%), predict(10%), decision(10%), alliance(10%)."],["GDELT Layer","gdeltScore = clamp(0, 100, (avgTone + 10) × 5) ± trendBonus","GDELT tone -10/+10 → 0/100. Trend improving +5, deteriorating -5."]];
  fms.forEach(function(f){h+='<div class="meth-formula-block"><div class="meth-formula-name">'+f[0]+'</div><div class="meth-formula">'+f[1]+'</div><div class="meth-formula-desc">'+f[2]+'</div></div>'});
  h+='</div>';

  // 03: BEHAVIORAL
  h+='<div class="meth-section"><div class="meth-section-num">03</div>';
  h+='<div class="meth-section-title">'+(t?"Davranışsal Profilleme — 8 Boyut":"Behavioral Profiling — 8 Dimensions")+'</div>';
  h+='<table class="meth-table"><tr><th>'+(t?"Boyut":"Dimension")+'</th><th>1</th><th>10</th><th>'+(t?"Teorik Referans":"Theoretical Reference")+'</th></tr>';
  var bds=t?[["Karar Yapısı","Tek kişi","Kurumsal","Allison & Zelikow (1999)"],["Kriz Davranışı","Tırmandırıcı","Yatıştırıcı","Lebow (1981)"],["Risk Toleransı","Riskten kaçınan","Yüksek risk","Jervis (1976)"],["Statüko Yönelimi","Revizyonist","Statüko koruyucu","Mearsheimer (2014)"],["İttifak Stratejisi","Bandwagoning","Dengeleme","Walt (1987)"],["İç Politika Etkisi","Düşük","Yüksek","Putnam (1988)"],["Diplomatik Stil","Tek taraflı","Çok taraflı","Ruggie (1993)"],["Öngörülebilirlik","Öngörülemez","Öngörülebilir","Jervis (2017)"]]:[["Decision Structure","One-man","Institutional","Allison & Zelikow (1999)"],["Crisis Behavior","Escalator","De-escalator","Lebow (1981)"],["Risk Tolerance","Risk averse","High risk","Jervis (1976)"],["Status Orientation","Revisionist","Status-quo","Mearsheimer (2014)"],["Alliance Strategy","Bandwagoning","Balancing","Walt (1987)"],["Domestic Constraint","Low","High","Putnam (1988)"],["Diplomatic Style","Unilateral","Multilateral","Ruggie (1993)"],["Predictability","Unpredictable","Predictable","Jervis (2017)"]];
  bds.forEach(function(d){h+='<tr><td>'+d[0]+'</td><td>'+d[1]+'</td><td>'+d[2]+'</td><td>'+d[3]+'</td></tr>'});
  h+='</table></div>';

  // 04: GDELT
  h+='<div class="meth-section"><div class="meth-section-num">04</div>';
  h+='<div class="meth-section-title">'+(t?"Gerçek Zamanlı Medya Analizi — GDELT Entegrasyonu":"Real-time Media Analysis — GDELT Integration")+'</div>';
  h+='<div class="meth-text">'+(t?"GDELT (Global Database of Events, Language, and Tone), küresel yayınları 65+ dilde gerçek zamanlı tarayan açık kaynak bir veri tabanıdır. AXIS, GDELT DOC 2.0 API'sini kullanarak iki ülke arasındaki haberlerin ton ortalamasını, trend yönünü ve güncel haber akışını çekmektedir. Her bilateral analiz için 2 paralel API isteği atılır: (1) timelinetone — son 3 ayın günlük ton ortalaması; (2) artlist — son 7 günün en güncel 10 haberi. Sonuçlar sessionStorage'da 2 saat TTL ile önbelleklenir.":"GDELT (Global Database of Events, Language, and Tone) is an open-source database that scans global publications in 65+ languages in real-time. AXIS uses the GDELT DOC 2.0 API to fetch the tone average, trend direction, and current news feed between two countries. Two parallel API requests per bilateral analysis: (1) timelinetone — daily tone average for the past 3 months; (2) artlist — 10 most recent articles from the past 7 days. Results are cached in sessionStorage with a 2-hour TTL.")+'</div></div>';

  // 05: MINERALS
  h+='<div class="meth-section"><div class="meth-section-num">05</div>';
  h+='<div class="meth-section-title">'+(t?"Kritik Mineral ve Tedarik Zinciri Risk Analizi":"Critical Mineral and Supply Chain Risk Analysis")+'</div>';
  h+='<div class="meth-text">'+(t?"USGS Mineral Commodity Summaries 2026 (Şubat 2026, 2025 üretim verileri) temel alınarak geliştirilen bu modül, 12 stratejik mineral için ülke bazlı üretim payları, ithalat bağımlılığı ve pazar yoğunlaşması analizleri sunmaktadır. Pazar yoğunlaşması Herfindahl-Hirschman Endeksi (HHI = Σ(pazar_payı²)) ile hesaplanır. Mineral Güvenlik Skoru: (1 - importDependency) × 60 + productionDiversity × 25 + processingShare × 15.":"Developed based on USGS Mineral Commodity Summaries 2026 (February 2026, 2025 production data), this module provides country-level production shares, import dependency, and market concentration analyses for 12 strategic minerals. Market concentration is calculated via the Herfindahl-Hirschman Index (HHI = Σ(market_share²)). Mineral Security Score: (1 - importDependency) × 60 + productionDiversity × 25 + processingShare × 15.")+'</div></div>';

  // 06: GAME THEORY
  h+='<div class="meth-section"><div class="meth-section-num">06</div>';
  h+='<div class="meth-section-title">'+(t?"Oyun Teorisi Modülü":"Game Theory Module")+'</div>';
  h+='<div class="meth-text">'+(t?"AXIS, 2×2 stratejik form oyunları ile uluslararası krizleri modellemektedir. Beş önceden tanımlı oyun: Yaptırım Restleşmesi, Askeri Tırmanma İkilemi (Tavuk Oyunu), Ticaret Savaşı (Mahkum İkilemi), İttifak Oluşturma ve Nükleer Brinksmanship. Saf Strateji Nash Dengesi: her hücre için A'nın en iyi yanıtı VE B'nin en iyi yanıtı kesişiyorsa Nash Dengesi'dir. Karma Strateji: p = (a₁₁ - a₀₁) / ((a₀₀ - a₀₁) - (a₁₀ - a₁₁)). Minimax: her stratejideki minimum ödemenin maksimumu. Ödüller ülkelerin GDP, askeri güç ve davranışsal profiline göre dinamik ayarlanır.":"AXIS models international crises through 2×2 strategic form games. Five preset games: Sanctions Standoff, Military Escalation Dilemma (Chicken Game), Trade War (Prisoner's Dilemma), Alliance Formation, and Nuclear Brinkmanship. Pure Strategy Nash Equilibrium: if A's best response AND B's best response intersect at a cell, it is a Nash Equilibrium. Mixed Strategy: p = (a₁₁ - a₀₁) / ((a₀₀ - a₀₁) - (a₁₀ - a₁₁)). Minimax: maximum of minimum payoffs per strategy. Payoffs are dynamically adjusted based on countries' GDP, military power, and behavioral profile.")+'</div></div>';

  // 07: NETWORK
  h+='<div class="meth-section"><div class="meth-section-num">07</div>';
  h+='<div class="meth-section-title">'+(t?"Koalisyon Ağ Analizi ve Görselleştirme":"Coalition Network Analysis and Visualization")+'</div>';
  h+='<div class="meth-text">'+(t?"Ağ Kritiklik Analizi: her üye çıkarıldığında koalisyon uyumunun değişimi hesaplanır (delta = withoutAvg - fullAvg). D3.js v7 force-directed simulation ile üyeler düğüm, ilişkiler kenar olarak görselleştirilir. Düğüm büyüklüğü GDP'ye orantılı; kenar kalınlığı ve rengi AXIS skoruna bağlı; mesafe ters orantılı.":"Network Criticality Analysis: for each member, the change in coalition cohesion when removed is calculated (delta = withoutAvg - fullAvg). D3.js v7 force-directed simulation visualizes members as nodes and relationships as edges. Node size is proportional to GDP; edge thickness and color depend on AXIS score; distance is inversely proportional.")+'</div></div>';

  // 08: SCENARIOS
  h+='<div class="meth-section"><div class="meth-section-num">08</div>';
  h+='<div class="meth-section-title">'+(t?"Senaryo Simülasyonu":"Scenario Simulation")+'</div>';
  h+='<table class="meth-table"><tr><th>'+(t?"Senaryo":"Scenario")+'</th><th>'+(t?"Modifiye Edilen Veri":"Modified Data")+'</th></tr>';
  var scs=t?[["Türkiye NATO'dan ayrılırsa","TR ittifak listesinden NATO çıkarılır"],["BRICS genişleme (TR + ID)","TR ve ID ittifaklarına BRICS eklenir"],["ABD-Çin ticari ayrışma","İkili ticaret $690B → $50B"],["AB ortak ordu","DE, FR, IT askeri bütçe %30 artış"],["Rusya askeri yarılama","RU askeri bütçe $109B → $55B"],["Hindistan Quad'dan çekilir","IN ittifaklarından Quad çıkarılır"],["Suudi-İran normalleşmesi","SA kriz ve risk profili değişir"],["Japonya nükleer silah","JP nükleer statü + askeri bütçe artışı"]]:[["Turkey exits NATO","NATO removed from TR alliances"],["BRICS expansion (TR + ID)","BRICS added to TR and ID alliances"],["US-China trade decoupling","Bilateral trade $690B → $50B"],["EU joint military","DE, FR, IT military budget +30%"],["Russia military halved","RU military budget $109B → $55B"],["India exits Quad","Quad removed from IN alliances"],["Saudi-Iran normalization","SA crisis and risk profile changes"],["Japan develops nuclear weapons","JP nuclear status + military budget increase"]];
  scs.forEach(function(s){h+='<tr><td>'+s[0]+'</td><td>'+s[1]+'</td></tr>'});
  h+='</table></div>';

  // 09: DATA SOURCES
  h+='<div class="meth-section"><div class="meth-section-num">09</div>';
  h+='<div class="meth-section-title">'+(t?"Veri Kaynakları":"Data Sources")+'</div>';
  h+='<table class="meth-table"><tr><th>'+(t?"Kaynak":"Source")+'</th><th>'+(t?"Veri Türü":"Data Type")+'</th><th>'+(t?"Yıl":"Year")+'</th></tr>';
  var srcs=[[t?"Dünya Bankası":"World Bank",t?"GSYİH, nüfus, ticaret açıklığı":"GDP, population, trade openness","2024"],["SIPRI",t?"Askeri harcamalar":"Military expenditures","2024"],["Transparency International",t?"Yolsuzluk Algı Endeksi":"Corruption Perceptions Index","2024"],["V-Dem",t?"Demokrasi endeksi":"Democracy index","2024"],["Freedom House",t?"Özgürlük endeksi":"Freedom index","2024"],["Hofstede Insights",t?"Kültürel boyutlar":"Cultural dimensions","2023"],[t?"BM Genel Kurul":"UN General Assembly",t?"Oylama uyumu":"Voting alignment","2024"],["USGS MCS 2026",t?"Kritik mineral üretim verileri":"Critical mineral production data","2025"],["GDELT DOC 2.0 API",t?"Gerçek zamanlı medya tonu":"Real-time media tone",t?"Canlı":"Live"],["CIA World Factbook",t?"Ülke coğrafi/demografik verileri":"Country geographic/demographic data","2024"],["Natural Earth",t?"G20 ülke sınırları (GeoJSON)":"G20 country boundaries (GeoJSON)","2024"]];
  srcs.forEach(function(s){h+='<tr><td>'+s[0]+'</td><td>'+s[1]+'</td><td>'+s[2]+'</td></tr>'});
  h+='</table></div>';

  // 10: REFERENCES
  h+='<div class="meth-section"><div class="meth-section-num">10</div>';
  h+='<div class="meth-section-title">'+(t?"Akademik Kaynaklar":"Academic References")+'</div>';
  h+='<div class="meth-refs">';
  var refs=["Allison, G. T. & Zelikow, P. (1999). <em>Essence of Decision: Explaining the Cuban Missile Crisis</em>. Longman.","Axelrod, R. (1984). <em>The Evolution of Cooperation</em>. Basic Books.","Drezner, D. W. (2003). The Hidden Hand of Economic Coercion. <em>International Organization</em>, 57(3).","Fearon, J. D. (1995). Rationalist Explanations for War. <em>International Organization</em>, 49(3).","Hofstede, G. (2001). <em>Culture's Consequences</em>. Sage Publications.","Ikenberry, G. J. (2001). <em>After Victory</em>. Princeton University Press.","Jervis, R. (1976). <em>Perception and Misperception in International Politics</em>. Princeton University Press.","Keohane, R. O. (1984). <em>After Hegemony</em>. Princeton University Press.","Keohane, R. O. & Nye, J. S. (1977). <em>Power and Interdependence</em>. Little Brown.","Lebow, R. N. (1981). <em>Between Peace and War</em>. Johns Hopkins University Press.","Mearsheimer, J. J. (2014). <em>The Tragedy of Great Power Politics</em>. W. W. Norton.","Putnam, R. D. (1988). Diplomacy and Domestic Politics: The Logic of Two-Level Games. <em>International Organization</em>, 42(3).","Ruggie, J. G. (1993). <em>Multilateralism Matters</em>. Columbia University Press.","Saaty, T. L. (1980). <em>The Analytic Hierarchy Process</em>. McGraw-Hill.","Schelling, T. C. (1960). <em>The Strategy of Conflict</em>. Harvard University Press.","USGS (2026). <em>Mineral Commodity Summaries 2026</em>. doi:10.3133/mcs2026","Walt, S. M. (1987). <em>The Origins of Alliances</em>. Cornell University Press."];
  refs.forEach(function(r){h+='<div class="meth-ref">'+r+'</div>'});
  h+='</div></div>';

  // FOOTER
  h+='<div class="meth-footer"><div class="meth-footer-line"></div>';
  h+='<div class="meth-footer-text">© 2026 Kuzey Çağan Gebrecioğlu</div>';
  h+='<div class="meth-footer-sub">'+(t?"Tüm hakları saklıdır. Bu makalenin tamamı veya bir kısmı yazarın yazılı izni olmadan çoğaltılamaz.":"All rights reserved. No part of this paper may be reproduced without written permission of the author.")+'</div></div>';
  h+='</div>';
  mv.innerHTML=h;
  mv.scrollTo({top:0});
}
