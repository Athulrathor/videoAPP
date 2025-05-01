
import { Short } from "../models/short.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary,deleteOnCloudinary } from "../utils/cloudinary.js";

const getAllShorts = asyncHandler(async (req, res) => {
  //TODO: get all shorts based on query, sort, pagination
  //shortfile thumnail title description duration  view ispublished owner = shortschema

  try {
    const {
      page = 1,
      limit = 10,
      query = `/^short/`,
      sortBy = 1,
      sortType = "ascending",
      userId = req.user._id,
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
            { description: { $regex: query, $options: "i" } },
          ],
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

const publishAShort = asyncHandler(async (req, res) => {
  // TODO: get short, upload to cloudinary, create short

  try {
    const { title, description, isPublished = true } = req.body;

    if (!title || title?.trim() === 0) {
      throw new ApiError(401, "Oops title is missing!");
    }

    if (description?.trim() === 0) {
      throw new ApiError(400, "Oops description is missing!");
    }

    const shortFileLocalPath = req.file?.path;

    if (!shortFileLocalPath) {
      throw new ApiError(401, "Short file is missing!");
    }

    const shortUploadedToCloudinary = await uploadOnCloudinary(
      shortFileLocalPath
    );

    // const thumbnailUploadedToCloudinary = await uploadOnCloudinary(
    //   thumbnailFileLocalPath
    // );

    if (!shortUploadedToCloudinary.url) {
      throw new ApiError(404, "Short url is missing!");
    }

    if (!shortUploadedToCloudinary.duration > 60 * 3) {
      throw new ApiError(404, "Short is larger than 3 min!");
    }

    // shortFile: {
    //     public_id: shortUploadedToCloudinary?.public_id,
    //     url: shortUploadedToCloudinary?.url,
    //   },
    //   thumbnail: {
    //     public_id: thumbnailUploadedToCloudinary?.public_id,
    //     url: thumbnailUploadedToCloudinary?.url,
    //   },

    const short = await Short.create({
      shortFile: shortUploadedToCloudinary.url,
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

    if (!shortId) {
      throw new ApiError(404, "Short id is missing!");
    }

    const updateShortFile = await Short.findByIdAndUpdate(
      shortId,
      {
        $set: {
          title: newTitle,
          description: newDescription,
          like: 0,
        },
      },
      { new: true }
    );

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

    const deleteShortFile = await Short.deleteOne({ _id: shortId });

    if (!deleteShortFile) {
      throw new ApiError(404, "Error in deleting short file!");
    }

    await deleteOnCloudinary(Short.shortFile);

    console.log(deleteShortFile)

    if (deleteShortFile.deletedCount === 1) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            deleteShortFile,
            "Short file deleted successfully!"
          )
        );
    }

    if (deleteShortFile.deletedCount === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            deleteShortFile,
            "Short file already deleted!"
          )
        );
    }
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

export {
  getAllShorts,
  publishAShort,
  getShortById,
  updateShort,
  deleteShort,
  togglePublishStatus,
};
