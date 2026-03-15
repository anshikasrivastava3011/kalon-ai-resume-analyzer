import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import "./ScoreMeter.css";

function ScoreMeter({ score }) {
  let scoreLabel = "Low Match";

  if (score >= 75) {
    scoreLabel = "Excellent Match";
  } else if (score >= 60) {
    scoreLabel = "Good Match";
  } else if (score >= 40) {
    scoreLabel = "Moderate Match";
  }

  return (
    <motion.div
      className="score-meter-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="score-meter-wrapper">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: "#a86dd8",
            trailColor: "#efe4fb",
            textColor: "#6b4296",
            textSize: "18px",
          })}
        />
      </div>

      <div className="score-meter-text">
        <h3>Resume Match Score</h3>
        <p>{scoreLabel}</p>
      </div>
    </motion.div>
  );
}

export default ScoreMeter;