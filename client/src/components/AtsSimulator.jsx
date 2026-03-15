import { motion } from "framer-motion";
import "./AtsSimulator.css";

function AtsSimulator({ atsReport }) {
  if (!atsReport) return null;

  const {
    atsScore,
    keywordMatch,
    formattingQuality,
    skillsCoverage,
    formattingLabel,
    coverageLabel,
  } = atsReport;

  return (
    <motion.div
      className="ats-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="ats-title">ATS Resume Score Simulator</h2>

      <div className="ats-top-score">
        <div className="ats-score-badge">{atsScore}%</div>
        <div className="ats-score-text">
          <h3>ATS Compatibility Score</h3>
          <p>
            This score estimates how well your resume aligns with typical ATS
            screening signals.
          </p>
        </div>
      </div>

      <div className="ats-grid">
        <div className="ats-metric">
          <span className="ats-label">Keyword Match</span>
          <strong>{keywordMatch}%</strong>
        </div>

        <div className="ats-metric">
          <span className="ats-label">Formatting Quality</span>
          <strong>{formattingLabel} ({formattingQuality}%)</strong>
        </div>

        <div className="ats-metric">
          <span className="ats-label">Skills Coverage</span>
          <strong>{coverageLabel} ({skillsCoverage}%)</strong>
        </div>
      </div>
    </motion.div>
  );
}

export default AtsSimulator;