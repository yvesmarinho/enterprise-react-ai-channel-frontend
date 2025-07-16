import { Room, RoomOptions, VideoPresets } from 'livekit-client';
import { livekitAPI } from './api';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880';

export class LiveKitService {
  private static instance: LiveKitService;
  private rooms: Map<string, Room> = new Map();

  static getInstance(): LiveKitService {
    if (!LiveKitService.instance) {
      LiveKitService.instance = new LiveKitService();
    }
    return LiveKitService.instance;
  }

  async createRoom(roomName: string, options?: Partial<RoomOptions>): Promise<Room> {
    const defaultOptions: RoomOptions = {
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution,
      },
      publishDefaults: {
        videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h360],
      },
      ...options,
    };

    const room = new Room(defaultOptions);
    this.rooms.set(roomName, room);
    return room;
  }

  async getAccessToken(roomName: string, participantName: string): Promise<string> {
    try {
      const response = await livekitAPI.getAccessToken(roomName, participantName);
      return response.token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error('Failed to get access token');
    }
  }

  async connectToRoom(roomName: string, token: string, participantName: string): Promise<Room> {
    let room = this.rooms.get(roomName);
    
    if (!room) {
      room = await this.createRoom(roomName);
    }

    try {
      await room.connect(LIVEKIT_URL, token, {
        autoSubscribe: true,
      });
      return room;
    } catch (error) {
      console.error('Failed to connect to room:', error);
      this.rooms.delete(roomName);
      throw error;
    }
  }

  disconnectFromRoom(roomName: string): void {
    const room = this.rooms.get(roomName);
    if (room) {
      room.disconnect();
      this.rooms.delete(roomName);
    }
  }

  getRoom(roomName: string): Room | undefined {
    return this.rooms.get(roomName);
  }

  disconnectAll(): void {
    this.rooms.forEach((room, roomName) => {
      room.disconnect();
    });
    this.rooms.clear();
  }
}

export const livekitService = LiveKitService.getInstance();
