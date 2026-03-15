import fs from "fs";
import { pool } from "../config/db.js";
import { extractResumeText } from "../services/parserService.js";
import {
  analyzeMatchWithExtractedSkills,
} from "../services/matchService.js";
import { getAiAnalysis } from "../services/aiService.js";
import { getAtsReport } from "../services/atsService.js";
import { extractJdSkills } from "../services/jdSkillService.js";
import { getRecommendedKeywords } from "../services/keywordService.js";
import { generateInterviewQuestions } from "../services/interviewService.js";

export async function analyzeResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required." });
    }

    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: "Job description is required." });
    }

    const resumeText = await extractResumeText(req.file.path);

    const extractedJdSkills = await extractJdSkills(jobDescription);

    const {
      matchedSkills,
      missingSkills,
      matchScore,
      requiredSkills,
    } = analyzeMatchWithExtractedSkills(resumeText, extractedJdSkills);

    const aiResult = await getAiAnalysis({
      resumeText,
      jobDescription,
      matchedSkills,
      missingSkills,
      matchScore,
    });

    const atsReport = getAtsReport({
      resumeText,
      matchedSkills,
      missingSkills,
    });

    const recommendedKeywords = getRecommendedKeywords({
      requiredSkills,
      missingSkills,
    });

    const interviewQuestions = await generateInterviewQuestions({
      resumeText,
      jobDescription,
      matchedSkills,
      missingSkills,
    });

    const query = `
  INSERT INTO analyses
  (user_id, resume_filename, resume_text, job_description, matched_skills, missing_skills, match_score, ai_summary, ai_suggestions)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *;
`;

const values = [
  req.user.id,
  req.file.filename,
  resumeText,
  jobDescription,
  matchedSkills,
  missingSkills,
  matchScore,
  aiResult.summary,
  aiResult.suggestions,
];

    const result = await pool.query(query, values);

    fs.unlink(req.file.path, () => {});

    return res.status(200).json({
      message: "Analysis completed successfully",
      report: {
        ...result.rows[0],
        ats_report: atsReport,
        required_skills: requiredSkills,
        recommended_keywords: recommendedKeywords,
        interview_questions: interviewQuestions,
      },
    });
  } catch (error) {
    console.error("Analyze error:", error);

    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    return res.status(500).json({
      message: "Something went wrong during analysis.",
      error: error.message,
    });
  }
}