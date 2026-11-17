(() => {
  const $ = id => document.getElementById(id);
  const CONFIG = window.MYSTERY_CONFIG || {mode:"demo", gasUrl:""};
  const state = {invite:"", mood:null, questions:[], index:0, answers:{}, safety:null, safetyNote:""};
  const sections = ["intro","quiz","finish"];
  function show(id){sections.forEach(s=>$(s).classList.toggle("hidden",s!==id));}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

  $("startBtn").addEventListener("click",()=>{
    const code=$("inviteCode").value.trim();
    if(!code){$("introError").textContent="Bạn cần nhập mã mở cửa.";return;}
    state.invite=code; state.mood=null; state.answers={}; state.index=0;
    state.questions=[{
      id:"MOOD",title:"Hôm nay, bạn muốn bước vào nhiệm vụ với trạng thái nào?",
      options:[
        {label:"☀️ Đầu óc đang rất tỉnh táo, sẵn sàng khám phá",value:"happy"},
        {label:"🌤 Một ngày bình thường, không quá đặc biệt",value:"normal"},
        {label:"🌧 Muốn tìm một chút gì đó nhẹ nhàng",value:"sad"},
        {label:"🌙 Não đang xin nghỉ phép, xin đừng làm phiền",value:"tired"},
        {label:"🎲 Không biết nữa, cứ để bất ngờ quyết định",value:"random"}
      ]
    }];
    show("quiz"); render();
  });

  function render(){
    const total=state.questions.length+1; // mood selection plus safety check
    const q=state.questions[state.index];
    $("chapterLabel").textContent=state.index===0?"THE FIRST GATE":`CHAPTER ${String(state.index).padStart(2,"0")}`;
    $("chapterTitle").textContent=state.index===0?"Mood Detector":window.MYSTERY.moods[state.mood]?.title||"The Mystery";
    $("progressCount").textContent=`${String(state.index+1).padStart(2,"0")} / ${String(total).padStart(2,"0")}`;
    $("progressBar").style.width=`${(state.index+1)/total*100}%`;
    if(state.index===state.questions.length){
      $("questionArea").innerHTML=`<h3 class="question-title">The Final Key</h3>
        <p class="question-sub">Một lưu ý nhỏ để món quà được chọn an toàn và dễ chịu hơn.</p>
        <div class="options">
          ${["Không có điều gì cần lưu ý","Không thích đồ quá ngọt","Không thích đồ quá béo","Có nguyên liệu cần tránh vì dị ứng hoặc lý do sức khỏe","Mình không muốn trả lời"].map((label,i)=>`<label class="option ${state.safety===String(i)?"selected":""}"><input type="radio" name="safety" value="${i}" ${state.safety===String(i)?"checked":""}><span>${label}</span></label>`).join("")}
        </div>
        <label class="field-label" for="safetyNote" style="margin-top:18px">Ghi chú thêm (không bắt buộc)</label>
        <input id="safetyNote" class="text-input" type="text" maxlength="300" placeholder="Bạn có thể để trống" value="${escapeHtml(state.safetyNote)}">`;
      $("questionArea").querySelectorAll('input[name="safety"]').forEach(input=>input.addEventListener("change",()=>{
        state.safety=input.value;
        $("questionArea").querySelectorAll(".option").forEach(el=>el.classList.remove("selected"));
        input.closest(".option").classList.add("selected");
      }));
      $("questionArea").querySelector("#safetyNote").addEventListener("input",e=>state.safetyNote=e.target.value);
    }else if(state.index===0){
      $("questionArea").innerHTML=`<h3 class="question-title">${escapeHtml(q.title)}</h3><p class="question-sub">Lựa chọn này giúp chọn hành trình phù hợp với bạn.</p><div class="options">${q.options.map((op,i)=>`<label class="option ${state.answers.MOOD===op.value?"selected":""}"><input type="radio" name="answer" value="${op.value}" ${state.answers.MOOD===op.value?"checked":""}><span>${escapeHtml(op.label)}</span></label>`).join("")}</div>`;
    }else{
      const list=window.MYSTERY.moods[state.mood].questions;
      const item=list[state.index-1];
      $("questionArea").innerHTML=`<h3 class="question-title">${escapeHtml(item.title)}</h3>${item.note?`<p class="question-sub">Một thử thách nhỏ của hành trình.</p>`:""}<div class="options">${item.options.map((op,i)=>`<label class="option ${state.answers[item.id]===String(i)?"selected":""}"><input type="radio" name="answer" value="${i}" ${state.answers[item.id]===String(i)?"checked":""}><span>${String.fromCharCode(65+i)}. ${escapeHtml(op.label)}</span></label>`).join("")}<label class="option ${state.answers[item.id]==="skip"?"selected":""}"><input type="radio" name="answer" value="skip" ${state.answers[item.id]==="skip"?"checked":""}><span>Bỏ qua câu này</span></label></div>`;
    }
    $("questionArea").querySelectorAll('input[name="answer"]').forEach(input=>input.addEventListener("change",()=>{
      const answerId=state.index===0?"MOOD":window.MYSTERY.moods[state.mood].questions[state.index-1].id;
      state.answers[answerId]=input.value;
      $("questionArea").querySelectorAll(".option").forEach(el=>el.classList.remove("selected"));
      input.closest(".option").classList.add("selected");
    }));
    $("backBtn").disabled=state.index===0;
    $("backBtn").style.opacity=state.index===0?".35":"1";
    $("nextBtn").textContent=state.index===total-1?"Hoàn thành nhiệm vụ ✦":"Tiếp tục →";
  }

  $("backBtn").addEventListener("click",()=>{if(state.index>0){state.index--;render();}});
  $("nextBtn").addEventListener("click",async()=>{
    if(state.index===0){
      const mood=state.answers.MOOD;
      if(!mood){$("questionArea").insertAdjacentHTML("beforeend",'<p class="error">Hãy chọn một trạng thái hoặc thử lại sau nhé.</p>');return;}
      state.mood=mood;
      state.questions=[state.questions[0],...window.MYSTERY.moods[mood].questions.map(q=>({id:q.id,title:q.title,options:q.options.map((o,i)=>({label:o.label,value:String(i)})),note:q.note}))];
      state.index=1;render();return;
    }
    if(state.index<state.questions.length){state.index++;render();return;}
    await finish();
  });

  function calculate(){
    const tagTotals={S:0,G:0,K:0,F:0,M:0,Y:0,X:0,P:0};
    const mood=window.MYSTERY.moods[state.mood];
    mood.questions.forEach(q=>{
      const selected=state.answers[q.id];
      if(selected===undefined||selected==="skip")return;
      const tag=q.options[Number(selected)]?.tag;
      if(tag)tagTotals[tag]++;
    });
    const results=window.MYSTERY.cakes.map(cake=>{
      let raw=0,max=0;
      mood.questions.forEach(q=>{
        const weight=cake.weights;
        const maxForQuestion=Math.max(0,...q.options.map(op=>op.tag?(weight[op.tag]||0):0));
        max+=maxForQuestion;
        const selected=state.answers[q.id];
        const tag=selected!==undefined&&selected!=="skip"?q.options[Number(selected)]?.tag:null;
        if(tag)raw+=weight[tag]||0;
      });
      return {...cake,raw,score:max?Math.round(raw/max*100):0};
    });
    results.sort((a,b)=>b.score-a.score);
    const answered=mood.questions.filter(q=>state.answers[q.id]!==undefined&&state.answers[q.id]!=="skip").length;
    const signalQuestions=mood.questions.filter(q=>q.options.some(op=>Boolean(op.tag))).length;
    const signalAnswered=mood.questions.filter(q=>{
      const selected=state.answers[q.id];
      return selected!==undefined&&selected!=="skip"&&Boolean(q.options[Number(selected)]?.tag);
    }).length;
    const confidence=signalAnswered>=Math.ceil(signalQuestions*0.8)?"MEDIUM":signalAnswered>=Math.ceil(signalQuestions*0.5)?"LOW":"VERY LOW";
    // One clue is too little evidence to suggest a pair of cakes.
    const pair=signalAnswered>=2?findPair(results):null;
    return {tagTotals,results,pair,confidence,answered,total:mood.questions.length,signalAnswered,signalQuestions};
  }

  function findPair(results){
    const byCode=Object.fromEntries(results.map(x=>[x.code,x]));
    const candidates=[];
    window.MYSTERY.stores.forEach(store=>{
      for(let i=0;i<store.cakes.length;i++)for(let j=i+1;j<store.cakes.length;j++){
        const a=byCode[store.cakes[i]],b=byCode[store.cakes[j]];
        candidates.push({store:store.name,storeId:store.id,shipping:store.shipping,cakes:[a,b],total:a.score+b.score,minScore:Math.min(a.score,b.score)});
      }
    });
    candidates.sort((a,b)=>b.total-a.total||b.minScore-a.minScore||a.shipping-b.shipping);
    return candidates[0]||null;
  }

  async function submitRemote(payload){
    const endpoint=CONFIG.gasUrl;
    if(!endpoint)throw new Error("Chưa cấu hình Google Apps Script URL.");
    if(!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec\/?$/.test(endpoint))
      throw new Error("Apps Script URL chưa đúng định dạng /exec.");

    const requestId=(crypto.randomUUID?.()||(`${Date.now()}-${Math.random().toString(36).slice(2)}`));
    payload.requestId=requestId;
    return await new Promise((resolve,reject)=>{
      const frameName=`mystery_submit_${requestId.replace(/[^a-zA-Z0-9_]/g,"_")}`;
      const iframe=document.createElement("iframe");
      iframe.name=frameName; iframe.title="Submission acknowledgement";
      iframe.style.display="none";
      const form=document.createElement("form");
      form.method="POST"; form.action=endpoint; form.target=frameName;
      form.style.display="none";
      const field=document.createElement("textarea");
      field.name="payload"; field.value=JSON.stringify(payload);
      form.appendChild(field); document.body.append(iframe,form);

      let settled=false;
      const cleanup=()=>{window.removeEventListener("message",onMessage);clearTimeout(timer);form.remove();iframe.remove();};
      const finish=(error,value)=>{if(settled)return;settled=true;cleanup();error?reject(error):resolve(value);};
      const onMessage=event=>{
        if(event.source!==iframe.contentWindow)return;
        const data=event.data;
        if(!data||data.type!=="MYSTERY_SUBMIT_RESULT"||data.requestId!==requestId)return;
        if(data.ok)finish(null,true);
        else finish(new Error(data.message||"Máy chủ từ chối dữ liệu."));
      };
      const timer=setTimeout(()=>finish(new Error("Hết thời gian chờ phản hồi từ Google Sheets. Hãy kiểm tra kết nối hoặc thử lại.")),20000);
      window.addEventListener("message",onMessage);
      form.submit();
    });
  }

  async function finish(){
    const result=calculate();
    const payload={
      inviteCode:state.invite,source:"web",mood:state.mood,moodLabel:window.MYSTERY.moodNames[state.mood],
      answers:state.answers,safetyChoice:state.safety,safetyNote:state.safetyNote.slice(0,300),
      tagTotals:result.tagTotals,scores:result.results.map(x=>({code:x.code,name:x.name,score:x.score})),
      recommendation:result.pair?{store:result.pair.store,storeId:result.pair.storeId,shipping:result.pair.shipping,cakes:result.pair.cakes.map(x=>({code:x.code,name:x.name,score:x.score})),totalScore:result.pair.total}:null,
      confidence:result.confidence,answered:result.answered,totalQuestions:result.total,signalAnswered:result.signalAnswered,signalQuestions:result.signalQuestions,
      completedAt:new Date().toISOString()
    };
    $("nextBtn").disabled=true;$("nextBtn").textContent="Đang niêm phong kết quả…";
    try{
      if(CONFIG.mode==="gas") await submitRemote(payload);
      else{
        const existing=JSON.parse(localStorage.getItem("mystery_submissions")||"[]");
        existing.push({...payload,submissionId:crypto.randomUUID?.()||String(Date.now())});
        localStorage.setItem("mystery_submissions",JSON.stringify(existing));
      }
      show("finish");
    }catch(err){
      alert("Chưa gửi được kết quả: "+err.message+"\nBạn có thể thử lại.");
      $("nextBtn").disabled=false;$("nextBtn").textContent="Hoàn thành nhiệm vụ ✦";
    }
  }
  show("intro");
})();