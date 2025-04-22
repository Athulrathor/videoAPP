import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subcriptions } from "../models/subcriptions.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    
    try {
      const userId = req?.user._id;

      // total likes
      const allLikesCount = await Like.aggregate([
        {
          $match: {
            likedBy: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null,
            totalVideoLikes: {
              $sum: {
                $cond: [
                  { $ifNull: ["$video", false] },
                  1, // not null then add 1
                  0, // else 0
                ],
              },
            },
            totalTweetLikes: {
              $sum: {
                $cond: [{ $ifNull: ["$tweet", false] }, 1, 0],
              },
            },
            totalCommentLikes: {
              $sum: {
                $cond: [{ $ifNull: ["$comment", false] }, 1, 0],
              },
            },
          },
        },
      ]);
      // total subscriber
      const allSubscribesCount = await Subcriptions.aggregate([
        {
          $match: {
            channel: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $count: "subscribers",
        },
      ]);
      // total videos
      const allVideoCount = await Video.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $count: "Videos",
        },
      ]);
      // total views
      const allViewsCount = await Video.aggregate([
        {
          $match: {
            owner: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null,
            allVideosViews: {
              $sum: "$views",
            },
          },
        },
      ]);

      const allStats = {
        likes: allLikesCount,
        subcribers: allSubscribesCount,
        videos: allVideoCount,
        views:allViewsCount,
      }

      return res.status(200).json(new ApiResponse(200, allStats, "All stats are fetched successfully!"));

    } catch (error) {
        console.log(error.message);
        throw new ApiError(500, "Error in getting channel status!");
    }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  try {

     const allVideo = await Video.find({
       owner: req.user._id,
     });

     if (!allVideo) {
       throw new ApiError(
         400,
         "something went wrong while fetching channel all videos!!"
       );
     }

     return res
       .status(200)
       .json(
         new ApiResponse(200, allVideo, "All videos fetched successfully !!")
       );
    
  } catch (error) {
    console.log(error.message);
    ApiError(500, "Error in getting channel stats!");
  }
});

export { getChannelStats, getChannelVideos };
