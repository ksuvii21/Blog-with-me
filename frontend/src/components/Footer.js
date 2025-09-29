import React from 'react';
import { Box, Typography, Link, Stack, IconButton, Grid } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Send, Public } from '@mui/icons-material';

// Theme Constants based on HomePage.js
const LIGHT_GRADIENT_BG = 'linear-gradient(135deg, #FFF3E0 0%, #F3E5F5 100%)';
const PRIMARY_GRADIENT = 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)';
const NEWSLETTER_GRADIENT_BG = 'linear-gradient(135deg, #FFD700 10%, #FF9800 100%)'; // Gold/Orange for contrast
const ORANGE_MAIN = '#FF9800';
const PURPLE_MAIN = '#9C27B0';


const Footer = () => {
  return (
    <Box 
      component="footer"
      sx={{
        background: LIGHT_GRADIENT_BG, // Light theme background
        boxShadow: '0 -2px 15px rgba(0,0,0,0.05)', // Subtle top shadow
        py: 8, // Increased vertical padding
        mt: 'auto',
        width: '100%'
      }}
    >
      <Box sx={{ maxWidth: 'xl', mx: 'auto', px: { xs: 3, md: 5 } }}>
        {/* Newsletter Subscription - Made Prominent and Interactive */}
        <Box sx={{ 
          background: NEWSLETTER_GRADIENT_BG, // Vivid background
          p: { xs: 4, sm: 6 }, 
          borderRadius: 4,
          mb: 8, // More spacing below
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(255, 152, 0, 0.3)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
            <Public sx={{ position: 'absolute', top: 10, right: 10, opacity: 0.1, fontSize: 80 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: 'white', zIndex: 1 }}>
                Join Our Newsletter!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto', zIndex: 1 }}>
                Get the best stories, writing tips, and platform updates delivered straight to your inbox.
            </Typography>
            
            <Box sx={{
              display: 'flex', 
              gap: 2, 
              maxWidth: 450, 
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' },
              zIndex: 1
            }}>
                <Box sx={{ position: 'relative', flex: 1, width: '100%' }}>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: 'none', // Removed border
                          borderRadius: 8,
                          fontSize: '15px',
                          outline: 'none',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                          transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                          e.target.style.boxShadow = `0 0 0 3px ${PURPLE_MAIN}40, 0 2px 10px rgba(0,0,0,0.15)`;
                      }}
                      onBlur={(e) => {
                          e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
                      }}
                    />
                </Box>
                <button
                    style={{
                        padding: '14px 24px',
                        background: PRIMARY_GRADIENT,
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 4px 15px rgba(156, 39, 176, 0.4)',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(156, 39, 176, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(156, 39, 176, 0.4)';
                    }}
                >
                    <Send sx={{ fontSize: 18, mr: 1 }} /> Subscribe
                </button>
            </Box>
        </Box>

        {/* Main Footer Content */}
        <Grid container spacing={5} justifyContent="space-between">
            {/* Brand Section */}
            <Grid item xs={12} md={4} lg={3}>
                <Box sx={{ 
                    textAlign: { xs: 'center', md: 'left' },
                    maxWidth: 350
                }}>
                    <Typography 
                      variant="h5" 
                      fontWeight="bold"
                      sx={{ 
                        background: PRIMARY_GRADIENT,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2,
                        fontSize: '2.1rem'
                      }}
                    >
                      Writely-Log
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      A modern platform for writers and readers to share, discover, and connect through meaningful content.
                    </Typography>
                    
                    {/* Social Links */}
                    <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                      {[
                        { icon: Facebook, color: '#1877F2' },
                        { icon: Twitter, color: '#1DA1F2' },
                        { icon: Instagram, color: '#E4405F' },
                        { icon: LinkedIn, color: '#0077B5' }
                      ].map((social, index) => (
                        <IconButton
                          key={index}
                          size="large"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.7)',
                            border: '1px solid #ddd',
                            '&:hover': { 
                                bgcolor: social.color, 
                                color: 'white',
                                transform: 'scale(1.1) rotate(5deg)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <social.icon />
                        </IconButton>
                      ))}
                    </Stack>
                </Box>
            </Grid>

            {/* Links Grid */}
            <Grid item xs={12} md={8} lg={9}>
                <Grid container spacing={4} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                    
                    {/* Company Links */}
                    <Grid item xs={6} sm={3}>
                        <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: PURPLE_MAIN }}>
                                Company
                            </Typography>
                            <Stack spacing={1}>
                                {['About Us', 'Careers', 'Contact', 'Press', 'Investors'].map((item) => (
                                    <Link 
                                        key={item}
                                        href="#" 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                            textDecoration: 'none',
                                            '&:hover': { 
                                                color: ORANGE_MAIN, // Orange hover color
                                                transform: 'translateX(4px) scale(1.02)', // Enhanced interaction
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }
                                        }}
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Resources Links */}
                    <Grid item xs={6} sm={3}>
                        <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: PURPLE_MAIN }}>
                                Resources
                            </Typography>
                            <Stack spacing={1}>
                                {['Blog', 'Help Center', 'Community', 'Webinars', 'API Docs'].map((item) => (
                                    <Link 
                                        key={item}
                                        href="#" 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                            textDecoration: 'none',
                                            '&:hover': { 
                                                color: ORANGE_MAIN,
                                                transform: 'translateX(4px) scale(1.02)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }
                                        }}
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Quick Links (Added Variety) */}
                    <Grid item xs={6} sm={3}>
                        <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: PURPLE_MAIN }}>
                                Discover
                            </Typography>
                            <Stack spacing={1}>
                                {['Trending', 'Popular Authors', 'Editor\'s Pick', 'New Releases', 'Podcast'].map((item) => (
                                    <Link 
                                        key={item}
                                        href="#" 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                            textDecoration: 'none',
                                            '&:hover': { 
                                                color: ORANGE_MAIN,
                                                transform: 'translateX(4px) scale(1.02)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }
                                        }}
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Legal Links */}
                    <Grid item xs={6} sm={3}>
                        <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: PURPLE_MAIN }}>
                                Legal
                            </Typography>
                            <Stack spacing={1}>
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'DMCA', 'Accessibility'].map((item) => (
                                    <Link 
                                        key={item}
                                        href="#" 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                            textDecoration: 'none',
                                            '&:hover': { 
                                                color: ORANGE_MAIN,
                                                transform: 'translateX(4px) scale(1.02)',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }
                                        }}
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ 
          borderTop: '1px solid', 
          borderColor: '#e0e0e0', 
          mt: 8,
          pt: 4,
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Writely-Log. All rights reserved. Designed with passion.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;