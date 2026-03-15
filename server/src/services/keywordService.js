import { normalizeText } from "../utils/textHelpers.js";

function prettifyKeyword(keyword) {
  return keyword
    .split(" ")
    .map((word) => {
      if (["api", "aws", "sql", "ci/cd", "jwt", "uat", "crm", "sap"].includes(word.toLowerCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function getRecommendedKeywords({ requiredSkills, missingSkills }) {
  const priorityKeywords = [...missingSkills, ...requiredSkills];

  const cleanedKeywords = [...new Set(
    priorityKeywords
      .map((skill) => normalizeText(skill))
      .filter(Boolean)
  )];

  const recommendedKeywords = cleanedKeywords
    .filter((skill) => !["teamwork", "leadership", "communication"].includes(skill))
    .slice(0, 12)
    .map(prettifyKeyword);

  return recommendedKeywords;
}