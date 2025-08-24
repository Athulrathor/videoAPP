// import mongoose, { isValidObjectId, Schema } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
// import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist

  try {
    const { name, description } = req.body;

    const userId = req.user._id;

    if (!name) {
      throw new ApiError(400, "Name is not found!");
    }

    // const getVideoFile = await Video.find({ owner: userId });

    // if (!getVideoFile) {
    //   throw new ApiError(401, "video file is missing!");
    // }

    const createUserPlaylist = await Playlist.create({
      name: name,
      description: description,
      owner: req.user._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          createUserPlaylist,
          "User playlist created successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in creating playlist!");
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists

  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ApiError(404, "User id is missing!");
    }

    const userPlaylist = await Playlist.find({ owner: userId });

    if (!userPlaylist) {
      throw new ApiError(403, "Playlist is not found!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, userPlaylist, "Playlist fetched successfully!")
      );
  } catch (error) {
    throw new ApiError(500, "Error in getting user playlist!");
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id

  try {
    const { playlistId } = req.params;

    if (!playlistId) {
      throw new ApiError(404, "Playlist id not found!");
    }

    const playLists = await Playlist.findById(playlistId);

    if (!playLists) {
      throw new ApiError(401, "Playlist not found!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playLists, "Playlist fetched successfully!"));
  } catch (error) {
    throw new ApiError(500, error.message, "Error in creating playlist by id!");
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    if (!playlistId) {
      throw new ApiError(403, "Playlist id not found!");
    }

    if (!videoId) {
      throw new ApiError(403, "video id not found!");
    }

    const addVideoToUserPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        video: videoId,
      }
    );

    if (!addVideoToUserPlaylist) {
      throw new ApiError(400, "Error in adding adding video to playlist!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          addVideoToUserPlaylist,
          "Video added to playlist successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message,
      "Error in adding video to playlist!"
    );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist

  try {
    const { playlistId, videoId } = req.params;

    if (!playlistId) {
      throw new ApiError(403, "Playlist id not found!");
    }

    if (!videoId) {
      throw new ApiError(403, "video id not found!");
    }

    const removeVideoToUserPlaylist = await Playlist.findByIdAndDelete({
      video:videoId
    });

    if (!removeVideoToUserPlaylist) {
      throw new ApiError(400, "Video is not in playlist to remove!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          removeVideoToUserPlaylist,
          "Video removed playlist successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500,error.message, "Error in remove video from playlist!");
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist

  try {

    const { playlistId } = req.params;

    if (!playlistId) {
      throw new ApiError(404, "Error in deleting the playlist!");
    }

    const deletingPlaylist = await Playlist.deleteMany(
      { _id: playlistId },
    );

        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              deletingPlaylist,
              "Playlist is updated successfully!"
            )
          );


  } catch (error) {
    throw new ApiError(500, "Error in deleting the playlist!");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {

  //TODO: update playlist

  try {

    const { playlistId } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      throw new ApiError(402,"New name is not found!")
    }

    if (!description) {
      throw new ApiError(402, " New description is not found!");
    }

    if (!playlistId) {
      throw new ApiError(402, " Playlist id is not found!");
    }

    const updatingPlaylist = await Playlist.updateMany({_id:playlistId}, {
      $set: {
        name: name,
        description: description,
      },
    });

    if (!updatingPlaylist) {
      throw new ApiError(404,"Error in updating playlist")
    }

    return res.status(200).json(new ApiResponse(200, updatingPlaylist, "Playlist is updated successfully!"));

  } catch (error) {
    throw new ApiError(500, "Error in updating playlist!");
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
