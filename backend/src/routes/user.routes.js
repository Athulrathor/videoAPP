import { Router } from "express";
import {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetail,
    uploadUserAvatar,
    uploadUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    deleteAccount,
    googleLogin,
    addContentToHistory,
    removeContentToHistory,
    clearWatchHistory,
    verifypassword,
    verifyRegisterMail,
    verifyLoginUser,
    forgetPassword,
    resetPassword,
    setup2FA,
    verifyAndEnable2FA,
    verify2FAOtp,
    disable2FA,
    regenerateBackupCodes,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getSessions, logoutOtherSessions, logoutSession, logoutAllSession } from "../controllers/session.controller.js"; 

const router = Router();

router.route("/register").post(registerUser);

router.route("/verify-mail").get(verifyRegisterMail);

router.route("/login").post( loginUser);

router.route("/verify-login").post(verifyLoginUser);

router.route("/google").post( googleLogin);

router.route("/logout").post(verifyToken, logOutUser);

router.route("/refreshtoken").post(refreshAccessToken);

router.route("/change-password").post(verifyToken, changeCurrentPassword);

router.route("/current-user").get(verifyToken, getCurrentUser);

router.route("/update-account-detail").patch(verifyToken, updateAccountDetail);

router.route("/avatar").patch(verifyToken, uploadUserAvatar);

router.route("/cover-image").patch(verifyToken, uploadUserCoverImage);

router.route("/channel/:username").get(verifyToken, getUserChannelProfile);

router.route("/history").get(verifyToken, getWatchHistory);

router.route("/add/history").post(verifyToken, addContentToHistory);

router.route("/remove/history").post(verifyToken, removeContentToHistory);

router.route("/clear/history").post(verifyToken, clearWatchHistory);

router.route("/delete-account/:userId").delete(verifyToken, deleteAccount);

router.post("/logout-all", verifyToken, logoutAllSession);

router.get("/password-check", verifyToken, verifypassword);

router.post("/forgot-password", forgetPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/sessions", verifyToken, getSessions);
router.delete("/sessions/others", verifyToken, logoutOtherSessions);
router.delete("/sessions/:sessionId", verifyToken, logoutSession);

router.post("/2fa/setup", verifyToken, setup2FA);
router.post("/2fa/verify-enable", verifyToken, verifyAndEnable2FA);
router.post("/2fa/verify", verifyToken, verify2FAOtp);
router.post("/2fa/disable", verifyToken, disable2FA);
router.post("/2fa/backup/regenerate", verifyToken, regenerateBackupCodes);

export default router;