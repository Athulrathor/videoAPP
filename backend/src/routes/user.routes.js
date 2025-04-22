import { Router } from "express";
import {registerUser,loginUser, logOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetail, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1,
    },
    {
        name: "coverImage",
        maxCount:1,
    }
]), registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyToken, logOutUser);

router.route("/refreshtoken").post(verifyToken, refreshAccessToken);

router.route("/change-password").post(verifyToken, changeCurrentPassword);

router.route("/current-user").get(verifyToken, getCurrentUser);

router.route("/update-account-detail").patch(verifyToken, updateAccountDetail);

router.route("/avatar").patch(verifyToken, upload.single("avatar"), updateUserAvatar);

router.route("/cover-image").patch(verifyToken, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:username").get(verifyToken, getUserChannelProfile);

router.route("/history").get(verifyToken, getWatchHistory);

export default router;