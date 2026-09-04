import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { videoService } from '@/services/videoService';
import { Video } from '@/types';
import { ReelItem } from '@/components/reels/ReelItem';
import { Spinner } from '@/components/ui/Spinner';
import { AlertCircle, ArrowLeft, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export const ReelsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const { data: videos, isLoading, isError, error } = useQuery({
    queryKey: ['videos'],
    queryFn: videoService.fetchVideos,
    retry: 1,
  });

  // Find starting index if id is provided
  useEffect(() => {
    if (id && videos) {
      const index = videos.findIndex((v) => v._id === id);
      if (index !== -1) {
        setVisibleIndex(index);
        setTimeout(() => {
          const element = containerRef.current?.children[index] as HTMLElement;
          element?.scrollIntoView({ behavior: 'auto' });
        }, 100);
      }
    }
  }, [id, videos]);

  // Intersection Observer for autoplay
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !videos) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target);
            setVisibleIndex(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.7,
      }
    );

    Array.from(container.children).forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [videos]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videos || videos.length === 0) return;

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setVisibleIndex((prev) => {
          const newIndex = Math.max(0, prev - 1);
          const element = containerRef.current?.children[newIndex] as HTMLElement;
          element?.scrollIntoView({ behavior: 'smooth' });
          return newIndex;
        });
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setVisibleIndex((prev) => {
          const newIndex = Math.min(videos.length - 1, prev + 1);
          const element = containerRef.current?.children[newIndex] as HTMLElement;
          element?.scrollIntoView({ behavior: 'smooth' });
          return newIndex;
        });
      } else if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videos, navigate]);

  const handleShare = useCallback(
    async (video: Video) => {
      const shareUrl = `${window.location.origin}/reels/${video._id}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: video.title,
            text: video.description,
            url: shareUrl,
          });
          showToast('Shared successfully!', 'success');
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            handleCopyLink(shareUrl);
          }
        }
      } else {
        handleCopyLink(shareUrl);
      }
    },
    [showToast]
  );

  const handleCopyLink = useCallback(
    (url: string) => {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Failed to copy link', 'error');
      });
    },
    [showToast]
  );

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <Spinner size="lg" label="Loading reels..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Unable to load reels</h2>
          <p className="text-zinc-400 mb-4">
            {(error as Error)?.message || 'Failed to connect to backend server.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">No reels available</h2>
          <p className="text-zinc-400 mb-4">
            Be the first creator to upload a reel!
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl transition-all"
          >
            Upload a Reel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={() => navigate('/')}
          className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white">ReelsPro</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Reels container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {videos.map((video, index) => (
          <ReelItem
            key={video._id}
            video={video}
            isVisible={index === visibleIndex}
            onShare={handleShare}
          />
        ))}
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-xs text-zinc-400 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          Scroll or use arrow keys to navigate • Press Escape to exit
        </p>
      </div>
    </div>
  );
};
