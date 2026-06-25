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

    result.scrollIntoView({ behavior: "smooth" });

  }catch(e){
    console.error("FRONT_ERROR:", e);
    alert("通信エラー詳細: " + e.message);
  }finally{
    button.disabled = false;
    button.innerText = "診断する";
  }
}
