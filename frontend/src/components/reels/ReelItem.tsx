import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Video } from '@/types';
import { Play, Pause, Volume2, VolumeX, Share2, Calendar } from 'lucide-react';

interface ReelItemProps {
  video: Video;
  isVisible: boolean;
  onShare: (video: Video) => void;
}

export const ReelItem: React.FC<ReelItemProps> = ({ video, isVisible, onShare }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setHasInteracted(true);
  }, [isPlaying]);

  const handleMuteToggle = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  }, []);

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [handleTimeUpdate, handleVideoEnd]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible && hasInteracted) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else if (!isVisible) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isVisible, hasInteracted]);

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
    <div className="relative h-full w-full bg-zinc-950 snap-start">
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        className="h-full w-full object-contain"
        loop
        playsInline
        muted={isMuted}
        onClick={handlePlayPause}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* Tap to play hint */}
      {!hasInteracted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full">
            <Play className="w-12 h-12 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Video info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
        <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{video.title}</h2>
        <p className="text-sm text-zinc-200 mb-3 line-clamp-3">{video.description}</p>
        {video.createdAt && (
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(video.createdAt)}</span>
          </div>
        )}
      </div>

      {/* Right side controls */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          className="bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMuteToggle();
          }}
          className="bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare(video);
          }}
          className="bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Share"
        >
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
        <div 
          className="h-full bg-rose-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
