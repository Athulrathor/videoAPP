import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment,getShortComments, addCommentShort, updateCommentShort, deleteCommentShort, getCommentToComments, addCommentToComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-comment-to-video/:videoId").post(verifyToken, addComment);

router.route("/add-comment-to-short/:shortId").post(verifyToken, addCommentShort);

router
  .route("/add-comment-to-comment/:commentId")
  .post(verifyToken, addCommentToComment);

router.route("/update-comment-to-video/:commentId").post(verifyToken, updateComment);

router
  .route("/update-comment-to-short/:commentId")
  .post(verifyToken, updateCommentShort);

router.route("/delete-comment-to-video/:commentId").get(verifyToken, deleteComment);

router
  .route("/delete-comment-to-short/:commentId")
  .get(verifyToken, deleteCommentShort);

router.route("/get-video-comment/:videoId").get(verifyToken, getVideoComments);

router.route("/get-short-comment/:shortId").get(verifyToken, getShortComments);

router.route("/get-comment-to-comment/:commentId").get(verifyToken, getCommentToComments);

export default router;
