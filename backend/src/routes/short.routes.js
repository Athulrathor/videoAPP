import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  deleteShort,
  getAllShorts,
  getShortById,
  publishAShort,
  togglePublishStatus,
  updateShort,
  getShortByOwner,
  shortViewCounter,
  getShortFeed
} from "../controllers/short.controller.js";

const router = Router();


// 🔥 SHORT FEED (TikTok / Reels style)
router.get("/feed", verifyToken, getShortFeed);


// 🔍 GET ALL SHORTS (search + pagination)
router.get("/", verifyToken, getAllShorts);


// 👤 GET SHORTS BY USER
router.get("/user/:userId", verifyToken, getShortByOwner);


// 🎬 GET SINGLE SHORT
router.get("/:shortId", verifyToken, getShortById);


// 🚀 CREATE SHORT
router.post(
  "/short",
  verifyToken,
  publishAShort
);

// ✏️ UPDATE SHORT
router.patch("/:shortId", verifyToken, updateShort);


// 🗑 DELETE SHORT
router.delete("/:shortId", verifyToken, deleteShort);


// 🔄 TOGGLE PUBLISH
router.patch("/:shortId/toggle-publish", verifyToken, togglePublishStatus);


// 👁 VIEW COUNTER
router.patch("/:shortId/view", verifyToken, shortViewCounter);


export default router;