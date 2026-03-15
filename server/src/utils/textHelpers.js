export function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/\r\n/g, " ")
    .replace(/\n/g, " ")
    .replace(/[^\w\s.+#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function includesSkill(text, skill) {
  const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escapedSkill}\\b`, "i");
  return pattern.test(text);
}