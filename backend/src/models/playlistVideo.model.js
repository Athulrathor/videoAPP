import mongoose, { Schema } from "mongoose";

const playlistVideoSchema = new Schema(
    {
        playlist: {
            type: Schema.Types.ObjectId,
            ref: "Playlist",
            index: true,
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        order: {
            type: Number,
            index: true,
        },
    },
    { timestamps: true }
);

export const PlaylistVideo = mongoose.model(
    "PlaylistVideo",
    playlistVideoSchema
);