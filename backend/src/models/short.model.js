import mongoose,{Schema} from "mongoose";
import MongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {Comment} from "./comments.model.js";
import {Like} from "./like.model.js";

const shortSchema = new Schema(
  {
    shortUrl: {
      type: String,
      required: true,
    },
    shortPublicId: String,
    title: {
      type: String,
      required: true,
    },
    likeCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    description: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },
    duration: { type: Number, required: true }, // seconds
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

shortSchema.index({ owner: 1 });
shortSchema.index({ createdAt: -1 });
shortSchema.index({ views: -1 });
shortSchema.index({ isPublished: 1, visibility: 1 });

shortSchema.pre("deleteOne", { document: true }, async function (next) {
  await Comment.deleteMany({ onModel: "Short", contentId: this._id });
  await Like.deleteMany({ short: this._id }); // only if Like model actually stores short
  next();
});

shortSchema.plugin(MongooseAggregatePaginate);

export const Short = mongoose.model("Short", shortSchema);
