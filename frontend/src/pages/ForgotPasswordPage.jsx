import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Fade,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  InputAdornment,
  IconButton,
  Zoom,
  Slide,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Email,
  CheckCircle,
  Security,
  Google,
  LinkedIn,
  GitHub,
  Send,
  ArrowBack,
  MarkEmailRead
} from '@mui/icons-material';
import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [touched, setTouched] = useState(false);

  const themeColors = {
    orange: { main: '#FF6B35', light: '#FF8E53' },
    purple: { main: '#6A1B9A', light: '#9C4DCC' },
    gradient: { 
      button: 'linear-gradient(45deg, #FF6B35 0%, #FF8E53 50%, #6A1B9A 100%)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setActiveStep(1);
      // Add your actual password reset logic here
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: 'Enter your email',
      description: 'We will send a password reset link to your email address.',
      icon: <Email />
    },
    {
      label: 'Check your email',
      description: 'Click the link in the email to reset your password.',
      icon: <MarkEmailRead />
    },
    {
      label: 'Set new password',
      description: 'Create a new secure password for your account.',
      icon: <Security />
    }
  ];

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Get back into your account in a few simple steps"
      backgroundGradient={themeColors.gradient.background}
    >
      <Slide in timeout={800} direction="up">
        <Box sx={{ mt: 2 }}>
          {/* Progress Stepper */}
          <Stepper 
            activeStep={activeStep} 
            orientation="vertical" 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root': {
                padding: 1
              }
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel 
                  StepIconComponent={() => (
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: index <= activeStep ? themeColors.gradient.button : '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: index <= activeStep ? '0 4px 15px rgba(255, 107, 53, 0.3)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      {index < activeStep ? <CheckCircle /> : step.icon}
                    </Box>
                  )}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {!success ? (
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                Enter the email address associated with your account, and we'll send you a secure link to reset your password.
              </Typography>

              {/* Email Field */}
              <Zoom in timeout={600}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setTouched(true);
                    if (error) setError('');
                  }}
                  onBlur={() => setTouched(true)}
                  error={touched && !email}
                  helperText={touched && !email ? 'Email is required' : ''}
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

              {/* Send Reset Link Button */}
              <Fade in timeout={700}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
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
                  {loading ? 'Sending Secure Link...' : 'Send Reset Link'}
                </Button>
              </Fade>
            </Box>
          ) : (
            <Zoom in timeout={800}>
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ 
                  fontSize: 80, 
                  color: themeColors.orange.main,
                  mb: 3,
                  filter: 'drop-shadow(0 4px 12px rgba(255, 107, 53, 0.3))'
                }} />
                
                <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                  Check Your Email!
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                  We've sent a password reset link to <strong style={{ color: themeColors.orange.main }}>{email}</strong>. 
                  The link will expire in 1 hour for security reasons.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setSuccess(false);
                      setActiveStep(0);
                    }}
                    startIcon={<Send />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: themeColors.purple.main,
                      color: themeColors.purple.main,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: themeColors.purple.main,
                        backgroundColor: `${themeColors.purple.main}08`,
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Resend Email
                  </Button>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/login')}
                    startIcon={<ArrowBack />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: themeColors.gradient.button,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #E55A2B 0%, #FF7B47 50%, #5A1387 100%)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Back to Login
                  </Button>
                </Box>

                <Alert severity="info" sx={{ borderRadius: 2, textAlign: 'left' }}>
                  <Typography variant="body2">
                    <strong>Didn't receive the email?</strong> Check your spam folder or{' '}
                    <Link 
                      href="#" 
                      sx={{ 
                        color: themeColors.orange.main,
                        fontWeight: 600
                      }}
                      onClick={() => {
                        setSuccess(false);
                        setActiveStep(0);
                      }}
                    >
                      try again with a different email address
                    </Link>
                  </Typography>
                </Alert>
              </Box>
            </Zoom>
          )}

          {/* Social Links */}
          <Fade in timeout={900}>
            <Box sx={{ textAlign: 'center', mb: 4, mt: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                Or connect with
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
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
                    bgColor: '#1a1919ff', 
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
            </Box>
          </Fade>

          {/* Back to Login Link */}
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Remember your password?
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
                <ArrowBack sx={{ fontSize: 20 }} />
                Back to Sign In
              </Link>
            </Box>
          </Fade>
        </Box>
      </Slide>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;