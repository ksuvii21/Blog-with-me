import React from 'react';
import { Box, Typography, Link, Stack, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
        width: '100%'
      }}
    >
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3 }}>
        {/* Main Footer Content */}
        <Stack 
          direction={{ xs: 'column', lg: 'row' }} 
          spacing={6}
          justifyContent="space-between"
          alignItems={{ xs: 'center', lg: 'flex-start' }}
          sx={{ mb: 4 }}
        >
          {/* Brand Section */}
          <Box sx={{ 
            textAlign: { xs: 'center', lg: 'left' },
            maxWidth: 300
          }}>
            <Typography 
              variant="h5" 
              fontWeight="bold"
              sx={{ 
                background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Writely-Log
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              A modern platform for writers and readers to share, discover, and connect through meaningful content.
            </Typography>
            
            {/* Social Links */}
            <Stack direction="row" spacing={1}>
              {[
                { icon: Facebook, color: '#1877F2' },
                { icon: Twitter, color: '#1DA1F2' },
                { icon: Instagram, color: '#E4405F' },
                { icon: LinkedIn, color: '#0077B5' }
              ].map((social, index) => (
                <IconButton
                  key={index}
                  sx={{
                    bgcolor: 'action.hover',
                    '&:hover': { bgcolor: social.color, color: 'white' },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* Links Grid */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 4, sm: 6, lg: 8 }}
            sx={{ textAlign: { xs: 'center', sm: 'left' } }}
          >
            {/* Company Links */}
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                Company
              </Typography>
              <Stack spacing={1}>
                {['About Us', 'Careers', 'Contact', 'Press'].map((item) => (
                  <Link 
                    key={item}
                    href="#" 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      textDecoration: 'none',
                      '&:hover': { 
                        color: 'primary.main',
                        transform: 'translateX(4px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Stack>

            {/* Resources Links */}
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                Resources
              </Typography>
              <Stack spacing={1}>
                {['Blog', 'Help Center', 'Community', 'Webinars'].map((item) => (
                  <Link 
                    key={item}
                    href="#" 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      textDecoration: 'none',
                      '&:hover': { 
                        color: 'primary.main',
                        transform: 'translateX(4px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Stack>

            {/* Legal Links */}
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                Legal
              </Typography>
              <Stack spacing={1}>
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item) => (
                  <Link 
                    key={item}
                    href="#" 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      textDecoration: 'none',
                      '&:hover': { 
                        color: 'primary.main',
                        transform: 'translateX(4px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* Newsletter Subscription */}
        <Box sx={{ 
          bgcolor: 'background.default', 
          p: 4, 
          borderRadius: 3,
          mb: 4,
          textAlign: 'center'
        }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Stay Updated
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Subscribe to our newsletter for the latest updates and articles.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            maxWidth: 400, 
            mx: 'auto',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <input 
              type="email" 
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: 8,
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            <button
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
              Subscribe
            </button>
          </Box>
        </Box>

        {/* Copyright */}
        <Box sx={{ 
          borderTop: '1px solid', 
          borderColor: 'divider', 
          pt: 4,
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 KSG Writely-Log. All rights reserved. | Made with ❤️ for writers and readers worldwide
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;