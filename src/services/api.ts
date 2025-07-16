import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginCredentials, RegisterData, User } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

const apiClient = new APIClient();

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    return apiClient.post('/auth/login', credentials);
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    return apiClient.post('/auth/register', data);
  },

  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get('/auth/me');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiClient.put('/auth/profile', data);
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return apiClient.post('/auth/refresh');
  },
};

// LiveKit API
export const livekitAPI = {
  getAccessToken: async (roomName: string, participantName: string): Promise<{ token: string }> => {
    return apiClient.post('/livekit/token', {
      roomName,
      participantName,
    });
  },

  getRoomInfo: async (roomName: string): Promise<any> => {
    return apiClient.get(`/livekit/rooms/${roomName}`);
  },

  createRoom: async (roomName: string, options?: any): Promise<any> => {
    return apiClient.post('/livekit/rooms', {
      roomName,
      ...options,
    });
  },

  deleteRoom: async (roomName: string): Promise<void> => {
    return apiClient.delete(`/livekit/rooms/${roomName}`);
  },
};

// AI Agent API
export const aiAgentAPI = {
  sendMessage: async (message: string, roomId: string): Promise<{ response: string }> => {
    return apiClient.post('/ai-agent/message', {
      message,
      roomId,
    });
  },

  getConversationHistory: async (roomId: string): Promise<any[]> => {
    return apiClient.get(`/ai-agent/conversations/${roomId}`);
  },

  activateAgent: async (roomId: string): Promise<{ success: boolean }> => {
    return apiClient.post(`/ai-agent/activate/${roomId}`);
  },

  deactivateAgent: async (roomId: string): Promise<{ success: boolean }> => {
    return apiClient.post(`/ai-agent/deactivate/${roomId}`);
  },
};

export default apiClient;
