import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary } from "../utils/cloudinary.js";
import { emptyLookupPipeline, parsePositiveLimit, parsePositivePage } from "../utils/pagination.js";

export const getFeed = asyncHandler(async (req, res) => {
  try {
    const { cursor, limit = 10, query = "" } = req.query;
    const limits = parsePositiveLimit(limit, 20);
    const trimmedQuery = String(query).trim();

    const matchStage = {
      isPublished: true,
      visibility: "public",
    };

    if (trimmedQuery) {
      const safeQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchStage.$or = [
        { title: { $regex: safeQuery, $options: "i" } },
        { description: { $regex: safeQuery, $options: "i" } },
      ];
    }

    if (cursor) {
      const parts = cursor.split("|");
      if (parts.length !== 2 || !isValidObjectId(parts[1])) {
        throw new ApiError(400, "Invalid cursor");
      }

      const [createdAt, id] = parts;
      const cursorCondition = [
        { createdAt: { $lt: new Date(createdAt) } },
        {
          createdAt: new Date(createdAt),
          _id: { $lt: new mongoose.Types.ObjectId(id) },
        },
      ];

      if (matchStage.$or) {
        matchStage.$and = [{ $or: matchStage.$or }, { $or: cursorCondition }];
        delete matchStage.$or;
      } else {
        matchStage.$or = cursorCondition;
      }
    }

    const userId = req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : null;

    const videos = await Video.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: limits + 1 },

      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1,
                subscriberCount: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "likes",
          let: {
            videoId: "$_id",
            userId,
          },
          pipeline: userId
            ? [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$video", "$$videoId"] },
                      { $eq: ["$owner", "$$userId"] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ]
            : emptyLookupPipeline,
          as: "userLike",
        },
      },
      {
        $addFields: {
          isLiked: { $gt: [{ $size: "$userLike" }, 0] },
        },
      },

      {
        $project: {
          videoUrl: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          likeCount: 1,
          commentsCount: 1,
          visibility: 1,
          category: 1,
          isPublished: 1,
          createdAt: 1,
          updatedAt: 1,
          isLiked: 1,
          owner: {
            _id: "$owner._id",
            username: "$owner.username",
            avatar: "$owner.avatar",
            subscriberCount: "$owner.subscriberCount",
          },
        },
      },
    ]);

    const hasNextPage = videos.length > limits;
    const slicedVideos = hasNextPage ? videos.slice(0, limits) : videos;
    const lastItem = slicedVideos[slicedVideos.length - 1];

    const nextCursor = hasNextPage
      ? `${lastItem.createdAt.toISOString()}|${lastItem._id}`
      : null;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videos: slicedVideos,
          nextCursor,
          hasNextPage,
        },
        "Feed fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Error in getting feed");
  }
});

export const getRecommendedVideos = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    const parsedLimit = Number(limit);
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(Math.floor(parsedLimit), 20)
        : 10;

    // Find current video to get its category
    const currentVideo = await Video.findById(videoId).select("_id category");
    if (!currentVideo) {
      throw new ApiError(404, "Video not found");
    }

    const recommendedVideos = await Video.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(videoId) },
          isPublished: true,
          visibility: "public",
        },
      },

      // Priority: same category first
      {
        $addFields: {
          categoryPriority: {
            $cond: [{ $eq: ["$category", currentVideo.category] }, 1, 0],
          },
        },
      },

      // same category first, then latest
      {
        $sort: {
          categoryPriority: -1,
          createdAt: -1,
          _id: -1,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          thumbnail: 1,
          duration: 1,
          views: 1,
          likeCount: 1,
          commentsCount: 1,
          category: 1,
          createdAt: 1,
          "owner._id": 1,
          "owner.username": 1,
          "owner.avatar": 1,
        },
      },
      {
        $limit: safeLimit,
      },
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          currentVideo: currentVideo._id,
          currentCategory: currentVideo.category,
          total: recommendedVideos.length,
          videos: recommendedVideos,
        },
        "Recommended videos fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Error while fetching recommended videos"
    );
  }
});

export const getAllSuggestion = asyncHandler(async (req, res) => {
  try {
    const { query = "", limit = 10 } = req.query;

    const trimmedQuery = String(query).trim();
    const safeLimit = parsePositiveLimit(limit, 10, 20);

    if (!trimmedQuery) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "Empty query"));
    }

    const safeQuery = String(trimmedQuery).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const suggestions = await Video.aggregate([
      {
        $match: {
          isPublished: true,
          visibility: "public",
          title: {
            $regex: `^${safeQuery}`,
            $options: "i",
          },
        },
      },
      {
        $addFields: {
          ageInDays: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: [{ $ifNull: ["$views", 0] }, 0.3] },
              { $multiply: [{ $ifNull: ["$likeCount", 0] }, 0.3] },
              {
                $divide: [1, { $add: ["$ageInDays", 1] }],
              },
            ],
          },
        },
      },
      { $sort: { score: -1, createdAt: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          thumbnail: 1,
        },
      },
      { $limit: safeLimit },
    ]);

    return res.status(200).json(
      new ApiResponse(200, suggestions, "Suggestions fetched successfully!")
    );
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "Error in getting suggestions"
    );
  }
});

export const getVideoByOwner = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      query = "",
      sortBy = "createdAt",
      sortType = "desc",
    } = req.query;

    const { userId } = req.params;

    if (!userId || !isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    const parsedPage = parsePositivePage(page);
    const parsedLimit = parsePositiveLimit(limit, 10);

    const allowedSortFields = [
      "createdAt",
      "views",
      "likeCount",
      "commentsCount",
      "title",
      "duration",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const matchStage = {
      owner: new mongoose.Types.ObjectId(userId),
      isPublished: true,
      visibility: "public",
    };

    if (query?.trim()) {
      matchStage.$or = [
        { title: { $regex: query.trim(), $options: "i" } },
        { description: { $regex: query.trim(), $options: "i" } },
      ];
    }

    const sortStage = {
      [safeSortBy]: sortType === "asc" ? 1 : -1,
      _id: -1,
    };

    const currentUserId = req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : null;

    const pipeline = [
      { $match: matchStage },
      { $sort: sortStage },

      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1,
                subscriberCount: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "likes",
          let: {
            videoId: "$_id",
            userId: currentUserId,
          },
          pipeline: currentUserId
            ? [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$video", "$$videoId"] },
                      { $eq: ["$owner", "$$userId"] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ]
            : emptyLookupPipeline,
          as: "userLike",
        },
      },
      {
        $addFields: {
          isLiked: { $gt: [{ $size: "$userLike" }, 0] },
        },
      },

      {
        $project: {
          videoUrl: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          likeCount: 1,
          commentsCount: 1,
          visibility: 1,
          category: 1,
          isPublished: 1,
          createdAt: 1,
          updatedAt: 1,
          isLiked: 1,
          owner: {
            _id: "$owner._id",
            username: "$owner.username",
            avatar: "$owner.avatar",
            subscriberCount: "$owner.subscriberCount",
          },
        },
      },

      { $skip: (parsedPage - 1) * parsedLimit },
      { $limit: parsedLimit },
    ];

    const [videos, total] = await Promise.all([
      Video.aggregate(pipeline),
      Video.countDocuments(matchStage),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          total,
          page: parsedPage,
          totalPages: Math.ceil(total / parsedLimit),
          videos,
        },
        "User videos fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Error in getting user videos");
  }
});

export const publishAVideo = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      videoUrl,
      videoPublicId,
      thumbnail,
      thumbnailPublicId,
      duration,
      isPublished,
      visibility = "public",
      category = "other",
    } = req.body;

    // ✅ validation
    if (!title?.trim() || !description?.trim()) {
      throw new ApiError(400, "Title and description required");
    }

    if (!videoUrl || !videoPublicId) {
      throw new ApiError(400, "Video upload data missing");
    }
    if (!thumbnail || !thumbnailPublicId) {
      throw new ApiError(400, "Thumbnail upload data missing");
    }

    const parsedIsPublished =
      isPublished === true || isPublished === "true";

    const video = await Video.create({
      videoUrl,
      videoPublicId,

      thumbnail,
      thumbnailPublicId,

      title: title.trim(),
      description: description.trim(),

      duration: duration || 0,

      isPublished: parsedIsPublished,
      visibility,
      category,

      owner: req.user.id,
    });

    return res.status(201).json(
      new ApiResponse(201, video, "Video published successfully!")
    );
  } catch (error) {
    console.error('❌ Video publishing error:', error);
    throw error;
  }
});

export const getVideoById = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    await Video.updateOne({ _id: videoId }, { $inc: { views: 1 } });

    const currentUserId = req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : null;

    const video = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
          isPublished: true,
          visibility: "public",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1,
                subscriberCount: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "likes",
          let: {
            videoId: "$_id",
            userId: currentUserId,
          },
          pipeline: currentUserId
            ? [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$video", "$$videoId"] },
                      { $eq: ["$owner", "$$userId"] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ]
            : [{ $limit: 1 }],
          as: "userLike",
        },
      },
      {
        $addFields: {
          isLiked: { $gt: [{ $size: "$userLike" }, 0] },
        },
      },

      {
        $project: {
          videoUrl: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          likeCount: 1,
          commentsCount: 1,
          visibility: 1,
          category: 1,
          isPublished: 1,
          createdAt: 1,
          updatedAt: 1,
          isLiked: 1,
          owner: {
            _id: "$owner._id",
            username: "$owner.username",
            avatar: "$owner.avatar",
            subscriberCount: "$owner.subscriberCount",
          },
        },
      },
    ]);

    if (!video.length) {
      throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
      new ApiResponse(200, video[0], "Video fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Error in getting video by id");
  }
});

export const updateVideo = asyncHandler(async (req, res) => {

  try {
    const { videoId } = req.params;

    const {
      title,
      description,
      isPublished,
      thumbnail,
      thumbnailPublicId,
    } = req.body;

    if (!videoId || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id!");
    }

    // 🔐 check ownership
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found!");
    }

    if (video.owner.toString() !== req.user.id.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    // ✅ build update object dynamically
    const updateFields = {};

    if (title) updateFields.title = title.trim();
    if (description) updateFields.description = description.trim();

    if (isPublished !== undefined) {
      updateFields.isPublished =
        isPublished === true || isPublished === "true";
    }

    // ✅ thumbnail already uploaded from frontend
    if (thumbnail && thumbnailPublicId) {
      updateFields.thumbnail = thumbnail;
      updateFields.thumbnailPublicId = thumbnailPublicId;
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedVideo,
        "Video updated successfully!"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in updating video!");
  }
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id!");
  }

  // 🔍 find video first
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  // 🔒 ownership check
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  try {
    // 🔥 delete from Cloudinary FIRST
    if (video.videoPublicId) {
      await deleteOnCloudinary(video.videoPublicId, "video");
    }

    if (video.thumbnailPublicId) {
      await deleteOnCloudinary(video.thumbnailPublicId, "image");
    }

    // 🧹 delete from DB
    await video.deleteOne();

    return res.status(200).json(
      new ApiResponse(200, null, "Video deleted successfully!")
    );

  } catch (error) {
    throw new ApiError(500, "Failed to delete video resources");
  }
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id!");
    }

    const updated = await Video.findOneAndUpdate(
      {
        _id: videoId,
        owner: req.user._id, // 🔒 ownership check inside query
      },
      [
        {
          $set: {
            isPublished: { $not: "$isPublished" },
          },
        },
      ],
      {
        new: true,
        projection: { isPublished: 1 },
      }
    );

    if (!updated) {
      throw new ApiError(404, "Video not found or unauthorized");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { isPublished: updated.isPublished },
        "Publish status updated successfully!"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in toggle published status!");
  }
});

export const videoViewCounter = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id!");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } },
      {
        new: true,
        select: "views",
      }
    );

    if (!updatedVideo) {
      throw new ApiError(404, "Video not found!");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { views: updatedVideo.views },
        "View counted successfully!"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in view counter!");
  }
});
