import { useState } from "react";
import api from "../services/api.js";
import "./UploadForm.css";

function UploadForm({
  setResult,
  setLoading,
  setError,
  onAnalysisComplete,
}) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      const response = await api.post("/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data.report);

      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error) {
      console.log("Frontend error:", error.response?.data || error.message);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to analyze the resume."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="label">Upload Resume (PDF or DOCX)</label>

        <label className="custom-file-upload">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(event) => setResumeFile(event.target.files[0])}
            className="hidden-file-input"
          />

          <span className="custom-file-button">Upload Resume</span>
          <span className="custom-file-name">
            {resumeFile ? resumeFile.name : "No file selected"}
          </span>
        </label>
      </div>

      <div className="field-group">
        <label className="label">Paste Job Description</label>
        <textarea
          className="textarea"
          rows="10"
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
        />
      </div>

      <button className="analyze-button" type="submit">
        Analyze Resume
      </button>
    </form>
  );
}

export default UploadForm;