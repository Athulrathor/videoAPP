import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteShort, getAllShorts, getShortById, publishAShort, togglePublishStatus, updateShort } from "../controllers/short.controller.js";

const router = Router();

router.route("/get-all-short").get(verifyToken, getAllShorts);

router
  .route("/publish-short")
  .post(verifyToken, upload.single("shortFile"), publishAShort);

router.route("/get-short/:shortId").post(verifyToken, getShortById);

router.route("/update-short/:shortId").post(verifyToken, updateShort);

router.route("/delete-short/:shortId").post(verifyToken, deleteShort);

router
  .route("/toggle-published-status/:shortId")
  .get(verifyToken, togglePublishStatus);

export default router;
