import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async createComment(videoId: string, userId: string, text: string, parentCommentId?: string) {
    const comment = new this.commentModel({
      videoId: new Types.ObjectId(videoId),
      userId: new Types.ObjectId(userId),
      text,
      parentCommentId: parentCommentId ? new Types.ObjectId(parentCommentId) : null,
    });
    return comment.save();
  }

  async getVideoComments(videoId: string, limit: number = 20, cursor?: string) {
    const query: any = { videoId: new Types.ObjectId(videoId) };
    
    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const comments = await this.commentModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = comments.length > limit;
    const items = hasMore ? comments.slice(0, -1) : comments;
    
    const nextCursor = hasMore && items.length > 0 
      ? items[items.length - 1]._id.toString() 
      : null;

    return {
      items,
      nextCursor,
      hasNextPage: hasMore,
    };
  }

  async deleteComment(commentId: string, userId: string, userRole: string) {
    const comment = await this.commentModel.findById(commentId);
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check ownership or admin
    if (userRole !== UserRole.ADMIN && comment.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    await this.commentModel.findByIdAndDelete(commentId);
    return { message: 'Comment deleted successfully' };
  }
}
