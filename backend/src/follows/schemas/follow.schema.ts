import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FollowDocument = Follow & Document;

@Schema({ timestamps: true })
export class Follow {
  @Prop({ required: true, type: Types.ObjectId })
  followerId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  followingId: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

// Compound unique index to prevent duplicate follows and self-follows
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
