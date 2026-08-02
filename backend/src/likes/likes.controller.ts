import { Controller, Post, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('api/videos/:id/likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async likeVideo(@Param('id') videoId: string, @CurrentUser() user: any) {
    return this.likesService.likeVideo(user.id, videoId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async unlikeVideo(@Param('id') videoId: string, @CurrentUser() user: any) {
    return this.likesService.unlikeVideo(user.id, videoId);
  }

  @Get()
  @Public()
  async getVideoLikes(@Param('id') videoId: string) {
    return this.likesService.getVideoLikes(videoId);
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  async hasUserLiked(@Param('id') videoId: string, @CurrentUser() user: any) {
    return this.likesService.hasUserLiked(user.id, videoId);
  }
}
