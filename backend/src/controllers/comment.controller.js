import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comments.model.js";
import { Video } from "../models/video.model.js";
import { Short } from "../models/short.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emptyLookupPipeline, parsePositiveLimit } from "../utils/pagination.js";

export const getComments = asyncHandler(async (req, res) => {
  try {
    const { contentId } = req.params;
    const { limit = 10, cursor, cursorId } = req.query;

    if (!isValidObjectId(contentId)) {
      throw new ApiError(400, "Invalid contentId");
    }

    // if (!onModel || !["Video", "Short"].includes(onModel)) {
    //   throw new ApiError(400, "Invalid onModel");
    // }

    const parsedLimit = parsePositiveLimit(limit, 10);
    const currentUserId = req.user?._id && isValidObjectId(req.user._id)
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;

    const matchStage = {
      contentId: new mongoose.Types.ObjectId(contentId),
      parentComment: null,
    };

    if (cursor && cursorId) {
      if (!isValidObjectId(cursorId)) {
        throw new ApiError(400, "Invalid cursorId");
      }

      matchStage.$or = [
        { createdAt: { $lt: new Date(cursor) } },
        {
          createdAt: new Date(cursor),
          _id: { $lt: new mongoose.Types.ObjectId(cursorId) },
        },
      ];
    }

    const comments = await Comment.aggregate([
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
          let: { commentId: "$_id", userId: currentUserId },
          pipeline: currentUserId
            ? [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$comment", "$$commentId"] },
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
          userLike: 0,
          __v: 0,
        },
      },
    ]);

    const hasNextPage = comments.length > parsedLimit;
    const slicedComments = hasNextPage ? comments.slice(0, parsedLimit) : comments;

    const lastItem = slicedComments[slicedComments.length - 1];

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          data: slicedComments,
          nextCursor: hasNextPage
            ? {
              cursor: lastItem.createdAt,
              cursorId: lastItem._id,
            }
            : null,
          hasNextPage,
        },
        "Comments fetched successfully"
      )
    );
  } catch (error) {
    console.error("[getComments] server error:", error.message);
    throw new ApiError(500, "Error in getting comments");
  }
});

export const getReplies = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { limit = 10, cursor, cursorId } = req.query;

    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid commentId");
    }

    const parsedLimit = parsePositiveLimit(limit, 10);
    const currentUserId = req.user?._id && isValidObjectId(req.user._id)
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;

    const matchStage = {
      parentComment: new mongoose.Types.ObjectId(commentId),
    };

    if (cursor && cursorId) {
      if (!isValidObjectId(cursorId)) {
        throw new ApiError(400, "Invalid cursorId");
      }

      matchStage.$or = [
        { createdAt: { $lt: new Date(cursor) } },
        {
          createdAt: new Date(cursor),
          _id: { $lt: new mongoose.Types.ObjectId(cursorId) },
        },
      ];
    }

    const replies = await Comment.aggregate([
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
          let: { commentId: "$_id", userId: currentUserId },
          pipeline: currentUserId
            ? [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$comment", "$$commentId"] },
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
          userLike: 0,
          __v: 0,
        },
      },
    ]);

    const hasNextPage = replies.length > parsedLimit;
    const slicedReplies = hasNextPage ? replies.slice(0, parsedLimit) : replies;

    const lastItem = slicedReplies[slicedReplies.length - 1];

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          data: slicedReplies,
          nextCursor: hasNextPage
            ? {
              cursor: lastItem.createdAt,
              cursorId: lastItem._id,
            }
            : null,
          hasNextPage,
        },
        "Replies fetched successfully"
      )
    );
  } catch (error) {
    console.error("[getReplies] server error:", error.message);
    throw new ApiError(500, "Error in getting replies");
  }
});

export const addComment = asyncHandler(async (req, res) => {
  try {
    const { contentId } = req.params;
    const { content, onModel } = req.body;

    if (!isValidObjectId(contentId)) {
      throw new ApiError(400, "Invalid contentId");
    }

    if (!["Video", "Short"].includes(onModel)) {
      throw new ApiError(400, "Invalid model type");
    }

    if (!content?.trim()) {
      throw new ApiError(400, "Comment cannot be empty");
    }

    const comment = await Comment.create({
      content,
      contentId,
      onModel,
      owner: req.user.id,
    });

    if (onModel === "Video") {
      await Video.findByIdAndUpdate(contentId, {
        $inc: { commentsCount: 1 },
      });
    }

    if (onModel === "Short") {
      await Short.findByIdAndUpdate(contentId, {
        $inc: { commentsCount: 1 },
      });
    }

    return res
      .status(201)
      .json(new ApiResponse(201, comment, "Comment added"));
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in adding comment to video!");
  }
});

export const addReplies = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid commentId");
    }

    const parent = await Comment.findById(commentId);

    if (!parent) {
      throw new ApiError(404, "Parent comment not found");
    }

    const reply = await Comment.create({
      content,
      contentId: parent.contentId,
      onModel: parent.onModel,
      parentComment: commentId,
      owner: req.user.id,
    });

    // 🔥 increment reply count
    await Comment.findByIdAndUpdate(commentId, {
      $inc: { replyCount: 1 },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, reply, "Reply added"));
  } catch (error) {
    console.error("[addReplies] server error: ", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const updateComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      throw new ApiError(400, "Content cannot be empty");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    // 🔐 ownership check
    if (comment.owner.toString() !== req.user.id.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    comment.content = content;
    await comment.save();

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment updated"));
  } catch (error) {
    console.error("[updateComment] server error: ", error.message);
    throw new ApiError(500, "Internal server error!");
  }
});

export const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user.id.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    // 🔥 decrement reply count if it's a reply
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $inc: { replyCount: -1 },
      });
    } else {
      if (comment.onModel === "Video") {
        await Video.findByIdAndUpdate(comment.contentId, {
          $inc: { commentsCount: -1 },
        });
      }

      if (comment.onModel === "Short") {
        await Short.findByIdAndUpdate(comment.contentId, {
          $inc: { commentsCount: -1 },
        });
      }
    }

    await Comment.findByIdAndDelete(commentId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment deleted"));
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in deleting video comment!");
  }
});
