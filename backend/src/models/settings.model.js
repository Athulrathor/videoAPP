import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    watchHistoryPause: {
        type: Boolean,
        default:false,
    },
    watchHistoryRecommentation: {
        type: Boolean,
        default:false,
    },
    watchHistoryInSuggestion: {
        type: Boolean,
        default:false,
    },
    notificationReccommentedContent: {
        type: Boolean,
        deafult: false,
    },
    notificationOfComment: {
        type: Boolean,
        default: true,
    },
    notificationOfLikes: {
        type: Boolean,
        default: true,
    },
    notificationOfSubcriber: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

export const Setting = mongoose.model('settings', settingSchema);