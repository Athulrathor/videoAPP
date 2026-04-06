import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {Like} from "./like.model.js";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 polymorphic reference (video OR short)
    onModel: {
      type: String,
      required: true,
      enum: ["Video", "Short"],
    },

    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
      index: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔥 parent comment (for replies)
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },

    // 🔥 denormalized fields (performance)
    likeCount: {
      type: Number,
      default: 0,
    },

    replyCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

commentSchema.index({ owner: 1 });
commentSchema.index({ contentId: 1, parentComment: 1, createdAt: -1, _id: -1 });
commentSchema.index({ parentComment: 1, createdAt: -1, _id: -1 });

commentSchema.pre("findOneAndDelete", async function (next) {
  const comment = await this.model.findOne(this.getQuery());
  if (!comment) return next();

  const commentId = comment._id;

  await Like.deleteMany({ comment: commentId });
  await mongoose.model("Comment").deleteMany({ parentComment: commentId });

  next();
});

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);