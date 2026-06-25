
function getVisualAgeRange(age){
  const n = Number(age || 20);
  if(n < 18) return "18 to 22 years old adult, youthful university student style";
  if(n <= 22) return "18 to 22 years old adult, youthful university student style";
  if(n <= 29) return "23 to 29 years old adult, young working adult style";
  if(n <= 39) return "30s adult, mature working adult style";
  if(n <= 49) return "40s adult, calm mature style";
  return "adult, age-appropriate mature style";
}

function buildDiagnosisPrompt(input){
  return `
あなたは健全なAI恋愛診断サービスです。
性的表現は禁止。18歳未満に見える人物画像の指定は禁止。
入力年齢が18未満でも、画像は必ず18歳以上の成人として扱ってください。

ユーザー情報:
ニックネーム: ${input.nickname || "未入力"}
年齢: ${input.age || "未入力"}
性別: ${input.gender || "未入力"}
MBTI: ${input.mbti || "未入力"}
理想のタイプ: ${input.type || "未入力"}

必ずJSONだけで返してください。

{
 "recommendedAge": "23〜26歳",
 "recommendedMbti": "ENFP",
 "personality": "自然体で話しやすい人",
 "loveType": "穏やかで安心できる恋愛",
 "job": "接客業・事務職・クリエイター",
 "place": "カフェ・職場・友人の紹介",
 "datePlan": "落ち着いたカフェで会話を楽しむ",
 "confessionScore": "82%",
 "marriageScore": "★★★★☆",
 "matchPercent": "88%",
 "profileJob": "会社員",
 "hobby": "映画鑑賞・カフェ巡り",
 "holiday": "落ち着いた場所でゆっくり過ごす",
 "advice": "200文字以内の恋愛アドバイス",
 "appearance": {
   "ageRange": "23〜26歳",
   "hair": "natural hairstyle",
   "fashion": "casual everyday clothes",
   "vibe": "natural and friendly",
   "bodyType": "average",
   "style": "ordinary everyday person"
 }
}
`;
}

function buildImagePrompt(input, diagnosis){
  const targetGender = input.gender === "男性" ? "woman" : input.gender === "女性" ? "man" : "person";
  const app = diagnosis.appearance || {};
  const visualAge = getVisualAgeRange(input.age);

  return `
Realistic Japanese ${targetGender}.
Age appearance: ${visualAge}.
The face must visually match this age range.
Hair: ${app.hair || "natural hairstyle"}.
Fashion: ${app.fashion || "casual everyday clothes"}.
Vibe: ${app.vibe || "ordinary, natural, friendly"}.
Body type: ${app.bodyType || "average body type"}.
Style: ${app.style || "ordinary everyday person"}.
Create a natural smartphone portrait photo.
Realistic skin texture, natural face, casual indoor daylight.
Make the person look like an ordinary everyday Japanese person.
Avoid celebrity, idol, influencer, fashion model, anime, doll-like face, or overly perfect beauty.
Avoid heavy makeup, glamour lighting, beauty filters, and studio photography.
Use natural facial features, realistic proportions, and casual expression.
Safe non-sexual profile photo, adult appearance only.
The person should feel like someone you could realistically meet in daily life.
`;
}

module.exports = { buildDiagnosisPrompt, buildImagePrompt };
