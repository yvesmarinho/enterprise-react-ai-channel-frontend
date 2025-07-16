import { useState, useEffect, useCallback } from 'react';
import { Room, RoomEvent, RoomOptions, VideoPresets } from 'livekit-client';
import { useAppDispatch, useAppSelector } from './redux';
import { connectStart, connectSuccess, connectFailure, disconnect, updateParticipants, updateQuality } from '@/store/slices/roomSlice';

export interface UseLiveKitOptions {
  token: string;
  serverUrl: string;
  roomName: string;
}

export const useLiveKit = ({ token, serverUrl, roomName }: UseLiveKitOptions) => {
  const dispatch = useAppDispatch();
  const roomState = useAppSelector((state) => state.room);
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const roomOptions: RoomOptions = {
    adaptiveStream: true,
    dynacast: true,
    videoCaptureDefaults: {
      resolution: VideoPresets.h720.resolution,
    },
    publishDefaults: {
      videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h360],
    },
  };

  const connectToRoom = useCallback(async () => {
    if (!token || !serverUrl || !roomName || isConnecting) return;

    try {
      setIsConnecting(true);
      dispatch(connectStart(roomName));

      const newRoom = new Room(roomOptions);
      
      // Setup event listeners
      newRoom.on(RoomEvent.Connected, () => {
        console.log('Connected to room:', roomName);
        dispatch(connectSuccess());
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room');
        dispatch(disconnect());
        setRoom(null);
      });

      newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
        console.log('Participant connected:', participant.identity);
        updateParticipantsList(newRoom);
      });

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
        console.log('Participant disconnected:', participant.identity);
        updateParticipantsList(newRoom);
      });

      newRoom.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
        if (participant?.isLocal) {
          dispatch(updateQuality({
            connectionQuality: quality === 1 ? 'excellent' : quality === 2 ? 'good' : quality === 3 ? 'fair' : 'poor',
            latency: newRoom.engine.latency || 0,
            bandwidth: 0, // This would need to be calculated based on tracks
          }));
        }
      });

      newRoom.on(RoomEvent.RoomMetadataChanged, (metadata) => {
        console.log('Room metadata changed:', metadata);
      });

      await newRoom.connect(serverUrl, token);
      setRoom(newRoom);
    } catch (error) {
      console.error('Failed to connect to room:', error);
      dispatch(connectFailure(error instanceof Error ? error.message : 'Failed to connect'));
    } finally {
      setIsConnecting(false);
    }
  }, [token, serverUrl, roomName, isConnecting, dispatch]);

  const updateParticipantsList = useCallback((currentRoom: Room) => {
    const participants = Array.from(currentRoom.remoteParticipants.values()).map(p => ({
      id: p.sid,
      name: p.identity,
      isLocal: false,
      hasAudio: p.isMicrophoneEnabled,
      hasVideo: p.isCameraEnabled,
      isAgent: p.metadata?.includes('ai_agent') || false,
    }));

    // Add local participant
    if (currentRoom.localParticipant) {
      participants.unshift({
        id: currentRoom.localParticipant.sid,
        name: currentRoom.localParticipant.identity,
        isLocal: true,
        hasAudio: currentRoom.localParticipant.isMicrophoneEnabled,
        hasVideo: currentRoom.localParticipant.isCameraEnabled,
        isAgent: false,
      });
    }

    dispatch(updateParticipants(participants));
  }, [dispatch]);

  const disconnectFromRoom = useCallback(() => {
    if (room) {
      room.disconnect();
      setRoom(null);
    }
  }, [room]);

  const toggleMicrophone = useCallback(async () => {
    if (room?.localParticipant) {
      await room.localParticipant.setMicrophoneEnabled(!room.localParticipant.isMicrophoneEnabled);
      updateParticipantsList(room);
    }
  }, [room, updateParticipantsList]);

  const toggleCamera = useCallback(async () => {
    if (room?.localParticipant) {
      await room.localParticipant.setCameraEnabled(!room.localParticipant.isCameraEnabled);
      updateParticipantsList(room);
    }
  }, [room, updateParticipantsList]);

  const toggleScreenShare = useCallback(async () => {
    if (room?.localParticipant) {
      await room.localParticipant.setScreenShareEnabled(!room.localParticipant.isScreenShareEnabled);
    }
  }, [room]);

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  return {
    room,
    isConnecting,
    connectToRoom,
    disconnectFromRoom,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    roomState,
  };
};
