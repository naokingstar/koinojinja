async function diagnose(){
  const button = document.querySelector("button");
  const result = document.getElementById("result");

  button.disabled = true;
  button.innerText = "診断中...";

  result.style.display = "block";

  try{
    const response = await fetch("/api/diagnose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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
    document.getElementById("resultAdvice").innerText =
      "出会いやすい場所：" + data.place + "\n\n" +
      "おすすめデート：" + data.datePlan + "\n\n" +
      "恋愛成功率：" + data.loveScore + "\n" +
      "結婚相性：" + data.marriageScore + "\n\n" +
      data.advice;

    const aiImage = document.getElementById("aiImage");
    if(aiImage && data.image){
      aiImage.innerHTML = '<img src="' + data.image + '" alt="AIが生成したお相手のイメージ">';
    }

    result.scrollIntoView({ behavior: "smooth" });

  }catch(e){
    alert("通信エラーが発生しました");
    console.error(e);
  }finally{
    button.disabled = false;
    button.innerText = "診断する";
  }
}
