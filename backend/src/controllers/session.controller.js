// controllers/session.controller.js
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Session } from "../models/session.model.js";
import mongoose, { isValidObjectId } from "mongoose";

export const getSessions = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const currentSessionId = req.sessionId;

    let sessions = await Session.getUserSessions(userId);
    // ✅ attach isCurrent flag
    sessions = sessions.map((s) => ({
        ...s.toObject(), // if mongoose doc
        isCurrent: s._id.toString() === currentSessionId?.toString(),
    }));

    if (!sessions || sessions.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No active sessions found."));
    }

    return res.status(200).json(
        new ApiResponse(200, sessions, "Sessions fetched successfully")
    );
});

// DELETE /users/sessions/:sessionId
export const logoutSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    // Block logging out current device from this endpoint
    if (sessionId?.toString() === req.sessionId?.toString()) {
        throw new ApiError(400, "Use /logout to log out your current device.");
    }

    // ✅ Validate sessionId is a valid ObjectId before querying
    if (!isValidObjectId(sessionId)) {
        throw new ApiError(400, "Invalid session ID.");
    }
    console.log("user : ",userId," session : ",sessionId)
    // ✅ Delete directly — checks both userId AND sessionId (ownership)
    const result = await Session.deleteSession(sessionId);
    console.log("result : ",result)
    // ✅ If nothing was deleted, session didn't exist or didn't belong to this user
    if (result.deletedCount === 0) {
        throw new ApiError(404, "Session not found or already removed.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Device logged out successfully."));
});

// DELETE /users/sessions/others
export const logoutOtherSessions = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const currentSessionId = req.sessionId;

    const user = await User.findById(userId);

    await Session.deleteOthers(userId, currentSessionId);
    user.invalidateTokens();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "All other devices logged out."));
});

export const logoutAllSession = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) throw new ApiError(404, "User not found!");

        await Session.deleteAll(user._id);

        await user.invalidateTokens();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'strict' : "lax",
            path: "/", // MUST match login
        };

        return res
            .clearCookie("refreshToken", cookieOptions)
            .json(new ApiResponse(200, {}, "User logout successfully!"));
    } catch (error) {
        console.error(error.message)
        throw new ApiError(500, "error in user logout!");
    }
});