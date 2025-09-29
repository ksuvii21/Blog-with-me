import React from 'react';
import { Box, Typography, Link, Stack, IconButton, Grid, TextField, Button } from '@mui/material';
import { 
  Facebook, Twitter, Instagram, LinkedIn, Send, 
  RocketLaunch, Email, LocalFireDepartment,
  AutoStories, People, Visibility, Favorite
} from '@mui/icons-material';

// Orange and Purple Theme Colors (matching home page)
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
    hero: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 50%, #673AB7 100%)',
    button: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
    text: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 100%)'
  },
  background: {
    light: '#f8fafc',
    white: '#ffffff'
  },
  text: {
    primary: '#2d3748',
    secondary: '#718096'
  }
};

const Footer = () => {
  return (
    <Box 
      component="footer"
      sx={{
        background: themeColors.background.light,
        color: themeColors.text.primary,
        py: { xs: 6, md: 8 },
        mt: 'auto',
        width: '100%',
        borderTop: `1px solid #e2e8f0`
      }}
    >
      <Box sx={{ maxWidth: 'xl', mx: 'auto', px: { xs: 3, md: 6 } }}>
        
        {/* Enhanced Newsletter Section */}
        <Box sx={{ 
          background: themeColors.gradient.hero,
          p: { xs: 4, sm: 5 }, 
          borderRadius: 4,
          mb: 6, 
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 20px 40px rgba(255, 152, 0, 0.2)',
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
          
          <LocalFireDepartment sx={{ 
            fontSize: 48, 
            mb: 2, 
            opacity: 0.9,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }} />
          
          <Typography variant="h4" fontWeight="800" sx={{ mb: 2, letterSpacing: '-0.5px' }}>
            Join Our Writing Revolution
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
                background: 'linear-gradient(45deg, #FF6B35 30%, #C6426E 90%)',
                color: 'white',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5722 30%, #AD1457 90%)',
                  boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
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
                  background: themeColors.gradient.text,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  letterSpacing: '-1px'
                }}
              >
                Writely Log
              </Typography>
              
              <Typography variant="body1" color={themeColors.text.secondary} sx={{ mb: 3, lineHeight: 1.6 }}>
                Empowering writers worldwide with intuitive tools and a supportive community. Share your stories, grow your audience, and join the revolution.
              </Typography>
              
              {/* Community Stats */}
              <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color={themeColors.orange.main}>
                    50K+
                  </Typography>
                  <Typography variant="caption" color={themeColors.text.secondary}>
                    Writers
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color={themeColors.purple.main}>
                    100K+
                  </Typography>
                  <Typography variant="caption" color={themeColors.text.secondary}>
                    Stories
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color={themeColors.orange.main}>
                    2M+
                  </Typography>
                  <Typography variant="caption" color={themeColors.text.secondary}>
                    Readers
                  </Typography>
                </Box>
              </Box>
              
              {/* Social Links */}
              <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                {[
                  { icon: Facebook, color: themeColors.orange.main, hover: '#FF5722' },
                  { icon: Twitter, color: themeColors.orange.main, hover: '#FF5722' },
                  { icon: Instagram, color: themeColors.purple.main, hover: '#7B1FA2' },
                  { icon: LinkedIn, color: themeColors.purple.main, hover: '#7B1FA2' }
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    size="medium"
                    sx={{
                      bgcolor: 'white',
                      color: social.color,
                      border: `1px solid #e2e8f0`,
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
                  <Typography variant="h6" fontWeight="700" sx={{ color: themeColors.orange.main, mb: 1 }}>
                    Platform
                  </Typography>
                  <Stack spacing={1.5}>
                    {['Explore Stories', 'Start Writing', 'Writer Dashboard', 'Community Forum', 'Writing Challenges'].map((item) => (
                      <Link 
                        key={item}
                        href="#" 
                        variant="body2" 
                        color={themeColors.text.secondary}
                        sx={{ 
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': { 
                            color: themeColors.orange.main,
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
                  <Typography variant="h6" fontWeight="700" sx={{ color: themeColors.purple.main, mb: 1 }}>
                    Resources
                  </Typography>
                  <Stack spacing={1.5}>
                    {['Writing Tips', 'Style Guide', 'Blog', 'Tutorials', 'Webinars'].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        variant="body2"
                        color={themeColors.text.secondary}
                        sx={{
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            color: themeColors.purple.main,
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
                  <Typography variant="h6" fontWeight="700" sx={{ color: themeColors.orange.main, mb: 1 }}>
                    Company
                  </Typography>
                  <Stack spacing={1.5}>
                    {['About Us', 'Our Team', 'Careers', 'Press Kit', 'Contact'].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        variant="body2"
                        color={themeColors.text.secondary}
                        sx={{
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            color: themeColors.orange.main,
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
                  <Typography variant="h6" fontWeight="700" sx={{ color: themeColors.purple.main, mb: 1 }}>
                    Support
                  </Typography>
                  <Stack spacing={1.5}>
                    {['Help Center', 'Privacy Policy', 'Terms of Service', 'Status', 'Contact Support'].map((item) => (
                      <Link
                        key={item}
                        href="#"
                        variant="body2"
                        color={themeColors.text.secondary}
                        sx={{
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            color: themeColors.purple.main,
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
          borderTop: `1px solid #e2e8f0`, 
          mt: 5,
          pt: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2" color={themeColors.text.secondary}>
            © {new Date().getFullYear()} Writely.log. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color={themeColors.text.secondary}>
              Made with passion for
            </Typography>
            <AutoStories sx={{ color: themeColors.orange.main, fontSize: 18 }} />
            <Typography variant="body2" color={themeColors.text.secondary}>
              writers everywhere
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={3}>
            <Link href="#" variant="body2" color={themeColors.text.secondary} sx={{ textDecoration: 'none', '&:hover': { color: themeColors.orange.main } }}>
              Privacy
            </Link>
            <Link href="#" variant="body2" color={themeColors.text.secondary} sx={{ textDecoration: 'none', '&:hover': { color: themeColors.orange.main } }}>
              Terms
            </Link>
            <Link href="#" variant="body2" color={themeColors.text.secondary} sx={{ textDecoration: 'none', '&:hover': { color: themeColors.orange.main } }}>
              Cookies
            </Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;