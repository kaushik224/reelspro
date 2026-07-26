import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Video, VideoDocument } from './schemas/video.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(limit: number = 10, cursor?: string) {
    const cacheKey = `videos:${limit}:${cursor || 'first'}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const query: any = {};
    
    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const rawVideos = await this.videoModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = rawVideos.length > limit;
    const items = hasMore ? rawVideos.slice(0, -1) : rawVideos;
    
    const nextCursor = hasMore && items.length > 0 
      ? items[items.length - 1]._id.toString() 
      : null;

    // Normalize response for backward compatibility with legacy documents containing vidoeUrl
    const normalizedItems = items.map((video: any) => ({
      ...video,
      videoUrl: video.videoUrl || video.vidoeUrl || '',
    }));

    const result = {
      items: normalizedItems,
      nextCursor,
      hasNextPage: hasMore,
    };

    await this.cacheManager.set(cacheKey, result, 300);
    return result;
  }

  async findById(id: string) {
    const video = await this.videoModel.findById(id).lean();
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    return {
      ...video,
      videoUrl: (video as any).videoUrl || (video as any).vidoeUrl || '',
    };
  }

  async create(createVideoDto: any, userId: string) {
    const videoData = {
      ...createVideoDto,
      userId: new Types.ObjectId(userId),
      controls: createVideoDto.controls !== undefined ? createVideoDto.controls : true,
      transformation: createVideoDto.transformation || {
        height: 1920,
        width: 1080,
        quality: 100,
      },
    };
    const video = new this.videoModel(videoData);
    const savedVideo = await video.save();
    
    // Invalidate video feed cache
    await this.invalidateVideoCache();
    
    return savedVideo;
  }

  async update(id: string, updateVideoDto: any, userId: string, userRole: string) {
    const video = await this.videoModel.findById(id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check ownership
    if (userRole !== 'ADMIN' && video.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this video');
    }

    Object.assign(video, updateVideoDto);
    const savedVideo = await video.save();
    
    // Invalidate video feed cache
    await this.invalidateVideoCache();
    
    return savedVideo;
  }

  async delete(id: string, userId: string, userRole: string) {
    const video = await this.videoModel.findById(id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    // Check ownership
    if (userRole !== 'ADMIN' && video.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this video');
    }

    await this.videoModel.findByIdAndDelete(id);
    
    // Invalidate video feed cache
    await this.invalidateVideoCache();
    
    return { message: 'Video deleted successfully' };
  }

  private async invalidateVideoCache() {
    try {
      const cacheStores = this.cacheManager.stores as any[];
      if (cacheStores && cacheStores.length > 0) {
        const keys = await cacheStores[0].keys('videos:*');
        if (keys && keys.length > 0) {
          await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
        }
      }
    } catch (error) {
      // Log error but don't fail the operation if cache invalidation fails
      console.error('Failed to invalidate video cache:', error);
    }
  }

  async search(query: string, sort: 'latest' | 'oldest' = 'latest', limit: number = 10, cursor?: string) {
    const cacheKey = `search:${query}:${sort}:${limit}:${cursor || 'first'}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const searchQuery: any = {};
    
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    if (cursor) {
      searchQuery._id = { $lt: new Types.ObjectId(cursor) };
    }

    const sortOrder = sort === 'latest' ? -1 : 1;

    const rawVideos = await this.videoModel
      .find(searchQuery)
      .sort({ _id: sortOrder })
      .limit(limit + 1)
      .lean();

    const hasMore = rawVideos.length > limit;
    const items = hasMore ? rawVideos.slice(0, -1) : rawVideos;
    
    const nextCursor = hasMore && items.length > 0 
      ? items[items.length - 1]._id.toString() 
      : null;

    const normalizedItems = items.map((video: any) => ({
      ...video,
      videoUrl: video.videoUrl || video.vidoeUrl || '',
    }));

    const result = {
      items: normalizedItems,
      nextCursor,
      hasNextPage: hasMore,
      query,
      sort,
    };

    await this.cacheManager.set(cacheKey, result, 300);
    return result;
  }
}
