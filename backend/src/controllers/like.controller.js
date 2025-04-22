import mongoose, { isValidObjectId, Schema } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video

  try {
    const { videoId } = req.params;
    //   const userId = req.user._id;

    if (!videoId) {
      throw new ApiError(401, "Video id is not found!");
      }
      
      const videoLike = await Like.findOne({ video: videoId });

      let like;
      let dislike;

      if (videoLike) {
        dislike = await Like.deleteOne({
          video: videoId,
        });

        if (!dislike) {
          throw new ApiError(500, "something went wrong while unlike video !!");
        }
      } else {
        like = await Like.create({
          video: videoId,
          likedBy: req.user._id,
        });

        if (!like) {
          throw new ApiError(500, "something went wrong while like video !!");
        }
    }
    
    const counts = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: "null",
          videoLikeCount: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          videoLikeCount: 1,
          _id:0
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {counts,videoLike},
          "Video liked successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in toggling video likes!");
  }
});

const toggleShortLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video

  try {
    const { shortId } = req.params;
    //   const userId = req.user._id;

    if (!shortId) {
      throw new ApiError(401, "Short id is not found!");
    }

    const shortLike = await Like.findOne({ short: shortId });

    let like;
    let dislike;

    if (shortLike) {
      dislike = await Like.deleteOne({
        short: shortId,
      });

      if (!dislike) {
        throw new ApiError(500, "something went wrong while unlike short !!");
      }
    } else {
      like = await Like.create({
        short: shortId,
        likedBy: req.user._id,
      });

      if (!like) {
        throw new ApiError(500, "something went wrong while like short !!");
      }
    }

    const counts = await Like.aggregate([
      {
        $match: {
          short: new mongoose.Types.ObjectId(shortId),
        },
      },
      {
        $group: {
          _id: "null",
          shortLikeCount: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          shortLikeCount: 1,
          _id:0
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {counts,shortLike},
          "short liked successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in toggling short likes!");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {

  //TODO: toggle like on comment

  try {
    const { commentId } = req.params;

    if (!commentId) {
      throw new ApiError(401, "comment id is not found!");
    }

    const commentLike = await Like.findOne({ comment: commentId });

    let like;
    let dislike;

    if (commentLike) {
      dislike = await Like.deleteOne({
        comment: commentId,
      });

      if (!dislike) {
        throw new ApiError(500, "something went wrong while unlike comment !!");
      }
    } else {
      like = await Like.create({
        comment: commentId,
        likedBy: req.user._id,
      });

      if (!like) {
        throw new ApiError(500, "something went wrong while like comment !!");
      }
    }

    const counts = await Like.aggregate([
      {
        $match: {
          comment: new mongoose.Types.ObjectId(commentId),
        },
      },
      {
        $group: {
          _id: "null",
          commentLikeCount: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          commentLikeCount: 1,
          _id:0
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {counts,commentLike},
          "comment liked successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in toggling comment likes!");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {

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
           _id:0
         },
       },
     ]);

     return res
       .status(200)
       .json(
         new ApiResponse(
           200,
           {counts,tweetLike},
           "tweet liked successfully!"
         )
       );
   } catch (error) {
     console.log(error.message);
     throw new ApiError(500, "Error in toggling tweet likes!");
   }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  try {
    const likedVideoId = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: "null",
          likedVideoList: {
            $addToSet: "$video",
          },
        },
      },
      // {
      //   $group: {
      //     _id: "null",
      //   },
      // },
      {
        $project: {
          _id: 0,
          likedVideoList: 1,
        },
      },
      // {
      //   $group: {
      //     _id: "$likedBy",
      //     listOfVideo: {
      //       $push: "$video",
      //     },
      //   },
      // },
      // {
      //   $project: {
      //     _id: 0,
      //   },
      // },
    ]);

    const videos = await Video.find({
      _id: { $in: likedVideoId[0].likedVideoList[0] },
    });

    // console.log(likedVideoId[0].likedVideoList[0]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          videos,
          "All liked video fetched successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in getting liked video!");
  }
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  toggleShortLike,
};
