import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Paper, Typography, Avatar, TextField, Button, Stack, Fade } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import api from '../utils/api';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.put(`/users/${user._id}/profile`, formData);
      setSuccess(true);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box textAlign="center" py={12}>
        <Typography color="text.secondary">Please log in to view your profile.</Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={700}>
      <Box maxWidth="sm" mx="auto" py={4}>
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar src={formData.profilePicture || '/default-avatar.png'} sx={{ width: 96, height: 96, mb: 2 }} />
            <Typography variant="h5" fontWeight={700} mb={1}>My Profile</Typography>
            <Typography color="text.secondary" mb={2}>{formData.email}</Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Profile Picture URL"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<EditIcon />}
                sx={{ borderRadius: 3, fontWeight: 700 }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              {success && <Typography color="success.main">Profile updated successfully!</Typography>}
              {error && <Typography color="error.main">{error}</Typography>}
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default ProfilePage;
