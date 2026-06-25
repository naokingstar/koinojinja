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

    const imagePrompt = `
Realistic everyday Japanese ${targetGender}, average appearance, natural face, realistic skin texture,
smartphone portrait style, casual clothes, indoor daylight, no beauty filter,
not model-like, not idol-like, ordinary person, natural hairstyle,
high realism, realistic candid profile photo.
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
