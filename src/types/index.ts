export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AIAgentMessage {
  type: 'transcription' | 'response' | 'command' | 'system';
  content: string;
  timestamp: number;
  userId: string;
  id: string;
  metadata?: Record<string, any>;
}

export interface LiveKitSession {
  id: string;
  roomName: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  quality: {
    audio: number;
    video: number;
    latency: number;
  };
  participants: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    type: 'user' | 'ai_agent' | 'system';
  };
  timestamp: string;
  metadata?: {
    transcribed?: boolean;
    confidence?: number;
  };
}

export interface RoomState {
  isConnected: boolean;
  roomName: string | null;
  participants: Array<{
    id: string;
    name: string;
    isLocal: boolean;
    hasAudio: boolean;
    hasVideo: boolean;
    isAgent: boolean;
  }>;
  quality: {
    connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
    latency: number;
    bandwidth: number;
  };
  error: string | null;
}

export interface MediaSettings {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
  audioDeviceId?: string;
  videoDeviceId?: string;
  audioOutputDeviceId?: string;
}
