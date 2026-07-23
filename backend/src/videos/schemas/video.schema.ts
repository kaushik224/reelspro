import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export enum VideoStatus {
  READY = 'READY',
}

export type VideoDocument = Video & Document;

@Schema({ timestamps: true, strict: false })
export class Video {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  videoUrl: string;

  @Prop({ required: true })
  thumbnailUrl: string;

  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: VideoStatus, default: VideoStatus.READY })
  status: VideoStatus;

  @Prop({ default: true })
  controls?: boolean;

  @Prop({
    type: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  })
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

export const VideoSchema = SchemaFactory.createForClass(Video);

VideoSchema.index({ userId: 1 });
VideoSchema.index({ createdAt: -1 });
VideoSchema.index({ userId: 1, createdAt: -1 });
