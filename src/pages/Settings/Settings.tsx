import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  TestTube as TestIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { User, MediaSettings } from '@/types';

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<Partial<User>>(user || {});
  const [mediaSettings, setMediaSettings] = useState<MediaSettings>({
    audioEnabled: true,
    videoEnabled: true,
    screenShareEnabled: false,
    audioDeviceId: '',
    videoDeviceId: '',
    audioOutputDeviceId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProfileChange = (field: keyof User, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMediaChange = (field: keyof MediaSettings, value: boolean | string) => {
    setMediaSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email) {
      setError('Name and email are required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await updateProfile(profile);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAudio = () => {
    // Mock audio test
    setSuccess('Audio test completed successfully');
  };

  const handleTestVideo = () => {
    // Mock video test
    setSuccess('Video test completed successfully');
  };

  const handleResetSettings = () => {
    setMediaSettings({
      audioEnabled: true,
      videoEnabled: true,
      screenShareEnabled: false,
      audioDeviceId: '',
      videoDeviceId: '',
      audioOutputDeviceId: '',
    });
    setSuccess('Settings reset to default');
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Profile Settings" />
            <CardContent>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Full Name"
                  value={profile.name || ''}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={profile.role || 'user'}
                    label="Role"
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                    disabled
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="moderator">Moderator</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Media Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Media Settings" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mediaSettings.audioEnabled}
                      onChange={(e) => handleMediaChange('audioEnabled', e.target.checked)}
                    />
                  }
                  label="Enable Audio by Default"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={mediaSettings.videoEnabled}
                      onChange={(e) => handleMediaChange('videoEnabled', e.target.checked)}
                    />
                  }
                  label="Enable Video by Default"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={mediaSettings.screenShareEnabled}
                      onChange={(e) => handleMediaChange('screenShareEnabled', e.target.checked)}
                    />
                  }
                  label="Allow Screen Share"
                />
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Device Preferences
                </Typography>
                
                <FormControl fullWidth size="small">
                  <InputLabel>Audio Input Device</InputLabel>
                  <Select
                    value={mediaSettings.audioDeviceId}
                    label="Audio Input Device"
                    onChange={(e) => handleMediaChange('audioDeviceId', e.target.value)}
                  >
                    <MenuItem value="">Default Microphone</MenuItem>
                    <MenuItem value="device1">Microphone 1</MenuItem>
                    <MenuItem value="device2">Microphone 2</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth size="small">
                  <InputLabel>Video Input Device</InputLabel>
                  <Select
                    value={mediaSettings.videoDeviceId}
                    label="Video Input Device"
                    onChange={(e) => handleMediaChange('videoDeviceId', e.target.value)}
                  >
                    <MenuItem value="">Default Camera</MenuItem>
                    <MenuItem value="camera1">Camera 1</MenuItem>
                    <MenuItem value="camera2">Camera 2</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth size="small">
                  <InputLabel>Audio Output Device</InputLabel>
                  <Select
                    value={mediaSettings.audioOutputDeviceId}
                    label="Audio Output Device"
                    onChange={(e) => handleMediaChange('audioOutputDeviceId', e.target.value)}
                  >
                    <MenuItem value="">Default Speaker</MenuItem>
                    <MenuItem value="speaker1">Speaker 1</MenuItem>
                    <MenuItem value="speaker2">Speaker 2</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Device Testing */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Device Testing" />
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Test your audio and video devices to ensure they work properly with the AI Channel.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<TestIcon />}
                  onClick={handleTestAudio}
                >
                  Test Audio
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TestIcon />}
                  onClick={handleTestVideo}
                >
                  Test Video
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ResetIcon />}
                  onClick={handleResetSettings}
                  color="secondary"
                >
                  Reset to Defaults
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Settings */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Advanced Settings" />
            <CardContent>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Advanced configuration options for power users.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  label="LiveKit Server URL"
                  value={import.meta.env.VITE_LIVEKIT_URL || ''}
                  disabled
                  fullWidth
                  size="small"
                  helperText="Contact your administrator to change this setting"
                />
                <TextField
                  label="AI Agent WebSocket URL"
                  value={import.meta.env.VITE_WEBSOCKET_URL || ''}
                  disabled
                  fullWidth
                  size="small"
                  helperText="Contact your administrator to change this setting"
                />
                <TextField
                  label="API Base URL"
                  value={import.meta.env.VITE_API_BASE_URL || ''}
                  disabled
                  fullWidth
                  size="small"
                  helperText="Contact your administrator to change this setting"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
