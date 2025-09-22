import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, TextField, Paper, Box, Typography, Fade } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import api from '../utils/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
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
              <LockResetIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight={900} sx={{ mt: 1, mb: 2, color: 'primary.main', fontFamily: 'Merriweather, serif', letterSpacing: 1 }}>
              Forgot Password
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontWeight: 500, fontSize: 17 }}>
              Enter your email to receive a password reset link.
            </Typography>
            {submitted ? (
              <Typography color="success.main" sx={{ mb: 2, fontWeight: 700, fontSize: 17 }}>
                If an account exists, a reset link has been sent to your email.
              </Typography>
            ) : (
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
                {error && (
                  <Typography color="error" sx={{ mt: 1, mb: 1 }}>
                    {error}
                  </Typography>
                )}
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
                  Send Reset Link
                </Button>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <Link to="/login" style={{ color: '#a21caf', fontWeight: 700, fontSize: 16 }}>
                Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ForgotPasswordPage;
