
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

  const hairOptions = targetGender === "woman" ? [
    "short bob hair",
    "medium length natural hair",
    "long straight dark hair",
    "shoulder length brown hair",
    "casual ponytail",
    "soft wavy hair",
    "simple short haircut",
    "natural bob hairstyle"
  ] : [
    "short black hair",
    "medium natural haircut",
    "clean short hairstyle",
    "slightly wavy short hair",
    "neat casual haircut",
    "soft medium hairstyle",
    "simple natural haircut",
    "short hairstyle with glasses"
  ];

  const fashionOptions = targetGender === "woman" ? [
    "casual knit top",
    "simple blouse",
    "office casual clothes",
    "plain hoodie",
    "casual cardigan",
    "simple university student style",
    "natural everyday fashion",
    "modest casual outfit"
  ] : [
    "plain shirt",
    "casual hoodie",
    "simple jacket",
    "office casual shirt",
    "knit sweater",
    "casual T-shirt",
    "modest everyday outfit",
    "simple clean style"
  ];

  const vibeOptions = [
    "friendly and approachable",
    "calm and gentle",
    "quiet and thoughtful",
    "cheerful but natural",
    "slightly shy smile",
    "warm and sincere",
    "ordinary and realistic",
    "relaxed everyday atmosphere"
  ];

  const faceOptions = [
    "round face",
    "oval face",
    "slightly sharp facial features",
    "soft facial features",
    "average facial features",
    "gentle eyes",
    "natural smile",
    "neutral expression"
  ];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generatedHair = app.hair && app.hair !== "natural hairstyle" ? app.hair : pick(hairOptions);
  const generatedFashion = app.fashion && app.fashion !== "casual everyday clothes" ? app.fashion : pick(fashionOptions);
  const generatedVibe = app.vibe && app.vibe !== "natural and friendly" ? app.vibe : pick(vibeOptions);
  const generatedFace = pick(faceOptions);

  return `
Create a realistic smartphone portrait photo.

Subject:
Japanese ${targetGender}
Age appearance: ${visualAge}
Hair: ${generatedHair}
Fashion: ${generatedFashion}
Vibe: ${generatedVibe}
Face: ${generatedFace}
Body type: ${app.bodyType || "average body type"}
Style: ${app.style || "ordinary everyday person"}

Important rules:
- The person must visually match the age range.
- The person must match the hairstyle, fashion, and vibe above.
- The person should look like someone you could realistically meet in daily life.
- Use realistic skin texture and natural facial features.
- Use indoor daylight or casual natural lighting.
- Use a smartphone portrait style.
- Avoid celebrity, idol, influencer, fashion model, anime, doll-like face, or overly perfect beauty.
- Avoid heavy makeup, beauty filter, glamour lighting, studio photography, or fantasy style.
- Safe non-sexual profile photo.
- Adult appearance only.
`;
}

module.exports = { buildDiagnosisPrompt, buildImagePrompt };
