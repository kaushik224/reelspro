import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '@/services/videoService';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Compass, Search, Film, AlertCircle, ArrowUpDown, Grid, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest';

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const { data: videos, isLoading, isError, error } = useQuery({
    queryKey: ['videos'],
    queryFn: videoService.fetchVideos,
    retry: 1,
  });

  const filteredAndSortedVideos = useMemo(() => {
    if (!videos) return [];

    let filtered = videos;

    // Client-side search by title and description
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query)
      );
    }

    // Client-side sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
    });

    return sorted;
  }, [videos, searchQuery, sortBy]);

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-rose-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Explore</h1>
          </div>
          <p className="text-sm text-zinc-400">
            Discover and browse all available reels
          </p>
        </div>
        <Badge variant="zinc">Client-Side Discovery</Badge>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'newest' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSortBy('newest')}
            leftIcon={<ArrowUpDown className="w-4 h-4" />}
          >
            Newest
          </Button>
          <Button
            variant={sortBy === 'oldest' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSortBy('oldest')}
            leftIcon={<ArrowUpDown className="w-4 h-4 rotate-180" />}
          >
            Oldest
          </Button>
          <div className="border-l border-zinc-700 mx-1" />
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            leftIcon={<Grid className="w-4 h-4" />}
          />
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            leftIcon={<List className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-16 flex flex-col items-center justify-center">
          <Spinner size="lg" label="Loading videos..." />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <Card className="border-rose-800/40 bg-rose-950/20 text-center py-10">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-rose-200 mb-1">Unable to load videos</h3>
          <p className="text-sm text-zinc-400">
            {(error as Error)?.message || 'Failed to connect to backend server.'}
          </p>
        </Card>
      )}

      {/* Results */}
      {!isLoading && !isError && videos && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              {filteredAndSortedVideos.length} of {videos.length} reels
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            )}
          </div>

          {/* Empty state */}
          {filteredAndSortedVideos.length === 0 && (
            <Card className="text-center py-16">
              <div className="bg-zinc-800/60 p-4 rounded-2xl inline-block mb-3">
                <Film className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200 mb-1">
                {searchQuery ? 'No matching reels found' : 'No reels available'}
              </h3>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try a different search term or browse all reels.'
                  : 'Be the first creator to upload a reel!'}
              </p>
            </Card>
          )}

          {/* Grid view */}
          {viewMode === 'grid' && filteredAndSortedVideos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedVideos.map((video) => (
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
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <h3 className="font-bold text-zinc-100 line-clamp-1 group-hover:text-rose-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 flex-1">{video.description}</p>
                      {video.createdAt && (
                        <div className="text-[10px] text-zinc-500 mt-auto">
                          {formatDate(video.createdAt)}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && filteredAndSortedVideos.length > 0 && (
            <div className="space-y-4">
              {filteredAndSortedVideos.map((video) => (
                <Link key={video._id} to={`/reels/${video._id}`}>
                  <Card hoverable className="flex gap-4 p-4">
                    <div className="relative aspect-[9/16] w-24 sm:w-32 bg-zinc-950 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-zinc-100 line-clamp-1 mb-1">{video.title}</h3>
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-2">{video.description}</p>
                      {video.createdAt && (
                        <div className="text-xs text-zinc-500">{formatDate(video.createdAt)}</div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
