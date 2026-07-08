import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { videoService } from '@/services/videoService';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Upload, X, Film, AlertCircle, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';

type UploadState = 'idle' | 'selecting' | 'uploading' | 'processing' | 'success' | 'error';

export const UploadPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      showToast('Please select a video file', 'error');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('File size must be less than 100MB', 'error');
      return;
    }

    setSelectedFile(file);
    setUploadState('selecting');

    // Create video preview
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  }, [showToast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-rose-500', 'bg-rose-950/20');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-rose-500', 'bg-rose-950/20');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-rose-500', 'bg-rose-950/20');
    }

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const resetUpload = useCallback(() => {
    setSelectedFile(null);
    setVideoPreview(null);
    setUploadProgress(0);
    setTitle('');
    setDescription('');
    setThumbnailUrl('');
    setErrorMessage('');
    setUploadState('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !title.trim() || !description.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setUploadState('uploading');
      setErrorMessage('');

      // Get ImageKit auth parameters
      const authParams = await videoService.getImageKitAuth();
      if (authParams.error) {
        throw new Error(authParams.error);
      }

      // Upload to ImageKit
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('fileName', selectedFile.name);
      formData.append('useUniqueFileName', 'true');
      // Add ImageKit auth parameters to FormData
      formData.append('token', authParams.token);
      formData.append('signature', authParams.signature);
      formData.append('expire', authParams.expire.toString());
      formData.append('publicKey', authParams.publicKey);

      const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const uploadData = await uploadResponse.json();
      setUploadProgress(100);

      // Submit metadata to backend
      setUploadState('processing');
      await videoService.createVideo({
        title: title.trim(),
        description: description.trim(),
        videoUrl: uploadData.url,
        thumbnailUrl: thumbnailUrl.trim() || uploadData.thumbnailUrl || uploadData.url,
        controls: true,
        transformation: {
          height: 1920,
          width: 1080,
          quality: 100,
        },
      });

      setUploadState('success');
      showToast('Reel uploaded successfully!', 'success');

      // Redirect to reels after 2 seconds
      setTimeout(() => {
        navigate('/reels');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage((error as Error).message || 'Upload failed. Please try again.');
      setUploadState('error');
      showToast('Upload failed. Please try again.', 'error');
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-8">
        <Card className="w-full max-w-md p-8 border-zinc-800 text-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-zinc-400 mb-6">You must be logged in to upload reels.</p>
          <Button
            variant="primary"
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  if (uploadState === 'success') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-8">
        <Card className="w-full max-w-md p-8 border-emerald-800/40 bg-emerald-950/20 text-center">
          <div className="bg-emerald-950/40 p-4 rounded-2xl inline-block mb-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Upload Successful!</h2>
          <p className="text-zinc-400 mb-6">Your reel has been uploaded and is now live.</p>
          <Spinner size="sm" label="Redirecting to reels..." />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Upload Reel</h1>
          </div>
          <p className="text-sm text-zinc-400">Share your content with the ReelsPro community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="space-y-4">
          {uploadState === 'idle' && (
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed border-zinc-700 rounded-2xl p-12 text-center cursor-pointer hover:border-rose-500 hover:bg-rose-950/10 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="bg-zinc-800/60 p-4 rounded-2xl inline-block mb-4">
                <Upload className="w-12 h-12 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Drop your video here</h3>
              <p className="text-sm text-zinc-400 mb-4">or click to browse</p>
              <div className="text-xs text-zinc-500">
                MP4, WebM, or MOV • Max 100MB
              </div>
            </div>
          )}

          {(uploadState === 'selecting' || uploadState === 'uploading' || uploadState === 'processing' || uploadState === 'error') && (
            <Card className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded-lg">
                    <Film className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {selectedFile?.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {selectedFile && ((selectedFile.size / 1024 / 1024).toFixed(2))} MB
                    </p>
                  </div>
                </div>
                {(uploadState === 'selecting' || uploadState === 'error') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetUpload}
                    leftIcon={<X className="w-4 h-4" />}
                  />
                )}
              </div>

              {videoPreview && (
                <div className="aspect-video bg-zinc-950 rounded-lg overflow-hidden mb-4">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {(uploadState === 'uploading' || uploadState === 'processing') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">
                      {uploadState === 'uploading' ? 'Uploading...' : 'Processing...'}
                    </span>
                    <span className="text-zinc-400">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadState === 'error' && errorMessage && (
                <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Metadata Form */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-white mb-4">Video Details</h2>
          <div className="space-y-4">
            <Input
              label="Title *"
              placeholder="Enter a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploadState === 'uploading' || uploadState === 'processing'}
              required
            />

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Description *
              </label>
              <textarea
                placeholder="Describe your reel..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploadState === 'uploading' || uploadState === 'processing'}
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500/60 transition-all resize-none"
                required
              />
            </div>

            <Input
              label="Thumbnail URL (optional)"
              placeholder="https://example.com/thumbnail.jpg"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              disabled={uploadState === 'uploading' || uploadState === 'processing'}
            />

            <div className="pt-4 border-t border-zinc-800">
              <Button
                variant="primary"
                className="w-full"
                onClick={handleUpload}
                disabled={
                  uploadState === 'uploading' ||
                  uploadState === 'processing' ||
                  !selectedFile ||
                  !title.trim() ||
                  !description.trim()
                }
                isLoading={uploadState === 'uploading' || uploadState === 'processing'}
                leftIcon={<Upload className="w-4 h-4" />}
              >
                {uploadState === 'uploading' || uploadState === 'processing'
                  ? 'Uploading...'
                  : 'Upload Reel'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
