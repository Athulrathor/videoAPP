import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    deviceName: String,
    platform: String,
    browser: String,
    os: String,
    ipAddress: String,
    userAgent: String,
    location: {
        country: String,
        region: String,
        city: String,
        timezone: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    loginDate: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    logoutDate: Date
}, {
    timestamps: true
});

export const UserSession = mongoose.model('UserSession', userSessionSchema);