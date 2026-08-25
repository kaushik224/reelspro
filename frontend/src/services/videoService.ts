import { apiClient } from '@/lib/apiClient';
import { Video, ImageKitAuthResponse } from '@/types';

export const videoService = {
  async fetchVideos(): Promise<Video[]> {
    const response = await apiClient.get<{ items: Video[]; nextCursor: string | null; hasNextPage: boolean }>('/api/videos');
    // Backend normalizes vidoeUrl to videoUrl, but we ensure type safety here
    return response.data.items.map((video) => ({
      ...video,
      videoUrl: (video as any).videoUrl || (video as any).vidoeUrl || '',
    }));
  },

  async createVideo(videoData: Partial<Video>): Promise<Video> {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.post<Video>('/api/videos', videoData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  async getImageKitAuth(): Promise<ImageKitAuthResponse> {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.get<ImageKitAuthResponse>('/api/auth/imagekit-auth', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },
};
