import { Router } from "express";
import {
  deleteVideo,
  getAllSuggestion,
  getVideoById,
  getVideoByOwner,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  videoViewCounter,
  getFeed,
  getRecommendedVideos
} from "../controllers/video.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔹 PUBLIC / FEED
router.get("/feed", getFeed); // cursor-based (no auth needed)

// 🔹 GET VIDEOS
router.get("/recommended/:videoId", getRecommendedVideos);

router.get("/suggestions", getAllSuggestion);

// 🔹 USER VIDEOS
router.get("/user/:userId",verifyToken, getVideoByOwner);

// 🔹 SINGLE VIDEO
router.get("/:videoId", getVideoById);

// 🔹 CREATE VIDEO
router.post(
  "/video",
  verifyToken,
  publishAVideo
);

// 🔹 UPDATE VIDEO
router.patch(
  "/:videoId",
  verifyToken,
  upload.single("thumbnail"),
  updateVideo
);

// 🔹 DELETE VIDEO
router.delete("/:videoId", verifyToken, deleteVideo);

// 🔹 TOGGLE PUBLISH
router.patch("/:videoId/toggle-publish", verifyToken, togglePublishStatus);

// 🔹 VIEW COUNT (optional)
router.post("/:videoId/view", videoViewCounter);

export default router;