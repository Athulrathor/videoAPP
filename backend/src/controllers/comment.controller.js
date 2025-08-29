import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comments.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video

  try {
    const { videoId } = req.params;
    const { page = 1, limit = 10, sortBy = "content", sortType=1 } = req.query;

    const sortTypes = parseInt(sortType);
    const pages = parseInt(page);
    const limits = parseInt(limit);

    if (!videoId || !isValidObjectId(videoId)) {
      throw new ApiError(401, "Video id not found!");
    }

    const count = await Comment.countDocuments({video:videoId});

    const commentOfVideo = await Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user_info",
        },
      },
      {
        $unwind: "$user_info",
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "comment",
          as: "likes_info",
        },
      },
      {
        $addFields: {
          totalLikes: {
            $size: "$likes_info",
          },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "comment",
          as: "replies_info",
        },
      },
      {
        $addFields: {
          totalReplies: {
            $size: "$replies_info",
          },
        },
      },
      {
        $project: {
          owner: 1,
          createdAt: 1,
          content: 1,
          video: 1,
          "user_info.avatar": 1,
          "user_info.username": 1,
          "user_info.createdAt": 1,
          totalLikes: 1,
          totalReplies:1,
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

const getShortComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a shorts

  try {
    const { shortId } = req.params;
    const { page = 1, limit = 10, sortBy = "content", sortType=1 } = req.query;

    const sortTypes = parseInt(sortType);
    const pages = parseInt(page);
    const limits = parseInt(limit);

    if (!shortId || !isValidObjectId(shortId)) {
      throw new ApiError(401, "Short id not found!");
    }

    const count = await Comment.countDocuments({ short: shortId });

    const commentOfShort = await Comment.aggregate([
      {
        $match: {
          short: new mongoose.Types.ObjectId(shortId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user_info",
        },
      },
      {
        $unwind: "$user_info",
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "comment",
          as: "likes_info",
        },
      },
      {
        $addFields: {
          totalLikes: {
            $size: "$likes_info",
          },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "comment",
          as: "comment_info",
        },
      },
      {
        $addFields: {
          totalComment: {
            $size: "$comment_info",
          },
        },
      },
      {
        $project: {
          owner: 1,
          createdAt: 1,
          content: 1,
          "user_info.avatar": 1,
          "user_info.username": 1,
          "user_info.createdAt": 1,
          totalLikes: 1,
          totalComment:1,
        },
      },
    ]);

    const totalPage = Math.ceil(commentOfShort.length / limits);
    const startingIndex = 0;

    if (!commentOfShort) {
      throw new ApiError(402, "There is no commented short!");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalCountOfShort: commentOfShort.length,
          totalPages: totalPage,
          data: commentOfShort,
        },
        "All commented short fetched successfully!"
      )
    );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in getting shorts comments!");
  }
});

const getCommentToComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a comments

  try {
    const { commentId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "content",
      sortType = 1,
    } = req.query;

    const sortTypes = parseInt(sortType);
    const pages = parseInt(page);
    const limits = parseInt(limit);

    if (!commentId || !isValidObjectId(commentId)) {
      throw new ApiError(401, "Comment id not found!");
    }

    const count = await Comment.countDocuments({ comment: commentId });

    const commentOfComments = await Comment.aggregate([
      {
        $match: {
          comment: new mongoose.Types.ObjectId(commentId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user_info",
        },
      },
      {
        $unwind: "$user_info",
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "comment",
          as: "likes_info",
        },
      },
      {
        $addFields: {
          totalLikes: {
            $size: "$likes_info",
          },
        },
      },
      {
        $project: {
          content: 1,
          "user_info.avatar": 1,
          "user_info.username": 1,
          "user_info.createdAt": 1,
          totalLikes:1,
        },
      },
    ]);

    if (!count || !commentOfComments) {
      console.log("not found")
    }

    const totalPage = Math.ceil(count / limits);
    const startingIndex = 0;

    if (!commentOfComments) {
      throw new ApiError(402, "There is no commented comment!");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalCountOfComments: count,
          totalPages: totalPage,
          data: commentOfComments,
        },
        "All commented comments fetched successfully!"
      )
    );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in getting comments of comments!");
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

    if (!comment || comment.trim() === "") {
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
    new ApiError(500, "Error in adding comment to video!");
  }
});

const addCommentShort = asyncHandler(async (req, res) => {
  // TODO: add a comment to a short

  try {
    const { shortId } = req.params;
    const { comment } = req.body

    if (!isValidObjectId(shortId)) {
      throw new ApiError(402, "Short id is not found!");
    }

    if (!comment || comment.trim() === "") {
      throw new ApiError(402, "Comment is empty!");
    }

    const addCommentToShort = await Comment.create({
      content: comment,
      short: shortId,
      owner: req.user._id,
    });

    if (!addCommentToShort) {
      throw new ApiError(404, "Error in creating comment!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          addCommentToShort,
          "A comment is added to short successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    new ApiError(500, "Error in adding comment to short!");
  }
});

const addCommentToComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a comment

  try {
    const { commentId } = req.params;
    const { comment } = req.body;

    if (!isValidObjectId(commentId)) {
      throw new ApiError(402, "Comment id is not found!");
    }

    if (!comment) {
      throw new ApiError(402, "Comment is empty!");
    }

    const addCommentToComment = await Comment.create({
      content: comment,
      comment: commentId,
      owner: req.user._id,
    });

    if (!addCommentToComment) {
      throw new ApiError(404, "Error in creating comment!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          addCommentToComment,
          "A comment is added to comment successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    new ApiError(500, "Error in adding comment to comment!");
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

const updateCommentShort = asyncHandler(async (req, res) => {
  // TODO: update a comment

  try {
    const { commentId } = req.params;
    const { newComment } = req.body;

    if (!newComment || newComment.trim() === " ") {
      throw new ApiError(401, "New comment is empty!");
    }

    if (!commentId) {
      throw new ApiError(401, "Comment id is empty!");
    }

    const updateShortComment = await Comment.findByIdAndUpdate(
      { _id: commentId },
      {
        content: newComment,
      },
      { new: true, upsert: true }
    );

    if (!updateShortComment) {
      throw new ApiError(401, "comment is not found!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updateShortComment,
          "Comment on short is updated successfully!"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(500, "Error in updating a short comment!");
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

const deleteCommentShort = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  try {
    const { commentId } = req.params;

    if (!commentId) {
      throw new ApiError(402, "Comment id is not found!");
    }

    const deletingcomment = await Comment.findByIdAndDelete({ _id: commentId });

    if (!deletingcomment) {
      throw new ApiError(404, "Error in deleting short comment!");
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
    throw new ApiError(500, "Error in deleting short comment!");
  }
});

export {
  getVideoComments,
  addComment,
  addCommentShort,
  updateComment,
  deleteComment,
  getShortComments,
  updateCommentShort,
  deleteCommentShort,
  getCommentToComments,
  addCommentToComment
};
