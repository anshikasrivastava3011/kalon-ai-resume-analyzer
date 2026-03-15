import { motion } from "framer-motion";
import "./LoadingSteps.css";

function LoadingSteps() {
  const steps = [
    "Analyzing Resume with AI...",
    "Matching Skills...",
    "Generating Suggestions...",
  ];

  return (
    <motion.div
      className="loading-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="loading-spinner"></div>

      <div className="loading-text-block">
        <h3>Processing Your Resume</h3>
        <div className="loading-steps">
          {steps.map((step, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            >
              {step}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default LoadingSteps;