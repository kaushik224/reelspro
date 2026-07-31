import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('api/videos/:id/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id') videoId: string,
    @Body() body: { text: string; parentCommentId?: string },
    @CurrentUser() user: any,
  ) {
    return this.commentsService.createComment(
      videoId,
      user.id,
      body.text,
      body.parentCommentId,
    );
  }

  @Get()
  @Public()
  async getVideoComments(
    @Param('id') videoId: string,
    @Query('limit') limit: number = 20,
    @Query('cursor') cursor?: string,
  ) {
    return this.commentsService.getVideoComments(videoId, limit, cursor);
  }
}

@Controller('api/comments')
export class CommentsManagementController {
  constructor(private commentsService: CommentsService) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') commentId: string, @CurrentUser() user: any) {
    return this.commentsService.deleteComment(commentId, user.id, user.role);
  }
}
