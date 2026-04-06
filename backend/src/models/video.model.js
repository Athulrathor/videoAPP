import mongoose, { Schema } from "mongoose";
import MongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {Comment} from "./comments.model.js";
import {Like} from "./like.model.js";

const videoSchema = new Schema(
  {
    videoUrl: { type: String, required: true },
    videoPublicId: String,

    thumbnail: { type: String, required: true },
    thumbnailPublicId: String,

    title: { type: String, required: true },
    description: { type: String, required: true },

    duration: { type: Number, required: true },

    views: { type: Number, default: 0 },

    likeCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },

    category: {
      type: String,
      default: "other",
    },

    isPublished: { type: Boolean, default: true },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

videoSchema.index({
  owner: 1,
  createdAt: -1,
  isPublished: 1,
});
videoSchema.index({ owner: 1 });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ views: -1 });
videoSchema.index({ title: "text" });

videoSchema.pre("deleteOne", { document: true }, async function (next) {
  await Comment.deleteMany({ onModel: "Video", contentId: this._id });
  await Like.deleteMany({ video: this._id }); // only if Like model actually stores video
  next();
});

videoSchema.plugin(MongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);