// AXIS — Blocs, scenarios, translations, labels

const blocs={BRICS:{m:["CN","RU","IN","BR","ZA","SA"],l:"BRICS+"},NATO:{m:["US","GB","FR","DE","IT","CA","TR"],l:"NATO Core"},QUAD:{m:["US","JP","IN","AU"],l:"Quad"},G7:{m:["US","GB","FR","DE","IT","CA","JP"],l:"G7"},FVEY:{m:["US","GB","CA","AU"],l:"Five Eyes"},AUKUS:{m:["US","GB","AU"],l:"AUKUS"}};

const scenarios={none:{en:"Select scenario...",tr:"Senaryo seçin..."},tr_nato:{en:"Turkey exits NATO",tr:"Turkiye NATOdan cikarsa",fn:(d,bC)=>{d.TR.al=d.TR.al.filter(a=>a!=="NATO")}},brics_exp:{en:"BRICS adds Turkey & Indonesia",tr:"BRICS'e Türkiye ve Endonezya",fn:(d,bC)=>{d.TR.al.push("BRICS");d.ID.al.push("BRICS")}},us_cn:{en:"US-China trade decoupling",tr:"ABD-Çin ticari ayrışma",fn:(d,bC)=>{const k=bK("US","CN");if(bC[k])bC[k]={...bC[k],trade:50}}},eu_army:{en:"EU joint military",tr:"AB ortak ordu",fn:(d,bC)=>{["DE","FR","IT"].forEach(c=>{if(!d[c].al.includes("EU Army"))d[c].al.push("EU Army");d[c].mil=Math.round(d[c].mil*1.3)})}},ru_half:{en:"Russia mil. halved",tr:"Rusya askeri yarılama",fn:(d,bC)=>{d.RU.mil=55}},
in_quad:{en:"India exits Quad",tr:"Hindistan Quad'dan çekilirse",fn:(d,bC)=>{d.IN.al=d.IN.al.filter(a=>a!=="Quad")}},
sa_iran:{en:"Saudi-Iran normalization",tr:"Suudi-İran normalleşmesi",fn:(d,bC)=>{if(!d.SA.al.includes("SA-IR Détente"))d.SA.al.push("SA-IR Détente");d.SA.beh={...d.SA.beh,crisis:6,risk:5}}},
jp_nuc:{en:"Japan develops nuclear weapons",tr:"Japonya nükleer silah geliştirirse",fn:(d,bC)=>{d.JP.nuc=1;d.JP.mil=Math.round(d.JP.mil*1.5);d.JP.beh={...d.JP.beh,risk:5,status:6}}}};

// Domino effect chains per scenario
const dominoChains={
tr_nato:{
  en:["Turkey leaves NATO → TR-US military alignment drops significantly","Loss of NATO SE flank → Greece/Bulgaria exposed","TR-RU rapprochement probability increases → S-400 deepens","NATO collective defense Article 5 coverage shrinks","TR may pivot to SCO/BRICS membership → multipolar shift"],
  tr:["Türkiye NATO'dan ayrılır → TR-ABD askeri uyum önemli ölçüde düşer","NATO güneydoğu kanadı kaybı → Yunanistan/Bulgaristan açığa çıkar","TR-RU yakınlaşma olasılığı artar → S-400 derinleşir","NATO kolektif savunma Madde 5 kapsamı daralır","TR, SCO/BRICS üyeliğine yönelebilir → çok kutuplu kayma"]},
brics_exp:{
  en:["Turkey + Indonesia join BRICS → bloc GDP exceeds G7","BRICS gains NATO member (Turkey) → unprecedented cross-bloc membership","Indonesia strengthens ASEAN-BRICS bridge","Western alliance cohesion questioned","De-dollarization momentum accelerates"],
  tr:["Türkiye + Endonezya BRICS'e katılır → blok GSYİH'si G7'yi aşar","BRICS NATO üyesi kazanır (Türkiye) → benzeri görülmemiş çapraz blok üyeliği","Endonezya ASEAN-BRICS köprüsünü güçlendirir","Batı ittifak uyumu sorgulanır","Dolardan uzaklaşma ivmesi hızlanır"]},
us_cn:{
  en:["US-China trade drops to $50B → supply chain decoupling accelerates","ASEAN countries forced to choose sides","Tech bifurcation deepens (chips, AI, 5G)","China accelerates yuan internationalization","Global inflation risk from supply chain disruption"],
  tr:["ABD-Çin ticareti 50 milyar $'a düşer → tedarik zinciri ayrışması hızlanır","ASEAN ülkeleri taraf seçmeye zorlanır","Teknoloji ikileşmesi derinleşir (çip, AI, 5G)","Çin yuan uluslararasılaştırmasını hızlandırır","Tedarik zinciri kesintisinden küresel enflasyon riski"]},
eu_army:{
  en:["EU joint military → European strategic autonomy realized","NATO relevance questioned → US may reduce European commitment","DE+FR+IT military budgets increase 30%","UK excluded → post-Brexit strategic gap widens","European defense industry consolidation accelerates"],
  tr:["AB ortak ordusu → Avrupa stratejik otonomisi gerçekleşir","NATO geçerliliği sorgulanır → ABD Avrupa taahhüdünü azaltabilir","DE+FR+IT askeri bütçeleri %30 artar","İngiltere dışarıda → Brexit sonrası stratejik açık genişler","Avrupa savunma sanayii konsolidasyonu hızlanır"]},
ru_half:{
  en:["Russia military halved → conventional deterrence collapses","Ukraine gains battlefield advantage","Russia increases nuclear reliance → escalation risk","China becomes sole security guarantor for Russia","Central Asian states hedge toward China/Turkey"],
  tr:["Rusya askeri yarıya düşer → konvansiyonel caydırıcılık çöker","Ukrayna savaş alanı avantajı kazanır","Rusya nükleer bağımlılığını artırır → tırmanma riski","Çin, Rusya için tek güvenlik garantörü olur","Orta Asya devletleri Çin/Türkiye'ye yönelir"]},
in_quad:{
  en:["India exits Quad → US Indo-Pacific strategy weakened","China's regional influence expands unchecked","Japan-Australia forced to compensate → higher defense burden","India-Russia defense ties may strengthen","BRICS cohesion increases as India distances from US orbit"],
  tr:["Hindistan Quad'dan çekilir → ABD Hint-Pasifik stratejisi zayıflar","Çin bölgesel etkisi kontrolsüz genişler","Japonya-Avustralya telafi etmeye zorlanır → daha yüksek savunma yükü","Hindistan-Rusya savunma bağları güçlenebilir","Hindistan ABD yörüngesinden uzaklaştıkça BRICS uyumu artar"]},
sa_iran:{
  en:["Saudi-Iran détente → Middle East proxy wars de-escalate","Yemen conflict potential resolution path opens","Oil market stabilizes → OPEC+ coordination strengthens","Israel loses anti-Iran coalition leverage","US influence in Gulf region diminishes"],
  tr:["Suudi-İran yumuşaması → Ortadoğu vekalet savaşları yatışır","Yemen çatışması potansiyel çözüm yolu açılır","Petrol piyasası stabilize olur → OPEC+ koordinasyonu güçlenir","İsrail İran karşıtı koalisyon kaldıracını kaybeder","ABD'nin Körfez bölgesindeki etkisi azalır"]},
jp_nuc:{
  en:["Japan goes nuclear → East Asian arms race triggered","South Korea pressured to develop own nuclear program","US-Japan alliance framework fundamentally altered","China increases military posture around Taiwan/Senkaku","NPT regime credibility collapses → global proliferation risk"],
  tr:["Japonya nükleer olur → Doğu Asya silahlanma yarışı tetiklenir","Güney Kore kendi nükleer programını geliştirmeye baskılanır","ABD-Japonya ittifak çerçevesi temelden değişir","Çin Tayvan/Senkaku çevresinde askeri duruşunu artırır","NPT rejimi güvenilirliği çöker → küresel yayılma riski"]}
};

const cTR={US:"ABD",CN:"Çin",JP:"Japonya",DE:"Almanya",GB:"Birleşik Krallık",FR:"Fransa",IN:"Hindistan",IT:"İtalya",BR:"Brezilya",CA:"Kanada",KR:"Güney Kore",RU:"Rusya",AU:"Avustralya",MX:"Meksika",ID:"Endonezya",SA:"Suudi Arabistan",TR:"Türkiye",AR:"Arjantin",ZA:"Güney Afrika"};
const rTR={"North America":"K.Amerika","East Asia":"D.Asya","Europe":"Avrupa","South Asia":"G.Asya","South America":"G.Amerika","Eurasia":"Avrasya","Oceania":"Okyanusya","Southeast Asia":"GD.Asya","Middle East":"Ortadoğu","Africa":"Afrika"};
const tTR={low:"DÜŞÜK",medium:"ORTA",high:"YÜKSEK",critical:"KRİTİK"};

// Behavioral dimension labels
const behLabels={
  en:{decis:"Decision",crisis:"Crisis Behav.",risk:"Risk Toler.",status:"Status Quo",alliance:"Alliance",twoLvl:"Domestic Eff.",dipStyle:"Dip. Style",predict:"Predictabil."},
  tr:{decis:"Karar Yapısı",crisis:"Kriz Davr.",risk:"Risk Tol.",status:"Statükoculuk",alliance:"İttifak Davr.",twoLvl:"İç Pol. Etk.",dipStyle:"Dip. Stil",predict:"Öngörül."}
};
const behDescEn={decis:["One-man","Institutional"],crisis:["Escalator","De-escalator"],risk:["Risk-averse","High risk"],status:["Revisionist","Status quo"],alliance:["Bandwagon","Balance"],twoLvl:["Low domestic","High domestic"],dipStyle:["Unilateral","Multilateral"],predict:["Unpredictable","Predictable"]};
const behDescTr={decis:["Tek adam","Kurumsal"],crisis:["Tırmandırıcı","Yatıştırıcı"],risk:["Riskten kaçınır","Yüksek risk"],status:["Revizyonist","Statükocu"],alliance:["Bandwagon","Dengeleyici"],twoLvl:["Düşük iç etki","Yüksek iç etki"],dipStyle:["Tek taraflı","Çok taraflı"],predict:["Öngörsüz","Öngörülür"]};

const tx={en:{sub:"International Relations Analysis Tool",bil:"BILATERAL",coal:"COALITION",scen:"SCENARIO",hBi:"Click two countries on the map",hCo:"Click 3-6 countries for coalition",hSc:"Select scenario then countries",go:"Analyze",rst:"Reset",cl:"AXIS Composite Index",cs:"Multi-Level Bilateral Score",wt:"WEIGHT",
pM:"Military & Structural Power",pE:"Economic Interdependence",pL:"Lobby & Civil Society",pC:"Identity & Cultural Proximity",pS:"Strategic Alignment",pB:"Behavioral Compatibility",pH:"Historical Context",histSource:"Data Source",histQuery:"Query Type",
pb:"Power Balance",bn:"Both Nuclear",bu:"Both UNSC P5",ml:"Mil.",gd:"GDP",bt:"Bilateral Trade",op:"Openness",ac:"Avg CPI",ad:"Avg Democracy",cv:"Civil Soc.",hd:"Hofstede Dist.",sr:"Same Region",uv:"UN Voting",sa:"Shared Alliances",tl:"Tension",sf:"Shared Fw.",al:"Alliances",
ai:"AXIS Interpretation Engine",pp:"Population",to:"Trade Open.",cp:"CPI",dm:"Democracy",fh:"Freedom H.",rg:"Region",tt:"Data Transparency",cx:"Context",sl:"Scenario",
ct:"Coalition Analysis",tg:"Combined GDP",tm:"Combined Mil.",ah:"Avg Cohesion",wl:"Weakest Link",cm:"Cohesion Matrix",mb:"Members",behTitle:"Behavioral Profile",behCompat:"Behav. Compatibility",
vD:"Deep Strategic Partnership",vS:"Strong Cooperative",vM:"Moderate Engagement",vL:"Limited/Transactional",vA:"Adversarial/Minimal",
coalInterp:"Coalition Interpretation",scenDiff:"Scenario Impact Analysis",before:"Before",after:"After",change:"Change",
    iH: function(a, b) {
      const phrases = [
        `<strong>${a}</strong> and <strong>${b}</strong> maintain a high-fidelity strategic alignment, anchored by institutionalized cooperation. `,
        `Bilateral ties between <strong>${a}</strong> and <strong>${b}</strong> exhibit significant structural synergy and deep-rooted engagement. `,
        `The relationship between <strong>${a}</strong> and <strong>${b}</strong> is characterized by a robust strategic partnership and mutual policy convergence. `
      ];
      return phrases[Math.floor(Math.random() * phrases.length)];
    },
    iM: function(a, b) {
      const phrases = [
        `Relations between <strong>${a}</strong> and <strong>${b}</strong> are currently defined by selective engagement, often characterized by transactional cooperation. `,
        `The <strong>${a}</strong>-<strong>${b}</strong> dyad shows moderate coordination, though restricted by structural asymmetries and competing priorities. `,
        `Strategic interaction between <strong>${a}</strong> and <strong>${b}</strong> remains stable but lacks the depth of a formalized partnership. `
      ];
      return phrases[Math.floor(Math.random() * phrases.length)];
    },
    iL: function(a, b) {
      const phrases = [
        `Bilateral engagement between <strong>${a}</strong> and <strong>${b}</strong> remains fragmented, reflecting a low-intensity or adversarial posture. `,
        `Strategic friction and limited institutional channels define the current <strong>${a}</strong>-<strong>${b}</strong> interaction. `,
        `There is a notable lack of diplomatic momentum between <strong>${a}</strong> and <strong>${b}</strong>, with relations bordering on systemic isolation. `
      ];
      return phrases[Math.floor(Math.random() * phrases.length)];
    },
    eH: function(t) { return `A trade volume of <strong>$${t}B</strong> underscores a high degree of geoeconomic interdependence. `; },
    eM: function(t) { return `Economic linkage ($${t}B) provides a moderate floor for relations, though it remains below potential. `; },
    eL: function(t) { return `Economic connectivity is negligible ($${t}B), offering little resilience against diplomatic shocks. `; },
    sH: function(n, o) { return `The dyad is deeply integrated into <strong>${n} multilateral frameworks</strong> (${o}), enhancing structural stability. `; },
    sM: function(o) { return `Overlap in ${o} indicates shared interests, yet lacks the intensity of a coordinated bloc. `; },
    tC: '<span style="color:var(--neg); font-weight:700;">[HIGH CRITICALITY] Elevated risk of coercive escalation or tactical standoff.</span> ',
    tH: "Presence of unresolved territorial or security disputes creates significant diplomatic friction. ",
    cC: function(d) { return `High cultural affinity (Hofstede: ${d}) serves as a lubricant for diplomatic signaling and trust-building. `; },
    cF: function(d) { return `Significant cultural distance (Hofstede: ${d}) increases the probability of misperception and signal failure. `; },
    bH: function(s) { return `Behavioral fidelity is high (${s}/100); both actors exhibit compatible strategic cultures and predictable crisis responses. `; },
    bM: function(s) { return `Moderate behavioral alignment (${s}/100); while diplomatic protocols match, divergences in risk-appetite may trigger friction during volatility. `; },
    bL: function(s) { return `Low behavioral compatibility (${s}/100); structural differences in decision-making and risk-tolerance create a high-friction environment. `; },
gtTitle:"GAME THEORY ANALYSIS",gtPureNash:"Pure Strategy Nash Equilibria",gtMixedNash:"Mixed Strategy Nash Equilibrium",gtDominant:"Dominant Strategies",gtMinimax:"Minimax (Worst-Case Optimal)",gtNoNash:"No pure strategy Nash Equilibrium exists",gtNone:"None (no dominant strategy)",gtExpected:"Expected payoff",gtGuaranteed:"guaranteed min",gtTheory:"IR THEORY CONTEXT",gtAiAnalysis:"AI Game Theory Analysis",
choroplethTitle:"AXIS Score Heatmap",choroplethRef:"Reference",choroplethMember:"Coalition Member",choroplethNon:"Non-member",choroplethHigh:"Strong (70+)",choroplethGood:"Good (55-69)",choroplethMod:"Moderate (40-54)",choroplethLow:"Low (25-39)",choroplethMin:"Adversarial (<25)",
netGraph:"COALITION NETWORK TOPOLOGY",netGraphBil:"ALLIANCE NETWORK",netNodeTooltip:"Connections",netEdgeScore:"Cohesion Score",netLegendStrong:"Strong (60+)",netLegendMod:"Moderate (35-59)",netLegendWeak:"Weak (<35)",netDrag:"Drag nodes to rearrange",netGdp:"GDP",netMil:"Military",
mineralTitle:"Critical Mineral Profile",mineralSecurity:"Mineral Security Score",mineralImportDep:"Import Dependency",mineralProduces:"Produces (≥5% global)",mineralCriticalImports:"Critical Imports",mineralTopSupplier:"Top Supplier",mineralSupplyCompat:"Supply Chain Compatibility",mineralChinaExposure:"Combined China Exposure",mineralAtoB:"can supply to",mineralBtoA:"can supply to",mineralCompetition:"Shared Dependencies",mineralHHIWarn:"⚠ High market concentration risk",mineralMining:"mining",mineralProcessing:"processing",
pG:"Real-time Media Climate",gdeltLoading:"FETCHING MEDIA DATA...",gdeltUnavailable:"Real-time media data unavailable",gdeltNews:"LIVE MEDIA FEED",gdeltTrend:"Media Trend",gdeltToneAvg:"Avg. Tone (3mo)",gdeltTone7d:"Tone (7 days)",gdeltArticles:"Articles (3mo)",gdeltImproving:"IMPROVING ▲",gdeltDeteriorating:"DETERIORATING ▼",gdeltStable:"STABLE ●",sGDELT:"GDELT Project",
sWB:"World Bank",sSI:"SIPRI",sCP:"TI CPI",sVD:"V-Dem",sFH:"Freedom House",sHF:"Hofstede",sUN:"UN Voting",sBL:"Bilateral est.",sBH:"Behavioralist indicators",
detailFormula:"Scoring Formula",detailNuclearBoth:"Both nuclear powers — MAD dynamics apply",detailNuclearAsym:"Nuclear asymmetry — deterrence imbalance",detailNuclearNone:"Neither state possesses nuclear weapons",detailTradeHigh:"Major trade partnership — high interdependence",detailTradeMed:"Moderate trade linkage",detailTradeLow:"Limited trade relationship",detailLobbyNote:"Higher scores indicate stronger institutional channels for non-state actors",detailCulturalClose:"Low cultural distance facilitates diplomatic communication",detailCulturalFar:"High cultural distance increases misperception risk",detailBehGap:"Biggest gap",detailBehAlign:"Strongest alignment",detailHofPdi:"Power Distance",detailHofIdv:"Individualism",detailHofMas:"Masculinity",detailHofUai:"Uncertainty Avoidance",detailHofLto:"Long-Term Orientation",
confHigh:"HIGH",confEst:"ESTIMATED",
meth:"METHODOLOGY",expCSV:"Export CSV",expPDF:"Print / PDF",copyLink:"Copy Link",
chat:"CHAT",chatTitle:"AXIS Intelligence Terminal — IR Analysis Chat",chatPlaceholder:"Ask about international relations...",chatSend:"SEND",chatNoKey:"Groq API key required for chat. Go to Settings (⚙) to add your free key from console.groq.com",chatWelcome:"AXIS IR Chat ready. Ask any question about international relations, geopolitics, alliances, or foreign policy theories.",
aiDeepBil:"AI Deep Analysis",aiDeepCoal:"AI Strategic Assessment",aiDeepScen:"AI Domino Analysis",aiAnalyzing:"ANALYZING...",aiDisclaimer:"⚠ This analysis is AI-generated. Independent verification is required for academic use.",aiNoKey:'Groq API key required — get one free at <a href="https://console.groq.com" target="_blank">console.groq.com</a>',aiError:"AI analysis unavailable. Rule-based analysis shown above.",settingsTitle:"SETTINGS",settingsSave:"SAVE",settingsKeySaved:"API key saved ✓",settingsKeyCleared:"API key cleared",
scenBefore:"Before",scenAfter:"After",scenChg:"Change",scenAffected:"Affected Bilateral Relations",scenDomino:"Domino Effect Chain",scenNoChange:"No significant changes detected",
netTitle:"Network Criticality Analysis",netMember:"Member",netCurrent:"Current Cohesion",netWithout:"Without Member",netDelta:"Impact",netCritical:"Most critical connector",netLeast:"Least impactful member",confLabel:"Data Confidence",confHighDesc:"Bilateral data sourced from verified datasets",confEstDesc:"Algorithmically estimated — no direct bilateral record",
sens:"SENSITIVITY",sensTitle:"Sensitivity Analysis",sensDefault:"Default Weights",sensCustom:"Custom Weights",sensDiff:"Difference",sensImpact:"Weight Impact Analysis",sensAcNote:"Adjust layer weights — total auto-normalizes to 100%. Cf. Saaty (1980) AHP as alternative weighting methodology.",sensNote:"This module offers user-defined weighting as an alternative to Saaty (1980) Analytic Hierarchy Process. Adjusting weights reveals which analytical layers drive the composite score.",sensReset:"Reset Weights",
histApiSrc:"Source:",histInit:"Initializing API connection...",histApiErr:"API Timeout / Error",histFail:"No comprehensive historical background article found.",histLoad:"Fetching live encyclopedic datastream...",
ftData:"DATA SOURCES:",ftRights:"\u00a9 2026 AXIS. All rights reserved.",ftAcad:"Academic use with attribution permitted.",detailUnsc:"UNSC P5:",detailFormDesc:"Balance\u00d740 + AvgGDP\u00d725 + Nuclear\u00d715 + UNSC\u00d710",
gdeltOnline:"GDELT ONLINE",gdeltOffline:"GDELT OFFLINE",
tabBil:"BILATERAL",tabCoal:"COALITION",tabScen:"SCENARIO",tabSens:"SENSITIVITY",tabChat:"CHAT",tabProf:"PROFILES",tabAbm:"SIMULATION",tabMeth:"METHODOLOGY",tabBacktest:"VALIDATION"},
tr:{sub:"Uluslararas\u0131 \u0130li\u015fkiler Analiz Arac\u0131",tabBil:"\u0130K\u0130L\u0130",tabCoal:"KOAL\u0130SYON",tabScen:"SENARYO",tabSens:"DUYARLILIK",tabChat:"SOHBET",tabProf:"PROF\u0130LLER",tabAbm:"S\u0130M\u00dcLASYON",tabMeth:"METODOLOJ\u0130",tabBacktest:"DO\u011eRULAMA",
gdeltOnline:"GDELT AKT\u0130F",gdeltOffline:"GDELT DEVRE DI\u015eI",hBi:"Haritadan iki \u00fclke se\u00e7in",hCo:"Koalisyon i\u00e7in 3-6 \u00fclke se\u00e7in",hSc:"Senaryo se\u00e7in sonra \u00fclkeleri belirleyin",go:"Analiz Et",rst:"S\u0131f\u0131rla",cl:"AXIS Bile\u015fik Endeksi",cs:"\u00c7ok Katmanl\u0131 \u0130kili \u0130li\u015fki Skoru",wt:"A\u011eIRLIK",
bil:"\u0130K\u0130L\u0130",coal:"KOAL\u0130SYON",scen:"SENARYO",sens:"DUYARLILIK",chat:"SOHBET",profiles:"PROF\u0130LLER",abm:"S\u0130M\u00dcLASYON",meth:"METODOLOJ\u0130",backtest:"DO\u011eRULAMA",
pM:"Askeri \u0026 Yap\u0131sal G\u00fc\u00e7",pE:"Ekonomik Kar\u015f\u0131l\u0131kl\u0131 Ba\u011f\u0131ml\u0131l\u0131k",pL:"Lobi \u0026 Sivil Toplum",pC:"Kimlik \u0026 K\u00fclt\u00fcrel Yak\u0131nl\u0131k",pS:"Stratejik Uyum",pB:"Davran\u0131\u015fsal Uyum",pH:"Tarihsel Ba\u011flam",histSource:"Veri Kayna\u011f\u0131",histQuery:"Sorgu T\u00fcr\u00fc",
pb:"G\u00fc\u00e7 Dengesi",bn:"\u0130kisi N\u00fckleer",bu:"\u0130kisi BMGK P5",ml:"Ask.",gd:"GSY\u0130H",bt:"\u0130kili Ticaret",op:"A\u00e7\u0131kl\u0131k",ac:"Ort. YAE",ad:"Ort. Demokrasi",cv:"Sivil Top.",hd:"Hofstede Mes.",sr:"Ayn\u0131 B\u00f6lge",uv:"BM Oylama",sa:"Ortak \u0130ttifaklar",tl:"Gerilim",sf:"Ortak \u00c7er\u00e7eveler",al:"\u0130ttifaklar",
ai:"AXIS Yorumlama Motoru",pp:"N\u00fcfus",to:"Ticaret A\u00e7.",cp:"YAE",dm:"Demokrasi",fh:"\u00d6zg\u00fcrl\u00fck E.",rg:"B\u00f6lge",tt:"Veri \u015eeffafl\u0131k Paneli",cx:"Ba\u011flam",sl:"Senaryo",
ct:"Koalisyon Analizi",tg:"Toplam GSY\u0130H",tm:"Toplam Askeri",ah:"Ort. Uyum",wl:"En Zay\u0131f Halka",cm:"Uyum Matrisi",mb:"\u00fcyeler",behTitle:"Davran\u0131\u015fsal Profil",
    iH: function(a, b) {
      const phrases = [
        `<strong>${a}</strong> ve <strong>${b}</strong>, kurumsallaşmış işbirliğiyle desteklenen yüksek düzeyde stratejik bir uyum sergilemektedir. `,
        `<strong>${a}</strong> ile <strong>${b}</strong> arasındaki ikili ilişkiler, derin yapısal sinerji ve kapsamlı karşılıklı angajman ile nitelendirilmektedir. `,
        `<strong>${a}</strong>-<strong>${b}</strong> ilişkisi, güçlü bir stratejik ortaklık ve belirgin politika yakınsaması temelinde ilerlemektedir. `
      ];
      return phrases[Math.floor(Math.random() * phrases.length)];
    },
    iM: function(a, b) {
      const phrases = [
        `<strong>${a}</strong> ve <strong>${b}</strong> arasındaki ilişkiler, çoğunlukla işlemsel (transactional) işbirliği ile tanımlanan "seçici angajman" aşamasındadır. `,
        `<strong>${a}</strong>-<strong>${b}</strong> ikilisi, yapısal asimetriler ve rakip öncelikler tarafından kısıtlanmış olsa da orta düzeyde bir koordinasyon göstermektedir. `,
        `<strong>${a}</strong> ve <strong>${b}</strong> arasındaki stratejik etkileşim istikrarlı seyretmekle birlikte, resmileşmiş bir ortaklığın derinliğinden yoksundur. `
      ];
      return phrases[Math.floor(Math.random() * phrases.length)];
    },
    iL: function(a, b) {
      const phrases = [
        `<strong>${a}</strong> ile <strong>${b}</strong> arasındaki ikili angajman, düşük yoğunluklu veya çatışmacı bir duruşu yansıtan parçalı bir yapıdadır. `,
        `Mevcut <strong>${a}</strong>-<strong>${b}</strong> etkileşimi, stratejik sürtünme ve kısıtlı kurumsal kanallar tarafından şekillenmektedir. `,
        `<strong>${a}</strong> ve <strong>${b}</strong> arasında diplomatik momentum eksikliği dikkat çekmektedir; ilişkiler sistemsel izolasyon sınırında seyretmektedir. `
      ];
      return phrases[Math.floor(Math.random() * phrases.length)];
    },
    eH: function(t) { return `<strong>$${t}Milyar</strong> tutarındaki ticaret hacmi, yüksek düzeyde bir jeoekonomik karşılıklı bağımlılığın altını çizmektedir. `; },
    eM: function(t) { return `Ekonomik bağlar ($${t}Milyar), ilişkiler için orta düzeyde bir zemin sağlasa da potansiyelinin altında kalmaktadır. `; },
    eL: function(t) { return `Ekonomik bağlantı ihmal edilebilir düzeydedir ($${t}Milyar); diplomatik şoklara karşı sınırlı direnç sağlamaktadır. `; },
    sH: function(n, o) { return `İkili, <strong>${n} çok taraflı çerçeveye</strong> (${o}) derinden entegre olmuştur; bu durum yapısal istikrarı artırmaktadır. `; },
    sM: function(o) { return `${o} bünyesindeki ortak üyelikler ortak çıkarlara işaret etmekle birlikte, eşgüdümlü bir bloğun yoğunluğundan yoksundur. `; },
    tC: '<span style="color:var(--neg); font-weight:700;">[KRİTİK GERİLİM] Zorlayıcı tırmanma veya taktiksel kilitlenme riski yüksektir.</span> ',
    tH: "Çözümlenmemiş güvenlik veya toprak ihtilafları, belirgin bir diplomatik sürtünme yaratmaktadır. ",
    cC: function(d) { return `Yüksek kültürel yakınlık (Hofstede: ${d}), diplomatik sinyalizasyon ve güven inşası sürecini kolaylaştırmaktadır. `; },
    cF: function(d) { return `Belirgin kültürel mesafe (Hofstede: ${d}), yanlış algılama ve sinyal hatası olasılığını artırmaktadır. `; },
    bH: function(s) { return `Davranışsal uyum yüksektir (${s}/100); her iki aktör de birbiriyle uyumlu stratejik kültürler ve öngörülebilir kriz tepkileri sergilemektedir. `; },
    bM: function(s) { return `Orta düzeyde davranışsal uyum (${s}/100); diplomatik protokoller örtüşse de risk iştahındaki farklılıklar kriz anlarında sürtünme yaratabilir. `; },
    bL: function(s) { return `Düşük davranışsal uyum (${s}/100); karar alma ve risk toleransındaki yapısal farklılıklar, yüksek sürtünmeli bir ortam yaratmaktadır. `; },
gtTitle:"OYUN TEOR\u0130S\u0130 ANAL\u0130Z\u0130",gtPureNash:"Saf Strateji Nash Dengeleri",gtMixedNash:"Karma Strateji Nash Dengesi",gtDominant:"Bask\u0131n Stratejiler",gtMinimax:"Minimax (En K\u00f6t\u00fc Durum Optimali)",gtNoNash:"Saf strateji Nash Dengesi mevcut de\u011fil",gtNone:"Yok (bask\u0131n strateji yok)",gtExpected:"Beklenen \u00f6deme",gtGuaranteed:"garantili min",gtTheory:"U\u0130 TEOR\u0130 BA\u011eLAMI",gtAiAnalysis:"AI Oyun Teorisi Analizi",
choroplethTitle:"AXIS Skor Is\u0131 Haritas\u0131",choroplethRef:"Referans",choroplethMember:"Koalisyon \u00fcyesi",choroplethNon:"\u00fcye De\u011fil",choroplethHigh:"G\u00fc\u00e7l\u00fc (70+)",choroplethGood:"\u0130yi (55-69)",choroplethMod:"Orta (40-54)",choroplethLow:"D\u00fc\u015f\u00fck (25-39)",choroplethMin:"\u00c7at\u0131\u015fmac\u0131 (<25)",
netGraph:"KOAL\u0130SYON A\u011e TOPOLOJ\u0130S\u0130",netGraphBil:"\u0130TT\u0130FAK A\u011eI",netNodeTooltip:"Ba\u011flant\u0131lar",netEdgeScore:"Uyum Skoru",netLegendStrong:"G\u00fc\u00e7l\u00fc (60+)",netLegendMod:"Orta (35-59)",netLegendWeak:"Zay\u0131f (<35)",netDrag:"D\u00fc\u011f\u00fcmleri s\u00fcr\u00fckleyerek yeniden d\u00fczenle",netGdp:"GSY\u0130H",netMil:"Askeri",
mineralTitle:"Kritik Mineral Profili",mineralSecurity:"Mineral G\u00fcvenlik Skoru",mineralImportDep:"\u0130thalat Ba\u011f\u0131ml\u0131l\u0131\u011f\u0131",mineralProduces:"\u00fcretir (\u2265%5 k\u00fcresel)",mineralCriticalImports:"Kritik \u0130thalatlar",mineralTopSupplier:"Ana Tedarik\u00e7i",mineralSupplyCompat:"Tedarik Zinciri Uyumu",mineralChinaExposure:"Birle\u015fik \u00c7in Maruziyeti",mineralAtoB:"tedarik edebilir \u2192",mineralBtoA:"tedarik edebilir \u2192",mineralCompetition:"Ortak Ba\u011f\u0131ml\u0131l\u0131klar",mineralHHIWarn:"\u26A0 Y\u00fcksek pazar yo\u011funla\u015fma riski",mineralMining:"madencilik",mineralProcessing:"i\u015fleme",
pG:"Anl\u0131k Medya \u0130klimi",gdeltLoading:"MEDYA VER\u0130S\u0130 \u00c7EK\u0130L\u0130YOR...",gdeltUnavailable:"Anl\u0131k medya verisi kullan\u0131lam\u0131yor",gdeltNews:"CANLI MEDYA AKI\u015eI",gdeltTrend:"Medya Trendi",gdeltToneAvg:"Ort. Ton (3ay)",gdeltTone7d:"Ton (7 g\u00fcn)",gdeltArticles:"Haber (3ay)",gdeltImproving:"\u0130Y\u0130LE\u015e\u0130YOR \u25b2",gdeltDeteriorating:"K\u00d6T\u00dcLE\u015e\u00ceYOR \u25bc",gdeltStable:"STAB\u0130L \u25cf",sGDELT:"GDELT Projesi",
sWB:"D\u00fcnya Bankas\u0131",sSI:"SIPRI",sCP:"Uluslararas\u0131 \u015eeffafl\u0131k \u00d6rg\u00fct\u00fc",sVD:"V-Dem",sFH:"Freedom House",sHF:"Hofstede",sUN:"BM Genel Kurul Oylamas\u0131",sBL:"\u0130kili ticaret tahmini",sBH:"Davran\u0131\u015fsalc\u0131 g\u00f6stergeler",
detailFormula:"Skor Form\u00fcl\u00fc",detailNuclearBoth:"\u0130kisi de n\u00fckleer g\u00fc\u00e7 \u2014 MAD dinamikleri ge\u00e7erli",detailNuclearAsym:"N\u00fckleer asimetri \u2014 cayd\u0131r\u0131c\u0131l\u0131k dengesizli\u011fi",detailNuclearNone:"\u0130ki devlet de n\u00fckleer silaha sahip de\u011fil",detailTradeHigh:"B\u00fcy\u00fck ticaret ortakl\u0131\u011f\u0131 \u2014 y\u00fcksek kar\u015f\u0131l\u0131kl\u0131 ba\u011f\u0131ml\u0131l\u0131k",detailTradeMed:"Orta d\u00fczey ticaret ba\u011f\u0131",detailTradeLow:"S\u0131n\u0131rl\u0131 ticaret ili\u015fkisi",detailLobbyNote:"Y\u00fcksek skor, devlet d\u0131\u015f\u0131 akt\u00f6rlerin daha g\u00fc\u00e7l\u00fc kurumsal kanallar\u0131n\u0131 i\u015faret eder",detailCulturalClose:"D\u00fc\u015f\u00fck k\u00fclt\u00fcrel mesafe diplomatik ileti\u015fimi kolayla\u015ft\u0131r\u0131r",detailCulturalFar:"Y\u00fcksek k\u00fclt\u00fcrel mesafe yanl\u0131\u015f alg\u0131lama riskini art\u0131r\u0131r",detailBehGap:"En b\u00fcy\u00fck fark",detailBehAlign:"En g\u00fc\u00e7l\u00fc uyum",detailHofPdi:"G\u00fc\u00e7 Mesafesi",detailHofIdv:"Bireycilik",detailHofMas:"Mask\u00fclenlik",detailHofUai:"Belirsizlikten Ka\u00e7\u0131nma",detailHofLto:"Uzun Vadeli Y\u00f6nelim",
confHigh:"Y\u00dcKSEK",confEst:"TAHM\u0130N\u0130",
meth:"METODOLOJ\u0130",expCSV:"CSV \u0130ndir",expPDF:"Yazd\u0131r / PDF",copyLink:"Link Kopyala",
chat:"SOHBET",chatTitle:"AXIS \u0130stihbarat Terminali \u2014 U\u0130 Analiz Sohbeti",chatPlaceholder:"Uluslararas\u0131 ili\u015fkiler hakk\u0131nda soru sorun...",chatSend:"G\u00d6NDER",chatNoKey:"Sohbet i\u00e7in Groq API key gerekli. Ayarlar (\u2699) panelinden console.groq.com'dan ald\u0131\u011f\u0131n\u0131z \u00fccretsiz key'i ekleyin.",chatWelcome:"AXIS U\u0130 Sohbet haz\u0131r. Uluslararas\u0131 ili\u015fkiler, jeopolitik, ittifaklar veya d\u0131\u015f politika teorileri hakk\u0131nda soru sorabilirsiniz.",
aiDeepBil:"AI Derinlemesine Analiz",aiDeepCoal:"AI Stratejik De\u011ferlendirme",aiDeepScen:"AI Domino Analizi",aiAnalyzing:"ANAL\u0130Z ED\u0130L\u0130YOR...",aiDisclaimer:"\u26A0 Bu analiz yapay zeka taraf\u0131ndan \u00fcretilmi\u015ftir. Akademik kullan\u0131mda ba\u011f\u0131ms\u0131z do\u011frulama gerektirir.",aiNoKey:'Groq API key gerekli \u2014 \u003ca href="https://console.groq.com" target="_blank"\u003econsole.groq.com\u003c/a\u003e adresinden \u00fccretsiz alabilirsiniz.',aiError:"AI analiz \u015fu an kullan\u0131lam\u0131yor. Kural tabanl\u0131 analiz g\u00f6steriliyor.",settingsTitle:"AYARLAR",settingsSave:"KAYDET",settingsKeySaved:"API key kaydedildi \u2713",settingsKeyCleared:"API key silindi",
scenBefore:"\u00d6nce",scenAfter:"Sonra",scenChg:"De\u011fi\u015fim",scenAffected:"Etkilenen \u0130kili \u0130li\u015fkiler",scenDomino:"Domino Etki Zinciri",scenNoChange:"\u00d6nemli bir de\u011fi\u015fiklik tespit edilmedi",
netTitle:"A\u011f Kritiklik Analizi",netMember:"\u00fcye",netCurrent:"Mevcut Uyum",netWithout:"\u00fcye \u00c7\u0131karsa",netDelta:"Etki",netCritical:"En kritik ba\u011flay\u0131c\u0131",netLeast:"En az etkili \u00fcye",confLabel:"Veri G\u00fcven Seviyesi",confHighDesc:"\u0130kili veriler do\u011frulanm\u0131\u015f veri setlerinden al\u0131nm\u0131\u015ft\u0131r",confEstDesc:"Algoritmik tahmin \u2014 do\u011frudan ikili kay\u0131t bulunmamaktad\u0131r",
sens:"DUYARLILIK",sensTitle:"Duyarl\u0131l\u0131k Analizi",sensDefault:"Varsay\u0131lan A\u011f\u0131rl\u0131klar",sensCustom:"\u00d6zel A\u011f\u0131rl\u0131klar",sensDiff:"Fark",sensImpact:"A\u011f\u0131rl\u0131k Etki Analizi",sensAcNote:"Katman a\u011f\u0131rl\u0131klar\u0131n\u0131 ayarlay\u0131n \u2014 toplam otomatik olarak %100'e normalize edilir. Kr\u015f. Saaty (1980) AHP alternatif a\u011f\u0131rl\u0131kland\u0131rma metodolojisi.",sensNote:"Bu mod\u00fcl Saaty (1980) Analitik Hiyerar\u015fi S\u00fcrecine alternatif olarak kullan\u0131c\u0131 tan\u0131ml\u0131 a\u011f\u0131rl\u0131kland\u0131rma sunar. A\u011f\u0131rl\u0131klar\u0131 de\u011fi\u015ftirmek, hangi analiz katmanlar\u0131n\u0131n bile\u015fik skoru y\u00f6nlendirdi\u011fini ortaya koyar.",sensReset:"A\u011f\u0131rl\u0131klar\u0131 S\u0131f\u0131rla",
histApiSrc:"Kaynak:",histInit:"API ba\u011flant\u0131s\u0131 kuruluyor...",histApiErr:"API Zaman A\u015f\u0131m\u0131 / Hatas\u0131",histFail:"Kapsaml\u0131 bir tarihsel arka plan makalesi bulunamad\u0131.",histLoad:"Canl\u0131 Wikipedia ar\u015fivi taran\u0131yor...",
ftData:"VER\u0130 KAYNAKLARI:",ftRights:"\u00a9 2026 AXIS. T\u00fcm haklar\u0131 sakl\u0131d\u0131r.",ftAcad:"At\u0131f yap\u0131larak akademik kullan\u0131ma izin verilir.",detailUnsc:"BMGK P5:",detailFormDesc:"Denge\u00d740 + OrtGSY\u0130H\u00d725 + N\u00fckleer\u00d715 + BMGK\u00d710"}};
