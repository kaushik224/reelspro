import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  _id?: mongoose.Types.ObjectId;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

const videoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  {
    timestamps: true,
    strict: false, // Ensures existing legacy documents with vidoeUrl can still be retrieved
  }
);

const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;
