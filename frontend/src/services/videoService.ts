import { apiClient } from '@/lib/apiClient';
import { Video, ImageKitAuthResponse } from '@/types';

export const videoService = {
  async fetchVideos(): Promise<Video[]> {
    const response = await apiClient.get<Video[]>('/api/video');
    // Backend normalizes vidoeUrl to videoUrl, but we ensure type safety here
    return response.data.map((video) => ({
      ...video,
      videoUrl: (video as any).videoUrl || (video as any).vidoeUrl || '',
    }));
  },

  async createVideo(videoData: Partial<Video>): Promise<Video> {
    const response = await apiClient.post<Video>('/api/video', videoData);
    return response.data;
  },

  async getImageKitAuth(): Promise<ImageKitAuthResponse> {
    const response = await apiClient.get<ImageKitAuthResponse>('/api/auth/imagekit-auth');
    return response.data;
  },
};
