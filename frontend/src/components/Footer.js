import React from 'react';
import { Box, Typography, Link, Stack, IconButton, Grid } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Send, WavingHand, RocketLaunch } from '@mui/icons-material';

// Theme Constants
const PRIMARY_GRADIENT = 'linear-gradient(45deg, #FF9800 30%, #E91E63 90%)'; // Orange to Pink/Purple
const DARK_BG = '#121212';
const DARK_SECONDARY_BG = '#1e1e1e';
const TEXT_LIGHT = '#e0e0e0';
const PURPLE_ACCENT = '#9C27B0';
const ORANGE_ACCENT = '#FF9800';


const Footer = () => {
  return (
    <Box 
      component="footer"
      sx={{
        background: DARK_BG, // Dark theme background
        color: TEXT_LIGHT,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
        py: { xs: 8, md: 10 }, 
        mt: 'auto',
        width: '100%'
      }}
    >
      <Box sx={{ maxWidth: 'xl', mx: 'auto', px: { xs: 3, md: 6 } }}>
        
        {/* Newsletter Subscription - Highly Contrasting Feature */}
        <Box sx={{ 
          background: DARK_SECONDARY_BG, // Slightly lighter dark box
          p: { xs: 4, sm: 6 }, 
          borderRadius: 4,
          mb: 8, 
          textAlign: 'center',
          border: `1px solid ${PURPLE_ACCENT}50`,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(255, 152, 0, 0.1)'
        }}>
            <RocketLaunch sx={{ position: 'absolute', top: 10, left: 10, opacity: 0.1, fontSize: 80, color: ORANGE_ACCENT }} />
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: 'white', zIndex: 1, letterSpacing: '1px' }}>
                Join the Writer's Circle
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: TEXT_LIGHT, maxWidth: 650, mx: 'auto', zIndex: 1 }}>
                Subscribe to our premium digest for exclusive insights, top-rated content, and platform news.
            </Typography>
            
            <Box sx={{
              display: 'flex', 
              gap: 2, 
              maxWidth: 500, 
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' },
              zIndex: 1
            }}>
                <Box sx={{ position: 'relative', flex: 1, width: '100%' }}>
                    <input 
                      type="email" 
                      placeholder="Your professional email address"
                      style={{
                          width: '100%',
                          padding: '15px 18px',
                          border: 'none', 
                          borderRadius: 8,
                          fontSize: '15px',
                          outline: 'none',
                          backgroundColor: '#2b2b2b', // Dark input field
                          color: TEXT_LIGHT,
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                          transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                          e.target.style.boxShadow = `0 0 0 3px ${ORANGE_ACCENT}40, inset 0 1px 3px rgba(0,0,0,0.5)`;
                      }}
                      onBlur={(e) => {
                          e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.5)';
                      }}
                    />
                </Box>
                <button
                    style={{
                        padding: '15px 28px',
                        background: PRIMARY_GRADIENT,
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 4px 18px rgba(233, 30, 99, 0.4)',
                        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-3px)'; // Pronounced lift
                        e.target.style.boxShadow = '0 8px 25px rgba(233, 30, 99, 0.7)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 18px rgba(233, 30, 99, 0.4)';
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
                      fontWeight="900"
                      sx={{ 
                        background: PRIMARY_GRADIENT,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2,
                        fontSize: '2.4rem',
                        letterSpacing: '-1px'
                      }}
                    >
                      Writely.log
                    </Typography>
                    <Typography variant="body1" color={TEXT_LIGHT} sx={{ mb: 4, opacity: 0.8 }}>
                      Crafting the future of storytelling. A platform built with passion for the global writing community.
                    </Typography>
                    
                    {/* Social Links */}
                    <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                      {[
                        { icon: Facebook, color: '#1877F2' },
                        { icon: Twitter, color: '#1DA1F2' },
                        { icon: Instagram, color: '#E4405F' },
                        { icon: LinkedIn, color: '#0077B5' }
                      ].map((social, index) => (
                        <IconButton
                          key={index}
                          size="medium"
                          sx={{
                            bgcolor: DARK_SECONDARY_BG,
                            color: TEXT_LIGHT,
                            border: '1px solid #333',
                            '&:hover': { 
                                bgcolor: social.color, 
                                color: 'white',
                                transform: 'scale(1.1) rotate(5deg)',
                                boxShadow: `0 4px 10px ${social.color}60`
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
                    
                    {/* Platform Links */}
                    <Grid item xs={6} sm={3}>
                        <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: ORANGE_ACCENT, mb: 1 }}>
                                Platform
                            </Typography>
                            <Stack spacing={1}>
                                {['Trending Topics', 'Start Writing', 'Author Payouts', 'Community Forum'].map((item) => (
                                    <Link 
                                        key={item}
                                        href="#" 
                                        variant="body2" 
                                        color={TEXT_LIGHT}
                                        sx={{ 
                                            textDecoration: 'none',
                                            opacity: 0.8,
                                            '&:hover': { 
                                                color: PURPLE_ACCENT,
                                                transform: 'translateX(6px)', // Deeper shift
                                                opacity: 1,
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

                    {/* Resources & Support */}
                    <Grid item xs={6} sm={3}>
                        <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: ORANGE_ACCENT, mb: 1 }}>
                                Support
                            </Typography>
                            <Stack spacing={1}>
                                {['Help Center', 'API Documentation', 'System Status', 'Feedback', 'Report Abuse'].map((item) => (
                                    <Link 
                                        key={item}
                                        href="#" 
                                        variant="body2" 
                                        color={TEXT_LIGHT}
                                        sx={{ 
                                            textDecoration: 'none',
                                            opacity: 0.8,
                                            '&:hover': { 
                                                color: PURPLE_ACCENT,
                                                transform: 'translateX(6px)',
                                                opacity: 1,
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

                    {/* Company */}
                    <Grid item xs={6} sm={3}>
                        <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: ORANGE_ACCENT, mb: 1 }}>
                                Company
                            </Typography>
                            <Stack spacing={1}>
                                {['About Us', 'Our Vision', 'Careers (Hiring!)', 'Press & Media', 'Contact Sales'].map((item) => (
                                    <Link 
                                        key={item}
                                        href="#" 
                                        variant="body2" 
                                        color={TEXT_LIGHT}
                                        sx={{ 
                                            textDecoration: 'none',
                                            opacity: 0.8,
                                            '&:hover': { 
                                                color: PURPLE_ACCENT,
                                                transform: 'translateX(6px)',
                                                opacity: 1,
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

                    {/* Legal */}
                    <Grid item xs={6} sm={3}>
                        <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: ORANGE_ACCENT, mb: 1 }}>
                                Legal
                            </Typography>
                            <Stack spacing={1}>
                                {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Security', 'GDPR Compliance'].map((item) => (
                                    <Link 
                                        key={item}
                                        href="#" 
                                        variant="body2" 
                                        color={TEXT_LIGHT}
                                        sx={{ 
                                            textDecoration: 'none',
                                            opacity: 0.8,
                                            '&:hover': { 
                                                color: PURPLE_ACCENT,
                                                transform: 'translateX(6px)',
                                                opacity: 1,
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
          borderColor: '#2b2b2b', 
          mt: 8,
          pt: 4,
          textAlign: 'center'
        }}>
          <Typography variant="body2" color={TEXT_LIGHT} opacity={0.6}>
            © {new Date().getFullYear()} Writely.log Inc. All rights reserved. 
            <span style={{ marginLeft: '16px', display: 'inline-flex', alignItems: 'center' }}>
                Made with <WavingHand sx={{ color: '#E91E63', fontSize: 16, mx: 0.5 }} /> for writers worldwide.
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;