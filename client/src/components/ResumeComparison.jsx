import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api.js";
import "./ResumeComparison.css";

function ResumeComparison() {
  const [resumeA, setResumeA] = useState(null);
  const [resumeB, setResumeB] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCompare(event) {
    event.preventDefault();
    setError("");
    setComparison(null);

    if (!resumeA || !resumeB) {
      setError("Please upload both Resume A and Resume B.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resumeA", resumeA);
      formData.append("resumeB", resumeB);
      formData.append("jobDescription", jobDescription);

      const response = await api.post("/compare-resumes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setComparison(response.data.comparison);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to compare resumes."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="compare-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="compare-title">Resume Comparison</h2>
      <p className="compare-subtitle">
        Upload two resumes and compare which one fits the target job better.
      </p>

      <form onSubmit={handleCompare}>
        <div className="compare-upload-grid">
          <div className="compare-field-group">
            <label className="compare-label">Resume A</label>

            <label className="compare-custom-file-upload">
              <input
                type="file"
                accept=".pdf,.docx"
                className="compare-hidden-file-input"
                onChange={(event) => setResumeA(event.target.files[0])}
              />

              <span className="compare-custom-file-button">
                Upload Resume A
              </span>
              <span className="compare-custom-file-name">
                {resumeA ? resumeA.name : "No file selected"}
              </span>
            </label>
          </div>

          <div className="compare-field-group">
            <label className="compare-label">Resume B</label>

            <label className="compare-custom-file-upload">
              <input
                type="file"
                accept=".pdf,.docx"
                className="compare-hidden-file-input"
                onChange={(event) => setResumeB(event.target.files[0])}
              />

              <span className="compare-custom-file-button">
                Upload Resume B
              </span>
              <span className="compare-custom-file-name">
                {resumeB ? resumeB.name : "No file selected"}
              </span>
            </label>
          </div>
        </div>

        <div className="compare-field-group">
          <label className="compare-label">Job Description</label>
          <textarea
            className="compare-textarea"
            rows="7"
            placeholder="Paste the target job description here..."
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          />
        </div>

        <button type="submit" className="compare-button">
          Compare Resumes
        </button>
      </form>

      {loading && (
        <p className="compare-status">
          Comparing both resumes against the role...
        </p>
      )}
      {error && <p className="compare-error">{error}</p>}

      {comparison && (
        <div className="compare-results">
          <div className="compare-results-header">
            <h3>Comparison Result</h3>
            <span className="compare-winner-badge">
              {comparison.betterResume === "Tie"
                ? "Tie"
                : `Resume ${comparison.betterResume} Fits Better`}
            </span>
          </div>

          <div className="compare-result-grid">
            <div
              className={
                comparison.betterResume === "A"
                  ? "compare-result-box compare-result-box-winner"
                  : "compare-result-box"
              }
            >
              <div className="compare-result-top">
                <h4>Resume A</h4>
                <span className="compare-score">
                  {comparison.resumeA.matchScore}%
                </span>
              </div>

              <p>
                <strong>Matched:</strong>{" "}
                {comparison.resumeA.matchedSkills.length
                  ? comparison.resumeA.matchedSkills.join(", ")
                  : "None"}
              </p>
              <p>
                <strong>Missing:</strong>{" "}
                {comparison.resumeA.missingSkills.length
                  ? comparison.resumeA.missingSkills.join(", ")
                  : "None"}
              </p>
              <p>
                <strong>ATS Score:</strong> {comparison.resumeA.atsReport.atsScore}%
              </p>
            </div>

            <div
              className={
                comparison.betterResume === "B"
                  ? "compare-result-box compare-result-box-winner"
                  : "compare-result-box"
              }
            >
              <div className="compare-result-top">
                <h4>Resume B</h4>
                <span className="compare-score">
                  {comparison.resumeB.matchScore}%
                </span>
              </div>

              <p>
                <strong>Matched:</strong>{" "}
                {comparison.resumeB.matchedSkills.length
                  ? comparison.resumeB.matchedSkills.join(", ")
                  : "None"}
              </p>
              <p>
                <strong>Missing:</strong>{" "}
                {comparison.resumeB.missingSkills.length
                  ? comparison.resumeB.missingSkills.join(", ")
                  : "None"}
              </p>
              <p>
                <strong>ATS Score:</strong> {comparison.resumeB.atsReport.atsScore}%
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ResumeComparison;