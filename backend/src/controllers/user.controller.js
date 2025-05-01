import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Subcriptions } from "../models/subcriptions.model.js";
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findOne(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generate token!");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    throw new ApiError(400, "All field are is required!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exist!");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const avatarUploadedToCloudinary = await uploadOnCloudinary(avatarLocalPath);
  const coverImageUploadedToCloudinary = await uploadOnCloudinary(
    coverImageLocalPath
  );

  if (!avatarUploadedToCloudinary) {
    throw new ApiError(400, "Avatar file is required!");
  }

  const newUser = await User.create({
    fullname,
    username: username.toLowerCase(),
    avatar: avatarUploadedToCloudinary.url,
    coverImage: coverImageUploadedToCloudinary.url,
    email,
    password,
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refressToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something wrong on registering user!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User regisred successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required!");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(400, "User is not found!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "User loggedin successfully!"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        //UNSET be use kar sakte hai
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logout successfully!"));
  } catch (error) {
    throw new ApiError(500, "error in user logout!");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Unauthorized request!");
  }

  try {
    const decodedRefreshToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id).select(
      "-password"
    );

    if (!user) {
      throw new ApiError(401, "Invalid refresh token!");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, refreshToken, "Access token is refreshed!"));
  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid refresh token!");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid password!");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully!"));
  } catch (error) {
    throw new ApiError(500, "Error in updating password!");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.user, "Current user fetched successfully!")
      );
  } catch (error) {
    throw new ApiError(500, "Error in getuser!");
  }
});

const updateAccountDetail = asyncHandler(async (req, res) => {
  try {
    const { fullname, email } = req.body;

    if (!(fullname && email)) {
      throw new ApiError(400, "All field are required!");
    }

    const userData = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullname,
          email: email,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(200, userData, "Account detail updated successfully!")
      );
  } catch (error) {
    throw new ApiError(500, error.message, "Error in updating account detail!");
  }
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  try {
    const avatarLocalFile = req.file?.path;

    if (!avatarLocalFile) {
      throw new ApiError(400, "Avatar file is mising!");
    }

    const uploadingAvatarToCloudinary = await uploadOnCloudinary(
      avatarLocalFile
    );

    if (!uploadingAvatarToCloudinary.url) {
      throw new ApiError(400, "Error while uploading avatar!");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          avatar: uploadingAvatarToCloudinary.url,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    // await deleteOnCloudinary(oldimage.avatar.url);

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Avatar updated successfully!"));
  } catch (error) {
    throw new ApiError(500, "Error in updating avatar!");
  }
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  try {
    const CoverImageLocalFile = req.file?.path;

    if (!CoverImageLocalFile) {
      throw new ApiError(400, "Avatar file is mising!");
    }

    const uploadingCoverImageToCloudinary = await uploadOnCloudinary(
      CoverImageLocalFile
    );

    if (!uploadingCoverImageToCloudinary.url) {
      throw new ApiError(400, "Error while uploading cover image!");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          coverImage: uploadingCoverImageToCloudinary.url,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    // await deleteOnCloudinary(coverImageLocalPath);

    return res
      .status(200)
      .json(
        new ApiResponse(200,user, "Cover image updated successfully!")
      );
  } catch (error) {
    throw new ApiError(500,error?.message, "Error in updating cover image!");
  }
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    // const { username } = req.query;

    if (!username?.trim()) {
      throw new ApiError(400, "Username is missing!");
    }

    // if (!userId?.trim()) {
    //   throw new ApiError(400, "User ID is missing!");
    // }
    console.log(username);
    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "Subcriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subcribers",
        },
      },
      {
        $lookup: {
          from: "Subcriptions",
          localField: "_id",
          foreignField: "subcriber",
          as: "subcribedTo",
        },
      },
      {
        $addFields: {
          subcribersCount: {
            $size: "$subcribers",
          },
          channelsSubcribedToCount: {
            $size: "$subcribedTo",
          },
          isSubcribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subcribers.subcriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullname: 1,
          username: 1,
          subcribersCount: 1,
          channelsSubcribedToCount: 1,
          isSubcribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
          createdAt: 1,
        },
      },
    ]);

    if (!channel?.length) {
      throw new ApiError(404, "Channel does not exits!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully!")
      );
  } catch (error) {
    throw new ApiError(500, "Error in channel aggregate part!");
  }
});

const getWatchHistory = asyncHandler(async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullname: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner",
                },
              },
            },
          ],
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {watchHistory:user[0].watchHistory},
          "Watch history fetched successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error in getting watch history!");
  }
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetail,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
