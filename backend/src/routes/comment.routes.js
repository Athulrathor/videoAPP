import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-comment-to-video/:videoId").get(verifyToken, addComment);

router.route("/update-comment-to-video/:commentId").post(verifyToken, updateComment);

router.route("/delete-comment-to-video/:commentId").get(verifyToken, deleteComment);

router.route("/get-video-comment/:videoId").get(verifyToken, getVideoComments);

export default router;
