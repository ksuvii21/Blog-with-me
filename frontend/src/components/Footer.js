import React from 'react';
import { Box, Typography, Link, Stack, IconButton, Grid, TextField, Button } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Send, WavingHand, RocketLaunch, Email } from '@mui/icons-material';

// New Light Theme Colors
const PRIMARY_GRADIENT = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; // Beautiful purple gradient
const SECONDARY_GRADIENT = 'linear-gradient(45deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)'; // Pink gradient
const BACKGROUND_LIGHT = '#f8fafc';
const CARD_BACKGROUND = '#ffffff';
const TEXT_PRIMARY = '#2d3748';
const TEXT_SECONDARY = '#718096';
const ACCENT_PURPLE = '#805ad5';
const ACCENT_BLUE = '#4299e1';
const BORDER_LIGHT = '#e2e8f0';

const Footer = () => {
  return (
    <Box 
      component="footer"
      sx={{
        background: BACKGROUND_LIGHT,
        color: TEXT_PRIMARY,
        py: { xs: 6, md: 8 },
        mt: 'auto',
        width: '100%',
        borderTop: `1px solid ${BORDER_LIGHT}`
      }}
    >
      <Box sx={{ maxWidth: 'xl', mx: 'auto', px: { xs: 3, md: 6 } }}>
        
        {/* Enhanced Newsletter Section */}
        <Box sx={{ 
          background: PRIMARY_GRADIENT,
          p: { xs: 4, sm: 5 }, 
          borderRadius: 4,
          mb: 6, 
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decorative elements */}
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)'
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)'
          }} />
          
          <RocketLaunch sx={{ 
            fontSize: 48, 
            mb: 2, 
            opacity: 0.9,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }} />
          
          <Typography variant="h4" fontWeight="800" sx={{ mb: 2, letterSpacing: '-0.5px' }}>
            Join Our Writing Community
          </Typography>
          
          <Typography variant="body1" sx={{ 
            mb: 4, 
            maxWidth: 600, 
            mx: 'auto', 
            opacity: 0.9,
            fontSize: '1.1rem'
          }}>
            Get weekly writing tips, featured stories, and exclusive content delivered to your inbox.
          </Typography>
          
          <Box sx={{
            display: 'flex', 
            gap: 2, 
            maxWidth: 500, 
            mx: 'auto',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <TextField
              placeholder="Enter your email address"
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                }
              }}
            />
            <Button
              variant="contained"
              endIcon={<Send />}
              sx={{
                py: 1.5,
                px: 4,
                background: SECONDARY_GRADIENT,
                color: 'white',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(255, 154, 158, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF7B7F 0%, #FDB5E3 99%)',
                  boxShadow: '0 6px 20px rgba(255, 154, 158, 0.4)',
                }
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>

        {/* Main Footer Content */}
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand Section */}
          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ 
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: 350
            }}>
              <Typography 
                variant="h4" 
                fontWeight="900"
                sx={{ 
                  background: PRIMARY_GRADIENT,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  letterSpacing: '-1px'
                }}
              >
                Writely.log
              </Typography>
              
              <Typography variant="body1" color={TEXT_SECONDARY} sx={{ mb: 3, lineHeight: 1.6 }}>
                Empowering writers worldwide with intuitive tools and a supportive community. Share your stories, grow your audience.
              </Typography>
              
              {/* Social Links */}
              <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                {[
                  { icon: Facebook, color: '#1877F2', hover: '#1664D9' },
                  { icon: Twitter, color: '#1DA1F2', hover: '#1A91DA' },
                  { icon: Instagram, color: '#E4405F', hover: '#D32C52' },
                  { icon: LinkedIn, color: '#0077B5', hover: '#00669C' }
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    size="medium"
                    sx={{
                      bgcolor: 'white',
                      color: social.color,
                      border: `1px solid ${BORDER_LIGHT}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      '&:hover': { 
                        bgcolor: social.color, 
                        color: 'white',
                        boxShadow: `0 4px 12px ${social.color}40`,
                        transform: 'translateY(-2px)'
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
                  <Typography variant="h6" fontWeight="700" sx={{ color: ACCENT_PURPLE, mb: 1 }}>
                    Platform
                  </Typography>
                  <Stack spacing={1.5}>
                    {['Explore Stories', 'Start Writing', 'Writer Dashboard', 'Community Forum', 'Writing Challenges'].map((item) => (
                      <Link 
                        key={item}
                        href="#" 
                        variant="body2" 
                        color={TEXT_SECONDARY}
                        sx={{ 
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': { 
                            color: ACCENT_PURPLE,
                            transform: 'translateX(2px)',
                            transition: 'all 0.2s ease'
                          }
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </Stack>
                </Stack>
              </Grid>

              {/* Resources */}
              <Grid item xs={6} sm={3}>
                <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h6" fontWeight="700" sx={{ color: ACCENT_BLUE, mb: 1 }}>
                    Resources
                  </Typography>
                  <Stack spacing={1.5}>
                    {['Writing Tips', 'Style Guide', 'Blog', 'Tutorials', 'Webinars'].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        variant="body2"
                        color={TEXT_SECONDARY}
                        sx={{
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            color: ACCENT_BLUE,
                            transform: 'translateX(2px)',
                            transition: 'all 0.2s ease'
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
                  <Typography variant="h6" fontWeight="700" sx={{ color: ACCENT_PURPLE, mb: 1 }}>
                    Company
                  </Typography>
                  <Stack spacing={1.5}>
                    {['About Us', 'Our Team', 'Careers', 'Press Kit', 'Contact'].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        variant="body2"
                        color={TEXT_SECONDARY}
                        sx={{
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            color: ACCENT_PURPLE,
                            transform: 'translateX(2px)',
                            transition: 'all 0.2s ease'
                          }
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </Stack>
                </Stack>
              </Grid>

              {/* Support */}
              <Grid item xs={6} sm={3}>
                <Stack spacing={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h6" fontWeight="700" sx={{ color: ACCENT_BLUE, mb: 1 }}>
                    Support
                  </Typography>
                  <Stack spacing={1.5}>
                    {['Help Center', 'Privacy Policy', 'Terms of Service', 'Status', 'Contact Support'].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        variant="body2"
                        color={TEXT_SECONDARY}
                        sx={{
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            color: ACCENT_BLUE,
                            transform: 'translateX(2px)',
                            transition: 'all 0.2s ease'
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

        {/* Bottom Bar */}
        <Box sx={{ 
          borderTop: `1px solid ${BORDER_LIGHT}`, 
          mt: 5,
          pt: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2" color={TEXT_SECONDARY}>
            © {new Date().getFullYear()} Writely.log. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color={TEXT_SECONDARY}>
              Made with
            </Typography>
            <WavingHand sx={{ color: '#FF9A9E', fontSize: 18 }} />
            <Typography variant="body2" color={TEXT_SECONDARY}>
              for writers everywhere
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={3}>
            <Link href="#" variant="body2" color={TEXT_SECONDARY} sx={{ textDecoration: 'none', '&:hover': { color: ACCENT_PURPLE } }}>
              Privacy
            </Link>
            <Link href="#" variant="body2" color={TEXT_SECONDARY} sx={{ textDecoration: 'none', '&:hover': { color: ACCENT_PURPLE } }}>
              Terms
            </Link>
            <Link href="#" variant="body2" color={TEXT_SECONDARY} sx={{ textDecoration: 'none', '&:hover': { color: ACCENT_PURPLE } }}>
              Cookies
            </Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;