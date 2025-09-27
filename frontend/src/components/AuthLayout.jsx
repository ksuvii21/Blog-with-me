// components/AuthLayout.jsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Star, Favorite, TrendingUp } from '@mui/icons-material';

const themeColors = {
  orange: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)'
  },
  purple: {
    light: '#BA68C8',
    main: '#9C27B0',
    dark: '#7B1FA2',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)'
  },
  gradient: {
    main: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 50%, #673AB7 100%)',
    card: 'linear-gradient(145deg, rgba(255,152,0,0.1) 0%, rgba(156,39,176,0.1) 100%)',
    button: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)'
  }
};

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #FFF3E0 0%, #F3E5F5 50%, #E8F4FD 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'rgba(255, 152, 0, 0.1)',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'rgba(156, 39, 176, 0.1)',
        animation: 'float 6s ease-in-out infinite reverse'
      }} />
      
      {/* Left Side - Illustration */}
      <Box sx={{
        flex: 1,
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        background: themeColors.gradient.main,
        color: 'white',
        position: 'relative'
      }}>
        {/* Decorative Elements */}
        <Box sx={{
          position: 'absolute',
          top: 40,
          left: 40,
          animation: 'pulse 2s infinite'
        }}>
          <Star sx={{ fontSize: 48, opacity: 0.3 }} />
        </Box>
        <Box sx={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          animation: 'pulse 2s infinite 1s'
        }}>
          <Favorite sx={{ fontSize: 48, opacity: 0.3 }} />
        </Box>
        
        <Box sx={{ 
          textAlign: 'center',
          maxWidth: 500,
          zIndex: 1
        }}>
          <TrendingUp sx={{ 
            fontSize: 80, 
            mb: 3,
            background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }} />
          
          <Typography variant="h2" fontWeight={900} sx={{ 
            mb: 3,
            background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Join Our Creative Community
          </Typography>
          
          <Typography variant="h6" sx={{ 
            opacity: 0.9,
            lineHeight: 1.6,
            mb: 4
          }}>
            Share your stories, connect with readers, and grow your audience with our powerful blogging platform.
          </Typography>
          
          {/* Features List */}
          <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            {[
              { icon: '✨', text: 'AI-powered writing suggestions' },
              { icon: '🎨', text: 'Beautiful customizable themes' },
              { icon: '📈', text: 'Advanced analytics dashboard' },
              { icon: '👥', text: 'Engage with a vibrant community' }
            ].map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ mr: 2, fontSize: 24 }}>{feature.icon}</Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>{feature.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right Side - Form */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: { xs: 4, md: 8 },
        paddingTop: { xs: 8, md: 12 },
        minHeight: '100vh'
      }}>
        <Box sx={{
          width: '100%',
          maxWidth: 450,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: { xs: 4, md: 6 },
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(156, 39, 176, 0.15)',
          border: '1px solid rgba(255, 152, 0, 0.2)'
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" fontWeight={900} sx={{
              background: themeColors.gradient.button,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>

          {children}
        </Box>
      </Box>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </Box>
  );
};

export default AuthLayout;