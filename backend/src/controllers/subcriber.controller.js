import mongoose, { isValidObjectId, Schema } from "mongoose";
import { Subcriptions } from "../models/subcriptions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { axiosInstance } from "../../../fronthend/src/libs/axios.js";
import { Video } from "../models/video.model.js";
import { Short } from "../models/short.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription

  try {

    const userId = req.params.userId;

    const currentUserId = req?.user._id;

    if (!userId) {
      throw new ApiError("Id not found ")
    }

    if (userId === currentUserId) return;

    let isSubcribed = await Subcriptions.findOne({
      subcriber: userId,
      subcribed:currentUserId,
    });

    let subcribed;
    let unSubcribed;

    if (isSubcribed) {
      unSubcribed = await Subcriptions.deleteOne({ subcriber: userId,subcribed:currentUserId });

      if (!unSubcribed) {
        throw new ApiError(
          400,
          "something went wrong while un subcribing video !!"
        );
      }
    } else {

      subcribed = await Subcriptions.create({
        subcriber: userId,
        subcribed: currentUserId,
      }); 

      if (!subcribed) {
        throw new ApiError(
          400,
          "something went wrong while subcribing video !!"
        );
      }
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subcribed: subcribed, unSubcribed: unSubcribed },
          "Getting subcription count!"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in toggling subcription!");
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  try {
    // const { userId } = req.params;

    const currentUserId = req.user._id;

    // if (!userId) {
    //   throw new ApiError(403, "User id is not found!");
    // }

    if (!currentUserId) {
      throw new ApiError(403, "Current user id is not found!");
    }

    const UserChannelSubscribers = await Subcriptions.aggregate([
      {
        $match: {
          subcribed: new mongoose.Types.ObjectId(currentUserId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subcriber",
          foreignField: "_id",
          as: "subcribers",
        },
      },
      {
        $unwind:"$subcribers"
      },
      {
        $project: {
          // _id: 1,
          // subcriber: 1,
          // subcribed: 1,
          // createdAt: 1,
          // updatedAt: 1,
          "subcribers._id":1,
          "subcribers.avatar": 1,
          "subcribers.username": 1,
          "subcribers.createdAt": 1,
          // "subcribers.subcriberCount":1
        },
      },
    ]);
      
      if (!UserChannelSubscribers) {
          throw new ApiError(404, "User channel subcriber not found!");
      }

      return res.status(200).json(new ApiResponse(200, UserChannelSubscribers, "User channel fetched successfully!"));

  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in get user channel subcriber!");
  }
});

const getUserChannelSubscribersVideosAndShort = asyncHandler(async (req, res) => {
  try {

    const currentUserId = req.user._id;

    if (!currentUserId) {
      throw new ApiError(403, "Current user id is not found!");
    }

    const UserChannelSubscribers = await Subcriptions.aggregate([
      {
        $match: {
          subcribed: new mongoose.Types.ObjectId(currentUserId),
        },
      },
      {
        $project: {
          subcriber: 1,
        },
      },
    ]);
      
    if (!UserChannelSubscribers) {
      throw new ApiError(404, "User channel subcriber not found!");
    }

    const videosIds = UserChannelSubscribers.map((video) => { return video.subcriber })
    
    const shortsIds = UserChannelSubscribers.map((short) => {
      return short.subcriber;
    });

    const videos = await Video.find({
      owner: { $in: videosIds },
    }).populate({
      path: "owner", select: "avatar username _id"
    });
    
    const shorts = await Short.find({
      owner: { $in: shortsIds },
    }).populate({
      path: "owner",
      select: "avatar username _id",
    });

    return res.status(200).json(new ApiResponse(200, {videos:videos,shorts:shorts}, "User videos and short are fetched successfully!"));

  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in get user subcriber videos and shorts!");
  }
});
// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  try {
      const { userId } = req.params;
      
    if (!userId) {
      throw new ApiError(403, "Subcriber id is not found!");
    }

    const UserChannelSubscribed = await Subcriptions.aggregate([
      {
        $match: {
          subcriber: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subcribed",
          foreignField: "_id",
          as: "subcribeds",
          pipeline: [
            {
              $addFields: {
                subcribedCount: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          subcriber: 1,
          subcribed: 1,
          createdAt: 1,
          updatedAt: 1,
          "subcribeds._id": 1,
          "subcribeds.avatar": 1,
          "subcribeds.username": 1,
        },
      },
    ]);

    if (!UserChannelSubscribed) {
      throw new ApiError(404, "User subcribed channel not found!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          UserChannelSubscribed,
          "User subcribed channel fetched successfully!"
        )
      );

  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in get subcribed channel!");
  }
});

const isSubcribed = asyncHandler(async (req, res) => {

  const { userId } = req.params;

  const currentUserId = req.user._id;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(403, "Subcriber id is not found!");
  }

  try {
    
    const isChecking = await Subcriptions.findOne({ subcriber: userId, subcribed: currentUserId });

    let status = null;

    if (isChecking === null) {
      status = false;
    } else {
      status = true;
    }

          return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                status,
                "User channel fetched successfully!"
              )
            );


  } catch (error) {
    console.error(error);
  }
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  isSubcribed,
  getUserChannelSubscribersVideosAndShort,
};
