// AXIS — Conflict Intensity Heatmap Layer
// © 2026 Kuzey Çağan Gebrecioğlu

var heatLayer=null,heatEnabled=false;

var CONFLICT_HOTSPOTS=[
{lat:32.43,lng:53.69,intensity:1.0},{lat:33.31,lng:44.37,intensity:0.8},{lat:33.89,lng:35.50,intensity:0.9},{lat:31.77,lng:35.23,intensity:0.7},{lat:31.50,lng:34.47,intensity:0.95},{lat:26.07,lng:50.55,intensity:0.5},{lat:24.47,lng:54.37,intensity:0.4},{lat:26.84,lng:50.08,intensity:0.6},{lat:15.37,lng:44.19,intensity:0.7},{lat:12.78,lng:45.02,intensity:0.6},{lat:27.19,lng:56.27,intensity:0.9},{lat:36.82,lng:36.15,intensity:0.3},
{lat:48.38,lng:37.80,intensity:0.9},{lat:47.10,lng:37.55,intensity:0.85},{lat:46.97,lng:33.36,intensity:0.6},{lat:50.45,lng:30.52,intensity:0.4},{lat:49.84,lng:36.25,intensity:0.7},{lat:51.77,lng:36.19,intensity:0.5},{lat:44.62,lng:33.53,intensity:0.3},
{lat:24.15,lng:120.67,intensity:0.5},{lat:26.07,lng:119.30,intensity:0.4},
{lat:15.60,lng:32.53,intensity:0.8},{lat:13.63,lng:25.35,intensity:0.7},
{lat:13.51,lng:2.11,intensity:0.5},{lat:12.37,lng:-1.52,intensity:0.5},{lat:12.65,lng:-8.00,intensity:0.5},
{lat:19.76,lng:96.07,intensity:0.6},
{lat:13.00,lng:43.00,intensity:0.7},{lat:11.59,lng:43.15,intensity:0.3}
];

function createHeatLayer(){
  if(!window.map||typeof L.heatLayer==="undefined")return;
  if(heatLayer){map.removeLayer(heatLayer);heatLayer=null}
  var points=CONFLICT_HOTSPOTS.map(function(h){return[h.lat,h.lng,h.intensity]});
  heatLayer=L.heatLayer(points,{radius:25,blur:20,maxZoom:8,max:1.0,minOpacity:0.3,gradient:{0.0:"rgba(0,0,255,0)",0.2:"#0044ff",0.4:"#00ccff",0.6:"#ffbb00",0.8:"#ff6600",1.0:"#ff0000"}});
}

function toggleHeatmap(){
  if(!heatLayer){createHeatLayer();if(!heatLayer)return}
  heatEnabled=!heatEnabled;
  if(heatEnabled)heatLayer.addTo(map);else map.removeLayer(heatLayer);
  var btn=document.getElementById("heatBtn");
  if(btn)btn.classList.toggle("on",heatEnabled);
}
