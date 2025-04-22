import { Router } from "express";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subcriber.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggle-subcriber-to-video").get(verifyToken, toggleSubscription);

router.route("/get-user-subcription-to-video/:channelId").get(verifyToken, getUserChannelSubscribers);

router.route("/get-subcribed-channel-to-video/:subscriberId").get(verifyToken, getSubscribedChannels);

export default router;
