import mongoose, { isValidObjectId } from "mongoose";
import { Subcriptions } from "../models/subcriptions.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription

  try {
    const userId = req?.user._id;

    const isSubcribed = await Subcriptions.findOne({ channel: userId });

    let subcribed;
    let unSubcribed;

    if (isSubcribed) {
      unSubcribed = await Subcriptions.deleteOne({ channel: userId });

      if (!unSubcribed) {
        throw new ApiError(
          400,
          "something went wrong while un subcribing video !!"
        );
      }
    } else {
      subcribed = await Subcriptions.create({
        channel: userId,
      });

      if (!subcribed) {
        throw new ApiError(
          400,
          "something went wrong while subcribing video !!"
        );
      }
    }

    // const channelCount = await Subcriptions.aggregate([
    //   {
    //     $match: {
    //       channel: userId,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "null",
    //       channelCount: {
    //         $sum: 1,
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       channelCount: 1,
    //     },
    //   },
    // ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subcribed,unSubcribed },
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
    const { channelId } = req.params;

    if (!channelId) {
      throw new ApiError(403, "Channel id is not found!");
    }

    const UserChannelSubscribers = await Subcriptions.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channel",
          pipeline: [
            {
              $addFields: {
                channelCount: {
                  $sum: 1,
                },
              },
            },
          ],
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

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  try {
      const { subscriberId } = req.params;
      
    if (!subscriberId) {
      throw new ApiError(403, "Subcriber id is not found!");
    }

    const UserChannelSubscribed = await Subcriptions.aggregate([
      {
        $match: {
          subcriber: new mongoose.Types.ObjectId(subscriberId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subcriber",
          foreignField: "_id",
          as: "subcriber",
          pipeline: [
            {
              $addFields: {
                subcriberCount: {
                  $sum: 1,
                },
              },
            },
          ],
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

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
