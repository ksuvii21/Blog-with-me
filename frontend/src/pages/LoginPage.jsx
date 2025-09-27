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
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Facebook,
  GitHub
} from '@mui/icons-material';
import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';

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

  const themeColors = {
    orange: { main: '#FF9800' },
    purple: { main: '#9C27B0' },
    gradient: { button: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)' }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Update Redux state
        dispatch(setCredentials({ user: data.user, token: data.token }));
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = (provider) => {
    // Implement social login logic
    console.log(`Logging in with ${provider}`);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue your journey"
    >
      <Fade in timeout={800}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Email Field */}
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
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

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
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
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

          {/* Forgot Password Link */}
          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Link 
              href="/forgot-password" 
              variant="body2"
              sx={{ 
                color: themeColors.purple.main,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Forgot your password?
            </Link>
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              mb: 3,
              borderRadius: 2,
              background: themeColors.gradient.button,
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(156, 39, 176, 0.4)'
              },
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
              Or continue with
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Social Login Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {[
              { provider: 'Google', icon: Google, color: '#DB4437' },
              { provider: 'Facebook', icon: Facebook, color: '#4267B2' },
              { provider: 'GitHub', icon: GitHub, color: '#333' }
            ].map((social) => (
              <Button
                key={social.provider}
                fullWidth
                variant="outlined"
                onClick={() => socialLogin(social.provider)}
                sx={{
                  py: 1.5,
                  borderColor: 'divider',
                  color: 'text.primary',
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: social.color,
                    backgroundColor: `${social.color}08`
                  }
                }}
              >
                <social.icon sx={{ color: social.color, mr: 1 }} />
                {social.provider}
              </Button>
            ))}
          </Box>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                sx={{ 
                  color: themeColors.orange.main,
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Fade>
    </AuthLayout>
  );
};

export default LoginPage;