import { pool } from "../config/db.js";

export async function getAnalyses(req, res) {
  try {
    const query = `
      SELECT id, job_description, match_score, created_at
      FROM analyses
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10;
    `;

    const result = await pool.query(query, [req.user.id]);

    return res.status(200).json({
      analyses: result.rows,
    });
  } catch (error) {
    console.error("Fetch analyses error:", error);

    return res.status(500).json({
      message: "Failed to fetch analysis history.",
      error: error.message,
    });
  }
}