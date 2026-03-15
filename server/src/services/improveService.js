import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function improveBulletPoint(bulletPoint) {
  if (!process.env.GROQ_API_KEY) {
    return {
      improvedBullet: `Improved version: ${bulletPoint}`,
    };
  }

  try {
    const prompt = `
You are an expert resume writing assistant.

Rewrite the following resume bullet point to make it:
- more professional
- ATS friendly
- action-oriented
- concise
- stronger for technical roles

Return only JSON in this format:
{
  "improvedBullet": "rewritten bullet point"
}

Bullet Point:
${bulletPoint}
`;

    const response = await client.chat.completions.create({
      model: "groq/compound-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional resume improvement assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    const outputText = response.choices[0].message.content;

    try {
      const parsed = JSON.parse(outputText);
      return {
        improvedBullet: parsed.improvedBullet || bulletPoint,
      };
    } catch {
      return {
        improvedBullet: outputText || bulletPoint,
      };
    }
  } catch (error) {
    console.error("Groq bullet improvement error:", error.message);

    return {
      improvedBullet: `Improved version: ${bulletPoint}`,
    };
  }
}