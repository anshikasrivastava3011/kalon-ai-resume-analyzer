import express from "express";
import { analyzeResume } from "../controllers/analyzeController.js";
import { getAnalyses } from "../controllers/historyController.js";
import { improveResumeBullet } from "../controllers/improveController.js";
import { analyzeMultipleJobs } from "../controllers/multiMatchController.js";
import { compareResumes } from "../controllers/compareController.js";
import { upload, compareUpload } from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/analyze", protect, upload.single("resume"), analyzeResume);
router.get("/analyses", protect, getAnalyses);
router.post("/improve-bullet", protect, improveResumeBullet);
router.post("/multi-match", protect, upload.single("resume"), analyzeMultipleJobs);

router.post(
  "/compare-resumes",
  protect,
  compareUpload.fields([
    { name: "resumeA", maxCount: 1 },
    { name: "resumeB", maxCount: 1 },
  ]),
  compareResumes
);

export default router;