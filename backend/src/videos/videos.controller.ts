import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SearchDto } from './dto/search.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('api/videos')
export class VideosController {
  constructor(private videosService: VideosService) {}

  @Public()
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      return await this.videosService.findAll(paginationDto.limit, paginationDto.cursor);
    } catch (error) {
      return { error: 'Failed to fetch videos' };
    }
  }

  @Public()
  @Get('search')
  async search(@Query() searchDto: SearchDto) {
    try {
      return await this.videosService.search(
        searchDto.q,
        searchDto.sort as 'latest' | 'oldest',
        searchDto.limit,
        searchDto.cursor,
      );
    } catch (error) {
      return { error: 'Failed to search videos' };
    }
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      return await this.videosService.findById(id);
    } catch (error) {
      return { error: 'Failed to fetch video' };
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createVideoDto: CreateVideoDto, @CurrentUser() user: any) {
    try {
      if (!createVideoDto.description || !createVideoDto.thumbnailUrl || !createVideoDto.title || !createVideoDto.videoUrl) {
        return { error: 'Missing required Fields' };
      }
      return await this.videosService.create(createVideoDto, user.id);
    } catch (error) {
      return { error: 'Failed to upload video' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateVideoDto: any, @CurrentUser() user: any) {
    try {
      return await this.videosService.update(id, updateVideoDto, user.id, user.role);
    } catch (error) {
      return { error: 'Failed to update video' };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    try {
      return await this.videosService.delete(id, user.id, user.role);
    } catch (error) {
      return { error: 'Failed to delete video' };
    }
  }
}
