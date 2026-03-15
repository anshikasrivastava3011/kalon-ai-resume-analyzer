import { improveBulletPoint } from "../services/improveService.js";

export async function improveResumeBullet(req, res) {
  try {
    const { bulletPoint } = req.body;

    if (!bulletPoint || !bulletPoint.trim()) {
      return res.status(400).json({
        message: "Bullet point is required.",
      });
    }

    const result = await improveBulletPoint(bulletPoint);

    return res.status(200).json({
      improvedBullet: result.improvedBullet,
    });
  } catch (error) {
    console.error("Improve bullet error:", error);

    return res.status(500).json({
      message: "Failed to improve bullet point.",
      error: error.message,
    });
  }
}