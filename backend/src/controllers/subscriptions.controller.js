import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Short } from "../models/short.model.js";
import { parsePositiveLimit, parsePositivePage } from "../utils/pagination.js";

export const toggleSubscription = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.id;

    if (!channelId) {
      throw new ApiError(400, "Channel id is required");
    }

    if (userId.toString() === channelId.toString()) {
      throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const existing = await Subscription.findOne({
      subscriber: userId,
      subscribedTo: channelId,
    });

    let isSubscribed;

    if (existing) {
      await existing.deleteOne();
      isSubscribed = false;
    } else {
      await Subscription.create({
        subscriber: userId,
        subscribedTo: channelId,
      });
      isSubscribed = true;
    }

    const subscriberCount = await Subscription.countDocuments({
      subscribedTo: channelId,
    });

    return res.json(
      new ApiResponse(200, "Subscription updated", {
        isSubscribed,
        subscriberCount,
        channelId,
      })
    );
  } catch (error) {
    console.error('[toggleSubscription] server error: ', error.message);
    throw new ApiError(500, "Internal server error!");
  }
});

// Toggle subscription
export const subscriptionCount = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) throw new ApiError(401, "Channel id is missing!");

    const count = await Subscription.countDocuments({
      subscribedTo: channelId,
    });

    return res.status(200).json(new ApiResponse(200, "Successfully fetched subscription count!", count));
  } catch (error) {
    console.error("[subscriptionCount] server error: ", error.message);
    throw new ApiError(500, "Internal server error!");
  }
});

//  Seperate subscriptions
export const subscribe = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    if (userId.equals(channelId)) {
      return res.status(400).json({ message: "Cannot subscribe to yourself" });
    }

    const sub = await Subscription.create({
      subscriber: userId,
      subscribedTo: channelId,
    });

    return res.json(new ApiResponse(201,"subscribed",true));
  } catch (error) {
    console.error("[subscribe] server error: ", error.message);
    throw new ApiError(500, "Internal server error!");
  }
});

export const unSubscribe = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    await Subscription.findOneAndDelete({
      subscriber: userId,
      subscribedTo: channelId,
    });

    return res.json(new ApiResponse(201, "unsubscribed", false));
  } catch (error) {
    console.error("[unSubscribe] server error: ", error.message);
    throw new ApiError(500, "Internal server error!");
  }
});

// controller to return subscriber list of a channel
export const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parsePositivePage(page);
    const parsedLimit = parsePositiveLimit(limit, 10);

    const subscribers = await Subscription.aggregate([
      {
        $match: {
          subscribedTo: new mongoose.Types.ObjectId(currentUserId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscriber",
        },
      },
      { $unwind: "$subscriber" },
      {
        $project: {
          _id: 0,
          "subscriber._id": 1,
          "subscriber.username": 1,
          "subscriber.avatar": 1,
        },
      },
      { $skip: (parsedPage - 1) * parsedLimit },
      { $limit: parsedLimit },
    ]);

    const total = await Subscription.countDocuments({
      subcribedTo: currentUserId,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          total,
          page: parsedPage,
          limit: parsedLimit,
          subscribers,
        },
        "Subscribers fetched successfully!"
      )
    );
  } catch (error) {
    console.error("[getUserChannelSubscribers] server error: ", error.message);
    throw new ApiError(500, "Internal server error!");
  }
});

export const getUserChannelSubscribersVideosAndShort = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const { page = 1, limit = 10 } = req.query;
  const parsedPage = parsePositivePage(page);
  const parsedLimit = parsePositiveLimit(limit, 10);

  if (!currentUserId) {
    throw new ApiError(403, "Current user id is not found!");
  }

  // ✅ Step 1: Get subscribed channel IDs
  const subscriptions = await Subscription.find({
    subscribedTo: currentUserId,
  }).select("subscriber");

  const channelIds = subscriptions.map((s) => s.subscriber);

  if (channelIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { videos: [], shorts: [] }, "No subscriptions yet")
    );
  }

  // ✅ Step 2: Fetch videos + shorts in parallel
  const [videos, shorts] = await Promise.all([
    Video.find({ owner: { $in: channelIds } }).lean(),
    Short.find({ owner: { $in: channelIds } }).lean(),
  ]);

  const feed = [
    ...videos.map(v => ({ ...v, type: "video" })),
    ...shorts.map(s => ({ ...s, type: "short" })),
  ];

  // 🔥 sort combined feed
  feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // pagination AFTER merge
  const start = (parsedPage - 1) * parsedLimit;
  const paginatedFeed = feed.slice(start, start + parsedLimit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        feed,
        start,
        paginatedFeed
      },
      "Feed fetched successfully!"
    )
  );
});
// controller to return channel list to which user has subscribed
export const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(403, "Subscriber id is not found!");
  }

  const channels = await Subscription.aggregate([
    {
      $match: {
        subcriber: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscribedTo",
        foreignField: "_id",
        as: "channel",
      },
    },
    { $unwind: "$channel" },

    // 🔥 subscriber count
    {
      $lookup: {
        from: "subscriptions",
        let: { channelId: "$channel._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$subscribedTo", "$$channelId"],
              },
            },
          },
          { $count: "count" },
        ],
        as: "subsCount",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $ifNull: [{ $arrayElemAt: ["$subsCount.count", 0] }, 0],
        },
      },
    },

    {
      $project: {
        _id: 0,
        channel: {
          _id: "$channel._id",
          username: "$channel.username",
          avatar: "$channel.avatar",
        },
        subscriberCount: 1,
        subscribedAt: "$createdAt",
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: channels.length,
        channels,
      },
      "Subscribed channels fetched successfully!"
    )
  );
});

export const isSubcribed = asyncHandler(async (req, res) => {

  const { userId } = req.params;

  const currentUserId = req.user._id;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(403, "Subcriber id is not found!");
  }

  try {
    
    const isChecking = await Subscription.findOne({ subscriber: userId, subscribedTo: currentUserId });

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
