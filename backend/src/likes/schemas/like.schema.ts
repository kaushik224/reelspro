import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  videoId: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Compound unique index to prevent duplicate likes
LikeSchema.index({ userId: 1, videoId: 1 }, { unique: true });
