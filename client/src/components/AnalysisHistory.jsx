import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api.js";
import "./AnalysisHistory.css";

function AnalysisHistory({ refreshKey }) {
  const [analyses, setAnalyses] = useState([]);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await api.get("/analyses");
        setAnalyses(response.data.analyses || []);
      } catch (error) {
        setHistoryError("Could not load previous analyses.");
      }
    }

    fetchHistory();
  }, [refreshKey]);

  function getJobTitle(jobDescription) {
    if (!jobDescription) return "Untitled Role";

    const firstLine = jobDescription.split("\n")[0].trim();

    if (firstLine.length > 60) {
      return firstLine.slice(0, 60) + "...";
    }

    return firstLine || "Untitled Role";
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <motion.div
      className="history-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="history-title">Previous Analyses</h2>

      {historyError && <p className="history-error">{historyError}</p>}

      {!historyError && analyses.length === 0 && (
        <p className="history-empty">No analysis history yet.</p>
      )}

      <div className="history-list">
        {analyses.map((item) => (
          <div className="history-item" key={item.id}>
            <div className="history-item-top">
              <h3>{getJobTitle(item.job_description)}</h3>
              <span className="history-score">{item.match_score}%</span>
            </div>

            <div className="history-item-bottom">
              <span>{formatDate(item.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default AnalysisHistory;