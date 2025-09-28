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
  IconButton
} from '@mui/material';
import {
  Email,
  CheckCircle,
  Security,
  Google,
  LinkedIn,
  GitHub
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

  const themeColors = {
    orange: { main: '#FF9800' },
    purple: { main: '#9C27B0' },
    gradient: { button: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
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
      description: 'We will send a password reset link to your email address.'
    },
    {
      label: 'Check your email',
      description: 'Click the link in the email to reset your password.'
    },
    {
      label: 'Set new password',
      description: 'Create a new secure password for your account.'
    }
  ];

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Get back into your account in few simple steps"
    >
      <Fade in timeout={800}>
        <Box sx={{ mt: 1 }}>
          {/* Progress Stepper */}
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel 
                  StepIconComponent={() => (
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: index <= activeStep ? themeColors.gradient.button : '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {index < activeStep ? <CheckCircle /> : index + 1}
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

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter the email address associated with your account, and we'll send you a link to reset your password.
              </Typography>

              {/* Email Field */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

              {/* Send Reset Link Button */}
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ 
                fontSize: 64, 
                color: themeColors.orange.main,
                mb: 2 
              }} />
              
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Check Your Email
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                We've sent a password reset link to <strong>{email}</strong>. 
                The link will expire in 1 hour for security reasons.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setSuccess(false)}
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    borderColor: themeColors.purple.main,
                    color: themeColors.purple.main,
                    '&:hover': {
                      borderColor: themeColors.purple.dark,
                      background: `${themeColors.purple.main}08`
                    }
                  }}
                >
                  Resend Email
                </Button>
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    background: themeColors.gradient.button,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)'
                    }
                  }}
                >
                  Back to Login
                </Button>
              </Box>

              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  Didn't receive the email? Check your spam folder or{' '}
                  <Link 
                    href="#" 
                    sx={{ 
                      color: themeColors.orange.main,
                      fontWeight: 600
                    }}
                    onClick={() => setSuccess(false)}
                  >
                    try again with a different email address
                  </Link>
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Social Links */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Or connect with
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

          {/* Back to Login Link */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{' '}
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

export default ForgotPasswordPage;