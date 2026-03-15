import { useRef } from "react";
import { motion } from "framer-motion";
import ScoreMeter from "./ScoreMeter.jsx";
import AtsSimulator from "./AtsSimulator.jsx";
import { exportAnalysisToPdf } from "../utils/exportPdf.js";
import "./ResultCard.css";

function ResultCard({ result }) {
  const reportRef = useRef(null);

  if (!result) return null;

  const copyMissingSkills = async () => {
    const text = result.missing_skills?.join(", ") || "No missing skills";
    await navigator.clipboard.writeText(text);
    alert("Missing skills copied to clipboard!");
  };

  const copyKeywords = async () => {
    const text =
      result.recommended_keywords?.join(", ") || "No recommended keywords";
    await navigator.clipboard.writeText(text);
    alert("Recommended keywords copied!");
  };

  const copyInterviewQuestions = async () => {
    const text =
      result.interview_questions
        ?.map((question, index) => `${index + 1}. ${question}`)
        .join("\n") || "No interview questions";
    await navigator.clipboard.writeText(text);
    alert("Interview questions copied!");
  };

  const handleExportPdf = async () => {
    await exportAnalysisToPdf(reportRef.current, "kalon-analysis-report.pdf");
  };

  return (
    <motion.div
      className="result-wrapper"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="result-card" ref={reportRef}>
        <div className="result-header-row">
          <h2 className="result-title">Analysis Report</h2>
          <button className="export-button" onClick={handleExportPdf}>
            Download PDF Report
          </button>
        </div>

        <ScoreMeter score={result.match_score} />
        <AtsSimulator atsReport={result.ats_report} />

        <div className="result-section">
          <h3>Required Skills from Job Description</h3>
          <div className="skill-list">
            {result.required_skills?.length ? (
              result.required_skills.map((skill, index) => (
                <span className="skill-pill required" key={index}>
                  {skill}
                </span>
              ))
            ) : (
              <p>No required skills detected.</p>
            )}
          </div>
        </div>

        <div className="result-section">
          <h3>Matched Skills</h3>
          <div className="skill-list">
            {result.matched_skills?.length ? (
              result.matched_skills.map((skill, index) => (
                <span className="skill-pill matched" key={index}>
                  {skill}
                </span>
              ))
            ) : (
              <p>No matched skills found.</p>
            )}
          </div>
        </div>

        <div className="result-section">
          <div className="section-heading-row">
            <h3>Missing Skills</h3>
            <button className="copy-button" onClick={copyMissingSkills}>
              📋 Add Skills to Resume
            </button>
          </div>

          <div className="skill-list">
            {result.missing_skills?.length ? (
              result.missing_skills.map((skill, index) => (
                <span className="skill-pill missing" key={index}>
                  {skill}
                </span>
              ))
            ) : (
              <p>No missing skills found.</p>
            )}
          </div>
        </div>

        <div className="result-section">
          <div className="section-heading-row">
            <h3>Recommended Keywords to Add</h3>
            <button className="copy-button" onClick={copyKeywords}>
              📋 Copy Keywords
            </button>
          </div>

          <div className="skill-list">
            {result.recommended_keywords?.length ? (
              result.recommended_keywords.map((keyword, index) => (
                <span className="skill-pill keyword" key={index}>
                  {keyword}
                </span>
              ))
            ) : (
              <p>No recommended keywords available.</p>
            )}
          </div>
        </div>

        <div className="result-section">
          <h3>AI Summary</h3>
          <p>{result.ai_summary}</p>
        </div>

        <div className="result-section">
          <h3>Improvement Suggestions</h3>
          {result.ai_suggestions?.length ? (
            <ul className="suggestion-list">
              {result.ai_suggestions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No suggestions available.</p>
          )}
        </div>

        <div className="result-section">
          <div className="section-heading-row">
            <h3>Likely Interview Questions</h3>
            <button className="copy-button" onClick={copyInterviewQuestions}>
              📋 Copy Questions
            </button>
          </div>

          {result.interview_questions?.length ? (
            <ol className="question-list">
              {result.interview_questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ol>
          ) : (
            <p>No interview questions available.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ResultCard;