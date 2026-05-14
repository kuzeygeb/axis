// AXIS — Centralized Event Delegation
// CSP-compliant, testable, maintainable
// © 2026 Kuzey Çağan Gebrecioğlu

(function(){"use strict";
function ready(fn){if(document.readyState!=="loading")fn();else document.addEventListener("DOMContentLoaded",fn)}

ready(function(){

// Header
var settingsBtn=document.getElementById("settingsBtn");
if(settingsBtn)settingsBtn.addEventListener("click",function(){if(typeof toggleSettings==="function")toggleSettings()});

var themeBtn=document.getElementById("themeBtn");
if(themeBtn)themeBtn.addEventListener("click",function(){if(typeof toggleTheme==="function")toggleTheme()});

var langBtns=document.querySelectorAll(".lang-b[data-lang]");
for(var i=0;i<langBtns.length;i++){langBtns[i].addEventListener("click",function(){if(typeof setLang==="function")setLang(this.getAttribute("data-lang"))})}

// Mode tabs — event delegation
var modeBar=document.querySelector(".mode-bar");
if(modeBar)modeBar.addEventListener("click",function(e){var tab=e.target.closest(".mode-tab");if(!tab)return;var m=tab.getAttribute("data-mode");if(m&&typeof setMode==="function")setMode(m)});

// Filter belt — event delegation
var filterBelt=document.querySelector(".filter-belt");
if(filterBelt)filterBelt.addEventListener("click",function(e){
  var tag=e.target.closest(".filter-tag");
  if(!tag)return;
  var reg=tag.getAttribute("data-region");
  if(reg&&typeof applyGlobalFilter==="function")applyGlobalFilter(reg);
});


// Scenario select
var scenSelect=document.getElementById("scenSelect");
if(scenSelect)scenSelect.addEventListener("change",function(){if(typeof applyScenario==="function")applyScenario()});

// Heatmap
var heatBtn=document.getElementById("heatBtn");
if(heatBtn)heatBtn.addEventListener("click",function(){if(typeof toggleHeatmap==="function")toggleHeatmap()});

// Chat
var chatInput=document.getElementById("chatInput");
if(chatInput)chatInput.addEventListener("keydown",function(e){if(typeof chatKeyDown==="function")chatKeyDown(e)});

var chatSendBtn=document.getElementById("chatSendBtn");
if(chatSendBtn)chatSendBtn.addEventListener("click",function(){if(typeof sendChat==="function")sendChat()});

// Settings modal
var settingsOverlay=document.getElementById("settingsOverlay");
if(settingsOverlay)settingsOverlay.addEventListener("click",function(e){if(e.target===settingsOverlay&&typeof toggleSettings==="function")toggleSettings()});

var settingsCloseBtn=document.getElementById("settingsCloseBtn");
if(settingsCloseBtn)settingsCloseBtn.addEventListener("click",function(){if(typeof toggleSettings==="function")toggleSettings()});

var settingsSaveBtn=document.getElementById("settingsSaveBtn");
if(settingsSaveBtn)settingsSaveBtn.addEventListener("click",function(){if(typeof saveGroqKey==="function")saveGroqKey()});

// Settings focus trap
var settingsModal=document.querySelector(".settings-modal");
if(settingsModal)settingsModal.addEventListener("keydown",function(e){if(e.key==="Escape"){if(typeof toggleSettings==="function")toggleSettings();return}if(e.key!=="Tab")return;var f=settingsModal.querySelectorAll("input,button,[tabindex]");if(!f.length)return;var first=f[0],last=f[f.length-1];if(e.shiftKey){if(document.activeElement===first){e.preventDefault();last.focus()}}else{if(document.activeElement===last){e.preventDefault();first.focus()}}});

// Keyboard shortcuts
document.addEventListener("keydown",function(e){
  if(e.key==="Escape"){var ov=document.getElementById("settingsOverlay");if(ov&&getComputedStyle(ov).display!=="none"){if(typeof toggleSettings==="function")toggleSettings();return}}
  var tag=(document.activeElement||{}).tagName;if(tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT")return;
  if(e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.key>="1"&&e.key<="8"){e.preventDefault();var modes=["bilateral","coalition","scenario","sensitivity","chat","profiles","abm","methodology"];var idx=parseInt(e.key)-1;if(modes[idx]&&typeof setMode==="function")setMode(modes[idx])}
  if(e.ctrlKey&&!e.shiftKey&&!e.altKey&&(e.key==="d"||e.key==="D")){e.preventDefault();if(typeof toggleTheme==="function")toggleTheme()}
  if(e.ctrlKey&&!e.shiftKey&&!e.altKey&&(e.key==="l"||e.key==="L")){e.preventDefault();var cl=(typeof lang!=="undefined")?lang:"en";if(typeof setLang==="function")setLang(cl==="tr"?"en":"tr")}
  if(e.ctrlKey&&!e.shiftKey&&!e.altKey&&(e.key==="m"||e.key==="M")){e.preventDefault();var rail=document.getElementById("mapToggleRail");if(rail)rail.click()}
});

// Map toggle rail
var mapRail=document.getElementById("mapToggleRail");
var paneLeft=document.getElementById("paneLeft");
if(mapRail&&paneLeft){
  mapRail.addEventListener("click",function(){
    var isCollapsed=paneLeft.classList.toggle("collapsed");
    var icon=mapRail.querySelector(".rail-icon");
    if(icon) icon.textContent=isCollapsed?"\u25b6 MAP":"\u25c0 MAP";
    if(!isCollapsed){
      setTimeout(function(){if(typeof map!=="undefined"&&map&&map.invalidateSize)map.invalidateSize()},450);
    }
  });
}

console.log("[AXIS] Event listeners initialized");
})})();
