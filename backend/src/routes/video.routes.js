import { Router } from "express";
import { deleteVideo, getAllSuggestion, getAllVideos, getVideoById, getVideoByOwner, publishAVideo, togglePublishStatus, updateVideo, videoViewCounter } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/get-all-videos").get(verifyToken, getAllVideos);

router.route("/get-all-suggestion").get(verifyToken, getAllSuggestion);

router.route("/get-all-videos-of-owner/:userId").get(verifyToken, getVideoByOwner);

router.route("/publish-video").post(
  verifyToken,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/get-video/:videoId").post(verifyToken, getVideoById);

router
  .route("/update-video/:videoId")
    .post(verifyToken, upload.single("newThumbnail"), updateVideo);
  
router.route("/delete-video/:videoId").post(verifyToken, deleteVideo);

router.route("/toggle-published-status/:videoId").get(verifyToken, togglePublishStatus);

router.route("/view-counter/:videoId").get(verifyToken,videoViewCounter)

export default router;