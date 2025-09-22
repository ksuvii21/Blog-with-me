import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials, setLoading, setError } from '../redux/slices/authSlice';
import api from '../utils/api';
import { Avatar, Button, TextField, Paper, Box, Typography, Grid, Fade } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
    profilePicture: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { username, email, password, bio, profilePicture } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await api.post('/auth/register', formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      dispatch(setCredentials({ user, token }));
      navigate('/');
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Registration failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6366f1 0%, #a21caf 100%)',
        py: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative SVGs */}
      <svg className="absolute left-0 top-0 w-48 h-48 opacity-20 -z-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle fill="#a21caf" cx="100" cy="100" r="100" />
      </svg>
      <svg className="absolute right-0 bottom-0 w-64 h-64 opacity-10 -z-10" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
        <circle fill="#06b6d4" cx="110" cy="110" r="110" />
      </svg>
      <Fade in timeout={700}>
        <Paper elevation={8} sx={{ p: 5, maxWidth: 460, width: '100%', borderRadius: 6, boxShadow: 12, backdropFilter: 'blur(2px)', background: 'rgba(255,255,255,0.97)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'info.main', width: 64, height: 64, boxShadow: 3 }}>
              <PersonAddAlt1Icon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h3" fontWeight={900} sx={{ mt: 1, mb: 2, color: 'primary.main', fontFamily: 'Merriweather, serif', letterSpacing: 1 }}>
              Create Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontWeight: 500, fontSize: 17 }}>
              Or{' '}
              <Link to="/login" style={{ color: '#a21caf', fontWeight: 700 }}>
                sign in to existing account
              </Link>
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={handleChange}
                variant="outlined"
                sx={{ background: '#f3f4f6', borderRadius: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleChange}
                variant="outlined"
                sx={{ background: '#f3f4f6', borderRadius: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={handleChange}
                variant="outlined"
                sx={{ background: '#f3f4f6', borderRadius: 2 }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="bio"
                label="Bio (optional)"
                name="bio"
                multiline
                rows={3}
                value={bio}
                onChange={handleChange}
                variant="outlined"
                sx={{ background: '#f3f4f6', borderRadius: 2 }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="profilePicture"
                label="Profile Picture URL (optional)"
                name="profilePicture"
                type="url"
                value={profilePicture}
                onChange={handleChange}
                variant="outlined"
                sx={{ background: '#f3f4f6', borderRadius: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontWeight: 800,
                  borderRadius: 999,
                  px: 2,
                  py: 1.5,
                  fontSize: 18,
                  background: 'linear-gradient(90deg, #06b6d4 0%, #a21caf 100%)',
                  color: '#fff',
                  boxShadow: 4,
                  textTransform: 'none',
                  '&:hover': { background: 'linear-gradient(90deg, #a21caf 0%, #06b6d4 100%)' }
                }}
              >
                Create Account
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default RegisterPage;
