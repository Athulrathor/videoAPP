import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Subcriptions } from "../models/subcriptions.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import axios from "axios";
import sendMail from "../utils/nodeMailer.js";
import { generateOTP } from "../../../fronthend/src/libs/otpGenerator.js";

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
    through:false,
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

  try {

    const { email, username, password } = req.body;

      if (!username && !email) {
        throw new ApiError(400, "Username or email is required!");
    }
    
  const user = await User.findOne({
    // $or: [{ email }, { username }],
    email:email
  });

  if (!user) {
    throw new ApiError(400, "User is not found!");
  }

    if (user.through) return;

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
    
  } catch (error) {
    console.log(error.message)
    throw new ApiError(500, "Error in logining user!");
  }
});

const googleLogin = asyncHandler(async (req, res) => {
  try {
    const { googleAccessToken } = req.body;
    if (!googleAccessToken) {
      return res.status(400).json({ message: 'Google access token required' });
    }

    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${googleAccessToken}`
    );

    if (!data.email) {
      return res.status(400).json({ message: 'Email not provided' });
    }

    let user = await User.findOne({ email: data.email });

    console.log(user)

    if (!user) {
      user = await User.create({
        fullname: data.name || 'Google User',
        email: data.email,
        avatar: data.picture || '',
        through: true,
        isOtpVerified: data.email_verified ?? false,
      });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // const accessToken = user.generateAccessToken();
    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({ user,accessToken });
  } catch (error) {
    console.error(error.message);
    throw new ApiError(500,"Error in google login part!");
  }
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
      .clearCookie("authToken", options)
      .clearCookie("userInfo", options)
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

    const userId = req.user._id;

    const currentUser = await User.findById(userId).select("-password -refreshToken");

    if (!currentUser) throw new ApiError(403, "technical fault User not found!");

    return res
      .status(200)
      .json(
        new ApiResponse(200, currentUser, "Current user fetched successfully!")
      );
  } catch (error) {
    throw new ApiError(500, "Error in getuser!");
  }
});

const updateAccountDetail = asyncHandler(async (req, res) => {
  try {
    const { fullname, email,username } = req.body;

    const userData = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          username:username,
          fullname:fullname,
          email: email,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    console.log(req.user._id)
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

    console.log(avatarLocalFile)
    
    if (!req.file) throw new ApiError(400, "Avatar file not found!");

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
    console.log(error.message)
    throw new ApiError(500, "Error in updating avatar!");
  }
});

const updateUserCoverImage = asyncHandler(async (req, res) => {

  try {
    const CoverImageLocalFile = req.file?.path;
     
    if (!req.file) throw new ApiError(400, "CoverImage file not found!");

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

    if (!username?.trim()) {
      throw new ApiError(400, "Username is missing!");
    }

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
          foreignField: "subcribed",
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
          { watchHistory: user[0].watchHistory },
          "Watch history fetched successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error in getting watch history!");
  }
});

const addConntentToHistory = asyncHandler(async (req, res) => {
  try {
    
    const { videoId } = req.body;

    if (!videoId || !isValidObjectId(videoId)) throw new ApiError(400, "videoId not Found!");

    const addedWatchHistory = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        watchHistory: { $ne: videoId }
      },
      {
        $push: {
          watchHistory: videoId
        }
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          addedWatchHistory,
          "Watch history Content Pushed successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error in Pushing Content watch history!");
  }
});

const removeConntentToHistory = asyncHandler(async (req, res) => {
  try {

    const { videoId } = req.body;

    console.log(videoId)

    if (!videoId || !isValidObjectId(videoId)) throw new ApiError(400, "videoId not Found!");

    const removedWatchHistory = await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        $pull: {
          watchHistory: videoId
        }
      },
      { new: true }
    );

    console.log(removeConntentToHistory);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          removedWatchHistory,
          "Watch history Content pulled successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error in Pushing Content watch history!");
  }
});

const clearWatchHistory = asyncHandler(async (req, res) => {
  try {
    const clearedWatchHistory = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { watchHistory: [] } },
      { new: true }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        clearedWatchHistory,
        "Watch history cleared successfully!"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Error in clearing watch history!");
  }
});

const deleteAccount = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(401, "UserId Not found!");
  }

  try {

    const deletedAccount = await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedAccount,
          "Account deleted after 3 days successfully!"
        )
      );

  } catch (error) {
    throw new ApiError(500, "Error in deleting user account!");
  }
})

const generateMailRecoveryPassword = asyncHandler(async (req, res) => {
  const { to } = req.body;

  if (!to) return new ApiError(400, "Recipient email is required!");

  try {

    const user = await User.findOne({ email: to });

    const otp = generateOTP(6);

    if (!user) return new ApiError(404, "User not found with this email \n Please register now!");

    sendMail(to, "Update password confirmation mail","this is the data", otp);

    return res.status(200).json(new ApiResponse(200, otp, "Otp generated successfully!"));
    
  } catch (error) {
    console.error(error);
    return new ApiError(500, "Server error during sending recovery email");
  }
})

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    // const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    // if (!isPasswordCorrect) {
    //   throw new ApiError(400, "Invalid password!");
    // }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully!"));
  } catch (error) {
    throw new ApiError(500, "Error in updating password!");
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
  deleteAccount,

  googleLogin,
  addConntentToHistory,
  removeConntentToHistory,
  clearWatchHistory,
  generateMailRecoveryPassword,
  updatePassword
};
