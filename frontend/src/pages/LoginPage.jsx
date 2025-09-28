import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Fade,
  Zoom,
  Slide,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  LinkedIn,
  GitHub,
  Login,
  PersonAdd
} from '@mui/icons-material';
import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import api from '../utils/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const themeColors = {
    orange: { main: '#FF6B35', light: '#FF8E53' },
    purple: { main: '#6A1B9A', light: '#9C4DCC' },
    gradient: { 
      button: 'linear-gradient(45deg, #FF6B35 0%, #FF8E53 50%, #6A1B9A 100%)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate all fields
    const newTouched = {
      email: true,
      password: true
    };
    setTouched(newTouched);

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Store token and user in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Update Redux state
      dispatch(setCredentials({ user: response.data.user, token: response.data.token }));
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your blogging journey"
      backgroundGradient={themeColors.gradient.background}
    >
      <Slide in timeout={800} direction="up">
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                animation: 'shake 0.5s ease-in-out',
                '@keyframes shake': {
                  '0%, 100%': { transform: 'translateX(0)' },
                  '25%': { transform: 'translateX(-5px)' },
                  '75%': { transform: 'translateX(5px)' }
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Email Field */}
          <Zoom in timeout={600}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              error={touched.email && !formData.email}
              helperText={touched.email && !formData.email ? 'Email is required' : ''}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: themeColors.orange.main }} />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Zoom>

          {/* Password Field */}
          <Zoom in timeout={700}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              error={touched.password && !formData.password}
              helperText={touched.password && !formData.password ? 'Password is required' : ''}
              required
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: themeColors.orange.main }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: themeColors.orange.main }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Zoom>

          {/* Forgot Password Link */}
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'right', mb: 4 }}>
              <Link 
                href="/forgot-password" 
                variant="body2"
                sx={{ 
                  color: themeColors.purple.main,
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': { 
                    textDecoration: 'underline',
                    gap: 1,
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <Lock sx={{ fontSize: 16 }} />
                Forgot your password?
              </Link>
            </Box>
          </Fade>

          {/* Login Button */}
          <Fade in timeout={900}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Login />}
              sx={{
                py: 1.8,
                mb: 4,
                borderRadius: 3,
                background: themeColors.gradient.button,
                color: 'white',
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #E55A2B 0%, #FF7B47 50%, #5A1387 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Signing You In...' : 'Access Your Account'}
            </Button>
          </Fade>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ px: 2, color: 'text.secondary', fontWeight: 500 }}>
              Or continue with
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Social Login Buttons */}
          <Fade in timeout={1000}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
              {[
                { 
                  provider: 'Google', 
                  icon: Google, 
                  color: '#DB4437', 
                  bgColor: '#DB4437', 
                  link: '/' 
                },
                { 
                  provider: 'LinkedIn', 
                  icon: LinkedIn, 
                  color: '#0077B5', 
                  bgColor: '#0077B5', 
                  link: 'https://www.linkedin.com/in/kritika-gupta2106' 
                },
                { 
                  provider: 'GitHub', 
                  icon: GitHub, 
                  color: '#333', 
                  bgColor: '#1c1b1bff', 
                  link: 'https://github.com/ksuvii21' 
                }
              ].map((social) => (
                <IconButton
                  key={social.provider}
                  onClick={() => window.open(social.link, '_blank')}
                  sx={{
                    width: 56,
                    height: 56,
                    border: `2px solid ${social.bgColor}20`,
                    backgroundColor: `${social.bgColor}08`,
                    '&:hover': {
                      backgroundColor: `${social.bgColor}15`,
                      transform: 'scale(1.1)',
                      boxShadow: `0 8px 20px ${social.bgColor}30`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <social.icon sx={{ 
                    color: social.color,
                    fontSize: 28
                  }} />
                </IconButton>
              ))}
            </Box>
          </Fade>

          {/* Sign Up Link */}
          <Fade in timeout={1100}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                New to our community?
              </Typography>
              <Link 
                href="/register" 
                sx={{ 
                  color: themeColors.orange.main,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': { 
                    textDecoration: 'underline',
                    gap: 1,
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <PersonAdd sx={{ fontSize: 20 }} />
                Create your account
              </Link>
            </Box>
          </Fade>
        </Box>
      </Slide>
    </AuthLayout>
  );
};

export default LoginPage;