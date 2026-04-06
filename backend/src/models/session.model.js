// models/session.model.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        deviceName: String,
        platform: String,
        browser: String,
        os: String,
        ipAddress: String,
        location: {
            country: String,
            city: String,
            timezone: String,
        },
        lastActive: {
            type: Date,
            default: Date.now,
            index: true,
        },
        loginAt: {
            type: Date,
            default: Date.now,
        },
        logoutDate: {
            type: Date,
            default: undefined,
        },
    },
    { timestamps: true }
);

//  Update every field if needed
sessionSchema.statics.upsertSession = async function ({
    userId,
    sessionId,
    deviceName,
    platform,
    browser,
    os,
    ipAddress,
    location,
}) {
    return await this.findOneAndUpdate(
        { sessionId, user: userId },
        {
            $set: {
                deviceName,
                platform,
                browser,
                os,
                ipAddress,
                location,
                lastActive: new Date(),
            },
            $setOnInsert: {
                loginAt: new Date(),
            },
        },
        {
            upsert: true,
            new: true,
        }
    );
};

//  Update LastActive only
sessionSchema.statics.touch = async function (sessionId) {
    const session = await this.findById(sessionId);

    if (!session) return null;

    session.lastActive = new Date();
    await session.save({ validateBeforeSave: false });

    return session;
};

//  Get all user sessions sorted by lastActive desc
sessionSchema.statics.getUserSessions = async function (userId) {
    return await this.find({ user: userId })
        .sort({ lastActive: -1 });
};

//  Delete a specific sessions
sessionSchema.statics.deleteSession = async function (sessionId) {

    const deletes = await Session.findByIdAndDelete(sessionId);

    return deletes;
};

//  Delete all sessions except current
sessionSchema.statics.deleteOthers = async function (userId, currentSessionId) {
    return await this.deleteMany({
        user: userId,
        _id: { $ne: currentSessionId },
    });
};

//  Delete all sessions for a user
sessionSchema.statics.deleteAll = async function (userId) {
    return await this.deleteMany({ user: userId });
};

// Limit total sessions per user
sessionSchema.statics.limitSessions = async function (userId, max = 5) {
    const sessions = await this.find({ user: userId })
        .sort({ lastActive: -1 });

    if (sessions.length > max) {
        const toDelete = sessions.slice(max);

        await this.deleteMany({
            _id: { $in: toDelete.map((s) => s._id) },
        });
    }
};

export const Session = mongoose.model('Session', sessionSchema);