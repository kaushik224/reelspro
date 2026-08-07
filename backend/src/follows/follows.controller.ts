import { Controller, Post, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('api/users/:id/follow')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async followUser(@Param('id') followingId: string, @CurrentUser() user: any) {
    return this.followsService.followUser(user.id, followingId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async unfollowUser(@Param('id') followingId: string, @CurrentUser() user: any) {
    return this.followsService.unfollowUser(user.id, followingId);
  }
}

@Controller('api/users/:id')
export class UserFollowsController {
  constructor(private followsService: FollowsService) {}

  @Get('followers')
  @Public()
  async getFollowers(
    @Param('id') userId: string,
    @Query('limit') limit: number = 20,
    @Query('cursor') cursor?: string,
  ) {
    return this.followsService.getFollowers(userId, limit, cursor);
  }

  @Get('following')
  @Public()
  async getFollowing(
    @Param('id') userId: string,
    @Query('limit') limit: number = 20,
    @Query('cursor') cursor?: string,
  ) {
    return this.followsService.getFollowing(userId, limit, cursor);
  }

  @Get('follow-status')
  @UseGuards(JwtAuthGuard)
  async isFollowing(@Param('id') followingId: string, @CurrentUser() user: any) {
    return this.followsService.isFollowing(user.id, followingId);
  }
}
