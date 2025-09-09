import { Router } from "express";
import {registerUser,loginUser, logOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetail, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory, deleteAccount, googleLogin, addConntentToHistory, removeConntentToHistory, clearWatchHistory, generateMailRecoveryPassword, updatePassword, generateMailVerify, activeSession, loginHistory, verifypassword} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { detectDevice } from "../middlewares/DeviceDetector.js";

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

router.route("/login").post(detectDevice, loginUser);

router.route("/google").post(detectDevice, googleLogin);

router.route("/logout").post(verifyToken, logOutUser);

router.route("/refreshtoken").post(verifyToken, refreshAccessToken);

router.route("/change-password").post(verifyToken, changeCurrentPassword);

router.route("/current-user").get(verifyToken, getCurrentUser);

router.route("/update-account-detail").patch(verifyToken, updateAccountDetail);

router.route("/avatar").patch(verifyToken, upload.single("avatar"), updateUserAvatar);

router.route("/cover-image").patch(verifyToken, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:username").get(verifyToken, getUserChannelProfile);

router.route("/history").get(verifyToken, getWatchHistory);

router.route("/add/history").post(verifyToken, addConntentToHistory);

router.route("/remove/history").post(verifyToken, removeConntentToHistory);

router.route("/clear/history").post(verifyToken, clearWatchHistory);

router.route("/delete-account/:userId").delete(verifyToken, deleteAccount);

router.route("/forget-password").post(generateMailRecoveryPassword);

router.route("/verify-email").post(generateMailVerify);

router.route("/update-password").post(updatePassword);

router.get('/active-sessions', verifyToken, activeSession);

router.get('/login-history', verifyToken, loginHistory);

router.post('/logout-device/:deviceId', verifyToken, loginHistory);

router.get(`/password-check`, verifyToken, verifypassword);

export default router;