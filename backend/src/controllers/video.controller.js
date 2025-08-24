import mongoose, { isValidObjectId, Schema } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadLargeVideo, uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  //videofile thumnail title description duration  view ispublished owner = videoschema

  try {
    const {
      page = 1,
      limit = 20,
      query = `/^video/`,
      sortBy = 1,
      sortType = "",
      userId = req.user._id,
    } = req.query;

    const pages = parseInt(page);
    const limits = parseInt(limit);

    const totalVideo = await Video.countDocuments({});
    const totalPage = Math.ceil(totalVideo / limits);
    const startingIndex = (pages - 1) * limits;

    if (query.trim() === "" && totalVideo.length === 0) return;


    const getAllVideoFile = await Video.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          "userInfo.password": 0,
          "userInfo.coverImage": 0,
          "userInfo.refreshToken": 0,
          "userInfo.acessToken": 0,
          // "userInfo.createdAt": 0,
          "userInfo.updatedAt": 0,
          "userInfo.fullname": 0,
          // "userInfo.username": 0,
          "userInfo.email": 0,
        },
      },
      {
        $skip: (pages - 1) * limits,
      },
      {
        $limit: limits,
      },
      {
        $sort: {
          sortBy: sortType === "ascending" ? 1 : -1,
        },
      },
    ]);

    if (!getAllVideoFile) {
      throw new ApiError(400, "Error in getting video file!");
    }

    return res
      .status(200)
      .json(
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

const getAllSuggestion = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  //videofile thumnail title description duration  view ispublished owner = videoschema

  try {
    const { query = `/^video/`} = req.query;

    if (query.trim() === "") return;

    const getSuggestion = await Video.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          title:1
        },
      },
    ]);

    if (!getSuggestion) {
      throw new ApiError(400, "Error in getting all suggetion!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          getSuggestion,
          "suggation fetched file fetched successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in getting all suggestion!");
  }
});

const getVideoByOwner = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  //videofile thumnail title description duration  view ispublished owner = videoschema

  try {
    const {
      page = 1,
      limit = 10,
      query = `/^video/`,
      sortBy = 1,
      sortType = "ascending",
    } = req.query;

    const { userId } = req.params;
    
    if (!userId || !isValidObjectId(userId))
      throw new ApiError(400, "User id is missing!");

    const pages = parseInt(page);
    const limits = parseInt(limit);

    const totalVideo = await Video.countDocuments({ owner: userId });
    const totalPage = Math.ceil(totalVideo / limits);
    const startingIndex = (pages - 1) * limits;

    const getAllVideoFile = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      // {
      //   $match: {
      //     $or: [
      //       { title: { $regex: query, $options: "i" } },
      //       { description: { $regex: query, $options: "i" } },
      //     ],
      //   },
      // },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          "userInfo.password": 0,
          // "userInfo.coverImage": 0,
          "userInfo.refreshToken": 0,
          "userInfo.acessToken": 0,
          // "userInfo.createdAt": 0,
          "userInfo.updatedAt": 0,
          // "userInfo.fullname": 0,
          // "userInfo.username": 0,
          "userInfo.email": 0,
        },
      },
      // {
      //   $skip: (pages - 1) * limits,
      // },
      // {
      //   $limit: limits,
      // },
      // {
      //   $sort: {
      //     sortBy: sortType === "ascending" ? 1 : -1,
      //   },
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
})

const publishAVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description, isPublished = true } = req.body;

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailFileLocalPath = req.files?.thumbnail?.[0]?.path;

    console.log(videoFileLocalPath,thumbnailFileLocalPath)

    const videoOptions = {
      resource_type: 'video',
      chunk_size: 6000000,
      timeout: 600000,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      invalidate: true,
      eager: [
        { width: 1280, height: 720, crop: 'limit', quality: 'auto', video_codec: 'auto' },
        { width: 640, height: 360, crop: 'limit', quality: 'auto:eco', video_codec: 'auto' },
      ],
      eager_async: true,
      quality: 'auto',
      fetch_format: 'auto'
    };

    const imageOptions = {
      resource_type: 'image',
      timeout: 300000,
      transformation: [{ width: 1200, crop: 'limit' }],
      quality: 'auto',
      fetch_format: 'auto',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      invalidate: true,
    };

    console.log('📤 Uploading video file...');
    const videoUploadedToCloudinary = await uploadOnCloudinary(videoFileLocalPath, videoOptions);

    console.log('📤 Uploading thumbnail...');
    const thumbnailUploadedToCloudinary = await uploadOnCloudinary(thumbnailFileLocalPath, imageOptions);

    // fs.unlink(videoFileLocalPath);
    // fs.unlink(thumbnailFileLocalPath);

    // Check results
    if (videoUploadedToCloudinary?.error) {
      throw new ApiError(500, `Video upload failed: ${videoUploadedToCloudinary.error}`);
    }

    console.log(videoUploadedToCloudinary)

    if (!videoUploadedToCloudinary?.secure_url) {
      throw new ApiError(500, "Video upload succeeded but no URL returned!");
    }

    if (thumbnailUploadedToCloudinary?.error) {
      throw new ApiError(500, `Thumbnail upload failed: ${thumbnailUploadedToCloudinary.error}`);
    }

    if (!thumbnailUploadedToCloudinary?.secure_url) {
      throw new ApiError(500, "Thumbnail upload succeeded but no URL returned!");
    }

    // Create video record
    const video = await Video.create({
      videoFile: videoUploadedToCloudinary.secure_url,
      thumbnail: thumbnailUploadedToCloudinary.secure_url,
      title: title.trim(),
      description: description.trim(),
      isPublished: isPublished,
      owner: req.user._id,
      duration: videoUploadedToCloudinary?.duration || 0,
    });

    return res.status(201).json(
      new ApiResponse(201, video, "Video published successfully!")
    );

  } catch (error) {
    console.error('❌ Video publishing error:', error);

    // Clean up files
    const paths = [
      req.files?.videoFile?.[0]?.path,
      req.files?.thumbnail?.[0]?.path
    ].filter(Boolean);

    paths.forEach(path => {
      if (fs.existsSync(path)) {
        try {
          fs.unlinkSync(path);
        } catch { }
      }
    });

    throw error;
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id

  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new ApiError(400, "Video id is missing!");
    }

    // const videoFile = await Video.findById(videoId);

    const videoFile = await Video.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likesInfo",
        },
      },
      {
        $set: {
          likeCount: { $size: "$likesInfo" },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          duration: 1,
          videoFile: 1,
          thumbnail: 1,
          isPublished: 1,
          likeCount: 1,
          views:1,
          createdAt:1,
          owner: {
            _id: "$owner._id",
            username: "$owner.username",
            avatar: "$owner.avatar",
          },
        },
      },
    ]);

    if (!videoFile) {
      throw new ApiError(400, "Video is missing!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, videoFile, "Video file fetched successfully!")
      );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in getting video by id!");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail

  try {
    const { videoId } = req.params;
    const newTitle = req.body.title;
    const newDescription = req.body.description;
    const isPublished = req.body.isPublished;
    const newThumbnail = req.file;

    if (!videoId) {
      throw new ApiError(404, "Video id is missing!");
    }

    // if (!newThumbnail) {
    //   throw new ApiError(404, "new thumbnail is missing!");
    // }

    const imageOptions = {
      folder: 'image_uploads',
      resource_type: 'image',
      transformation: [
        { width: 1200, crop: 'limit' }, // limit width to 1200px max for large images
      ],
      quality: 'auto',      // automatically adjust quality for best balance
      fetch_format: 'auto', // auto convert format (e.g., WebP if supported)
      overwrite: true,
      invalidate: true,
      use_filename: true,
      unique_filename: false,
    };

    const newThumbnailUplouadedToCloudinary = await uploadOnCloudinary(
      newThumbnail.path,imageOptions
    );

    if (newThumbnail) {
      await Video.findByIdAndUpdate(
        videoId,
        {
          $set: {
            thumbnail: newThumbnailUplouadedToCloudinary.url,
          }
        },
        { new: true }
      );
    }

    const updateVideoFile = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title: newTitle,
          description: newDescription,
          isPublished: isPublished,
        },
      },
      { new: true }
    );

    if (!updateVideoFile) {
      throw new ApiError(401, "Video file is missing!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updateVideoFile,
          "Video file update fetched successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in updating video!");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video

  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new ApiError(401, "Video id is missing!");
    }

    // if (de.owner.toString() !== req.user._id.toString()) {
    //   throw new ApiError(403, "Unauthrized control!");
    // }

    const deleteVideoFile = await Video.findByIdAndDelete(videoId);

    if (!deleteVideoFile) {
      throw new ApiError(404, "Error in deleting video file!");
    }

    await deleteOnCloudinary(Video.videoFile);
    await deleteOnCloudinary(Video.thumbnail);

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            deleteVideoFile,
            "Video file deleted successfully!"
          )
        );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in deleting the video!");
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new ApiError(401, "Video id is missing!");
    }

    const isPublishedStatus = await Video.findById(videoId);

    if (!isPublishedStatus) {
      throw new ApiError(400, "Video file is not published!");
    }

    if (isPublishedStatus.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Unauthrized control!");
    }

    isPublishedStatus.isPublished = !isPublishedStatus.isPublished;

    await isPublishedStatus.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {isPublished:isPublishedStatus.isPublished},
          "Status is fetched successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in toggle published status!");
  }
});

const videoViewCounter = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new ApiError(401, "Video id is missing!");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } }, // Increments by 1 on each call
      { new: true }
    );

    if (!updatedVideo) {
      throw new ApiError(400, "error counting views!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedVideo, "views is fetched successfully!")
      );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in view counter!");
  }
});


export {
  getAllVideos,
  getVideoByOwner,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  videoViewCounter,
  getAllSuggestion
};
