import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscribedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index(
  { subscriber: 1, subscribedTo: 1 },
  { unique: true }
);

subscriptionSchema.index({ subscriber: 1 });
subscriptionSchema.index({ subscribedTo: 1 });

export const Subscription = mongoose.model(
  "Subscription",
  subscriptionSchema
);