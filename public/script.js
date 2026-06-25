function diagnose(){
  const result = document.getElementById("result");
  result.style.display = "block";

  const ageList = ["20〜22歳", "23〜25歳", "26〜28歳", "29〜31歳", "32歳前後"];
  const mbtiList = ["ENFP", "INFP", "INFJ", "ISFJ", "ESFP", "INTJ"];
  const personalityList = [
    "穏やかで思いやりがある人",
    "明るく前向きで会話を楽しめる人",
    "落ち着いていて聞き上手な人",
    "誠実で一途に向き合ってくれる人",
    "感性が豊かで優しい雰囲気の人"
  ];

  const adviceList = [
    "無理に背伸びせず、自然体で接することで良いご縁につながります。",
    "相手の話をよく聞き、安心感を与えることが恋愛運を高めます。",
    "焦らず少しずつ距離を縮めることで、信頼関係が深まりやすくなります。",
    "共通の趣味や価値観を大切にすると、長く続く関係になりやすいです。",
    "第一印象よりも、会話の心地よさを大切にすると良い相手を見つけやすくなります。"
  ];

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  document.getElementById("resultAge").innerText = pick(ageList);
  document.getElementById("resultMbti").innerText = pick(mbtiList);
  document.getElementById("resultPersonality").innerText = pick(personalityList);
  document.getElementById("resultAdvice").innerText = pick(adviceList);

  result.scrollIntoView({ behavior: "smooth" });
}
