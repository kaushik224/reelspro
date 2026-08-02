import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like, LikeDocument } from './schemas/like.schema';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likeModel: Model<LikeDocument>) {}

  async likeVideo(userId: string, videoId: string) {
    try {
      const like = new this.likeModel({
        userId: new Types.ObjectId(userId),
        videoId: new Types.ObjectId(videoId),
      });
      await like.save();
      return { message: 'Video liked successfully' };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('You have already liked this video');
      }
      throw error;
    }
  }

  async unlikeVideo(userId: string, videoId: string) {
    const result = await this.likeModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      videoId: new Types.ObjectId(videoId),
    });

    if (!result) {
      throw new NotFoundException('Like not found');
    }

    return { message: 'Video unliked successfully' };
  }

  async getVideoLikes(videoId: string) {
    const count = await this.likeModel.countDocuments({
      videoId: new Types.ObjectId(videoId),
    });
    return { videoId, likeCount: count };
  }

  async hasUserLiked(userId: string, videoId: string) {
    const like = await this.likeModel.findOne({
      userId: new Types.ObjectId(userId),
      videoId: new Types.ObjectId(videoId),
    });
    return { liked: !!like };
  }
}
