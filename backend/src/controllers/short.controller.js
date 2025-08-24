
import mongoose,{ isValidObjectId } from "mongoose";
import {Short} from "../models/short.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary,deleteOnCloudinary, uploadLargeVideo } from "../utils/cloudinary.js";

const getAllShorts = asyncHandler(async (req, res) => {
  //TODO: get all shorts based on query, sort, pagination
  //shortfile thumnail title description duration  view ispublished owner = shortschema

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

const getShortByOwner = asyncHandler(async (req, res) => {
  //TODO: get all shorts based on query, sort, pagination
  //shortfile thumnail title description duration  view ispublished owner = shortschema

  try {
    const {
      page = 1,
      limit = 2,
      query = `/^short/`,
      sortBy = 1,
      sortType = "ascending",
    } = req.query;

    const { userId } = req.params;

    if (!userId || !isValidObjectId(userId)) throw new ApiError(400, "User id is missing!");

    const pages = parseInt(page);
    const limits = parseInt(limit);

    const totalShort = await Short.countDocuments({});
    const totalPage = Math.ceil(totalShort / limits);
    const startingIndex = (pages - 1) * limits;

    const getAllShortFile = await Short.aggregate(
[
  {
    $match: {
      owner: new mongoose.Types.ObjectId(userId),
    }
  },
  {
    $lookup: {
      from: "likes",
      localField: "_id",
      foreignField: "short",
      as: "likesInfo"
    }
  },
  {
    $set: {
      likeCount: { $size: "$likesInfo" }
    }
  },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "short",
      as: "commentInfo"
    }
  },
  {
    $set: {
      commentCount: { $size: "$commentInfo" }
    }
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
            createdAt: 1
          }
        }
      ]
    }
  },
  {
    $project: {
      likesInfo: 0,
      commentInfo: 0
    }
  }
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
          totalShort: totalShort,
          data: getAllShortFile,
        },
        "short file fetched successfully!"
      )
    );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in getting all short!");
  }
});

const publishAShort = asyncHandler(async (req, res) => {
  // TODO: get short, upload to cloudinary, create short

  try {
    const { title, description, isPublished = true } = req.body;

    if (!title || title?.trim() === "") {
      throw new ApiError(401, "Oops title is missing!");
    }

    if (description?.trim() === "") {
      throw new ApiError(400, "Oops description is missing!");
    }

    const shortOptions = {
      resource_type: 'video',
      chunk_size: 6000000,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      invalidate: true,
      eager: [
        { width: 720, height: 1280, crop: 'limit', quality: 'auto', video_codec: 'auto' },
        { width: 640, height: 360, crop: 'limit', quality: 'auto:eco', video_codec: 'auto' },
      ],
      eager_async: true,
      quality: 'auto',
      fetch_format: 'auto'
    };

    const shortFileLocalPath = req.file?.path;

    if (!shortFileLocalPath) {
      throw new ApiError(401, "Short file is missing!");
    }

    const shortUploadedToCloudinary = await uploadOnCloudinary(shortFileLocalPath, shortOptions);

    if (!shortUploadedToCloudinary.url) {
      throw new ApiError(404, "Short url is missing!");
    }

    if (shortUploadedToCloudinary.duration > 60 * 3) {
      throw new ApiError(404, "Short is larger than 3 min!");
    }

    const short = await Short.create({
      shortFile: shortUploadedToCloudinary?.url,
      title: title,
      description: description,
      isPublished: isPublished,
      owner: req.user._id,
      duration: shortUploadedToCloudinary?.duration,
    });

    if (!short) {
      throw new ApiError(400, "Error in pulishing short!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, short, "Short published successfully!"));
  } catch (error) {
    throw new ApiError(500, error.message, "Error in publishing short!");
  }
});

const getShortById = asyncHandler(async (req, res) => {
  //TODO: get short by id

  try {
    const { shortId } = req.params;

    if (!shortId) {
      throw new ApiError(400, "Short id is missing!");
    }

    const shortFile = await Short.findById(shortId);

    if (!shortFile) {
      throw new ApiError(400, "Short is missing!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, shortFile, "Short file fetched successfully!")
      );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in getting short by id!");
  }
});

const updateShort = asyncHandler(async (req, res) => {
  //TODO: update short details like title, description, thumbnail

  try {
    const { shortId } = req.params;

    const newTitle = req.body.title;

    const newDescription = req.body.description;

    const isPublished = req.body.isPublished;

    console.log(req.body)

    if (!shortId) {
      throw new ApiError(404, "Short id is missing!");
    }

    const updateShortFile = await Short.findByIdAndUpdate(
      shortId,
      {
        $set: {
          title: newTitle,
          description: newDescription,
          isPublished: isPublished,
        },
      },
      { new: true }
    )

    if (!updateShortFile) {
      throw new ApiError(401, "Short file is missing!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updateShortFile,
          "Short file update fetched successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in updating short!");
  }
});

const deleteShort = asyncHandler(async (req, res) => {
  //TODO: delete short

  try {
    const { shortId } = req.params;

    if (!shortId) {
      throw new ApiError(401, "Short id is missing!");
    }

    // if (de.owner.toString() !== req.user._id.toString()) {
    //   throw new ApiError(403, "Unauthrized control!");
    // }

    const deleteShortFile = await Short.findByIdAndDelete(shortId);

    if (!deleteShortFile) {
      throw new ApiError(404, "Error in deleting short file!");
    }

    await deleteOnCloudinary(Short.shortFile);

    // if (deleteShortFile.deletedCount === 1) {
    //   return res
    //     .status(200)
    //     .json(
    //       new ApiResponse(
    //         200,
    //         deleteShortFile,
    //         "Short file deleted successfully!"
    //       )
    //     );
    // }

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            deleteShortFile,
            "Short file already deleted!"
          )
        );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in deleting the short!");
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const { shortId } = req.params;

    if (!shortId) {
      throw new ApiError(401, "Short id is missing!");
    }

    const isPublishedStatus = await Short.findById(shortId);

    if (!isPublishedStatus) {
      throw new ApiError(400, "Short file is not published!");
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

const shortViewCounter = asyncHandler(async (req, res) => {
  try {
    const { shortId } = req.params;

    if (!shortId) {
      throw new ApiError(401, "Short id is missing!");
    }

    const updatedShort = await Short.findByIdAndUpdate(
      shortId,
      { $inc: { views: 1 } }, // Increments by 1 on each call
      { new: true }
    );

    if (!updatedShort) {
      throw new ApiError(400, "error counting views!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedShort, "views is fetched successfully!")
      );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in view counter!");
  }
});

export {
  getAllShorts,
  getShortByOwner,
  publishAShort,
  getShortById,
  updateShort,
  deleteShort,
  togglePublishStatus,
  shortViewCounter,
};
