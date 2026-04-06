import { Playlist } from "../models/playlist.model.js";
import { PlaylistVideo } from "../models/playlistVideo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  try {
    const { title, description, privacy = "public" } = req.body;

    if (!title?.trim()) {
      throw new ApiError(400, "Title is required");
    }

    const playlist = await Playlist.create({
      title,
      description,
      privacy,
      owner: req.user._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, playlist, "Playlist created"));
  } catch (error) {
    throw new ApiError(500, error.message, "Error in creating playlist!");
  }
});

export const getUserPlaylists = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const playlists = await Playlist.find({ owner: userId })
      .select("title description privacy videoCount createdAt thumbnail")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();
    
    return res
      .status(200)
      .json(new ApiResponse(200, playlists, "Playlists fetched"));
  } catch (error) {
    throw new ApiError(500, "Error in getting user playlist!");
  }
});

export const getPlaylistById = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const playlist = await Playlist.findById(playlistId)
      .populate("owner", "username avatar")
      .lean();

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    const videos = await PlaylistVideo.find({ playlist: playlistId })
      .sort({ order: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("video", "title thumbnail duration views")
      .lean();

    return res.status(200).json(
      new ApiResponse(200, {
        playlist,
        videos,
      }, "Playlist fetched")
    );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in creating playlist by id!");
  }
});

export const addVideoToPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, arrayVideoId } = req.body;

    if (!playlistId || !arrayVideoId?.length) {
      throw new ApiError(400, "playlistId & videoIds required");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    // 🔐 Optional: ownership check
    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    const validVideos = await Video.find({
      _id: { $in: arrayVideoId },
    }).select("_id");

    const validVideoIds = validVideos.map(v => v._id.toString());

    if (!validVideoIds.length) {
      throw new ApiError(400, "No valid videos found");
    }

    const existing = await PlaylistVideo.find({
      playlist: playlistId,
      video: { $in: validVideoIds },
    }).select("video");

    const existingIds = existing.map(v => v.video.toString());

    const newVideoIds = validVideoIds.filter(
      id => !existingIds.includes(id)
    );

    if (!newVideoIds.length) {
      throw new ApiError(400, "All videos already in playlist");
    }

    // ✅ Get current max order
    const lastVideo = await PlaylistVideo.findOne({ playlist: playlistId })
      .sort({ order: -1 })
      .select("order");

    let startOrder = lastVideo ? lastVideo.order + 1 : 0;

    // ✅ Prepare documents
    const docs = newVideoIds.map((videoId, index) => ({
      playlist: playlistId,
      video: videoId,
      order: startOrder + index,
    }));

    // ✅ Insert
    await PlaylistVideo.insertMany(docs);

    // ✅ Update count
    await Playlist.findByIdAndUpdate(playlistId, {
      $inc: { videoCount: docs.length },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, docs, "Videos added successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message,
      "Error in adding video to playlist!"
    );
  }
});

export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    const deleted = await PlaylistVideo.findOneAndDelete({
      playlist: playlistId,
      video: videoId,
    });

    if (!deleted) {
      throw new ApiError(404, "Video not found in playlist");
    }

    await Playlist.findByIdAndUpdate(playlistId, {
      $inc: { videoCount: -1 },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video removed"));
  } catch (error) {
    throw new ApiError(500,error.message, "Error in remove video from playlist!");
  }
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    // 🔥 also delete all mappings
    await PlaylistVideo.deleteMany({ playlist: playlistId });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Playlist deleted"));
  } catch (error) {
    throw new ApiError(500, "Error in deleting the playlist!");
  }
});

export const updatePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { title, description, privacy } = req.body;

    const updated = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $set: { title, description, privacy },
      },
      { new: true }
    );

    if (!updated) {
      throw new ApiError(404, "Playlist not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updated, "Playlist updated"));
  } catch (error) {
    throw new ApiError(500, "Error in updating playlist!");
  }
});
