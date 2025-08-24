import mongoose, { Schema } from "mongoose";

const subcriptionsSchema = new Schema(
  {
    subcriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subcribed: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Subcriptions = mongoose.model("Subcriptions", subcriptionsSchema);
