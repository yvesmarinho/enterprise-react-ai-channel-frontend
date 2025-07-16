import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  Send,
  Call,
  CallEnd,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLiveKit } from '@/hooks/useLiveKit';
import { useAIAgent } from '@/hooks/useAIAgent';
import { livekitAPI } from '@/services/api';

const AIChannel: React.FC = () => {
  const { roomName = 'default-room' } = useParams<{ roomName: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [token, setToken] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880';
  const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001';
  const API_KEY = import.meta.env.VITE_AI_AGENT_API_KEY || 'demo-key';

  const {
    room,
    connectToRoom,
    disconnectFromRoom,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    roomState,
  } = useLiveKit({
    token,
    serverUrl: LIVEKIT_URL,
    roomName,
  });

  const {
    isConnected: aiConnected,
    messages,
    isProcessing,
    connectToAgent,
    sendCommand,
    disconnect: disconnectAgent,
  } = useAIAgent({
    websocketUrl: WEBSOCKET_URL,
    apiKey: API_KEY,
  });

  useEffect(() => {
    if (user && roomName) {
      initializeConnection();
    }
    
    return () => {
      disconnectFromRoom();
      disconnectAgent();
    };
  }, [user, roomName]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeConnection = async () => {
    if (!user) return;
    
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      // Get access token for LiveKit
      const tokenResponse = await livekitAPI.getAccessToken(roomName, user.id);
      setToken(tokenResponse.token);
      
      // Connect to AI Agent
      connectToAgent();
      
    } catch (error) {
      console.error('Failed to initialize connection:', error);
      setConnectionError('Failed to connect to the room. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnect = async () => {
    if (token) {
      try {
        await connectToRoom();
      } catch (error) {
        console.error('Failed to connect to room:', error);
        setConnectionError('Failed to connect to LiveKit room.');
      }
    }
  };

  const handleDisconnect = () => {
    disconnectFromRoom();
    disconnectAgent();
    navigate('/dashboard');
  };

  const handleSendMessage = () => {
    if (message.trim() && aiConnected) {
      sendCommand(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleAudio = async () => {
    await toggleMicrophone();
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleToggleVideo = async () => {
    await toggleCamera();
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleScreenShare = async () => {
    await toggleScreenShare();
    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Channel: {roomName}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={roomState.isConnected ? 'Connected' : 'Disconnected'}
            color={roomState.isConnected ? 'success' : 'error'}
            variant="outlined"
          />
          <Chip
            label={aiConnected ? 'AI Agent Online' : 'AI Agent Offline'}
            color={aiConnected ? 'success' : 'warning'}
            variant="outlined"
          />
          {roomState.participants.length > 0 && (
            <Chip
              label={`${roomState.participants.length} participants`}
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {connectionError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setConnectionError(null)}>
          {connectionError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Video Section */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 500 }}>
            <Typography variant="h6" gutterBottom>
              Video Conference
            </Typography>
            
            <Grid container spacing={2} sx={{ height: 400 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', position: 'relative' }}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: '#000',
                    }}
                  />
                  <Box
                    position="absolute"
                    bottom={8}
                    left={8}
                    bgcolor="rgba(0,0,0,0.7)"
                    color="white"
                    px={1}
                    py={0.5}
                    borderRadius={1}
                  >
                    <Typography variant="caption">You</Typography>
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', position: 'relative' }}>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: '#000',
                    }}
                  />
                  <Box
                    position="absolute"
                    bottom={8}
                    left={8}
                    bgcolor="rgba(0,0,0,0.7)"
                    color="white"
                    px={1}
                    py={0.5}
                    borderRadius={1}
                  >
                    <Typography variant="caption">AI Agent</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Video Controls */}
            <Box display="flex" justifyContent="center" gap={2} mt={2}>
              {!roomState.isConnected ? (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Call />}
                  onClick={handleConnect}
                  disabled={isConnecting || !token}
                >
                  {isConnecting ? 'Connecting...' : 'Join Call'}
                </Button>
              ) : (
                <>
                  <IconButton
                    color={isAudioEnabled ? 'primary' : 'error'}
                    onClick={handleToggleAudio}
                  >
                    {isAudioEnabled ? <Mic /> : <MicOff />}
                  </IconButton>
                  
                  <IconButton
                    color={isVideoEnabled ? 'primary' : 'error'}
                    onClick={handleToggleVideo}
                  >
                    {isVideoEnabled ? <Videocam /> : <VideocamOff />}
                  </IconButton>
                  
                  <IconButton
                    color={isScreenSharing ? 'secondary' : 'default'}
                    onClick={handleToggleScreenShare}
                  >
                    {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                  </IconButton>
                  
                  <IconButton color="default">
                    <VolumeUp />
                  </IconButton>
                  
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CallEnd />}
                    onClick={handleDisconnect}
                  >
                    Leave Call
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Chat Section */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, height: 500, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              AI Chat
            </Typography>
            
            {/* Messages */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              {messages.length === 0 ? (
                <Typography variant="body2" color="textSecondary" textAlign="center" py={4}>
                  {aiConnected ? 'Start a conversation with the AI agent...' : 'Connecting to AI agent...'}
                </Typography>
              ) : (
                <List dense>
                  {messages.map((msg) => (
                    <ListItem
                      key={msg.id}
                      sx={{
                        flexDirection: 'column',
                        alignItems: msg.sender.type === 'user' ? 'flex-end' : 'flex-start',
                        px: 0,
                      }}
                    >
                      <Card
                        sx={{
                          maxWidth: '80%',
                          bgcolor: msg.sender.type === 'user' ? 'primary.main' : 'grey.200',
                          color: msg.sender.type === 'user' ? 'white' : 'text.primary',
                        }}
                      >
                        <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                          <Typography variant="caption" display="block">
                            {msg.sender.name}
                          </Typography>
                          <Typography variant="body2">
                            {msg.content}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                  {isProcessing && (
                    <ListItem sx={{ px: 0 }}>
                      <Card sx={{ bgcolor: 'grey.200' }}>
                        <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                          <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                            AI is thinking...
                          </Typography>
                        </CardContent>
                      </Card>
                    </ListItem>
                  )}
                </List>
              )}
              <div ref={chatEndRef} />
            </Box>

            {/* Message Input */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!aiConnected}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSendMessage}
                      disabled={!message.trim() || !aiConnected}
                      edge="end"
                    >
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AIChannel;
