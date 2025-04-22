import mongoose,{Schema} from "mongoose";
import MongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

shortSchema.plugin(MongooseAggregatePaginate);

export const Short = mongoose.model("Short", shortSchema);
