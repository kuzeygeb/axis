// AXIS — IR Chat terminal
// Depends on: core.js (lang, T), ai.js (getGroqKey)

let chatHistory=[];
let chatInitialized=false;

function initChat(){
  const header=document.getElementById("chatHeader");
  if(header)header.textContent=T("chatTitle");
  const input=document.getElementById("chatInput");
  if(input)input.placeholder=T("chatPlaceholder");
  const btn=document.getElementById("chatSendBtn");
  if(btn)btn.textContent=T("chatSend");
  if(!chatInitialized){
    chatInitialized=true;
    const saved=sessionStorage.getItem("axis-chat-history");
    if(saved){try{chatHistory=JSON.parse(saved)}catch(e){chatHistory=[]}}
    if(chatHistory.length===0){
      addChatMessage("system",T("chatWelcome"));
    }else{
      renderChatHistory();
    }
    if(!getGroqKey()){
      addChatMessage("system",T("chatNoKey"));
    }
  }
}

function addChatMessage(role,content){
  chatHistory.push({role,content});
  sessionStorage.setItem("axis-chat-history",JSON.stringify(chatHistory));
  appendChatBubble(role,content);
}

function appendChatBubble(role,content,typing){
  const container=document.getElementById("chatMessages");
  const div=document.createElement("div");
  div.className="chat-msg "+role;
  if(role==="ai"){
    div.innerHTML='<span class="chat-prefix">AXIS&gt; </span><span class="chat-content">'+(typing?"":content.replace(/\n/g,"<br>"))+'</span>';
  }else if(role==="user"){
    div.textContent=content;
  }else{
    div.textContent=content;
  }
  container.appendChild(div);
  container.scrollTop=container.scrollHeight;
  return div;
}

function renderChatHistory(){
  const container=document.getElementById("chatMessages");
  container.innerHTML="";
  chatHistory.forEach(m=>appendChatBubble(m.role,m.content));
}

function chatKeyDown(e){
  if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat()}
}

async function sendChat(){
  const input=document.getElementById("chatInput");
  const text=input.value.trim();
  if(!text)return;
  input.value="";
  addChatMessage("user",text);
  if(!getGroqKey()){
    addChatMessage("system",T("chatNoKey"));
    return;
  }
  const typingDiv=appendChatBubble("ai","",true);
  const contentSpan=typingDiv.querySelector(".chat-content");
  contentSpan.innerHTML='<span class="chat-typing">'+T("aiAnalyzing")+'</span>';
  const langDir=lang==="tr"?"Kullanıcının dili Türkçe, Türkçe yanıt ver.":"User's language is English, respond in English.";
  const sysPrompt="Sen AXIS uluslararası ilişkiler analiz platformunun yapay zeka asistanısın. Kullanıcılar sana devletler arası ilişkiler, ittifaklar, çatışmalar, jeopolitik dinamikler, uluslararası örgütler, dış politika teorileri ve güncel küresel meseleler hakkında sorular soracak. Yanıtlarında: IR teorilerini (Realizm, Liberalizm, Konstrüktivizm, İngiliz Okulu vb.) referans ver. Güncel olayları tarihsel bağlama oturt. Tarafsız ve akademik ton kullan. Gerektiğinde farklı perspektifleri sun. AXIS platformundaki verilere referans verebilirsin (G20 ülkeleri, AXIS endeksi, davranışsal profiller). Kısa ve öz cevaplar ver, gereksiz uzatma. "+langDir;
  const messages=[{role:"system",content:sysPrompt}];
  const recentHistory=chatHistory.filter(m=>m.role==="user"||m.role==="ai").slice(-10);
  recentHistory.forEach(m=>{
    messages.push({role:m.role==="ai"?"assistant":"user",content:m.content});
  });
  try{
    const key=getGroqKey();
    const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{
      method:"POST",
      headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},
      body:JSON.stringify({model:"llama-3.3-70b-versatile",max_tokens:2000,temperature:0.7,messages})
    });
    if(!res.ok)throw new Error("api-error");
    const data=await res.json();
    const reply=data.choices[0].message.content;
    typingDiv.remove();
    const aiDiv=appendChatBubble("ai","",true);
    const aiContent=aiDiv.querySelector(".chat-content");
    chatHistory.push({role:"ai",content:reply});
    sessionStorage.setItem("axis-chat-history",JSON.stringify(chatHistory));
    if(window.matchMedia("(prefers-reduced-motion:reduce)").matches){
      aiContent.innerHTML=reply.replace(/\n/g,"<br>");
    }else{
      let idx=0;
      const words=reply.split(" ");
      function typeWord(){
        if(idx<words.length){
          aiContent.innerHTML+=(idx>0?" ":"")+words[idx].replace(/\n/g,"<br>");
          idx++;
          const container=document.getElementById("chatMessages");
          container.scrollTop=container.scrollHeight;
          setTimeout(typeWord,20+Math.random()*30);
        }
      }
      typeWord();
    }
  }catch(e){
    typingDiv.remove();
    addChatMessage("system",T("aiError"));
  }
}
