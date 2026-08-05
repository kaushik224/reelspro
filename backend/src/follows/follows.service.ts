import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow, FollowDocument } from './schemas/follow.schema';

@Injectable()
export class FollowsService {
  constructor(@InjectModel(Follow.name) private followModel: Model<FollowDocument>) {}

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    try {
      const follow = new this.followModel({
        followerId: new Types.ObjectId(followerId),
        followingId: new Types.ObjectId(followingId),
      });
      await follow.save();
      return { message: 'User followed successfully' };
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('You are already following this user');
      }
      throw error;
    }
  }

  async unfollowUser(followerId: string, followingId: string) {
    const result = await this.followModel.findOneAndDelete({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    if (!result) {
      throw new NotFoundException('Follow relationship not found');
    }

    return { message: 'User unfollowed successfully' };
  }

  async getFollowers(userId: string, limit: number = 20, cursor?: string) {
    const query: any = { followingId: new Types.ObjectId(userId) };
    
    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const follows = await this.followModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = follows.length > limit;
    const items = hasMore ? follows.slice(0, -1) : follows;
    
    const nextCursor = hasMore && items.length > 0 
      ? items[items.length - 1]._id.toString() 
      : null;

    return {
      items,
      nextCursor,
      hasNextPage: hasMore,
    };
  }

  async getFollowing(userId: string, limit: number = 20, cursor?: string) {
    const query: any = { followerId: new Types.ObjectId(userId) };
    
    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const follows = await this.followModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = follows.length > limit;
    const items = hasMore ? follows.slice(0, -1) : follows;
    
    const nextCursor = hasMore && items.length > 0 
      ? items[items.length - 1]._id.toString() 
      : null;

    return {
      items,
      nextCursor,
      hasNextPage: hasMore,
    };
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.followModel.findOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });
    return { following: !!follow };
  }
}
