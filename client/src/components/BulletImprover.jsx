import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api.js";
import "./BulletImprover.css";

function BulletImprover() {
  const [bulletPoint, setBulletPoint] = useState("");
  const [improvedBullet, setImprovedBullet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImprove = async () => {
    setError("");
    setImprovedBullet("");

    if (!bulletPoint.trim()) {
      setError("Please enter a bullet point.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/improve-bullet", {
        bulletPoint,
      });

      setImprovedBullet(response.data.improvedBullet);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to improve bullet point."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyImprovedBullet = async () => {
    if (!improvedBullet) return;
    await navigator.clipboard.writeText(improvedBullet);
    alert("Improved bullet copied!");
  };

  return (
    <motion.div
      className="bullet-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="bullet-title">AI Resume Bullet Point Improver</h2>
      <p className="bullet-subtitle">
        Paste a weak resume bullet and get a stronger, ATS-friendly version.
      </p>

      <textarea
        className="bullet-textarea"
        rows="5"
        placeholder="Example: Built a MERN web app"
        value={bulletPoint}
        onChange={(event) => setBulletPoint(event.target.value)}
      />

      <button className="bullet-button" onClick={handleImprove}>
        Improve Bullet Point
      </button>

      {loading && <p className="bullet-status">Improving bullet point...</p>}
      {error && <p className="bullet-error">{error}</p>}

      {improvedBullet && (
        <div className="bullet-result">
          <div className="bullet-result-header">
            <h3>Improved Version</h3>
            <button className="copy-bullet-button" onClick={copyImprovedBullet}>
              📋 Copy
            </button>
          </div>
          <p>{improvedBullet}</p>
        </div>
      )}
    </motion.div>
  );
}

export default BulletImprover;