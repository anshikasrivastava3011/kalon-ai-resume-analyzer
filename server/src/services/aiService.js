import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function getAiAnalysis({
  resumeText,
  jobDescription,
  matchedSkills,
  missingSkills,
  matchScore,
}) {

  if (!process.env.GROQ_API_KEY) {
    return {
      summary: `Your resume currently matches approximately ${matchScore}% of the job requirements.`,
      suggestions: [
        "Add more job-specific keywords mentioned in the job description.",
        "Improve project descriptions with measurable impact.",
        "Highlight relevant technical skills more clearly."
      ]
    };
  }

  try {

    const prompt = `
You are an expert ATS resume analyzer.

Analyze the candidate resume against the job description.

Return valid JSON only in this format:

{
  "summary": "2-4 sentence professional evaluation",
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ]
}

Resume Text:
${resumeText}

Job Description:
${jobDescription}

Matched Skills:
${matchedSkills.join(", ") || "None"}

Missing Skills:
${missingSkills.join(", ") || "None"}

Current Match Score:
${matchScore}
`;

    const response = await client.chat.completions.create({
      model: "groq/compound-mini",
      messages: [
        { role: "system", content: "You are a professional ATS resume evaluator." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4
    });

    const outputText = response.choices[0].message.content;

    try {
      const parsed = JSON.parse(outputText);

      return {
        summary: parsed.summary || "No summary generated.",
        suggestions: parsed.suggestions || []
      };

    } catch {
      return {
        summary: outputText,
        suggestions: []
      };
    }

  } catch (error) {

    console.error("Groq error:", error.message);

    return {
      summary: `Your resume currently matches approximately ${matchScore}% of the job requirements.`,
      suggestions: [
        missingSkills.length
          ? `Consider adding these missing skills if relevant: ${missingSkills.join(", ")}`
          : "Your resume already covers many detected job skills.",
        "Improve your project descriptions with stronger technical detail.",
        "Tailor your resume keywords to match the job description."
      ]
    };
  }
}