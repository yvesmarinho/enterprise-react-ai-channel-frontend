import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LiveKitSession } from '@/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<LiveKitSession[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [roomName, setRoomName] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockSessions: LiveKitSession[] = [
      {
        id: '1',
        roomName: 'AI Support Session',
        userId: user?.id || '1',
        startTime: '2025-01-16T10:00:00Z',
        endTime: '2025-01-16T10:30:00Z',
        duration: 30,
        quality: {
          audio: 95,
          video: 88,
          latency: 45,
        },
        participants: ['user1', 'ai_agent'],
      },
      {
        id: '2',
        roomName: 'Team Meeting with AI',
        userId: user?.id || '1',
        startTime: '2025-01-15T14:00:00Z',
        endTime: '2025-01-15T15:15:00Z',
        duration: 75,
        quality: {
          audio: 92,
          video: 85,
          latency: 52,
        },
        participants: ['user1', 'user2', 'ai_agent'],
      },
    ];
    setSessions(mockSessions);
  }, [user]);

  const handleCreateRoom = () => {
    setOpenDialog(true);
  };

  const handleJoinRoom = () => {
    if (roomName.trim()) {
      navigate(`/channel/${roomName.trim()}`);
      setOpenDialog(false);
      setRoomName('');
    }
  };

  const handleQuickStart = () => {
    const quickRoomName = `quick-session-${Date.now()}`;
    navigate(`/channel/${quickRoomName}`);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Start a new AI conversation or review your recent sessions
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <VideoCallIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Quick Start</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Start an instant AI session with default settings
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleQuickStart}
                fullWidth
              >
                Start Session
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AddIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Create Room</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Create or join a specific room for collaboration
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleCreateRoom}
                fullWidth
              >
                Create/Join Room
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Analytics</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                View detailed session analytics and insights
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<AnalyticsIcon />}
                onClick={() => navigate('/settings')}
                fullWidth
              >
                View Analytics
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Sessions */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <HistoryIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Recent Sessions</Typography>
        </Box>

        {sessions.length === 0 ? (
          <Typography variant="body2" color="textSecondary" textAlign="center" py={4}>
            No recent sessions found. Start your first AI conversation!
          </Typography>
        ) : (
          <List>
            {sessions.map((session) => (
              <ListItem
                key={session.id}
                divider
                sx={{
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  py: 2,
                }}
              >
                <ListItemIcon>
                  <VideoCallIcon />
                </ListItemIcon>
                <ListItemText
                  primary={session.roomName}
                  secondary={`Started: ${new Date(session.startTime).toLocaleString()}`}
                  sx={{ minWidth: 200 }}
                />
                <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: { xs: 1, md: 0 } }}>
                  <Chip
                    label={`Duration: ${formatDuration(session.duration || 0)}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`Audio: ${session.quality.audio}%`}
                    size="small"
                    color={getQualityColor(session.quality.audio)}
                  />
                  <Chip
                    label={`Video: ${session.quality.video}%`}
                    size="small"
                    color={getQualityColor(session.quality.video)}
                  />
                  <Chip
                    label={`${session.participants.length} participants`}
                    size="small"
                  />
                </Box>
                <IconButton
                  onClick={() => navigate(`/channel/${session.roomName}`)}
                  sx={{ ml: { xs: 0, md: 2 }, mt: { xs: 1, md: 0 } }}
                >
                  <PlayIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Create/Join Room Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create or Join Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            fullWidth
            variant="outlined"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleJoinRoom} variant="contained" disabled={!roomName.trim()}>
            Join Room
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
