import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  toggleShortLike,
  isLikedOrNotShort,
  isLikedOrNotComment,
  isLikedOrNotVideo,
} from "../controllers/like.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


// 🎬 VIDEO LIKES
router.post("/videos/:videoId", verifyToken, toggleVideoLike);
router.get("/videos/:videoId/status", verifyToken, isLikedOrNotVideo);


// 🎥 SHORT LIKES
router.post("/shorts/:shortId", verifyToken, toggleShortLike);
router.get("/shorts/:shortId/status", verifyToken, isLikedOrNotShort);


// 💬 COMMENT LIKES
router.post("/comments/:commentId", verifyToken, toggleCommentLike);
router.get("/comments/:commentId/status", verifyToken, isLikedOrNotComment);


// 🐦 TWEET LIKES (optional)
router.post("/tweets/:tweetId", verifyToken, toggleTweetLike);


// ❤️ USER LIKED VIDEOS
router.get("/videos/me", verifyToken, getLikedVideos);


export default router;