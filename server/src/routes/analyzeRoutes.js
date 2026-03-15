import express from "express";
import { analyzeResume } from "../controllers/analyzeController.js";
import { getAnalyses } from "../controllers/historyController.js";
import { improveResumeBullet } from "../controllers/improveController.js";
import { analyzeMultipleJobs } from "../controllers/multiMatchController.js";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", protect, upload.single("resume"), analyzeResume);
router.get("/analyses", protect, getAnalyses);
router.post("/improve-bullet", protect, improveResumeBullet);
router.post("/multi-match", protect, upload.single("resume"), analyzeMultipleJobs);

export default router;