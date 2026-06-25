require("dotenv").config();

const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/diagnose", async (req, res) => {
  try {
    const { nickname, age, gender, mbti, type } = req.body;

    const targetGender = gender === "男性" ? "woman" : gender === "女性" ? "man" : "person";

    const prompt = `
日本語で恋愛診断結果を作ってください。
対象者:
ニックネーム: ${nickname || "未入力"}
年齢: ${age || "未入力"}
性別: ${gender || "未入力"}
MBTI: ${mbti || "未入力"}
理想のタイプ: ${type || "未入力"}

必ずJSONだけで返してください。
{
 "recommendedAge": "24〜27歳",
 "recommendedMbti": "ENFP",
 "personality": "自然体で話しやすい人",
 "place": "カフェ、学校、職場、友人の紹介",
 "datePlan": "落ち着いたカフェで会話を楽しむ",
 "loveScore": "82%",
 "marriageScore": "★★★★☆",
 "advice": "恋愛アドバイスを120文字以内で"
}
`;

    const textResult = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9
    });

    const raw = textResult.choices[0].message.content;
    const jsonText = raw.replace(/```json|```/g, "").trim();
    const diagnosis = JSON.parse(jsonText);

    const imagePatterns = targetGender === "woman" ? [
  "ordinary Japanese woman, everyday person, natural face, average appearance, casual clothes, light makeup, realistic skin texture, smartphone portrait",
  "Japanese woman with short hair, natural everyday style, casual clothes, realistic face, not model-like, indoor daylight",
  "Japanese woman with bob hair, simple natural look, ordinary person, realistic smartphone portrait",
  "Japanese woman with long hair, everyday casual fashion, natural skin texture, no beauty filter, realistic candid photo",
  "Japanese woman with gyaru-inspired casual fashion, natural realistic face, not idol-like, smartphone portrait",
  "Japanese woman with calm modest style, ordinary appearance, realistic face, casual indoor photo",
  "Japanese woman, slightly fuller face, natural everyday person, realistic skin texture, casual clothes",
  "Japanese woman with unique personal style, ordinary realistic face, casual clothes, natural daylight"
] : [
  "ordinary Japanese man, everyday person, average appearance, casual clothes, realistic skin texture, smartphone portrait",
  "Japanese man with short hair, natural everyday style, realistic face, not model-like, indoor daylight",
  "Japanese man with gentle feminine features, ordinary realistic face, casual clothes, smartphone portrait",
  "Japanese man with glasses, calm everyday appearance, realistic skin texture, casual indoor photo",
  "Japanese man, slightly fuller face, ordinary person, realistic candid profile photo",
  "Japanese man with sporty casual look, natural realistic face, smartphone portrait",
  "Japanese man with quiet modest style, ordinary appearance, realistic face, indoor daylight",
  "Japanese man with unique facial features, everyday person, natural skin texture, casual clothes"
];

const selectedImagePattern = imagePatterns[Math.floor(Math.random() * imagePatterns.length)];

const imagePrompt = `
${selectedImagePattern}.
High realism, realistic Japanese everyday person, no beauty filter, no glamour lighting,
not celebrity, not idol, not fashion model, not overly attractive, natural hairstyle,
casual indoor daylight, smartphone portrait style, realistic candid profile photo.
`;

    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt,
      size: "1024x1024"
    });

    const imageBase64 = image.data[0].b64_json;

    res.json({
      ...diagnosis,
      image: `data:image/png;base64,${imageBase64}`
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "AI診断に失敗しました。時間をおいて再度お試しください。"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
