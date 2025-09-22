import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials, setLoading, setError } from '../redux/slices/authSlice';
import api from '../utils/api';
import { Avatar, Button, TextField, Paper, Box, Typography, Grid, Fade } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      dispatch(setCredentials({ user, token }));
      navigate('/');
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Login failed'));
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
        <Paper elevation={8} sx={{ p: 5, maxWidth: 420, width: '100%', borderRadius: 6, boxShadow: 12, backdropFilter: 'blur(2px)', background: 'rgba(255,255,255,0.97)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'accent.main', width: 64, height: 64, boxShadow: 3 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h3" fontWeight={900} sx={{ mt: 1, mb: 2, color: 'primary.main', fontFamily: 'Merriweather, serif', letterSpacing: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontWeight: 500, fontSize: 17 }}>
              Sign in to your account or{' '}
              <Link to="/register" style={{ color: '#a21caf', fontWeight: 700 }}>
                create a new one
              </Link>
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  background: 'linear-gradient(90deg, #a21caf 0%, #6366f1 100%)',
                  color: '#fff',
                  boxShadow: 4,
                  textTransform: 'none',
                  '&:hover': { background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)' }
                }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/forgot-password" style={{ color: '#6366f1', fontWeight: 600, fontSize: 15 }}>
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginPage;
