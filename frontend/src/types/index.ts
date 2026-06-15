export interface User {
  id: string;
  email: string;
}

export interface VideoTransformation {
  height: number;
  width: number;
  quality?: number;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string; // Normalized property name
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: VideoTransformation;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  user?: User;
  expires?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  error?: string;
}

export interface ImageKitAuthResponse {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
