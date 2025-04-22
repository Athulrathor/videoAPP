import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike ,toggleShortLike} from "../controllers/like.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggle-like-to-video/:videoId").get(verifyToken, toggleVideoLike);

router.route("/toggle-like-to-short/:shortId").get(verifyToken, toggleShortLike);

router.route("/toggle-like-to-comment/:commentId").get(verifyToken, toggleCommentLike);
  
router.route("/toggle-like-to-tweet/:tweetId").get(verifyToken, toggleTweetLike);

router.route("/get-liked-video").get(verifyToken, getLikedVideos);

export default router;
