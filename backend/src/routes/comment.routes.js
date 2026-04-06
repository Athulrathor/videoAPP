import { Router } from "express";
import { addComment, deleteComment, updateComment, addReplies, getComments, getReplies } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-comment/:contentId").post(verifyToken, addComment);

// router.route("/add-comment-to-short/:contentId").post(verifyToken, addComment);

router
  .route("/add-replies/:commentId")
  .post(verifyToken, addReplies);

router.route("/update-comment/:commentId").post(verifyToken, updateComment);

// router
//   .route("/update-comment-to-short/:commentId")
//   .post(verifyToken, updateCommentShort);

router.route("/delete-comment/:commentId").delete(verifyToken, deleteComment);

// router
//   .route("/delete-comment-to-short/:commentId")
//   .get(verifyToken, deleteCommentShort);

router.route("/get-comment/:contentId").get(verifyToken, getComments);

// router.route("/get-short-comment/:shortId").get(verifyToken, getShortComments);

router.route("/get-replies/:commentId").get(verifyToken, getReplies);

export default router;
