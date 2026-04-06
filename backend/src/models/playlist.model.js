import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // for search
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    privacy: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
      index: true,
    },

    // 🔥 denormalized fields (important for performance)
    videoCount: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String, // store first video thumbnail
    },
  },
  { timestamps: true }
);

playlistSchema.index({ owner: 1, createdAt: -1 });
playlistSchema.index({ privacy: 1, createdAt: -1 });
playlistSchema.index({ title: "text", description: "text" }); // search

export const Playlist = mongoose.model("Playlist", playlistSchema);