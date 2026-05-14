// AXIS — Map initialization and interaction
// Depends on: core.js (mode, selA, selB, coalMembers, markers, C, cN), Leaflet (L)

// Flag code mapping (used by map markers and flagImg in ui.js)
// Flag code mapping — sole definition, used by map markers and flagImg() in ui.js
const _flagMap={US:'us',CN:'cn',JP:'jp',DE:'de',GB:'gb',FR:'fr',IN:'in',IT:'it',BR:'br',CA:'ca',KR:'kr',RU:'ru',AU:'au',MX:'mx',ID:'id',SA:'sa',TR:'tr',AR:'ar',ZA:'za'};

window.map=L.map("map",{zoomControl:true,attributionControl:false,minZoom:2,maxZoom:7}).setView([25,10],2);
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{
  attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains:'abcd',
  maxZoom:20
}).addTo(window.map);
const map = window.map;
map.on("mousemove",function(e){const el=document.getElementById("statusCoords");if(el)el.textContent="LAT "+e.latlng.lat.toFixed(2)+" LNG "+e.latlng.lng.toFixed(2)});
Object.entries(C).forEach(([code,c])=>{
  let fhtml = '';
  let mkrStyle = 'width:36px;height:36px;background:var(--bg3);border:2px solid var(--border2);display:flex;align-items:center;justify-content:center;';
  
  if (c.isNSA) {
    const assetPath = 'assets/' + code.toLowerCase() + '.png';
    fhtml = '<img src="' + assetPath + '" width="24" height="24" style="object-fit:contain;filter:drop-shadow(0 0 4px '+c.c+')">';
    mkrStyle += 'border-color:' + c.c + '; box-shadow: 0 0 12px '+c.c+'66; background: rgba(0,0,0,0.4);';
  } else {
    fhtml = '<img src="https://flagcdn.com/w40/'+(_flagMap[code]||code.toLowerCase())+'.png" width="24" height="18" style="border-radius:2px" onerror="this.outerHTML=\''+c.f+'\'">';
  }


  const icon=L.divIcon({className:"",html:'<div class="map-marker" id="mk-'+code+'" tabindex="0" role="button" aria-label="'+c.n+'" style="'+mkrStyle+'">'+fhtml+'</div>',iconSize:[32,32],iconAnchor:[16,16]});
  const m=L.marker([c.lat,c.lng],{icon}).addTo(map);
  m.on("click",()=>onMapClick(code));
  
  let pIcon = c.isNSA ? c.flag : c.f;
  m.on("mouseover",()=>{m.bindPopup('<div style="font-weight:600;font-size:14px;margin-bottom:6px">'+pIcon+" "+cN(code)+'</div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t2)"><span>VAL</span><span style="font-family:monospace;color:var(--t1)">$'+c.gdp+'B</span></div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t2)"><span>MIL</span><span style="font-family:monospace;color:var(--t1)">$'+c.mil+'B</span></div>',{closeButton:false,offset:[0,-10]}).openPopup()});
  markers[code]=m;
});

function updateMarkers(){
  Object.keys(markers).forEach(code=>{const el=document.getElementById("mk-"+code);if(!el)return;el.className="map-marker";el.style.border="2px solid var(--border2)";
    if(mode==="bilateral"||mode==="sensitivity"||mode==="scenario"){if(code===selA){el.classList.add("sel-a");el.style.borderColor="var(--gold)"}if(code===selB){el.classList.add("sel-b");el.style.borderColor="var(--blue)"}}
    else{if(coalMembers.includes(code)){el.classList.add("coalition");el.style.borderColor="var(--cyan)"}}});
  map.eachLayer(l=>{if(l instanceof L.Polyline&&!(l instanceof L.Polygon))map.removeLayer(l)});
  if((mode==="bilateral"||mode==="sensitivity"||mode==="scenario")&&selA&&selB)L.polyline([[C[selA].lat,C[selA].lng],[C[selB].lat,C[selB].lng]],{color:"rgba(255,176,0,0.5)",weight:2.5,dashArray:"6,4"}).addTo(map);
  if(mode!=="bilateral"&&coalMembers.length>=2)for(let i=0;i<coalMembers.length;i++)for(let j=i+1;j<coalMembers.length;j++)
    L.polyline([[C[coalMembers[i]].lat,C[coalMembers[i]].lng],[C[coalMembers[j]].lat,C[coalMembers[j]].lng]],{color:"rgba(0,255,65,0.25)",weight:1.5,dashArray:"4,3"}).addTo(map);
  // Choropleth update
  if(typeof updateChoropleth==="function"){
    if((mode==="bilateral"||mode==="sensitivity"||mode==="scenario")&&selA){
      const scores={};Object.keys(C).forEach(code=>{if(code!==selA)scores[code]=computeAxis(selA,code).composite});
      updateChoropleth("bilateral",{reference:selA,scores:scores,selB:selB});
    }else if(mode==="coalition"&&coalMembers.length>0){
      updateChoropleth("coalition",{members:coalMembers});
    }else{
      updateChoropleth("none");
    }
  }
}

function onMapClick(code){
  if(mode==="bilateral"||mode==="sensitivity"||mode==="scenario"){if(code===selA)selA=null;else if(code===selB)selB=null;else if(!selA)selA=code;else if(!selB&&code!==selA)selB=code;else{selA=code;selB=null}}
  else{const i=coalMembers.indexOf(code);if(i>=0)coalMembers.splice(i,1);else if(coalMembers.length<6)coalMembers.push(code)}
  // Marker lock-on animation
  const mkEl=document.getElementById("mk-"+code);
  if(mkEl&&!window.matchMedia("(prefers-reduced-motion:reduce)").matches){mkEl.style.animation="markerLock .3s ease";setTimeout(function(){mkEl.style.animation=""},350)}
  updateUI();
  // GDELT prefetch: silently cache data when both countries selected
  if((mode==="bilateral"||mode==="sensitivity")&&selA&&selB){
    fetchGDELT(selA,selB).catch(()=>{});
  }
}

// Keyboard support for map markers
document.addEventListener("keydown",function(e){
  if(e.target.classList.contains("map-marker")&&(e.key==="Enter"||e.key===" ")){
    e.preventDefault();
    const code=e.target.id.replace("mk-","");
    if(code&&C[code])onMapClick(code);
  }
});

// ═══ GLOBAL FILTER ENGINE ═══
window.currentGlobalFilter = "all";

function applyGlobalFilter(region) {
  window.currentGlobalFilter = region;
  
  // Update UI classes
  document.querySelectorAll(".filter-tag").forEach(tag => {
    tag.classList.toggle("on", tag.getAttribute("data-region") === region);
  });

  // Filter map markers
  Object.keys(markers).forEach(code => {
    const c = C[code];
    const m = markers[code];
    let visible = false;
    
    // Subregion mapping for specific IR areas
    const sub = c.subregion || "";
    const reg = c.region || "";

    if (region === "all") {
      visible = true;
    } else if (region === "NGO") {
      visible = !!c.isNSA;
    } else if (region === "Europe") {
      visible = (reg === "Europe");
    } else if (region === "Asia") {
       visible = (reg === "Asia" && sub !== "Western Asia"); 
    } else if (region === "Middle East") {
       visible = (reg === "Asia" && sub === "Western Asia");
    } else if (region === "N. America") {
       visible = (reg === "Americas" && (sub.indexOf("North")>=0 || sub.indexOf("Central")>=0 || sub.indexOf("Caribbean")>=0));
    } else if (region === "S. America") {
       visible = (reg === "Americas" && sub.indexOf("South")>=0);
    } else if (region === "Africa") {
       visible = (reg === "Africa");
    } else if (region === "Oceania") {
       visible = (reg === "Oceania");
    }

    if (visible) {
      if (!map.hasLayer(m)) m.addTo(map);
    } else {
      if (map.hasLayer(m)) map.removeLayer(m);
    }
  });

  // Sync profile grid if function exists
  if (typeof syncProfilesGrid === "function") syncProfilesGrid(region);
}

window.applyGlobalFilter = applyGlobalFilter;
