import mongoose,{Schema} from "mongoose";

const playlistSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: [{
      type: Schema.Types.ObjectId,
      ref: "Video",}
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    privacy: {
      type: String,
    }
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);