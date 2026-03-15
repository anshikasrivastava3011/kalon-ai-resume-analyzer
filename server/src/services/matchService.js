import { skillDictionary } from "../utils/skillDictionary.js";
import { includesSkill, normalizeText } from "../utils/textHelpers.js";

export function analyzeMatch(resumeText, jobDescription) {
  const cleanResume = normalizeText(resumeText);
  const cleanJobDescription = normalizeText(jobDescription);

  const jdSkills = skillDictionary.filter((skill) =>
    includesSkill(cleanJobDescription, skill)
  );

  const uniqueJdSkills = [...new Set(jdSkills)];

  const matchedSkills = uniqueJdSkills.filter((skill) =>
    includesSkill(cleanResume, skill)
  );

  const missingSkills = uniqueJdSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  const matchScore =
    uniqueJdSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / uniqueJdSkills.length) * 100);

  return {
    matchedSkills,
    missingSkills,
    matchScore,
    requiredSkills: uniqueJdSkills,
  };
}

export function analyzeMatchWithExtractedSkills(resumeText, extractedSkills) {
  const cleanResume = normalizeText(resumeText);

  const normalizedSkills = [...new Set(
    extractedSkills
      .map((skill) => normalizeText(skill))
      .filter(Boolean)
  )];

  const matchedSkills = normalizedSkills.filter((skill) =>
    includesSkill(cleanResume, skill)
  );

  const missingSkills = normalizedSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  const matchScore =
    normalizedSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / normalizedSkills.length) * 100);

  return {
    matchedSkills,
    missingSkills,
    matchScore,
    requiredSkills: normalizedSkills,
  };
}