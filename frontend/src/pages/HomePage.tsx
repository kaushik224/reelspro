import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { videoService } from '@/services/videoService';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Play, AlertCircle, Film, Sparkles, Calendar } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { data: videos, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['videos'],
    queryFn: videoService.fetchVideos,
    retry: 1,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-zinc-900/60 to-pink-950/30 border border-rose-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Reels Feed</h1>
          </div>
          <p className="text-sm text-zinc-400">
            Explore short trending video reels powered by ReelsPro.
          </p>
        </div>
        <Badge variant="rose">Live Feed</Badge>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[9/16] max-h-[380px] w-full bg-zinc-800 rounded-2xl mb-3" />
              <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <Card className="border-rose-800/40 bg-rose-950/20 text-center py-10">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-rose-200 mb-1">Unable to load videos</h3>
          <p className="text-sm text-zinc-400 mb-4">
            {(error as Error)?.message || 'Failed to connect to backend server.'}
          </p>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-700 disabled:cursor-not-allowed text-white font-medium text-xs rounded-xl transition-all"
          >
            {isRefetching ? 'Retrying...' : 'Try Again'}
          </button>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !isError && videos && videos.length === 0 && (
        <Card className="text-center py-16">
          <div className="bg-zinc-800/60 p-4 rounded-2xl inline-block mb-3">
            <Film className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-200 mb-1">No reels available yet</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-4">
            The video feed is currently empty. Be the first creator to upload a reel!
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-xl transition-all"
          >
            <Play className="w-4 h-4" />
            Upload Your First Reel
          </Link>
        </Card>
      )}

      {/* Video Grid Feed */}
      {!isLoading && !isError && videos && videos.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              {videos.length} {videos.length === 1 ? 'reel' : 'reels'} available
            </p>
            <Link
              to="/reels"
              className="text-sm text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors"
            >
              <Play className="w-4 h-4" />
              Watch in Reels View
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link key={video._id} to={`/reels/${video._id}`}>
                <Card hoverable className="flex flex-col p-0 overflow-hidden group h-full">
                  <div className="relative aspect-[9/16] max-h-[380px] w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <div className="bg-rose-600 text-white p-3 rounded-full shadow-lg shadow-rose-950/60">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-zinc-100 line-clamp-1 group-hover:text-rose-400 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 flex-1">{video.description}</p>
                    {video.createdAt && (
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-auto">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(video.createdAt)}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
