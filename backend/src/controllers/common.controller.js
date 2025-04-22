// import mongoose, { isValidObjectId, Schema } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Short } from "../models/short.model.js";


const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination

  try {
    const {
      page = 1,
      limit = 10,
      query = `/^video/`,
      sortBy = 1,
      sortType = "createdAt",
      // userId = req.user._id,
    } = req.query;

    const pages = parseInt(page);
    const limits = parseInt(limit);

    const totalVideo = await Video.countDocuments({});
    const totalPage = Math.ceil(totalVideo / limits);
    const startingIndex = (pages - 1) * limits;

    const getAllVideoFile = await Video.aggregate([
    {
      $lookup: {
      from: 'users',
      localField: 'owner',
      foreignField: '_id',
      as: 'user_info'
    }
  },
  {
    $unwind: '$user_info'
  },
  {
    $addFields: {
      avatar: '$user_info.avatar'
    }
  },
  {
    $project: {
      user_info: 0
    }
  },
      {
        $skip: (pages - 1) * limits,
      },
      {
        $limit: limits,
      },
      {
        $sort: {
          [sortType]: sortBy,
        },
      },
      // {
      //   $or: [
      //     { title: { $regex: query, $options: "i" } },
      //     { description: { $regex: query, $options: "i" } },
      //   ],
      // },
    ]);

    if (!getAllVideoFile) {
      throw new ApiError(400, "Error in getting video file!");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalPage: totalPage,
          totalVideo: totalVideo,
          startingIndex: startingIndex,
          data: getAllVideoFile,
        },
        "Video file fetched successfully!"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in getting all video!");
  }
});

const getAllShorts = asyncHandler(async (req, res) => {
  //TODO: get all shorts based on query, sort, pagination

  try {
    const {
      page = 1,
      limit = 10,
      query = `/^short/`,
      sortBy = 1,
      sortType = "createdAt",
      // userId = req.user._id,
    } = req.query;

    const pages = parseInt(page);
    const limits = parseInt(limit);

    const totalShort = await Short.countDocuments({});
    const totalPage = Math.ceil(totalShort / limits);
    const startingIndex = (pages - 1) * limits;

    // $or: [
    //         { title: { $regex: query, $options: "i" } },
    //         { description: { $regex: query, $options: "i" } },
    //       ],

    const getAllShortFile = await Short.aggregate([
      // {
      //   $match: {
      //     owner: userId,
      //   },
      // },
      {
        $skip: (pages - 1) * limits,
      },
      {
        $limit: limits,
      },
      {
        $sort: {
          [sortType]: sortBy,
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
          totalshort: totalShort,
          startingIndex: startingIndex,
          data: getAllShortFile,
        },
        "short file fetched successfully!"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in getting all short!");
  }
});

export { getAllVideos, getAllShorts };