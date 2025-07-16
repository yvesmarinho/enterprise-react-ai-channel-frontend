import { useState, useEffect, useCallback } from 'react';
import { AIAgentMessage, ChatMessage } from '@/types';
import { useAppSelector } from './redux';

export interface UseAIAgentOptions {
  websocketUrl: string;
  apiKey: string;
}

export const useAIAgent = ({ websocketUrl, apiKey }: UseAIAgentOptions) => {
  const { user } = useAppSelector((state) => state.auth);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectToAgent = useCallback(() => {
    if (!user || !websocketUrl || socket?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(`${websocketUrl}?token=${apiKey}&userId=${user.id}`);
      
      ws.onopen = () => {
        console.log('Connected to AI Agent');
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data: AIAgentMessage = JSON.parse(event.data);
          
          const chatMessage: ChatMessage = {
            id: data.id,
            content: data.content,
            sender: {
              id: data.type === 'response' ? 'ai_agent' : data.userId,
              name: data.type === 'response' ? 'AI Assistant' : user?.name || 'User',
              type: data.type === 'response' ? 'ai_agent' : 'user',
            },
            timestamp: new Date(data.timestamp).toISOString(),
            metadata: data.metadata,
          };

          setMessages(prev => [...prev, chatMessage]);
          
          if (data.type === 'response') {
            setIsProcessing(false);
          }
        } catch (err) {
          console.error('Failed to parse AI agent message:', err);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from AI Agent');
        setIsConnected(false);
        setSocket(null);
      };

      ws.onerror = (error) => {
        console.error('AI Agent WebSocket error:', error);
        setError('Failed to connect to AI Agent');
        setIsConnected(false);
      };

      setSocket(ws);
    } catch (err) {
      console.error('Failed to connect to AI Agent:', err);
      setError('Failed to connect to AI Agent');
    }
  }, [user, websocketUrl, apiKey, socket?.readyState]);

  const sendMessage = useCallback((content: string, type: AIAgentMessage['type'] = 'command') => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !user) return;

    const message: AIAgentMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      content,
      timestamp: Date.now(),
      userId: user.id,
    };

    socket.send(JSON.stringify(message));
    
    if (type === 'command') {
      setIsProcessing(true);
      
      // Add user message to chat
      const chatMessage: ChatMessage = {
        id: message.id,
        content,
        sender: {
          id: user.id,
          name: user.name,
          type: 'user',
        },
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, chatMessage]);
    }
  }, [socket, user]);

  const sendTranscription = useCallback((transcription: string) => {
    sendMessage(transcription, 'transcription');
  }, [sendMessage]);

  const sendCommand = useCallback((command: string) => {
    sendMessage(command, 'command');
  }, [sendMessage]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return {
    isConnected,
    messages,
    isProcessing,
    error,
    connectToAgent,
    sendMessage,
    sendTranscription,
    sendCommand,
    disconnect,
    clearMessages,
  };
};
