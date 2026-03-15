function getKeywordMatchScore(matchedSkills, missingSkills) {
  const total = matchedSkills.length + missingSkills.length;

  if (total === 0) {
    return 0;
  }

  return Math.round((matchedSkills.length / total) * 100);
}

function getFormattingQuality(resumeText) {
  let score = 100;
  const text = resumeText || "";

  const length = text.trim().length;

  if (length < 500) {
    score -= 25;
  }

  if (length < 250) {
    score -= 20;
  }

  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
  const hasPhone = /(\+?\d[\d\s-]{7,}\d)/.test(text);
  const hasSections =
    /skills|projects|education|experience|internship|achievements/i.test(text);

  if (!hasEmail) {
    score -= 10;
  }

  if (!hasPhone) {
    score -= 10;
  }

  if (!hasSections) {
    score -= 15;
  }

  if (score < 0) {
    score = 0;
  }

  return score;
}

function getCoverageLabel(score) {
  if (score >= 75) return "Strong";
  if (score >= 50) return "Medium";
  return "Low";
}

function getFormattingLabel(score) {
  if (score >= 80) return "Good";
  if (score >= 55) return "Average";
  return "Poor";
}

export function getAtsReport({ resumeText, matchedSkills, missingSkills }) {
  const keywordMatch = getKeywordMatchScore(matchedSkills, missingSkills);
  const formattingQuality = getFormattingQuality(resumeText);
  const skillsCoverage = keywordMatch;

  const atsScore = Math.round(
    keywordMatch * 0.5 + formattingQuality * 0.25 + skillsCoverage * 0.25
  );

  return {
    atsScore,
    keywordMatch,
    formattingQuality,
    skillsCoverage,
    formattingLabel: getFormattingLabel(formattingQuality),
    coverageLabel: getCoverageLabel(skillsCoverage),
  };
}