import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {verifyAccessToken} from '../utils/jwtToken.js';

export const verifyToken = asyncHandler(async (req,res, next) => {

  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      throw new ApiError(401,"Unauthorized: Missing access token.");
    }

    const accessToken = auth.split(" ")[1];

    let payload = undefined;

    try {
      payload = await verifyAccessToken(accessToken);
    } catch (error) {
      throw new ApiError(401,error?.name === "TokenExpiredError"
            ? "Access token expired."
            : "Invalid access token.");
    }

    const user = await User.findById(payload.id).select("+tokenVersion");

    if (!user) {
      throw new ApiError(401, "Invalid access token!");
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new ApiError(401,"Session revoked. Please log in again.");
    }

    if (user.isLocked()) {
      throw new ApiError(423,"Account temporarily locked.");
    }

    if (!user.isEmailVerified) {
      throw new ApiError(403,"Please verify your email first.");
    }

    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.username,
      isEmailVerified: user.isEmailVerified,
      tokenVersion: user.tokenVersion,
    };

    req.sessionId = payload.sessionId;

    next();

  } catch (error) {
    console.log('[authenticate] middleware error')
    throw new ApiError(401, error?.message || "Invalid access token!");
  }
});
