import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Short } from "../models/short.model.js";
import { Comment } from "../models/comments.model.js";

const toggleLikeEntity = async ({
  targetType,
  targetId,
  userId,
  room,
  event,
  key,
}) => {
  const query = {
    targetId: new mongoose.Types.ObjectId(targetId),
    targetType,
    likedBy: new mongoose.Types.ObjectId(userId),
  };

  const existing = await Like.findOne(query);
  const delta = existing ? -1 : 1;

  if (!existing || existing === null || existing === undefined) {
    await Like.create(query);
  } else {
    await existing.deleteOne();
  }

  const modelMap = {
    Video,
    Short,
    Comment,
  };

  const Model = modelMap[targetType];

  if (!Model) {
    throw new ApiError(403,`Unsupported targetType: ${targetType}`);
  }

  await Model.findByIdAndUpdate(targetId, {
    $inc: { likeCount: delta },
  });

  const count = await Like.countDocuments({
    targetId,
    targetType,
  });

  const isLiked = delta === 1;

  global.io.to(room).emit(event, {
    [key]: String(targetId),
    count,
    userId: String(userId),
    isLiked,
  });

  return { isLiked, count };
};

export const toggleVideoLike = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    if (!videoId || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Valid video id required");
    }

    const data = await toggleLikeEntity({
      targetType: "Video",
      targetId: videoId,
      userId,
      room: `video:${videoId}`,
      event: "video-like-updated",
      key: "videoId",
    });

    return res.json(new ApiResponse(200, data, "Video like toggled"));
  } catch (error) {
    console.error("[toggleVideoLike] server error:", error.message);
    throw new ApiError(500, "Internal server error!");
  }
});

export const toggleShortLike = asyncHandler(async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.user.id;

    if (!shortId || !isValidObjectId(shortId)) {
      throw new ApiError(400, "Valid short id required");
    }

    const data = await toggleLikeEntity({
      targetType: "Short",
      targetId: shortId,
      userId,
      room: `short:${shortId}`,
      event: "short-like-updated",
      key: "shortId",
    });

    return res.json(new ApiResponse(200, data, "Short like toggled"));
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in toggling short likes!");
  }
});

export const toggleCommentLike = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    if (!commentId || !isValidObjectId(commentId)) {
      throw new ApiError(400, "Valid comment id required");
    }

    const data = await toggleLikeEntity({
      targetType: "Comment",
      targetId: commentId,
      userId,
      room: `comment:${commentId}`,
      event: "comment-like-updated",
      key: "commentId",
    });

    return res.json(new ApiResponse(200, data, "Comment like toggled"));
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in toggling comment likes!");
  }
});

export const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    const likedVideoIds = await Like.find({
      likedBy: req.user.id,
      targetType: "Video",
    }).distinct("targetId");

    if (!likedVideoIds.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "All liked video fetched successfully!"));
    }

    const videos = await Video.find({
      _id: { $in: likedVideoIds },
    }).populate({
      path: "owner",
      select: "avatar username _id",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, videos || [], "All liked video fetched successfully!"));
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in getting liked video!");
  }
});

export const isLikedOrNotVideo = asyncHandler(async (req, res) => {
  //TODO: checking on Video

  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!videoId || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Valid video id is required");
    }

    const existing = await Like.findOne({
      video: videoId,
      likedBy: userId,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        { isLiked: !!existing },
        "Video like status fetched successfully"
      )
    );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in toggling video likes!");
  }
});

export const isLikedOrNotShort = asyncHandler(async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.user._id;

    if (!shortId || !isValidObjectId(shortId)) {
      throw new ApiError(401, "Short id is not found!");
    }

    const existing = await Like.findOne({
      short: shortId,
      likedBy: userId,
    });

    return res.status(200).json(
      new ApiResponse(
        200,

        { isLiked: !!existing },
        "short liked successfully!"
      )
    );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in toggling short likes!");
  }
});

export const isLikedOrNotComment = asyncHandler(async (req, res) => {
  //TODO: checking on comment

  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!commentId || !isValidObjectId(commentId)) {
      throw new ApiError(401, "Short id is not found!");
    }

    const existing = await Like.findOne({
      comment: commentId,
      likedBy: userId,
    });

    return res.status(200).json(
      new ApiResponse(
        200,

        { isLiked: !!existing },
        "comment liked successfully!"
      )
    );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in toggling comment likes!");
  }
});

export const toggleTweetLike = asyncHandler(async (req, res) => {

  //TODO: toggle like on tweet

  try {
    const { tweetId } = req.params;

    if (!tweetId) {
      throw new ApiError(401, "tweet id is not found!");
    }

    const tweetLike = await Like.findOne({ tweet: tweetId });

    let like;
    let dislike;

    if (tweetLike) {
      dislike = await Like.deleteOne({
        tweet: tweetId,
      });

      if (!dislike) {
        throw new ApiError(500, "something went wrong while unlike tweet !!");
      }
    } else {
      like = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
      });

      if (!like) {
        throw new ApiError(500, "something went wrong while like tweet !!");
      }
    }

    const counts = await Like.aggregate([
      {
        $match: {
          tweet: new mongoose.Types.ObjectId(tweetId),
        },
      },
      {
        $group: {
          _id: "null",
          tweetLikeCount: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          tweetLikeCount: 1,
          _id: 0
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { counts, tweetLike },
          "tweet liked successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in toggling tweet likes!");
  }
});
