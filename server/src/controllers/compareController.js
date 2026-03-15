import fs from "fs";
import { extractResumeText } from "../services/parserService.js";
import { extractJdSkills } from "../services/jdSkillService.js";
import { analyzeMatchWithExtractedSkills } from "../services/matchService.js";
import { getAtsReport } from "../services/atsService.js";

function cleanupFile(filePath) {
  if (filePath) {
    fs.unlink(filePath, () => {});
  }
}

export async function compareResumes(req, res) {
  try {
    const resumeA = req.files?.resumeA?.[0];
    const resumeB = req.files?.resumeB?.[0];
    const { jobDescription } = req.body;

    if (!resumeA || !resumeB) {
      return res.status(400).json({
        message: "Both Resume A and Resume B are required.",
      });
    }

    if (!jobDescription || !jobDescription.trim()) {
      cleanupFile(resumeA.path);
      cleanupFile(resumeB.path);

      return res.status(400).json({
        message: "Job description is required.",
      });
    }

    const [resumeTextA, resumeTextB] = await Promise.all([
      extractResumeText(resumeA.path),
      extractResumeText(resumeB.path),
    ]);

    const extractedJdSkills = await extractJdSkills(jobDescription);

    const resultA = analyzeMatchWithExtractedSkills(
      resumeTextA,
      extractedJdSkills
    );

    const resultB = analyzeMatchWithExtractedSkills(
      resumeTextB,
      extractedJdSkills
    );

    const atsReportA = getAtsReport({
      resumeText: resumeTextA,
      matchedSkills: resultA.matchedSkills,
      missingSkills: resultA.missingSkills,
    });

    const atsReportB = getAtsReport({
      resumeText: resumeTextB,
      matchedSkills: resultB.matchedSkills,
      missingSkills: resultB.missingSkills,
    });

    const betterResume =
      resultA.matchScore > resultB.matchScore
        ? "A"
        : resultB.matchScore > resultA.matchScore
        ? "B"
        : "Tie";

    cleanupFile(resumeA.path);
    cleanupFile(resumeB.path);

    return res.status(200).json({
      message: "Resume comparison completed successfully.",
      comparison: {
        betterResume,
        requiredSkills: resultA.requiredSkills,
        resumeA: {
          filename: resumeA.filename,
          matchScore: resultA.matchScore,
          matchedSkills: resultA.matchedSkills,
          missingSkills: resultA.missingSkills,
          atsReport: atsReportA,
        },
        resumeB: {
          filename: resumeB.filename,
          matchScore: resultB.matchScore,
          matchedSkills: resultB.matchedSkills,
          missingSkills: resultB.missingSkills,
          atsReport: atsReportB,
        },
      },
    });
  } catch (error) {
    console.error("Resume comparison error:", error);

    cleanupFile(req.files?.resumeA?.[0]?.path);
    cleanupFile(req.files?.resumeB?.[0]?.path);

    return res.status(500).json({
      message: "Failed to compare resumes.",
      error: error.message,
    });
  }
}