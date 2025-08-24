import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
  isSubcribed,
  getUserChannelSubscribersVideosAndShort,
} from "../controllers/subcriber.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggle-subcriber/:userId").get(verifyToken, toggleSubscription);

router.route("/get-subcriber").get(verifyToken, getUserChannelSubscribers);

router.route("/get-subcribed/:userId").get(verifyToken, getSubscribedChannels);

router
  .route("/get-subcribers-videos-and-short")
  .get(verifyToken,getUserChannelSubscribersVideosAndShort);

router.route("/is-subcribed/:userId").get(verifyToken, isSubcribed);

export default router;
