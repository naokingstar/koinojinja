async function diagnose(){
  const button = document.querySelector("button");
  const result = document.getElementById("result");

  button.disabled = true;
  button.innerText = "AIが診断中...";
  result.style.display = "block";

  try{
    const response = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: document.getElementById("nickname").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        mbti: document.getElementById("mbti").value,
        type: document.getElementById("type").value
      })
    });

    const data = await response.json();
    if(!response.ok){
      alert(data.error || "診断に失敗しました");
      return;
    }

    document.getElementById("resultAge").innerText = data.recommendedAge;
    document.getElementById("resultMbti").innerText = data.recommendedMbti;
    document.getElementById("resultPersonality").innerText = data.personality;
    document.getElementById("resultLoveType").innerText = data.loveType;
    document.getElementById("resultJob").innerText = data.job;
    document.getElementById("resultConfession").innerText = data.confessionScore;
    document.getElementById("resultMarriage").innerText = data.marriageScore;
    document.getElementById("resultPlace").innerText = data.place;
    document.getElementById("resultDate").innerText = data.datePlan;
    document.getElementById("resultAdvice").innerText = data.advice;

    const aiImage = document.getElementById("aiImage");
    aiImage.innerHTML = '<img src="' + data.image + '" alt="AIが生成したお相手のイメージ">';

    result.scrollIntoView({ behavior: "smooth" });

  }catch(e){
    console.error(e);
    alert("通信エラーが発生しました");
  }finally{
    button.disabled = false;
    button.innerText = "診断する";
  }
}
