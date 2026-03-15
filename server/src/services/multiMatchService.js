import { extractJdSkills } from "./jdSkillService.js";
import { analyzeMatchWithExtractedSkills } from "./matchService.js";
import { getRecommendedKeywords } from "./keywordService.js";

export async function analyzeResumeAgainstMultipleJobs(resumeText, jobDescriptions) {
  const results = [];

  for (const job of jobDescriptions) {
    const extractedSkills = await extractJdSkills(job.jobDescription);

    const {
      matchedSkills,
      missingSkills,
      matchScore,
      requiredSkills,
    } = analyzeMatchWithExtractedSkills(resumeText, extractedSkills);

    const recommendedKeywords = getRecommendedKeywords({
      requiredSkills,
      missingSkills,
    });

    results.push({
      title: job.title || "Untitled Role",
      matchScore,
      matchedSkills,
      missingSkills,
      requiredSkills,
      recommendedKeywords,
    });
  }

  results.sort((first, second) => second.matchScore - first.matchScore);

  return results;
}