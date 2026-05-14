// AXIS — GeoJSON Choropleth map layer
// Depends on: data/geo.js (G20_GEO), core.js (C, computeAxis, mode, selA, selB, coalMembers, cN, T), map.js (map, markers)

let geoLayer=null;
let choroLegend=null;

function getCountryCode(feature){
  return feature.properties.ISO||null;
}

function getScoreColor(score){
  if(score>=70)return"#00e676";
  if(score>=55)return"#69f0ae";
  if(score>=40)return"#ffab00";
  if(score>=25)return"#ff9100";
  return"#ff1744";
}

function defaultGeoStyle(feature){
  const borderCol=getComputedStyle(document.documentElement).getPropertyValue("--border").trim()||"#1a2a1a";
  return{fillColor:"rgba(0,229,255,0.1)",fillOpacity:0.1,weight:1,color:borderCol,opacity:.4};
}

function initChoropleth(){
  console.log("initChoropleth called");
  console.log("G20_GEO defined:",typeof G20_GEO!=="undefined");
  console.log("G20_GEO features:",typeof G20_GEO!=="undefined"?G20_GEO.features.length:"N/A");
  console.log("map exists:",typeof map!=="undefined"&&map!==null);

  if(typeof G20_GEO==="undefined"||!G20_GEO||!G20_GEO.features||typeof map==="undefined"||!map){
    console.error("Choropleth init failed: missing G20_GEO or map");
    return;
  }

  // Remove previous layer if exists
  if(geoLayer){try{map.removeLayer(geoLayer)}catch(e){}geoLayer=null}

  try{
    geoLayer=L.geoJson(G20_GEO,{
      style:defaultGeoStyle,
      onEachFeature:function(feature,layer){
        const code=getCountryCode(feature);
        console.log("Choropleth polygon:",code,feature.properties.NAME);
        if(!code||!C[code])return;
        layer.on({
          mouseover:function(){highlightCountry(layer)},
          mouseout:function(){if(geoLayer)geoLayer.resetStyle(layer)},
          click:function(){if(typeof onMapClick==="function")onMapClick(code)}
        });
      }
    }).addTo(map);
    geoLayer.bringToBack();
    console.log("Choropleth added, layer count:",geoLayer.getLayers().length);
  }catch(e){
    console.error("Choropleth init error:",e);
  }
}

function highlightCountry(layer){
  const greenCol=getComputedStyle(document.documentElement).getPropertyValue("--green").trim()||"#00ff41";
  layer.setStyle({weight:2,color:greenCol,fillOpacity:Math.min(.4,(layer.options.fillOpacity||0)+.15)});
  layer.bringToFront();
  Object.values(markers).forEach(m=>{if(m.setZIndex)m.setZIndex(1000)});
}

function updateChoropleth(cMode,data){
  if(!geoLayer)return;

  if(cMode==="bilateral"&&data&&data.reference){
    const ref=data.reference;
    const scores=data.scores||{};
    const sB=data.selB;
    const amberCol=getComputedStyle(document.documentElement).getPropertyValue("--amber").trim()||"#ffb000";
    const blueCol=getComputedStyle(document.documentElement).getPropertyValue("--blue").trim()||"#40c4ff";
    geoLayer.eachLayer(function(layer){
      const code=getCountryCode(layer.feature);
      if(!code)return;
      if(code===ref){
        layer.setStyle({fillColor:amberCol,fillOpacity:.2,weight:3,color:amberCol,opacity:.7});
      }else if(code===sB){
        layer.setStyle({fillColor:blueCol,fillOpacity:.2,weight:3,color:blueCol,opacity:.7});
      }else if(scores[code]!==undefined){
        layer.setStyle({fillColor:getScoreColor(scores[code]),fillOpacity:.25,weight:1,color:getScoreColor(scores[code]),opacity:.4});
      }else{
        layer.setStyle(defaultGeoStyle());
      }
    });
    updateLegend("bilateral");
  }else if(cMode==="coalition"&&data&&data.members){
    const members=data.members;
    const cyanCol=getComputedStyle(document.documentElement).getPropertyValue("--cyan").trim()||"#00e5ff";
    geoLayer.eachLayer(function(layer){
      const code=getCountryCode(layer.feature);
      if(!code)return;
      if(members.includes(code)){
        layer.setStyle({fillColor:cyanCol,fillOpacity:.2,weight:2,color:cyanCol,opacity:.5});
      }else{
        layer.setStyle({fillColor:"transparent",fillOpacity:0,weight:1,color:getComputedStyle(document.documentElement).getPropertyValue("--border").trim(),opacity:.15});
      }
    });
    updateLegend("coalition");
  }else{
    geoLayer.eachLayer(function(layer){layer.setStyle(defaultGeoStyle(layer.feature))});
    updateLegend("none");
  }
  geoLayer.bringToBack();
}

function updateLegend(lMode){
  if(choroLegend){try{map.removeControl(choroLegend)}catch(e){}choroLegend=null}
  if(lMode==="none")return;

  choroLegend=L.control({position:"bottomright"});
  choroLegend.onAdd=function(){
    const div=L.DomUtil.create("div","choropleth-legend");
    if(lMode==="bilateral"){
      div.innerHTML='<div class="choropleth-legend-title">'+T("choroplethTitle")+'</div>'+
        lgItem("#00e676",T("choroplethHigh"))+
        lgItem("#69f0ae",T("choroplethGood"))+
        lgItem("#ffab00",T("choroplethMod"))+
        lgItem("#ff9100",T("choroplethLow"))+
        lgItem("#ff1744",T("choroplethMin"));
    }else if(lMode==="coalition"){
      const cyanCol=getComputedStyle(document.documentElement).getPropertyValue("--cyan").trim()||"#00e5ff";
      div.innerHTML='<div class="choropleth-legend-title">'+T("ct")+'</div>'+
        lgItem(cyanCol,T("choroplethMember"))+
        lgItem("transparent",T("choroplethNon"));
    }
    return div;
  };
  choroLegend.addTo(map);
}

function lgItem(color,label){
  return'<div class="choropleth-legend-item"><div class="choropleth-legend-color" style="background:'+color+'"></div>'+label+'</div>';
}

function updateChoroplethTheme(){
  if(!geoLayer)return;
  updateChoropleth("none");
}
