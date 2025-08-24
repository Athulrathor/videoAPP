import mongoose,{Schema} from "mongoose";
import MongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {Comment} from "./comments.model.js";
import {Like} from "./like.model.js";

const shortSchema = new Schema(
  {
    shortFile: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
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

shortSchema.pre("findOneAndDelete", async function (next) {
  const shortId = this.getQuery()._id;
  await Comment.deleteMany({ short: shortId });
  await Like.deleteMany({ short: shortId });
  next();
});

shortSchema.plugin(MongooseAggregatePaginate);

export const Short = mongoose.model("Short", shortSchema);
