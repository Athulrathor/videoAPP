import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {Like} from "./like.model.js";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    short: {
      type: Schema.Types.ObjectId,
      ref:"short",
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamp: true }
);

commentSchema.pre("findOneAndDelete", async function (next) {
  const commentId = this.getQuery()._id;
  await Like.deleteMany({ comment: commentId });
  next();
});

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);