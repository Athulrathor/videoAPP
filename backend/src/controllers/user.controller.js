import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { sendVerificationEmail } from "../utils/email.js";
import crypto from 'crypto';
import DeviceDetector from "node-device-detector";
import geoip from "geoip-lite";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtToken.js";
import { Session } from "../models/session.model.js";
import { Video } from "../models/video.model.js";
import { Short } from "../models/short.model.js";
import { deleteOnCloudinary } from "../utils/cloudinary.js";

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
});

// REGISTERS
// User Register
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullname, username, email, password, avatarUrl, avatarPublicId, coverImageUrl, coverImagePublicId } = req.body;

    if ([fullname, username, email, password].some((f) => !f?.trim())) {
      throw new ApiError(400, "All fields are required!");
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      throw new ApiError(400, "Invalid username format!");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new ApiError(400, "Invalid email format!");
    }

    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password)) {
      throw new ApiError(400, "Password must include uppercase, lowercase and number!");
    }


    const normalizedEmail = decodeURIComponent(email).toLowerCase().trim();

    let user = undefined;

    try {
      user = await User.create({
        fullname,
        username: username.toLowerCase().trim(),
        email: normalizedEmail,
        password,
        avatarUrl: avatarUrl,
        coverImageUrl: coverImageUrl,
        avatarPublicId: avatarPublicId,
        coverImagePublicId: coverImagePublicId,
        through: false,

        isActive: false,
        lastActivity: new Date(),
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError(409, "User already exists!");
      }
    }

    const verifyToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // const verifyUrl = `${process.env.BASE_URL}/api/v1/user/verify-mail?token=${verifyToken}`;
    const toEmail = user.email;
    const subject = "Verify your email";
    const token = verifyToken;
    const htmlContent = undefined;
    await sendVerificationEmail(toEmail, subject, htmlContent, token);

    return res.status(201).json(
      new ApiResponse(201, "User registered!  Please check your email to verify your account.")
    );
  } catch (error) {
    console.error("[registerUser] server error: ", error.message);
    throw new ApiError(500, "Internal server error", error.message);
  }
});

//  User Register Verifications
export const verifyRegisterMail = asyncHandler(async (req, res) => {

  const { token, email } = req.query;

  if (!token || !email) {
    throw new ApiError(401, "Verification token is missing");
  }

  try {

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({ email: decodeURIComponent(email) });

    if (!user) {
      throw new ApiError(401, "Invalid or expired token");
    }

    user.isActive = true;
    await user.verifyEmailToken(token);
    user.isEmailVerified = true;
    await user.save();

    res.json(new ApiResponse(200, "Email verified! Login to your account!"));

  } catch (error) {
    console.error("[verifyRegisterMail] server error!: ", error.message);
    throw new ApiError(500, 'Internal server error!');
  }
});

//  LOGIN
//  User Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"];
  const result = detector.detect(userAgent);

  if (!email) throw new ApiError(400, "Email is required!");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new ApiError(400, "Invalid email format!");
  if (!password) throw new ApiError(400, "Password is required!");

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail })
    .select("+password +tokenVersion +refreshToken +twoFactorEnabled");

  if (!user) throw new ApiError(401, "Invalid credentials!");

  const deviceToken = req.cookies.deviceToken;

  if (user.isLocked()) {
    const minutesLeft = user.lockUntil
      ? Math.ceil((user.lockUntil.getTime() - Date.now()) / 60_000)
      : 30;
    throw new ApiError(423, `Account is temporarily locked. Try again in ${minutesLeft} minute(s).`);
  }
  if (user.through) throw new ApiError(400, "Use social login!");
  if (!user.isEmailVerified) throw new ApiError(403, "Please verify your email before logging in!");
  if (result.bot) throw new ApiError(403, "Bots are not allowed");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    if (!user.failedLoginAttempts) user.failedLoginAttempts = [];
    user.failedLoginAttempts.push({ ip: clientIp, timestamp: new Date() });
    if (user.failedLoginAttempts.length > 10) user.failedLoginAttempts.shift();
    await user.incrementLoginAttempts();
    throw new ApiError(401, "Invalid credentials!");
  }

  if (user.scheduledDeletion) throw new ApiError(403, "Account scheduled for deletion");

  if (user.twoFactorEnabled && !user.isTrustedDevice(deviceToken)) {
    const trusted = user.isTrustedDevice(req.cookies.deviceToken);

    if (!trusted) {
      const code = await user.generateTwoFactorCode();

      const otpTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #1a1a1a;">Your Login Verification Code</h2>
        <p style="color: #555;">Use the OTP below to complete your login. Expires in <strong>5 minutes</strong>.</p>
        <div style="margin: 24px 0; text-align: center;">
          <span style="font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #4F46E5; background: #f5f5ff; padding: 12px 24px; border-radius: 8px; border: 1px dashed #4F46E5;">
            ${code}
          </span>
        </div>
        <p style="color: #777; font-size: 14px;">Do not share this code with anyone.</p>
      </div>
    `;
      await sendVerificationEmail(user.email, "Your Login OTP", otpTemplate, undefined);
      return res.json({ requires2FA: true });
    }
  }

  const geo = geoip.lookup(clientIp);

  const resolvedDeviceName =
    result.device?.brand && result.device?.model
      ? `${result.device.brand} ${result.device.model}`
      : result.client?.name && result.os?.name
        ? `${result.client.name} on ${result.os.name}`
        : result.client?.name || "Unknown Device";

  // ✅ Always create a fresh session on every login
  const session = await Session.create({
    user: user._id,
    deviceName: resolvedDeviceName,
    platform: result.device?.type || "desktop",
    browser: result.client?.name || "Unknown",
    os: result.os?.name || "Unknown",
    ipAddress: clientIp,
    location: geo
      ? { country: geo.country, city: geo.city, timezone: geo.timezone }
      : {},
    lastActive: new Date(),
    loginAt: new Date(),
  });

  // ✅ Enforce max 5 sessions per user (drops oldest beyond limit)
  await Session.limitSessions(user._id, 5);

  const accessToken = generateAccessToken(user._id, user.tokenVersion, user.role, session._id);
  const refreshToken = generateRefreshToken(user._id, user.tokenVersion, session._id);

  user.refreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

  await user.resetLoginAttempts();
  await user.save({ validateBeforeSave: false });

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken -tokenVersion"
  );

  return res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    })
    .json(new ApiResponse(200, { user: loggedUser, accessToken,sessionId: session._id }, "Login successful!"));
});
//  User Login Verifications
export const verifyLoginUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"];
  const result = detector.detect(userAgent);

  if (!email || !otp) throw new ApiError(400, "Email and OTP required");

  const user = await User.findOne({ email: email.toLowerCase().trim() })
    .select("+twoFactorCode +twoFactorExpiry +twoFactorAttempts +twoFactorLastAttempt");

  if (!user) throw new ApiError(401, "User not found");

  let isValid = await user.verifyOtpTwoFactor(otp);

  if (!isValid) {
    isValid = await user.verifyBackupCode(otp);
  }

  if (!isValid) throw new ApiError(401, "Invalid OTP or backup code");

  if (trustDevice) {
    const token = await user.addTrustedDevice();

    res.cookie("deviceToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }

  const geo = geoip.lookup(clientIp);

  const resolvedDeviceName =
    deviceName ||
    (result.device?.brand && result.device?.model
      ? `${result.device.brand} ${result.device.model}`
      : result.client?.name && result.os?.name
        ? `${result.client.name} on ${result.os.name}`
        : result.client?.name
          ? result.client.name
          : "Unknown Device");

  const session = await Session.create({
    user: user._id,
    deviceName: resolvedDeviceName,
    platform: platform || result.device?.type || "desktop",
    browser: browser || result.client?.name || "Unknown",
    os: os || result.os?.name || "Unknown",
    ipAddress: clientIp,
    location: geo
      ? {
        country: geo.country,
        city: geo.city,
        timezone: geo.timezone,
      }
      : {},
    lastActive: new Date(),
    loginAt: new Date()
  });

  await Session.limitSessions(user._id, 5);

  const accessToken = generateAccessToken(user._id, user.tokenVersion, user.role, session._id);
  const refreshToken = generateRefreshToken(user._id, user.tokenVersion, session._id);

  user.refreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

  await user.resetLoginAttempts();
  await user.save({ validateBeforeSave: false });

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken -tokenVersion"
  );

  return res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    })
    .json(new ApiResponse(200, { user: loggedUser, accessToken,sessionId:session._id }, "Login successful!"));
});

//  Logout current user session
export const logOutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) throw new ApiError(404, "User not found");

  // Remove only the current session using sessionId from JWT
  if (!req.sessionId) throw new ApiError(404, "User session not found!");

  await Session.deleteSession(req.user.id, req.sessionId);

  user.refreshToken = undefined;
  user.tokenVersion += 1;       // ✅ was bug: "user.tokenVersion + 1" never assigned

  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  };

  return res
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken || typeof incomingRefreshToken !== 'string') {
    throw new ApiError(400, "Unauthorized request!");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  };

  try {
    const decodedToken = crypto
      .createHash("sha256")
      .update(incomingRefreshToken)
      .digest("hex");

    let payload = undefined;

    try {
      payload = verifyRefreshToken(incomingRefreshToken);
    } catch (error) {
      console.error(error.message)
      res.clearCookie('refreshToken', options);
      throw new ApiError(401, 'Session expired or invalid. Please log in again.');
    }

    if (!payload?.id || typeof payload.tokenVersion !== 'number' || !payload?.sessionId) {
      res.clearCookie('refreshToken', options);
      throw new ApiError(401, 'Malformed token. Please log in again.');
    }

    const user = await User.findById(payload?.id).select(
      "+tokenVersion +refreshToken"
    );

    if (decodedToken !== user.refreshToken) {
      // 🚨 token reuse attack detected
      await user.invalidateTokens();

      res.clearCookie("refreshToken", options);

      throw new ApiError(401, "Token reuse detected. Please login again.");
    }

    if (!user) {
      res.clearCookie('refreshToken', options);
      throw new ApiError(401, "Session invalid. Please log in again.");
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      res.clearCookie('refreshToken', options);
      throw new ApiError(401, 'Session has been revoked. Please log in again.');
    }

    if (user.isLocked()) {
      res.clearCookie('refreshToken', options);
      throw new ApiError(423, 'Account is locked. Please contact support or try again later.');
    }


    if (!user.isEmailVerified) {
      res.clearCookie('refreshToken', options);
      throw new ApiError(403, 'Email verification required. Please verify your email address.');
    }

    // ─── Carry the same sessionId forward ───────────────────────
    const sessionId = payload.sessionId;

    // Touch lastActive for this session
    await Session.touch(sessionId);

    const newAccessToken = generateAccessToken(user.id, user.role, user.tokenVersion, sessionId);
    const newRefreshToken = generateRefreshToken(user.id, user.tokenVersion, sessionId);
    console.log(newAccessToken)
    user.refreshToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await user.save({ validateBeforeSave: false });

    return res
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken: newAccessToken,sessionId }, "Access token is refreshed!"));
  } catch (error) {
    console.error('[refreshAccessToken] server error: ', error.message);
    res.clearCookie("refreshToken", options);
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new ApiError(400, "All fields are required!");
    }

    if (newPassword !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match!");
    }

    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(newPassword)) {
      throw new ApiError(
        400,
        "Password must include uppercase, lowercase and number!"
      );
    }

    const user = await User.findById(req.user?.id).select("+password +passwordHistory");

    if (!user) {
      throw new ApiError(404, "User not found!");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Old password is incorrect!");
    }

    const canChange = await user.canChangePassword(newPassword);

    if (!canChange) {
      throw new ApiError(400, "You cannot reuse your previous passwords!");
    }

    user.password = newPassword;
    user.tokenVersion += 1;
    await user.save();

    return res.json(
      new ApiResponse(200, {}, "Password changed successfully! Please login again.")
    );
  } catch (error) {
    console.error('[changePassword] server error!',error.message);
    throw new ApiError(500, "Internal server error")
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw new ApiError(401, "Unauthorized");
    }

    const [user, videosCount, shortsCount] = await Promise.all([
      User.findById(userId)
        .select("-password -refreshToken -passwordHistory -backupCodes -trustedDevices")
        .populate({
          path: "watchHistory.videos",
          select:
            "videoUrl thumbnail title description duration views likeCount commentsCount visibility category isPublished createdAt updatedAt owner",
          populate: {
            path: "owner",
            select: "username _id avatar subscriberCount",
          },
        })
        .populate({
          path: "watchHistory.shorts",
          select:
            "shortUrl title description duration views likeCount commentsCount visibility isPublished createdAt updatedAt owner",
          populate: {
            path: "owner",
            select: "username _id avatar subscriberCount",
          },
        }),

      Video.countDocuments({ owner: userId }),
      Short.countDocuments({ owner: userId }),
    ]);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const data = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      avatar: user.avatar,
      coverImage: user.coverImage,
      subscriberCount: user.subscriberCount ?? 0,
      channelsSubscribedToCount: 0,
      videosCount,
      shortsCount,
      isSubscribed: false,
      through: user.through ?? false,
      watchHistory: {
        videos: user.watchHistory?.videos || [],
        shorts: user.watchHistory?.shorts || [],
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Current user fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Error in getCurrentUser");
  }
});

export const updateAccountDetail = asyncHandler(async (req, res) => {
  const { fullname, email, username } = req.body;

  if (!fullname || !email || !username) {
    throw new ApiError(400, "All fields are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
    _id: { $ne: req.user._id },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(409, "Email already in use");
    }
    if (existingUser.username === username) {
      throw new ApiError(409, "Username already taken");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname: fullname.trim(),
        email: email.toLowerCase(),
        username: username.trim().toLowerCase(),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedUser,
      "Account details updated successfully"
    )
  );
});

export const uploadUserAvatar = asyncHandler(async (req, res) => {
  try {
    const { url, public_id } = req.body;

    if (!url || !public_id) {
      throw new ApiError(400, "Avatar data is required");
    }

    if (!url.includes("res.cloudinary.com")) {
      throw new ApiError(400, "Invalid media source");
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.avatarPublicId) {
      // await cloudinary.v2.uploader.destroy(user.avatarPublicId, {
      //   resource_type: "image",
      // });
      await deleteOnCloudinary(user.avatarPublicId, "image");
    }

    user.avatar = url;
    user.avatarPublicId = public_id;

    await user.save();

    return res.status(200).json(
      new ApiResponse(200, user.avatar, "Avatar updated successfully")
    );
  } catch (error) {
    console.error('[uploadUserAvatar] server error: ', error.message);
    throw new ApiError(500, "Error in updating avatar!");
  }
});

export const uploadUserCoverImage = asyncHandler(async (req, res) => {

  try {
    const { url, public_id } = req.body;

    if (!url || !public_id) {
      throw new ApiError(400, "Cover image data is required");
    }

    if (!url.includes("res.cloudinary.com")) {
      throw new ApiError(400, "Invalid media source");
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.coverImage?.public_id) {
      // await cloudinary.v2.uploader.destroy(
      //   user.coverImage.public_id,
      //   { resource_type: "image" }
      // );
      await deleteOnCloudinary(user.coverImagePublicId, "image");
    }

    user.coverImage = url;
    user.coverImagePublicId = public_id;

    await user.save();

    return res.status(200).json(
      new ApiResponse(200, user.coverImage, "Cover image updated successfully")
    );
  } catch (error) {
    console.error('[uploadUserCoverImage] server error: ', error.message);
    throw new ApiError(500, error?.message, "Error in updating cover image!");
  }
});

export const getUserChannelProfile = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;

    if (!username?.trim()) {
      throw new ApiError(400, "Username is missing");
    }

    const currentUserId =
      req.user?.id && mongoose.isValidObjectId(req.user.id)
        ? new mongoose.Types.ObjectId(req.user.id)
        : null;

    const channel = await User.aggregate([
      {
        $match: {
          username: username.trim().toLowerCase(),
        },
      },

      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },

      {
        $lookup: {
          from: "subscriptions",
          let: { channelId: "$_id" },
          pipeline: currentUserId
            ? [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$subscribedTo", "$$channelId"] },
                      { $eq: ["$subscriber", currentUserId] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ]
            : [{ $limit: 1 }],
          as: "subscriptionStatus",
        },
      },

      {
        $lookup: {
          from: "videos",
          let: { ownerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$owner", "$$ownerId"] },
                isPublished: true,
                visibility: "public",
              },
            },
            { $count: "count" },
          ],
          as: "videosMeta",
        },
      },

      {
        $lookup: {
          from: "shorts",
          let: { ownerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$owner", "$$ownerId"] },
                isPublished: true,
                visibility: "public",
              },
            },
            { $count: "count" },
          ],
          as: "shortsMeta",
        },
      },

      {
        $lookup: {
          from: "videos",
          localField: "watchHistory.videos",
          foreignField: "_id",
          as: "watchHistoryVideos",
        },
      },
      {
        $lookup: {
          from: "shorts",
          localField: "watchHistory.shorts",
          foreignField: "_id",
          as: "watchHistoryShorts",
        },
      },

      {
        $addFields: {
          channelsSubscribedToCount: { $size: "$subscribedTo" },
          videosCount: {
            $ifNull: [{ $arrayElemAt: ["$videosMeta.count", 0] }, 0],
          },
          shortsCount: {
            $ifNull: [{ $arrayElemAt: ["$shortsMeta.count", 0] }, 0],
          },
          isSubscribed: { $gt: [{ $size: "$subscriptionStatus" }, 0] },
          watchHistory: {
            videos: "$watchHistoryVideos",
            shorts: "$watchHistoryShorts",
          },
        },
      },

      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          fullname: 1,
          avatar: 1,
          coverImage: 1,
          subscriberCount: 1,
          through: 1,
          channelsSubscribedToCount: 1,
          videosCount: 1,
          shortsCount: 1,
          isSubscribed: 1,
          watchHistory: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (!channel.length) {
      throw new ApiError(404, "Channel does not exist");
    }

    return res.status(200).json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, error.message || "Error fetching channel profile");
  }
});

export const getWatchHistory = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "watchHistory.videos",
        populate: {
          path: "owner",
          select: "avatar username fullname createdAt",
        },
      })
      .populate({
        path: "watchHistory.shorts",
        populate: {
          path: "owner",
          select: "avatar username fullname createdAt",
        },
      });

    if (!user) {
      throw new ApiError(404, "User not found!");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          videos: user.watchHistory.videos,
          shorts: user.watchHistory.shorts,
        },
        "Watch history fetched successfully!"
      )
    );
  } catch (error) {
    console.error("[getWatchHistory] error:", error.message);
    throw new ApiError(500, "Error in getting watch history!");
  }
});

export const addContentToHistory = asyncHandler(async (req, res) => {
  try {
    const { videoId, shortId } = req.body;

    if (!videoId && !shortId) {
      throw new ApiError(400, "videoId or shortId is required!");
    }

    let updateQuery = {};

    // 🎬 VIDEO HISTORY
    if (videoId) {
      if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
      }

      updateQuery = {
        $pull: { "watchHistory.videos": videoId }, // 🔥 remove duplicate
      };

      await User.findByIdAndUpdate(req.user._id, updateQuery);

      updateQuery = {
        $push: {
          "watchHistory.videos": {
            $each: [videoId],
            $position: 0, // latest first
          },
        },
      };
    }

    // 🎥 SHORT HISTORY
    if (shortId) {
      if (!isValidObjectId(shortId)) {
        throw new ApiError(400, "Invalid shortId!");
      }

      updateQuery = {
        $pull: { "watchHistory.shorts": shortId },
      };

      await User.findByIdAndUpdate(req.user._id, updateQuery);

      updateQuery = {
        $push: {
          "watchHistory.shorts": {
            $each: [shortId],
            $position: 0,
          },
        },
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateQuery,
      { new: true }
    ).select("watchHistory");

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser.watchHistory,
        "Watch history updated successfully!"
      )
    );
  } catch (error) {
    console.error("[addContentToHistory] error:", error.message);
    throw new ApiError(500, "Error in updating watch history!");
  }
});

export const removeContentToHistory = asyncHandler(async (req, res) => {
  try {
    const { videoId, shortId } = req.body;

    if (!videoId && !shortId) {
      throw new ApiError(400, "videoId or shortId is required!");
    }

    let updateQuery = {};

    // 🎬 REMOVE VIDEO
    if (videoId) {
      if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
      }

      updateQuery = {
        $pull: {
          "watchHistory.videos": videoId,
        },
      };
    }

    // 🎥 REMOVE SHORT
    if (shortId) {
      if (!isValidObjectId(shortId)) {
        throw new ApiError(400, "Invalid shortId!");
      }

      updateQuery = {
        $pull: {
          "watchHistory.shorts": shortId,
        },
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateQuery,
      { new: true }
    ).select("watchHistory");

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser.watchHistory,
        "Watch history content removed successfully!"
      )
    );
  } catch (error) {
    console.error("[removeContentToHistory] error:", error.message);
    throw new ApiError(500, "Error in removing content from watch history!");
  }
});

export const clearWatchHistory = asyncHandler(async (req, res) => {
  try {
    const clearedWatchHistory = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "watchHistory.videos": [],
          "watchHistory.shorts": [],
        },
      },
      { new: true }
    ).select("watchHistory");

    return res.status(200).json(
      new ApiResponse(
        200,
        clearedWatchHistory.watchHistory,
        "Watch history cleared successfully!"
      )
    );
  } catch (error) {
    console.error("[clearWatchHistory] error:", error.message);
    throw new ApiError(500, "Error in clearing watch history!");
  }
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Valid userId required!");
  }

  // 🔐 Only allow self-delete (important security fix)
  if (req.user._id.toString() !== userId) {
    throw new ApiError(403, "Unauthorized account deletion!");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found!");
    }

    // 📅 schedule deletion after 3 days
    const deletionDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    user.scheduledDeletion = true;
    user.deletionAt = deletionDate;

    // 🔥 invalidate tokens (logout everywhere)
    user.tokenVersion += 1;

    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          scheduledDeletion: true,
          deletionAt: deletionDate,
        },
        "Account scheduled for deletion in 3 days"
      )
    );
  } catch (error) {
    console.error("[deleteAccount] error:", error.message);
    throw new ApiError(500, "Error scheduling account deletion!");
  }
});

export const verifypassword = asyncHandler(async (req, res) => {
  const { currentPassword } = req.query;
  try {
    const check = await User.findById(req.user._id);

    if (!check) ApiError(400, "No user Account!");

    const result = await check.isPasswordCorrect(currentPassword);

    if (!result) throw new ApiError(401, "Invalid password!");

    res.json(new ApiResponse(200, result, "check successfully fetched!"));
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error verifying password', error: error.message });
  }
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { googleAccessToken } = req.body;
  if (!googleAccessToken) throw new ApiError(400, "Google access token required");

  const { data } = await fetch.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${googleAccessToken}`
  );

  if (!data.email) throw new ApiError(400, "Email not provided by Google");

  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"];
  const result = detector.detect(userAgent);
  const geo = geoip.lookup(clientIp);

  let user = await User.findOne({ email: data.email });

  if (!user) {
    user = await User.create({
      fullname: data.name || "Google User",
      email: data.email,
      avatar: data.picture || "",
      through: true,
      isEmailVerified: data.email_verified,
    });
  }

  const resolvedDeviceName =
    deviceName ||
    (result.device?.brand && result.device?.model
      ? `${result.device.brand} ${result.device.model}`
      : result.client?.name && result.os?.name
        ? `${result.client.name} on ${result.os.name}`
        : result.client?.name
          ? result.client.name
          : "Unknown Device");

  const session = await Session.create({
    user: user._id,
    deviceName: resolvedDeviceName,
    platform: platform || result.device?.type || "desktop",
    browser: browser || result.client?.name || "Unknown",
    os: os || result.os?.name || "Unknown",
    ipAddress: clientIp,
    location: geo
      ? {
        country: geo.country,
        city: geo.city,
        timezone: geo.timezone,
      }
      : {},
    lastActive: new Date(),
    loginAt: new Date()
  });

  await Session.limitSessions(user._id, 5);

  const accessToken = generateAccessToken(user._id, user.tokenVersion, user.role, session._id);
  const refreshToken = generateRefreshToken(user._id, user.tokenVersion, session._id);

  user.refreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

  await user.save({ validateBeforeSave: false });

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken -tokenVersion"
  );

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    })
    .json(new ApiResponse(200, { user: loggedUser, accessToken }, "Google login successful!"));
});

export const forgetPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required.");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new ApiError(400, "Invalid email format!");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return 200 — prevents email enumeration
    if (!user) {
      return res.status(200).json(new ApiResponse(200, "If that email is registered, a reset link has been sent."));
    }

    // Check if account is locked
    if (user.isLocked()) {
      throw new ApiError(423, "Account is temporarily locked. Try again later.");
    }

    // Check scheduled for deletion
    if (user.scheduledDeletion) {
      throw new ApiError(403, "This account is scheduled for deletion.");
    }

    // Uses the model method — generates raw token, stores SHA-256 hash + 15min expiry
    const rawToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send the RAW token in the URL — never the hash
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${rawToken}`;

    await sendVerificationEmail({
      toEmail: user.email,
      subject: "Password Reset Request",
      htmlContent: `
        <p>Hi ${user.fullname},</p>
        <p>You requested a password reset. Click the link below (valid for <strong>15 minutes</strong>):</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
      `, token: undefined
    });

    return res.status(200).json(new ApiResponse(200, "If that email is registered, a reset link has been sent."));

  } catch (error) {
    console.error("forgotPassword error:", error);
    throw new ApiError(500, "Something went wrong. Please try again.");
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Basic input validation
    if (!token || !password || !confirmPassword) {
      throw new ApiError(400, "Token, password, and confirmPassword are required.");
    }

    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match.");
    }

    if (password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters.");
    }

    // Hash the incoming raw token — same SHA-256 used in generatePasswordResetToken()
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user by hashed token AND check expiry in one query
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: Date.now() },   // not yet expired
    }).select("+password +passwordHistory +passwordChangedAt");

    if (!user) {
      throw new ApiError(400, "Reset token is invalid or has expired.");
    }

    // Check password history — canChangePassword() uses bcrypt compare on last 5
    const canChange = await user.canChangePassword(password);
    if (!canChange) {
      throw new ApiError(400, "You cannot reuse any of your last 5 passwords.");
    }

    // Set new password — pre-save hook will bcrypt hash it and update passwordHistory
    user.password = password;

    // Clear reset token fields
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;

    // Invalidate all existing sessions by bumping tokenVersion
    user.tokenVersion += 1;

    await user.save();

    return res.status(200).json(new ApiResponse(200, "Password reset successful. Please log in with your new password."));

  } catch (error) {
    console.error("resetPassword error:", error);
    throw new ApiError(500, "Something went wrong. Please try again.");
  }
});


export const setup2FA = asyncHandler(async (req, res) => {
  try {
    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(req.user.id).select("+backupCodes");

    if (!user) throw new ApiError(404, "User not found");
    if (user.twoFactorEnabled) throw new ApiError(400, "2FA already enabled");

    const otp = await user.generateTwoFactorCode();

    const codes = Array.from({ length: 8 }).map(() => {
      const raw = crypto.randomBytes(4).toString("hex").toUpperCase();

      return {
        raw,
        hashed: crypto.createHash("sha256").update(raw).digest("hex"),
      };
    });

    // Prepare for saving
    const backupCodesToSave = codes.map(c => ({ code: c.hashed, used: false }));
    const backupCodesRaw = codes.map(c => c.raw);

    // Atomically update the user in DB
    await User.findByIdAndUpdate(
      user._id,
      { backupCodes: backupCodesToSave },
      { new: true, runValidators: false }
    );

    // 📩 send OTP (example)
    console.log("OTP:", otp); // replace with email/SMS service
    console.log("Give these to the user once:", backupCodesRaw);

    res.json(
      new ApiResponse(
        200,
        {
          backupCodes: backupCodesRaw,
          message: "OTP sent to your email",
        },
        "Verify OTP to enable 2FA"
      )
    );
  } catch (error) {
    console.error("[setup2FA] server error: ", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const verifyAndEnable2FA = asyncHandler(async (req, res) => {
  try {
    const { otp } = req.body;

    if (!req.user?.id) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(req.user.id).select("+twoFactorCode");

    if (!user) throw new ApiError(404, "User not found");

    const valid = await user.verifyOtpTwoFactor(otp);
    if (!valid) throw new ApiError(400, "Invalid or expired OTP");

    await user.enableTwoFactor();

    res.json(new ApiResponse(200, {}, "2FA enabled successfully"));
  } catch (error) {
    console.error("[verifyAndEnable2FA] server error: ", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const verify2FAOtp = asyncHandler(async (req, res) => {
  try {
    const { otp, trustDevice } = req.body;

    const user = await User.findById(req.user.id).select(
      "+twoFactorCode +backupCodes"
    );

    let valid = await user.verifyOtpTwoFactor(otp);

    // 🔁 fallback to backup codes
    if (!valid) {
      valid = await user.verifyBackupCode(otp);
    }

    if (!valid) {
      throw new ApiError(400, "Invalid OTP or backup code");
    }

    let deviceToken = null;

    // 📱 Trusted device
    if (trustDevice) {
      deviceToken = await user.addTrustedDevice();

      res.cookie("deviceToken", deviceToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    return res.status(200).json(new ApiResponse(200, "2FA verified"));
  } catch (error) {
    console.error("[verify2FAOtp] server error: ", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const disable2FA = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;
    console.log(password)
    const user = await User.findById(req.user.id).select("+password");
    if (!user) throw new ApiError(404, "User not found");

    await user.disableTwoFactor(password);

    return res.status(200).json(new ApiResponse(200, "2FA disabled"));
  } catch (error) {
    console.error("[disable2FA ] server error: ", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const regenerateBackupCodes = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+backupCodes");

    const codes = await user.generateBackupCodes();

    return res.status(200).json(new ApiResponse(200, { backupCodes: codes }));
  } catch (error) {
    console.error("[regenerateBackupCodes] server error: ", error.message);
    throw new ApiError(500, "Internal server error!");
  }
});