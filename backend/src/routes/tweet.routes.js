import { Router } from "express";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-tweet").post(verifyToken, createTweet);

router.route("/user-tweet").get(verifyToken, getUserTweets);

router.route("/update-tweet").post(verifyToken, updateTweet);

router.route("/delete-tweet/:tweetId").get(verifyToken, deleteTweet);

export default router;