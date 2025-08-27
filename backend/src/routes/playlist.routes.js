import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-playlist").post(verifyToken, createPlaylist);

router.route("/user-playlist/:userId").get(verifyToken, getUserPlaylists);

router.route("/get-playlist/:playlistId").get(verifyToken, getPlaylistById);

router.route("/add-video-to-playlist").post(verifyToken, addVideoToPlaylist);

router
  .route("/remove-video-to-playlist/:videoId/:playlistId")
  .patch(verifyToken, removeVideoFromPlaylist);

router.route("/update-playlist/:playlistId").post(verifyToken, updatePlaylist);

router.route("/delete-playlist/:playlistId").delete(verifyToken, deletePlaylist);

export default router;
