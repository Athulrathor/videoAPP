
import mongoose,{ isValidObjectId } from "mongoose";
import {Short} from "../models/short.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getShortFeed = asyncHandler(async (req, res) => {
  try {
    const { cursor, limit = 5 } = req.query;
    const parsedLimit = Math.min(Math.max(Number(limit) || 5, 1), 50);

    const matchStage = {
      isPublished: true,
      visibility: "public",
    };

    if (cursor) {
      const parts = cursor.split("|");
      if (parts.length !== 2 || !isValidObjectId(parts[1])) {
        throw new ApiError(400, "Invalid cursor");
      }

      const [createdAt, id] = parts;
      matchStage.$or = [
        { createdAt: { $lt: new Date(createdAt) } },
        {
          createdAt: new Date(createdAt),
          _id: { $lt: new mongoose.Types.ObjectId(id) },
        },
      ];
    }

    const userId = req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : null;

    const shorts = await Short.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1, _id: -1 } },
      { $limit: parsedLimit + 1 },

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
            shortId: "$_id",
            userId,
          },
          pipeline: userId
            ? [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$short", "$$shortId"] },
                      { $eq: ["$owner", "$$userId"] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ]
            : [{ $limit: 0 }],
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
          shortUrl: 1,
          shortPublicId: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          likeCount: 1,
          commentsCount: 1,
          visibility: 1,
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

    const hasNextPage = shorts.length > parsedLimit;
    const slicedShorts = hasNextPage ? shorts.slice(0, parsedLimit) : shorts;
    const lastItem = slicedShorts[slicedShorts.length - 1];

    const nextCursor = hasNextPage
      ? `${lastItem.createdAt.toISOString()}|${lastItem._id}`
      : null;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          shorts: slicedShorts,
          nextCursor,
          hasNextPage,
        },
        "Short feed fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Internal server error");
  }
});

export const getAllShorts = asyncHandler(async (req, res) => {

  try {
    const {
      page=1,
      limit=2,
      query = `/^short/`,
      sortBy = 1,
      sortType = "ascending",
    } = req.query;

    const pages = parseInt(page);
    const limits = parseInt(limit);

    const totalShort = await Short.countDocuments({});
    const totalPage = Math.ceil(totalShort / limits);
    const startingIndex = (pages - 1) * limits;

    const getAllShortFile = await Short.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
          ],
        },
      },
   {
     $lookup: {
       from: "likes",
       localField: "_id",
       foreignField: "short",
       as: "likesInfo",
     },
   },
   {
     $set: {
       likeCount: { $size: "$likesInfo" },
     },
   },
   {
     $lookup: {
       from: "comments",
       localField: "_id",
       foreignField: "short",
       as: "commentInfo",
     },
   },
   {
     $set: {
       commentCount: { $size: "$commentInfo" },
     },
   },
   {
     $lookup: {
       from: "users",
       localField: "owner",
       foreignField: "_id",
       as: "userInfo",
       pipeline: [
         {
           $project: {
             _id: 1,
             username: 1,
             avatar: 1,
             createdAt: 1,
           },
         },
       ],
     },
   },
   {
     $project: {
       likesInfo: 0,
       commentInfo:0,
     },
   },
 ]);

    if (!getAllShortFile) {
      throw new ApiError(400, "Error in getting short file!");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalPage: totalPage,
          startingIndex: startingIndex,
          totalShort:totalShort,
          data: getAllShortFile,
        },
        "short file fetched successfully!"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in getting all short!");
  }
});

export const getShortByOwner = asyncHandler(async (req, res) => {
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

    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

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
            shortId: "$_id",
            userId: currentUserId,
          },
          pipeline: currentUserId
            ? [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$short", "$$shortId"] },
                      { $eq: ["$owner", "$$userId"] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ]
            : [{ $limit: 0 }],
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
          shortUrl: 1,
          shortPublicId: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          likeCount: 1,
          commentsCount: 1,
          visibility: 1,
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

    const [shorts, total] = await Promise.all([
      Short.aggregate(pipeline),
      Short.countDocuments(matchStage),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          total,
          page: parsedPage,
          totalPages: Math.ceil(total / parsedLimit),
          shorts,
        },
        "User shorts fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Error in getting all shorts");
  }
});

export const publishAShort = asyncHandler(async (req, res) => {

  try {
    const {
          title,
          description,
          shortUrl,
          shortPublicId,
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
    
        if (!shortUrl || !shortPublicId) {
          throw new ApiError(400, "short upload data missing");
        }
    
        if (!thumbnail || !thumbnailPublicId) {
          throw new ApiError(400, "Thumbnail upload data missing");
        }
    
        const parsedIsPublished =
          isPublished === true || isPublished === "true";
    
        const short = await Short.create({
          shortUrl,
          shortPublicId,
    
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
          new ApiResponse(201, short, "Short video published successfully!")
        );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in publishing short!");
  }
});

export const getShortById = asyncHandler(async (req, res) => {
  try {
    const { shortId } = req.params;

    if (!shortId || !isValidObjectId(shortId)) {
      throw new ApiError(400, "Invalid short id");
    }

    await Short.updateOne({ _id: shortId }, { $inc: { views: 1 } });

    const currentUserId = req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : null;

    const short = await Short.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(shortId),
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
            shortId: "$_id",
            userId: currentUserId,
          },
          pipeline: currentUserId
            ? [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$short", "$$shortId"] },
                      { $eq: ["$owner", "$$userId"] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ]
            : [{ $limit: 0 }],
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
          shortUrl: 1,
          shortPublicId: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          likeCount: 1,
          commentsCount: 1,
          visibility: 1,
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

    if (!short.length) {
      throw new ApiError(404, "Short not found");
    }

    return res.status(200).json(
      new ApiResponse(200, short[0], "Short fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Error in getting short by id");
  }
});

export const updateShort = asyncHandler(async (req, res) => {
  try {
    const { shortId } = req.params;
    
        const {
          title,
          description,
          isPublished,
          thumbnail,
          thumbnailPublicId,
        } = req.body;
    
        if (!shortId || !isValidObjectId(shortId)) {
          throw new ApiError(400, "Invalid short id!");
        }
    
        // 🔐 check ownership
    const short = await Short.findById(shortId);
        if (!short) {
          throw new ApiError(404, "Short not found!");
        }
    
        if (short.owner.toString() !== req.user._id.toString()) {
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
    
        const updatedShort = await Short.findByIdAndUpdate(
          shortId,
          { $set: updateFields },
          { new: true }
        );
    
        return res.status(200).json(
          new ApiResponse(
            200,
            updatedShort,
            "Short updated successfully!"
          )
        );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in updating short!");
  }
});

export const deleteShort = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  
  if (!shortId || !isValidObjectId(shortId)) {
      throw new ApiError(400, "Invalid short id!");
    }
  
    // 🔍 find short first
  const short = await Short.findById(shortId);
  
    if (!short) {
      throw new ApiError(404, "Short not found!");
    }
  
    // 🔒 ownership check
    if (short.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Unauthorized");
    }
  

  try {
    // 🔥 delete from Cloudinary FIRST
        if (short.videoPublicId) {
          await deleteOnCloudinary(short.videoPublicId, "video");
        }
    
        if (short.thumbnailPublicId) {
          await deleteOnCloudinary(short.thumbnailPublicId, "image");
        }
    
        // 🧹 delete from DB
        await short.deleteOne();
    
        return res.status(200).json(
          new ApiResponse(200, null, "Short deleted successfully!")
        );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in deleting the short!");
  }
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const { shortId } = req.params;

    if (!shortId || !isValidObjectId(shortId)) {
      throw new ApiError(400, "Invalid short id!");
    }

    const updated = await Short.findOneAndUpdate(
          {
        _id: shortId,
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
          throw new ApiError(404, "Short not found or unauthorized");
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

export const shortViewCounter = asyncHandler(async (req, res) => {
  try {
    const { shortId } = req.params;

    if (!shortId || !isValidObjectId(shortId)) {
          throw new ApiError(400, "Invalid short id!");
        }
    
        const updatedShort = await Short.findByIdAndUpdate(
          shortId,
          { $inc: { views: 1 } },
          {
            new: true,
            select: "views",
          }
        );
    
        if (!updatedShort) {
          throw new ApiError(404, "Short not found!");
        }
    
        return res.status(200).json(
          new ApiResponse(
            200,
            { views: updatedShort.views },
            "View counted successfully!"
          )
        );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in view counter!");
  }
});
