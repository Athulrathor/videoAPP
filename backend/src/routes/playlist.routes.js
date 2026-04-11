import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist
} from "../controllers/playlist.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


// 🎬 CREATE PLAYLIST
router.post("/", verifyToken, createPlaylist);


// 👤 GET USER PLAYLISTS
router.get("/user/:userId", verifyToken, getUserPlaylists);


// 📂 GET SINGLE PLAYLIST (with videos)
router.get("/:playlistId", verifyToken, getPlaylistById);


// ➕ ADD VIDEOS TO PLAYLIST
router.post("/:playlistId/videos", verifyToken, addVideoToPlaylist);


// ❌ REMOVE VIDEO FROM PLAYLIST
router.delete("/:playlistId/videos/:videoId", verifyToken, removeVideoFromPlaylist);


// ✏️ UPDATE PLAYLIST
router.patch("/:playlistId", verifyToken, updatePlaylist);


// 🗑 DELETE PLAYLIST
router.delete("/:playlistId", verifyToken, deletePlaylist);


export default router;
