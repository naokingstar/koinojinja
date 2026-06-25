
require("dotenv").config();

const express = require("express");
const path = require("path");
const OpenAI = require("openai");
const { buildDiagnosisPrompt, buildImagePrompt } = require("./services/promptBuilder");

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

function cleanJson(text){
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

app.post("/api/diagnose", async (req, res) => {
  try{
    const input = req.body || {};

    const textResult = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: buildDiagnosisPrompt(input) }],
      temperature: 0.85
    });

    let diagnosis;
    try{
      diagnosis = JSON.parse(cleanJson(textResult.choices[0].message.content));
    }catch(e){
      console.error("JSON_PARSE_ERROR:", textResult.choices[0].message.content);
      throw e;
    }

    let imageData = "";
    try{
      const image = await client.images.generate({
        model: "gpt-image-1",
        prompt: buildImagePrompt(input, diagnosis),
        size: "1024x1024"
      });
      imageData = "data:image/png;base64," + image.data[0].b64_json;
    }catch(imageError){
      console.error("IMAGE_GENERATION_ERROR:", imageError);
    }

    res.json({
      ...diagnosis,
      image: imageData
    });

  }catch(e){
    console.error("DIAGNOSE_ERROR:", e);
    res.status(500).json({
      error: "AI診断に失敗しました。時間をおいて再度お試しください。"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
