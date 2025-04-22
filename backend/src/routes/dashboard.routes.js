import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const router = Router();

router
  .route("/get-channel-stats")
  .get(verifyToken, getChannelStats);

router
  .route("/get-channel-video")
  .get(verifyToken, getChannelVideos);

export default router;
