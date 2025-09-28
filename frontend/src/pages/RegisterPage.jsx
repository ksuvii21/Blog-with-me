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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Container,
  Divider,
  CircularProgress,
  Zoom,
  Slide
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Google,
  LinkedIn,
  GitHub,
  HowToReg,
  Security,
  Group
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
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });

    // Validate password strength
    if (e.target.name === 'password') {
      validatePasswordStrength(e.target.value);
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true
    });
  };

  const validatePasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (strongRegex.test(password)) {
      setPasswordStrength('strong');
    } else if (mediumRegex.test(password)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'weak': return '#F44336';
      default: return 'transparent';
    }
  };

  const getPasswordHelperText = () => {
    if (!formData.password) return '';
    switch (passwordStrength) {
      case 'strong': return 'Strong password';
      case 'medium': return 'Medium strength - add special characters';
      case 'weak': return 'Weak - use uppercase, lowercase, numbers & 8+ characters';
      default: return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate all fields
    const newTouched = {
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    };
    setTouched(newTouched);

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch(setCredentials({ user: data.user, token: data.token }));
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
      title="Join Our Community"
      subtitle="Create your account and start your blogging journey"
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

          {/* Full Name Field */}
          <Zoom in timeout={600}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => handleBlur('fullName')}
              error={touched.fullName && !formData.fullName}
              helperText={touched.fullName && !formData.fullName ? 'Full name is required' : ''}
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
          </Zoom>

          {/* Email Field */}
          <Zoom in timeout={700}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              error={touched.email && !formData.email}
              helperText={touched.email && !formData.email ? 'Valid email is required' : ''}
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
          <Zoom in timeout={800}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              error={touched.password && !formData.password}
              helperText={getPasswordHelperText()}
              required
              sx={{ mb: 2 }}
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <Fade in>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  {[1, 2, 3].map((item) => (
                    <Box
                      key={item}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: item <= 
                          (passwordStrength === 'weak' ? 1 : 
                           passwordStrength === 'medium' ? 2 : 3) 
                          ? getPasswordStrengthColor() 
                          : '#e0e0e0',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: getPasswordStrengthColor(),
                    fontWeight: 600
                  }}
                >
                  {getPasswordHelperText()}
                </Typography>
              </Box>
            </Fade>
          )}

          {/* Confirm Password Field */}
          <Zoom in timeout={900}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              error={touched.confirmPassword && (!formData.confirmPassword || formData.password !== formData.confirmPassword)}
              helperText={
                touched.confirmPassword && 
                (formData.confirmPassword && formData.password !== formData.confirmPassword 
                  ? 'Passwords do not match' 
                  : '')
              }
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security sx={{ color: themeColors.orange.main }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: themeColors.orange.main }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Zoom>

          {/* Terms Agreement */}
          <Fade in timeout={1000}>
            <Box sx={{ mb: 4, p: 2, backgroundColor: 'rgba(255, 107, 53, 0.05)', borderRadius: 2 }}>
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
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    I agree to the{' '}
                    <Link 
                      component="button" 
                      type="button"
                      onClick={() => setTermsOpen(true)} 
                      sx={{ 
                        color: themeColors.orange.main, 
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link 
                      component="button" 
                      type="button"
                      onClick={() => setPrivacyOpen(true)} 
                      sx={{ 
                        color: themeColors.orange.main, 
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
            </Box>
          </Fade>

          {/* Register Button */}
          <Fade in timeout={1100}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <HowToReg />}
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
              {loading ? 'Creating Your Account...' : 'Start Your Journey'}
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

          {/* Social Registration */}
          <Fade in timeout={1200}>
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
                  bgColor: '#1c1c1cff', 
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

          {/* Login Link */}
          <Fade in timeout={1300}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Already part of our community?
              </Typography>
              <Link 
                href="/login" 
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
                <Group sx={{ fontSize: 20 }} />
                Sign in to your account
              </Link>
            </Box>
          </Fade>
        </Box>
      </Slide>

      {/* Terms Dialog */}
      <Dialog 
        open={termsOpen} 
        onClose={() => setTermsOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          background: themeColors.gradient.button,
          color: 'white',
          fontWeight: 700
        }}>
          Terms of Service
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            Welcome to Blog with Me! By using our platform, you agree to create and share original content responsibly. 
          </Typography>
          <Typography variant="body2" paragraph>
            • Users must respect copyright laws and avoid harmful content<br/>
            • Engage positively with the community<br/>
            • We reserve the right to moderate content<br/>
            • Accounts may be suspended for violations<br/>
            • All content must be original and respectful<br/>
            • No spam, offensive material, or illegal activities
          </Typography>
          <Typography variant="body2">
            By registering, you acknowledge that you are at least 13 years old and have the legal capacity to enter into this agreement.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setTermsOpen(false)}
            variant="contained"
            sx={{
              background: themeColors.gradient.button,
              borderRadius: 2
            }}
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog 
        open={privacyOpen} 
        onClose={() => setPrivacyOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          background: themeColors.gradient.button,
          color: 'white',
          fontWeight: 700
        }}>
          Privacy Policy
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            Your privacy matters to us. Here's how we protect your data:
          </Typography>
          <Typography variant="body2" paragraph>
            • We collect email, username, and profile data for personalized experiences<br/>
            • Blog content is public, but personal information is protected<br/>
            • Secure servers and no data sharing without consent<br/>
            • Cookies enhance user experience<br/>
            • No selling of personal data to third parties<br/>
            • Request data deletion anytime by contacting support
          </Typography>
          <Typography variant="body2">
            We comply with privacy laws and take reasonable measures to protect your information.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setPrivacyOpen(false)}
            variant="contained"
            sx={{
              background: themeColors.gradient.button,
              borderRadius: 2
            }}
          >
            Got It
          </Button>
        </DialogActions>
      </Dialog>
    </AuthLayout>
  );
};

export default RegisterPage;