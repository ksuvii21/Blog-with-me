import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  Fade,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Google,
  LinkedIn,
  GitHub
} from '@mui/icons-material';
import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const themeColors = {
    orange: { main: '#FF9800' },
    purple: { main: '#9C27B0' },
    gradient: { button: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)' }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.fullName,
          email: formData.email,
          password: formData.password,
          bio: '',
          profilePicture: ''
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
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our community and start sharing your stories"
    >
      <Fade in timeout={800}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Full Name Field */}
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: themeColors.orange.main }} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

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
            sx={{ mb: 3 }}
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

          {/* Confirm Password Field */}
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: themeColors.orange.main }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

          {/* Terms Agreement */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  sx={{
                    color: themeColors.orange.main,
                    '&.Mui-checked': {
                      color: themeColors.orange.main,
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the Terms of Service and Privacy Policy
                </Typography>
              }
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="terms and privacy tabs">
                <Tab label="Terms of Service" />
                <Tab label="Privacy Policy" />
              </Tabs>
              <Box sx={{ p: 2, border: '1px solid', borderTop: 'none', borderColor: 'divider' }}>
                {tabValue === 0 && (
                  <Typography variant="body2">
                    Welcome to Blog with Me! By using our platform, you agree to create and share original content responsibly. Users must respect copyright laws, avoid harmful content, and engage positively with the community. We reserve the right to moderate content and suspend accounts for violations. All content posted on our platform must be original and not infringe on any third-party rights. Users are prohibited from posting spam, offensive material, or content that promotes hate, violence, or illegal activities. We encourage respectful interactions and community building. Accounts found violating these terms may be suspended or terminated. By registering, you acknowledge that you are at least 13 years old and have the legal capacity to enter into this agreement. We may update these terms at any time, and continued use constitutes acceptance. Enjoy blogging and connecting with like-minded individuals!
                  </Typography>
                )}
                {tabValue === 1 && (
                  <Typography variant="body2">
                    Your privacy matters. We collect email, username, and profile data to provide personalized blogging experiences. Blog content is public, but personal information is protected. We use secure servers and do not share data without consent. We may collect information such as your IP address, browser type, and usage patterns to improve our services. Cookies are used to enhance user experience and remember preferences. We do not sell personal data to third parties, but may share aggregated, anonymized data for analytics. Users can request data deletion or updates by contacting support. We comply with applicable privacy laws and take reasonable measures to protect your information. By using our platform, you consent to these practices. For more details, please review our full privacy policy or contact us directly.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Register Button */}
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
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Social Registration */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Or sign up with
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {[
                { provider: 'Google', icon: Google, color: '#DB4437', link: '/' },
                { provider: 'LinkedIn', icon: LinkedIn, color: '#0077B5', link: 'https://www.linkedin.com/in/kritika-gupta2106' },
                { provider: 'GitHub', icon: GitHub, color: '#333', link: 'https://github.com/ksuvii21' }
              ].map((social) => (
                <IconButton
                  key={social.provider}
                  onClick={() => window.open(social.link, '_blank')}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: social.color,
                      backgroundColor: `${social.color}08`
                    }
                  }}
                >
                  <social.icon sx={{ color: social.color }} />
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link 
                href="/login" 
                sx={{ 
                  color: themeColors.orange.main,
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Fade>
    </AuthLayout>
  );
};

export default RegisterPage;