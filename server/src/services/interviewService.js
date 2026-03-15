import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

function fallbackQuestions({ matchedSkills, missingSkills }) {
  const questions = [];

  matchedSkills.slice(0, 3).forEach((skill) => {
    questions.push(`Can you explain your hands-on experience with ${skill}?`);
  });

  missingSkills.slice(0, 2).forEach((skill) => {
    questions.push(`How would you approach learning or working with ${skill} for this role?`);
  });

  questions.push("Tell us about a project that best demonstrates your technical skills.");
  questions.push("Why do you think you are a good fit for this role?");

  return questions;
}

export async function generateInterviewQuestions({
  resumeText,
  jobDescription,
  matchedSkills,
  missingSkills,
}) {
  if (!process.env.GROQ_API_KEY) {
    return fallbackQuestions({ matchedSkills, missingSkills });
  }

  try {
    const prompt = `
You are an expert technical interviewer.

Generate 6 likely interview questions for this candidate based on:
- their resume
- the target job description
- matched skills
- missing skills

Return valid JSON only in this format:
{
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5",
    "question 6"
  ]
}

Guidelines:
- Mix technical and HR/behavioral questions
- Focus on the target role
- Include some questions around missing skills or gaps
- Keep each question concise and realistic

Resume Text:
${resumeText}

Job Description:
${jobDescription}

Matched Skills:
${matchedSkills.join(", ") || "None"}

Missing Skills:
${missingSkills.join(", ") || "None"}
`;

    const response = await client.chat.completions.create({
      model: "groq/compound-mini",
      messages: [
        {
          role: "system",
          content: "You generate realistic interview questions in clean JSON format.",
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

      if (Array.isArray(parsed.questions)) {
        return parsed.questions.filter(Boolean).slice(0, 6);
      }

      return fallbackQuestions({ matchedSkills, missingSkills });
    } catch {
      return fallbackQuestions({ matchedSkills, missingSkills });
    }
  } catch (error) {
    console.error("Interview question generation error:", error.message);
    return fallbackQuestions({ matchedSkills, missingSkills });
  }
}