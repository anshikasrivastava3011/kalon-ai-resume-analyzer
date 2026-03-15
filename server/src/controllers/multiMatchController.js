import fs from "fs";
import { extractResumeText } from "../services/parserService.js";
import { analyzeResumeAgainstMultipleJobs } from "../services/multiMatchService.js";

export async function analyzeMultipleJobs(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required.",
      });
    }

    const jobs = JSON.parse(req.body.jobs || "[]");

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        message: "At least one job description is required.",
      });
    }

    const validJobs = jobs.filter(
      (job) =>
        job &&
        typeof job.title === "string" &&
        typeof job.jobDescription === "string" &&
        job.jobDescription.trim()
    );

    if (validJobs.length === 0) {
      return res.status(400).json({
        message: "Please provide valid job descriptions.",
      });
    }

    const resumeText = await extractResumeText(req.file.path);

    const multiMatchResults = await analyzeResumeAgainstMultipleJobs(
      resumeText,
      validJobs
    );

    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    return res.status(200).json({
      message: "Multiple job analysis completed successfully.",
      results: multiMatchResults,
    });
  } catch (error) {
    console.error("Multi-match error:", error);

    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    return res.status(500).json({
      message: "Failed to analyze multiple job descriptions.",
      error: error.message,
    });
  }
}