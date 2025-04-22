import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comments.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video

  try {
    const { videoId } = req.params;
    const { page = 1, limit = 10, sortBy = "content", sortType } = req.query;

    const sortTypes = parseInt(sortType);
    const pages = parseInt(page);
    const limits = parseInt(limit);

    if (!videoId) {
      throw new ApiError(401, "Video id not found!");
    }

    const count = await Comment.countDocuments({});

    const commentOfVideo = await Comment.aggregate([
      { $match: { video: new mongoose.Types.ObjectId(videoId) } },
      { $sort: { content: sortTypes } },
      { $skip: (pages - 1) * limits * 0 },
      { $limit: limits },
      {
        $group: {
          _id: "null",
          total_count: { $sum: 1 },
          comments: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
      
      const totalPage = Math.ceil(count / limits);
      const startingIndex = 0;

    if (!commentOfVideo) {
      throw new ApiError(402, "There is no commented video!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {totalCountInDocument:count,totalPages:totalPage,data:commentOfVideo},
          "All commented video fetched successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in getting video comments!");
  }
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video

  try {
    const { videoId } = req.params;
    const { comment } = req.body;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(402, "Video id is not found!");
    }

    if (!comment || comment.trim() === " ") {
      throw new ApiError(402, "Comment is empty!");
    }

    const addCommentToVideo = await Comment.create({
      content: comment,
      video: videoId,
      owner: req.user._id,
    });

    if (!addCommentToVideo) {
      throw new ApiError(404, "Error in creating comment!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          addCommentToVideo,
          "A comment is added to video successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    ApiError(500, "Error in adding comment to video!");
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

  try {
    const {commentId } = req.params;
    const { newComment } = req.body;

    if (!newComment || newComment.trim() === " ") {
      throw new ApiError(401, "New comment is empty!");
    }

    if (!commentId) {
      throw new ApiError(401, "Comment id is empty!");
    }

    const updateVideoComment = await Comment.findByIdAndUpdate(
      { _id: commentId },
      {
        content: newComment,
      },
      { new: true, upsert: true }
    );

    if (!updateVideoComment) {
      throw new ApiError(401, "comment is not found!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updateVideoComment,
          "Comment on video is updated successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in updating a video comment!");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  try {
    const { commentId } = req.params;

    if (!commentId) {
      throw new ApiError(402, "Comment id is not found!");
    }

    const deletingcomment = await Comment.findByIdAndDelete({ _id: commentId });

    if (!deletingcomment) {
      throw new ApiError(404, "Error in deleting video comment!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletingcomment,
          "A comment is deleted successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in deleting video comment!");
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
