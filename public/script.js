async function diagnose(){
  const button = document.querySelector("button");
  const result = document.getElementById("result");

  button.disabled = true;
  button.innerText = "AIが診断中...";
  const aiImage = document.getElementById("aiImage");
  if(aiImage){ aiImage.innerHTML = '<div class="image-loading">画像を生成中...</div>'; }
  result.style.display = "block";

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if(el) el.innerText = value || "";
  };

  try{
    const payload = {
      nickname: document.getElementById("nickname")?.value || "",
      age: document.getElementById("age")?.value || "",
      gender: document.getElementById("gender")?.value || "",
      mbti: document.getElementById("mbti")?.value || "",
      type: document.getElementById("type")?.value || ""
    };

    const response = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if(!response.ok){
      alert(data.error || "AI診断に失敗しました");
      return;
    }

    setText("resultAge", data.recommendedAge);
    setText("resultMbti", data.recommendedMbti);
    setText("resultPersonality", data.personality);
    setText("resultLoveType", data.loveType);
    setText("resultJob", data.job);
    setText("resultConfession", data.confessionScore);
    setText("resultMarriage", data.marriageScore);
    setText("resultPlace", data.place);
    setText("resultDate", data.datePlan);
    setText("resultProfileJob", data.profileJob || data.job || "");
    setText("resultHobby", data.hobby || "カフェ巡り・映画鑑賞");
    setText("resultHoliday", data.holiday || "落ち着いた場所でゆっくり過ごす");
    setText("resultFirstImpression", data.firstImpression);
    setText("resultLoveFortune", data.loveFortune);
    setText("resultLuckyColor", data.luckyColor);
    setText("resultLuckyItem", data.luckyItem);
    setText("resultMorningDate", data.morningDate);
    setText("resultAfternoonDate", data.afternoonDate);
    setText("resultNightDate", data.nightDate);
    setText("resultStory", data.story);
    setText("resultOneYearLater", data.oneYearLater);
    setText("resultAdvice", data.advice);

    const percent = data.matchPercent || data.confessionScore || "82%";
    setText("resultMatchPercent", percent);
    const num = parseInt(percent.replace("%","")) || 82;
    const bar = document.getElementById("matchBar");
    if(bar){ bar.style.width = Math.min(num,100) + "%"; }

    if(aiImage && data.image){
      aiImage.innerHTML = '<img src="' + data.image + '" alt="AIが生成したお相手のイメージ">';
    } else if(aiImage){
      aiImage.innerHTML = '<div class="image-loading">画像生成に失敗しました。診断結果のみ表示しています。</div>';
    }

    latestDiagnosis = data;
    saveDiagnosisHistory(data);
    result.scrollIntoView({ behavior: "smooth" });

  }catch(e){
    console.error("FRONT_ERROR:", e);
    alert("通信エラー詳細: " + e.message);
  }finally{
    button.disabled = false;
    button.innerText = "診断する";
  }
}


let latestDiagnosis = null;

function saveDiagnosisHistory(data){
  const history = JSON.parse(localStorage.getItem("koi_history") || "[]");
  history.unshift({
    date: new Date().toLocaleString("ja-JP"),
    age: data.recommendedAge,
    mbti: data.recommendedMbti,
    personality: data.personality,
    match: data.matchPercent || data.confessionScore || "",
    image: data.image || ""
  });
  localStorage.setItem("koi_history", JSON.stringify(history.slice(0, 10)));
}

function saveFavorite(){
  if(!latestDiagnosis){
    alert("先に診断してください");
    return;
  }

  const favorites = JSON.parse(localStorage.getItem("koi_favorites") || "[]");
  favorites.unshift(latestDiagnosis);
  localStorage.setItem("koi_favorites", JSON.stringify(favorites.slice(0, 20)));
  alert("お気に入りに保存しました");
}

function showHistory(){
  const area = document.getElementById("historyArea");
  const history = JSON.parse(localStorage.getItem("koi_history") || "[]");

  if(!area) return;

  if(history.length === 0){
    area.innerHTML = "<p>まだ診断履歴がありません。</p>";
    area.style.display = "block";
    return;
  }

  area.innerHTML = "<h3>診断履歴</h3>" + history.map(item => `
    <div class="history-item">
      ${item.image ? `<img src="${item.image}" alt="診断画像">` : ""}
      <div>
        <p><strong>${item.date}</strong></p>
        <p>年齢：${item.age}</p>
        <p>MBTI：${item.mbti}</p>
        <p>性格：${item.personality}</p>
        <p>相性：${item.match}</p>
      </div>
    </div>
  `).join("");

  area.style.display = "block";
}


function loadDailyOmikuji(){
  const fortunes = ["大吉", "中吉", "小吉", "吉", "末吉"];
  const colors = ["桜色", "白", "淡いピンク", "水色", "クリーム色"];
  const items = ["ハンカチ", "スマホケース", "白い靴", "小さなノート", "香水"];

  const today = new Date().toLocaleDateString("ja-JP");
  const seed = today.split("").reduce((a,c)=>a+c.charCodeAt(0),0);

  const fortune = fortunes[seed % fortunes.length];
  const color = colors[seed % colors.length];
  const item = items[seed % items.length];

  const f = document.getElementById("dailyFortune");
  const l = document.getElementById("dailyLucky");

  if(f) f.innerText = "本日の恋愛運：" + fortune;
  if(l) l.innerText = "ラッキーカラー：" + color + " / ラッキーアイテム：" + item;
}

function shareResult(){
  const text = "恋の神社でAI恋愛診断をしました。";
  const url = location.href;

  if(navigator.share){
    navigator.share({
      title: "恋の神社 | AI恋愛診断",
      text,
      url
    });
  }else{
    navigator.clipboard.writeText(text + "\n" + url);
    alert("診断ページのURLをコピーしました");
  }
}

document.addEventListener("DOMContentLoaded", loadDailyOmikuji);
