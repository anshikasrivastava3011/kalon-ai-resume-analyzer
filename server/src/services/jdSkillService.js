import OpenAI from "openai";
import dotenv from "dotenv";
import { skillDictionary } from "../utils/skillDictionary.js";
import { includesSkill, normalizeText } from "../utils/textHelpers.js";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

function fallbackExtractSkills(jobDescription) {
  const cleanJobDescription = normalizeText(jobDescription);

  const detectedSkills = skillDictionary.filter((skill) =>
    includesSkill(cleanJobDescription, skill)
  );

  return [...new Set(detectedSkills)];
}

export async function extractJdSkills(jobDescription) {
  if (!jobDescription || !jobDescription.trim()) {
    return [];
  }

  if (!process.env.GROQ_API_KEY) {
    return fallbackExtractSkills(jobDescription);
  }

  try {
    const prompt = `
You are an expert job description analyzer.

Extract only the important technical skills, tools, platforms, frameworks, soft skills, and role-related keywords from the following job description.

Return valid JSON only in this format:
{
  "skills": ["skill 1", "skill 2", "skill 3"]
}

Rules:
- Keep skills short and clean
- Do not include full sentences
- Remove duplicates
- Focus on relevant hiring keywords only

Job Description:
${jobDescription}
`;

    const response = await client.chat.completions.create({
      model: "groq/compound-mini",
      messages: [
        {
          role: "system",
          content: "You extract important job description skills in clean JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const outputText = response.choices[0].message.content;

    try {
      const parsed = JSON.parse(outputText);

      if (Array.isArray(parsed.skills)) {
        return [...new Set(parsed.skills.map((skill) => skill.trim()).filter(Boolean))];
      }

      return fallbackExtractSkills(jobDescription);
    } catch {
      return fallbackExtractSkills(jobDescription);
    }
  } catch (error) {
    console.error("JD skill extraction error:", error.message);
    return fallbackExtractSkills(jobDescription);
  }
}