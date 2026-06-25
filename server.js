require("dotenv").config();

const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

function cleanJson(text){
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

app.post("/api/diagnose", async (req, res) => {
  try {
    const { nickname, age, gender, mbti, type } = req.body;
    const userAge = Number(age || 20);

    const targetGender = gender === "男性" ? "woman" : gender === "女性" ? "man" : "person";

    const resultPrompt = `
あなたは健全なAI恋愛診断サービスです。
性的表現は禁止。18歳未満に見える人物画像の指定は禁止。
入力年齢が18未満でも、画像は必ず18歳以上の成人として扱ってください。

ユーザー情報:
ニックネーム: ${nickname || "未入力"}
年齢: ${age || "未入力"}
性別: ${gender || "未入力"}
MBTI: ${mbti || "未入力"}
理想のタイプ: ${type || "未入力"}

必ずJSONだけで返してください。

{
 "recommendedAge": "18〜22歳",
 "recommendedMbti": "ENFP",
 "personality": "自然体で話しやすい人",
 "loveType": "穏やかで安心できる恋愛",
 "job": "接客業・事務職・クリエイター",
 "place": "カフェ・学校・職場・友人の紹介",
 "datePlan": "落ち着いたカフェで会話を楽しむ",
 "confessionScore": "78%",
 "marriageScore": "★★★★☆",
 "advice": "120文字以内の恋愛アドバイス",
 "appearance": {
   "ageRange": "18〜22歳",
   "hair": "short bob",
   "fashion": "casual",
   "vibe": "natural and friendly",
   "bodyType": "average",
   "style": "ordinary everyday person"
 }
}
`;

    const textResult = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: resultPrompt }],
      temperature: 0.9
    });

    const diagnosis = JSON.parse(cleanJson(textResult.choices[0].message.content));

    const app = diagnosis.appearance || {};
    const safeAgeRange = userAge < 18 ? "18 to 22 years old adult" : (app.ageRange || diagnosis.recommendedAge || "young adult");

    const imagePrompt = `
Realistic Japanese ${targetGender}, ${safeAgeRange},
${app.hair || "natural hairstyle"},
${app.fashion || "casual clothes"},
${app.vibe || "ordinary everyday atmosphere"},
${app.bodyType || "average body type"},
natural face, realistic skin texture, smartphone portrait,
ordinary everyday person, not celebrity, not idol, not fashion model,
not overly attractive, no beauty filter, indoor daylight,
safe non-sexual profile photo, adult appearance only.
`;

    let imageData = "";

    try {
      const image = await client.images.generate({
        model: "gpt-image-1",
        prompt: imagePrompt,
        size: "1024x1024"
      });

      imageData = "data:image/png;base64," + image.data[0].b64_json;
    } catch (imageError) {
      console.error("IMAGE_GENERATION_ERROR:", imageError);
    }

    res.json({
      ...diagnosis,
      image: imageData
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI診断に失敗しました。時間をおいて再度お試しください。" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
