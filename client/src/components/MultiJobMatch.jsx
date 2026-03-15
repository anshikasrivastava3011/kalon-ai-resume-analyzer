import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api.js";
import "./MultiJobMatch.css";

function MultiJobMatch() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobs, setJobs] = useState([
    { title: "Backend Developer", jobDescription: "" },
    { title: "React Developer", jobDescription: "" },
    { title: "DevOps Engineer", jobDescription: "" },
  ]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleJobChange(index, field, value) {
    const updatedJobs = [...jobs];
    updatedJobs[index][field] = value;
    setJobs(updatedJobs);
  }

  function addJobCard() {
    setJobs([
      ...jobs,
      { title: `Role ${jobs.length + 1}`, jobDescription: "" },
    ]);
  }

  function removeJobCard(indexToRemove) {
    if (jobs.length === 1) return;

    const updatedJobs = jobs.filter((_, index) => index !== indexToRemove);
    setJobs(updatedJobs);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResults([]);

    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }

    const validJobs = jobs.filter((job) => job.jobDescription.trim());

    if (validJobs.length === 0) {
      setError("Please add at least one job description.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobs", JSON.stringify(validJobs));

      const response = await api.post("/multi-match", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data.results || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to analyze multiple job descriptions."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="multi-match-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="multi-match-title">Multiple Job Matching</h2>
      <p className="multi-match-subtitle">
        Upload your resume once and compare it against multiple job roles.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="multi-field-group">
          <label className="multi-label">Upload Resume</label>

          <label className="multi-custom-file-upload">
            <input
              type="file"
              accept=".pdf,.docx"
              className="multi-hidden-file-input"
              onChange={(event) => setResumeFile(event.target.files[0])}
            />

            <span className="multi-custom-file-button">Upload Resume</span>
            <span className="multi-custom-file-name">
              {resumeFile ? resumeFile.name : "No file selected"}
            </span>
          </label>
        </div>

        <div className="multi-job-list">
          {jobs.map((job, index) => (
            <div className="multi-job-card" key={index}>
              <div className="multi-job-card-top">
                <div className="multi-role-wrapper">
                  <input
                    type="text"
                    className="multi-role-input"
                    value={job.title}
                    onChange={(event) =>
                      handleJobChange(index, "title", event.target.value)
                    }
                    placeholder="Role title"
                  />
                  <span className="edit-icon" title="Edit job title">
                    ✎
                  </span>
                </div>

                <button
                  type="button"
                  className="remove-job-button"
                  onClick={() => removeJobCard(index)}
                  disabled={jobs.length === 1}
                  title={
                    jobs.length === 1
                      ? "At least one job card is required"
                      : "Remove this job"
                  }
                >
                  ✖ Remove
                </button>
              </div>

              <textarea
                className="multi-textarea"
                rows="5"
                value={job.jobDescription}
                onChange={(event) =>
                  handleJobChange(index, "jobDescription", event.target.value)
                }
                placeholder="Paste job description here..."
              />
            </div>
          ))}
        </div>

        <div className="multi-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={addJobCard}
          >
            + Add Another Job
          </button>

          <button type="submit" className="primary-button">
            Compare Multiple Jobs
          </button>
        </div>
      </form>

      {loading && (
        <p className="multi-status">Comparing your resume across roles...</p>
      )}
      {error && <p className="multi-error">{error}</p>}

      {results.length > 0 && (
        <div className="multi-results">
          <div className="multi-results-header">
            <h3>Best Role Matches</h3>
            <p>Ranked by resume-job alignment score</p>
          </div>

          {results.map((item, index) => (
            <div
              className={
                index === 0
                  ? "multi-result-item multi-result-item-featured"
                  : "multi-result-item"
              }
              key={index}
            >
              <div className="multi-result-top">
                <div className="multi-result-title-block">
                  <span className="multi-rank-badge">
                    {index === 0 ? "#1 Best Fit" : `#${index + 1}`}
                  </span>
                  <h4>{item.title}</h4>
                </div>

                <span className="multi-score">{item.matchScore}%</span>
              </div>

              <div className="multi-result-skills">
                <p>
                  <strong>Matched:</strong>{" "}
                  {item.matchedSkills.length
                    ? item.matchedSkills.join(", ")
                    : "None"}
                </p>
                <p>
                  <strong>Missing:</strong>{" "}
                  {item.missingSkills.length
                    ? item.missingSkills.join(", ")
                    : "None"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default MultiJobMatch;