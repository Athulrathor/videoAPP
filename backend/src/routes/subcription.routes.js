import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
  isSubcribed,
  getUserChannelSubscribersVideosAndShort,
  subscriptionCount,
} from "../controllers/subscriptions.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


// 🔹 SUBSCRIBE / UNSUBSCRIBE (toggle)
router.post("/:channelId", verifyToken, toggleSubscription);

// 🔹 CHECK IF SUBSCRIBED
router.get("/:channelId/status", verifyToken, isSubcribed);

// 🔹 GET SUBSCRIBER COUNT
router.get("/:channelId/count", subscriptionCount);

// 🔹 GET MY SUBSCRIBERS (who subscribed to me)
router.get("/me/subscribers", verifyToken, getUserChannelSubscribers);

// 🔹 GET CHANNELS I SUBSCRIBED TO
router.get("/me/subscriptions", verifyToken, getSubscribedChannels);

// 🔹 GET FEED FROM SUBSCRIPTIONS
router.get("/feed", verifyToken, getUserChannelSubscribersVideosAndShort);

export default router;