(() => {
  const $=id=>document.getElementById(id);
  const CONFIG=window.MYSTERY_CONFIG||{mode:"demo",gasUrl:""};
  let adminCode="";
  function jsonp(url){
    return new Promise((resolve,reject)=>{
      const callback="mystery_cb_"+Date.now()+"_"+Math.floor(Math.random()*10000);
      const script=document.createElement("script");
      const timer=setTimeout(()=>{cleanup();reject(new Error("Hết thời gian chờ máy chủ."));},15000);
      function cleanup(){delete window[callback];script.remove();clearTimeout(timer);}
      window[callback]=data=>{cleanup();resolve(data);};
      script.src=url+(url.includes("?")?"&":"?")+"callback="+callback;
      script.onerror=()=>{cleanup();reject(new Error("Không thể kết nối Apps Script."));};
      document.body.appendChild(script);
    });
  }
  $("adminLoginBtn").addEventListener("click",login);
  $("adminCode").addEventListener("keydown",e=>{if(e.key==="Enter")login();});
  $("refreshBtn").addEventListener("click",load);
  async function login(){
    adminCode=$("adminCode").value.trim();
    if(!adminCode){$("adminError").textContent="Vui lòng nhập mã quản trị.";return;}
    try{
      const data=await fetchData();
      if(!data.ok)throw new Error(data.error||"Mã quản trị không hợp lệ.");
      $("adminLogin").classList.add("hidden");$("dashboard").classList.remove("hidden");
      render(data.submissions||[]);
    }catch(e){$("adminError").textContent=e.message;}
  }
  async function fetchData(){
    if(CONFIG.mode==="demo"){
      const submissions=JSON.parse(localStorage.getItem("mystery_submissions")||"[]");
      return {ok:true,submissions};
    }
    if(!CONFIG.gasUrl)throw new Error("Chưa cấu hình Apps Script URL.");
    return await jsonp(CONFIG.gasUrl+"?action=list&adminKey="+encodeURIComponent(adminCode));
  }
  async function load(){try{const d=await fetchData();if(!d.ok)throw new Error(d.error||"Lỗi dữ liệu");render(d.submissions||[]);}catch(e){$("connectionNotice").textContent=e.message;}}
  function render(rows){
    rows=rows.slice().sort((a,b)=>new Date(b.completedAt||b.timestamp)-new Date(a.completedAt||a.timestamp));
    $("totalCount").textContent=rows.length;
    $("latestMood").textContent=rows[0]?.moodLabel||"—";
    $("sourceLabel").textContent=rows[0]?.source||"—";
    $("connectionNotice").textContent=CONFIG.mode==="demo"?"DEMO MODE · Dữ liệu chỉ nằm trên trình duyệt này.":"CONNECTED · Dữ liệu đọc từ Google Sheets.";
    if(!rows.length){$("latestResult").textContent="Chưa có lượt tham gia."; $("scoreBars").innerHTML="";$("historyBody").innerHTML="";return;}
    const latest=rows[0],rec=latest.recommendation;
    const safetyLabels=["Không có điều gì cần lưu ý","Không thích đồ quá ngọt","Không thích đồ quá béo","Có nguyên liệu cần tránh vì dị ứng hoặc lý do sức khỏe","Không muốn trả lời"];
    const safetyText=latest.safetyChoice!==""?(safetyLabels[Number(latest.safetyChoice)]||"Đã ghi nhận") : "Chưa trả lời";
    $("latestResult").innerHTML=rec?`<div class="result-pair">${rec.cakes.map(c=>`<div class="result-tile"><b>${esc(c.name)}</b><small>${Number(c.score)} / 100 điểm phù hợp</small></div>`).join("")}</div><div class="result-meta">Cửa hàng: <b>${esc(rec.store)}</b><br>Phí giao tham khảo: ${Number(rec.shipping).toLocaleString("vi-VN")}đ<br>Độ tin cậy: ${esc(latest.confidence||"Chưa xác định")}<br>Trả lời: ${latest.answered||0}/${latest.totalQuestions||0} câu (tín hiệu khẩu vị: ${latest.signalAnswered||0}/${latest.signalQuestions||0})<br>Lưu ý khẩu vị / an toàn: <b>${esc(safetyText)}</b>${latest.safetyNote?`<br>Ghi chú: ${esc(latest.safetyNote)}`:""}</div>`:"Không đủ dữ liệu để đề xuất cặp bánh.";
    const scores=latest.scores||[];
    $("scoreBars").innerHTML=scores.slice().sort((a,b)=>b.score-a.score).map(s=>`<div class="score-row"><label>${esc(s.name)}</label><div class="bar-track"><div class="bar-fill" style="width:${Math.max(0,Math.min(100,Number(s.score)))}%"></div></div><div class="score-value">${Number(s.score)}%</div></div>`).join("");
    $("historyBody").innerHTML=rows.map(r=>`<tr><td>${esc(new Date(r.completedAt||r.timestamp).toLocaleString("vi-VN"))}</td><td>${esc(r.moodLabel||r.mood||"—")}</td><td class="confidence">${esc(r.confidence||"—")}</td><td>${esc((r.recommendation?.cakes||[]).map(c=>c.name).join(" + ")||"—")}</td><td>${esc(r.recommendation?.store||"—")}</td></tr>`).join("");
  }
  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
})();