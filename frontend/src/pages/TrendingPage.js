import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import {
  Box, Button, Typography, Paper, Fade, Container, Chip, Stack, IconButton,
  Drawer, Avatar, Badge, Grid, Zoom, Slide, alpha, Card, CardContent,
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  TrendingUp, Menu, Whatshot, Favorite, Visibility, AccessTime,
  LocalFireDepartment, EmojiEvents, RocketLaunch, FlashOn,
  BarChart, TrendingFlat, NewReleases, Search, FilterList, People
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';

// Orange and Purple Theme Colors
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
    card: 'linear-gradient(145deg, rgba(255,152,0,0.1) 0%, rgba(156,39,176,0.1) 100%)',
    button: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)'
  }
};

// Floating Fire Keyframes
const floatFire = keyframes`
  0% {
    transform: translateY(-50px) rotate(0deg) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
    transform: scale(1.2);
  }
  40% {
    transform: scale(1.5);
    opacity: 1;
  }
  90% {
    opacity: 0.7;
    transform: scale(0.9);
  }
  100% {
    transform: translateY(120vh) rotate(360deg) scale(0.5);
    opacity: 0;
  }
`;

// Floating Fire Animation - Enhanced like homepage
const FloatingFireAnimation = () => {
  const fireElements = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
    size: 20 + Math.random() * 30,
    type: ['🔥', '💥', '✨', '🌟', '⚡'][Math.floor(Math.random() * 5)],
    rotation: Math.random() * 360
  }));

  return (
    <Box sx={{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 1 // Changed from 0 to 1, but keep it below the menu button (zIndex: 9999)
}}>
      {/* Special Fire Elements - Left and Right */}
      <Box
        sx={{
          position: 'absolute',
          left: '5%',
          top: '25%',
          width: '400px',
          height: '400px',
          animation: `floatFire 6s ease-in-out infinite`,
          animationDelay: '0s',
          opacity: 0.8,
          filter: 'drop-shadow(0 0 15px rgba(255, 107, 53, 0.6))',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '120px'
        }}
      >
        🔥
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: '8%',
          top: '20%',
          width: '300px',
          height: '300px',
          animation: `floatFire 8s ease-in-out infinite`,
          animationDelay: '2s',
          opacity: 0.7,
          filter: 'drop-shadow(0 0 12px rgba(255, 107, 53, 0.5))',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '80px'
        }}
      >
        ✨
      </Box>

      {fireElements.map((item) => (
        <Box
          key={item.id}
          sx={{
            position: 'absolute',
            left: `${item.left}%`,
            top: '-50px',
            fontSize: `${item.size}px`,
            animation: `fallFire ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
            opacity: 0.6,
            transform: `rotate(${item.rotation}deg)`,
            filter: 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.4))'
          }}
        >
          {item.type}
        </Box>
      ))}
      <style jsx>{`
        @keyframes fallFire {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes floatFire {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(2deg);
          }
          66% {
            transform: translateY(-8px) rotate(-1deg);
          }
        }
      `}</style>
    </Box>
  );
};

const TrendingPage = () => {
  const { blogs, isLoading, error } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('week');
  const [trendingMetrics, setTrendingMetrics] = useState({
    totalEngagement: 0,
    trendingWriters: 0,
    viralStories: 0
  });

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Enhanced trending algorithm with multiple factors
  const trendingBlogs = blogs
    .filter(blog => {
      const blogDate = new Date(blog.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - blogDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (timeframe) {
        case 'today':
          return diffDays <= 1;
        case 'week':
          return diffDays <= 7;
        case 'month':
          return diffDays <= 30;
        default:
          return true;
      }
    })
    .map(blog => {
    // Fix: Handle both array and number formats for likes
    const likes = Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0);
    const views = blog.views || 0;
    const comments = Array.isArray(blog.comments) ? blog.comments.length : (blog.comments || 0);
    const shares = blog.shares || 0;
    
    // Enhanced trending score calculation
    const recency = Math.max(0, 1 - (new Date() - new Date(blog.createdAt)) / (7 * 24 * 60 * 60 * 1000));
    const engagementRate = (likes + comments * 2 + shares * 3) / Math.max(views, 1);
    const trendingScore = (likes * 1 + views * 0.1 + comments * 2 + shares * 3) * (1 + recency) * (1 + engagementRate);
    
    return {
      ...blog,
      trendingScore,
      engagementRate,
      // Add formatted counts for display
      formattedLikes: likes,
      formattedComments: comments
    };
  })
  .sort((a, b) => b.trendingScore - a.trendingScore)
  .slice(0, 20);

  // Update trending metrics
  useEffect(() => {
    if (trendingBlogs.length > 0) {
      setTrendingMetrics({
        totalEngagement: trendingBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0) + (blog.views || 0), 0),
        trendingWriters: new Set(trendingBlogs.map(blog => blog.author?.username)).size,
        viralStories: trendingBlogs.filter(blog => blog.trendingScore > 1000).length
      });
    }
  }, [trendingBlogs]);

  const timeframes = [
    { value: 'today', label: 'Today', icon: FlashOn, color: '#FF6B35' },
    { value: 'week', label: 'This Week', icon: TrendingUp, color: '#FF9800' },
    { value: 'month', label: 'This Month', icon: Whatshot, color: '#F44336' }
  ];

  // Top trending categories
  const trendingCategories = trendingBlogs
    .flatMap(blog => blog.categories || [])
    .reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  
  const topCategories = Object.entries(trendingCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));

  return (
    <>
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            boxShadow: '0 20px 60px rgba(255,152,0,0.3)',
            border: 'none',
            borderRadius: '0 24px 24px 0',
            background: themeColors.gradient.hero,
          },
        }}
      >
        <Sidebar isMobile={true} toggleSidebar={() => setSidebarOpen(false)} />
      </Drawer>

      {/* Enhanced Hero Section - Matching HomePage Style */}
      <Box sx={{
        width: '100%',
        minHeight: '80vh',
        position: 'relative',
        background: themeColors.gradient.hero,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1
        }
      }}>
        <FloatingFireAnimation />

// In TrendingPage component, replace the mobile menu button section:

{/* Mobile Menu Button - Fixed positioning */}
<Box sx={{ 
  position: 'fixed', // Changed from absolute to fixed
  top: 20, 
  left: 20, 
  zIndex: 9999, // Increased z-index to ensure it's on top
  display: { xs: 'block', md: 'none' } 
}}>
  <IconButton
    onClick={() => setSidebarOpen(true)}
    sx={{
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255,255,255,0.3)',
      color: 'white',
      '&:hover': {
        background: 'rgba(255,255,255,0.3)',
        transform: 'scale(1.1)'
      },
      transition: 'all 0.3s ease',
      width: 50,
      height: 50
    }}
  >
    <Menu sx={{ fontSize: 28 }} />
  </IconButton>
</Box>

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={600}>
            <Box textAlign="center">
              {/* Timeframe Selector */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                  {timeframes.map((tf) => (
                    <Button
                      key={tf.value}
                      variant={timeframe === tf.value ? 'contained' : 'outlined'}
                      startIcon={<tf.icon />}
                      onClick={() => setTimeframe(tf.value)}
                      sx={{
                        px: 4,
                        py: 2,
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        background: timeframe === tf.value ? themeColors.gradient.button : 'rgba(255,255,255,0.1)',
                        border: `2px solid ${timeframe === tf.value ? 'transparent' : 'rgba(255,255,255,0.3)'}`,
                        color: timeframe === tf.value ? 'white' : 'white',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                          background: timeframe === tf.value ? themeColors.gradient.button : 'rgba(255,255,255,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {tf.label}
                    </Button>
                  ))}
                </Stack>
              </Box>

              {/* Main Hero Content */}
              <Typography variant="h1" sx={{
                fontSize: { xs: '3rem', md: '5rem' },
                fontWeight: 900,
                mb: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #FFE082 50%, #ffffff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(255,255,255,0.5)',
                lineHeight: 1.1
              }}>
                🔥 TRENDING NOW
              </Typography>

              <Typography variant="h4" sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 600,
                mb: 4,
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.4
              }}>
                Discover the hottest stories, viral content, and trending topics that everyone's talking about
              </Typography>

              {/* Trending Metrics */}
              <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
                <Grid item xs={6} md={3}>
                  <Box sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#FFE082', mb: 1 }}>
                      {trendingMetrics.totalEngagement.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Total Engagement
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#FFE082', mb: 1 }}>
                      {trendingMetrics.trendingWriters}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Trending Writers
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#FFE082', mb: 1 }}>
                      {trendingMetrics.viralStories}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Viral Stories
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#FFE082', mb: 1 }}>
                      {trendingBlogs.length}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Hot Stories
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* CTA Button */}
              <Button
                variant="contained"
                size="large"
                startIcon={<TrendingUp />}
                sx={{
                  px: 8,
                  py: 3,
                  borderRadius: 4,
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #ffffff 0%, #FFE082 100%)',
                  color: themeColors.orange.dark,
                  boxShadow: '0 10px 30px rgba(255,255,255,0.3)',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: '0 20px 40px rgba(255,255,255,0.4)',
                    background: 'linear-gradient(45deg, #FFE082 0%, #ffffff 100%)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Explore Trending
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 8, background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)' }}>
        <Fade in timeout={800}>
          <Container maxWidth="xl">
            {/* Search/Filter Section - Matching HomePage Style */}
            <Fade in timeout={1000}>
              <Card sx={{
                p: 4,
                mb: 8,
                borderRadius: 4,
                background: themeColors.gradient.card,
                border: `2px solid ${alpha(themeColors.orange.main, 0.2)}`,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <Typography variant="h4" fontWeight="800" sx={{
                  mb: 4,
                  background: themeColors.gradient.hero,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🔍 Discover Trending Content
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      placeholder="Search trending topics..."
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          background: 'white',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: themeColors.orange.main
                            }
                          },
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: themeColors.orange.main,
                              borderWidth: 2
                            }
                          }
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: themeColors.orange.main }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Sort By</InputLabel>
                      <Select
                        value="score"
                        label="Sort By"
                        sx={{
                          borderRadius: 3,
                          background: 'white',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: themeColors.orange.main
                            }
                          },
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: themeColors.orange.main,
                              borderWidth: 2
                            }
                          }
                        }}
                      >
                        <MenuItem value="score">Trending Score</MenuItem>
                        <MenuItem value="views">Most Viewed</MenuItem>
                        <MenuItem value="likes">Most Liked</MenuItem>
                        <MenuItem value="recent">Most Recent</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{
                        height: 56,
                        borderRadius: 3,
                        background: themeColors.gradient.button,
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(255, 152, 0, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <FilterList sx={{ mr: 1 }} />
                      Apply Filters
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Fade>

            {/* Trending Categories */}
            {topCategories.length > 0 && (
              <Box sx={{ mb: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                  <LocalFireDepartment sx={{ fontSize: 40, color: themeColors.orange.main, mr: 2 }} />
                  <Typography variant="h2" fontWeight="800" sx={{
                    background: themeColors.gradient.hero,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center'
                  }}>
                    Hot Categories
                  </Typography>
                </Box>

                <Grid container spacing={2} justifyContent="center">
                  {topCategories.map((cat, index) => (
                    <Grid item key={cat.category}>
                      <Zoom in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Chip
                          icon={<Whatshot sx={{ color: '#FF6B35' }} />}
                          label={`${cat.category} (${cat.count})`}
                          sx={{
                            px: 2,
                            py: 3,
                            fontSize: '1rem',
                            fontWeight: 700,
                            background: themeColors.gradient.button,
                            color: 'white',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              boxShadow: '0 8px 20px rgba(255, 107, 53, 0.4)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Featured Trending Writers - New Section */}
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                <People sx={{ fontSize: 40, color: themeColors.purple.main, mr: 2 }} />
                <Typography variant="h2" fontWeight="800" sx={{
                  background: themeColors.gradient.hero,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center'
                }}>
                  Trending Writers
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {[
                  { name: 'Sarah Chen', followers: 2500, stories: 45, avatar: '', bio: 'Tech innovator & AI enthusiast' },
                  { name: 'Marcus Rodriguez', followers: 1800, stories: 32, avatar: '', bio: 'Travel blogger & photographer' },
                  { name: 'Emma Thompson', followers: 3200, stories: 67, avatar: '', bio: 'Lifestyle & wellness expert' },
                  { name: 'David Park', followers: 1400, stories: 28, avatar: '', bio: 'Business & finance writer' }
                ].map((writer, index) => (
                  <Grid item xs={12} sm={6} md={3} key={writer.name}>
                    <Zoom in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card sx={{
                        height: '100%',
                        borderRadius: 3,
                        background: themeColors.gradient.card,
                        border: `2px solid ${alpha(themeColors.purple.main, 0.2)}`,
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          borderColor: themeColors.purple.main,
                          boxShadow: `0 15px 35px ${alpha(themeColors.purple.main, 0.2)}`
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <Avatar
                            sx={{
                              width: 80,
                              height: 80,
                              mx: 'auto',
                              mb: 2,
                              border: `3px solid ${themeColors.purple.main}`,
                              background: themeColors.gradient.button,
                              fontSize: '2rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {writer.name.charAt(0)}
                          </Avatar>

                          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: themeColors.purple.dark }}>
                            {writer.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                            {writer.bio}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight="bold" color={themeColors.orange.main}>
                                {writer.followers.toLocaleString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Followers
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" fontWeight="bold" color={themeColors.purple.main}>
                                {writer.stories}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Stories
                              </Typography>
                            </Box>
                          </Box>

                          <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            sx={{
                              borderRadius: 2,
                              background: themeColors.gradient.button,
                              fontWeight: 600,
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 25px ${alpha(themeColors.orange.main, 0.4)}`
                              }
                            }}
                          >
                            Follow
                          </Button>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Viral Stories Section */}
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <RocketLaunch sx={{ fontSize: 40, color: themeColors.purple.main, mr: 2 }} />
                  <Typography variant="h2" fontWeight="800" sx={{
                    background: themeColors.gradient.hero,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    🔥 Viral Stories
                  </Typography>
                </Box>
                <Chip
                  icon={<NewReleases />}
                  label={`${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}'s Top Picks`}
                  sx={{
                    bgcolor: themeColors.gradient.button,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 2
                  }}
                />
              </Box>

              {isLoading ? (
                <Box textAlign="center" py={10}>
                  <Box sx={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                  }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      border: '4px solid',
                      borderColor: themeColors.orange.light,
                      borderTopColor: themeColors.orange.main,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <Typography variant="h4" color={themeColors.orange.main} fontWeight={600}>
                      Analyzing Trends...
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Finding the hottest content right now
                    </Typography>
                  </Box>
                </Box>
              ) : error ? (
                <Zoom in timeout={800}>
                  <Card sx={{
                    p: 8,
                    textAlign: 'center',
                    borderRadius: 4,
                    background: themeColors.gradient.card,
                    border: `2px solid ${alpha('#ff4444', 0.3)}`,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                  }}>
                    <Favorite sx={{ fontSize: 80, color: '#ff4444', mb: 3, opacity: 0.6 }} />
                    <Typography variant="h3" fontWeight="bold" gutterBottom color="error">
                      Oops! Something went wrong
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                      We couldn't load trending content. Please try again.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => dispatch(fetchBlogs())}
                      size="large"
                      sx={{
                        background: themeColors.gradient.button,
                        borderRadius: 4,
                        px: 6,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}
                    >
                      Try Again
                    </Button>
                  </Card>
                </Zoom>
              ) : trendingBlogs.length > 0 ? (
                <>
                  <Grid container spacing={4}>
                    {trendingBlogs.map((blog, index) => (
                      <Grid item xs={12} sm={6} lg={4} key={blog._id}>
                        <Fade in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                          <Box sx={{ 
                            position: 'relative',
                            '&:hover': {
                              transform: 'translateY(-12px)',
                              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                            }
                          }}>
                            {/* Trending Badge with Rank */}
                            <Box sx={{
                              position: 'absolute',
                              top: -12,
                              right: -12,
                              zIndex: 2,
                              background: index < 3 ? 
                                (index === 0 ? 'linear-gradient(45deg, #FFD700, #FF6B35)' :
                                 index === 1 ? 'linear-gradient(45deg, #C0C0C0, #B0B0B0)' :
                                 'linear-gradient(45deg, #CD7F32, #8B4513)') : 
                                themeColors.gradient.button,
                              color: 'white',
                              borderRadius: '50%',
                              width: 50,
                              height: 50,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                              fontSize: '1.2rem',
                              fontWeight: 'bold'
                            }}>
                              {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                            </Box>

                            {/* Engagement Indicator */}
                            <Box sx={{
                              position: 'absolute',
                              top: 16,
                              left: 16,
                              zIndex: 2,
                              background: 'rgba(255,255,255,0.9)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: 3,
                              px: 2,
                              py: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              color: themeColors.orange.dark
                            }}>
                              <LocalFireDepartment sx={{ fontSize: 16 }} />
                              {Math.round(blog.trendingScore / 100)}K
                            </Box>

                            <BlogCard blog={blog} />
                          </Box>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Zoom in timeout={800}>
                  <Card sx={{
                    p: 8,
                    textAlign: 'center',
                    borderRadius: 4,
                    background: themeColors.gradient.card,
                    border: `2px solid ${alpha(themeColors.purple.main, 0.2)}`,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                  }}>
                    <Whatshot sx={{ fontSize: 80, color: themeColors.orange.main, mb: 3, opacity: 0.6 }} />
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
                      background: themeColors.gradient.button,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      No Trending Content Yet
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                      Check back later for the latest trending posts and viral stories!
                    </Typography>
                    <Button
                      variant="contained"
                      href="/create"
                      size="large"
                      startIcon={<RocketLaunch />}
                      sx={{
                        background: themeColors.gradient.button,
                        borderRadius: 4,
                        px: 6,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 10px 30px rgba(255, 152, 0, 0.4)'
                        }
                      }}
                    >
                      Create Viral Content
                    </Button>
                  </Card>
                </Zoom>
              )}
            </Box>

            {/* Trending Insights */}
            {trendingBlogs.length > 0 && (
              <Slide direction="up" in timeout={1000}>
                <Card sx={{
                  p: 5,
                  borderRadius: 4,
                  background: themeColors.gradient.card,
                  border: `2px solid ${alpha(themeColors.purple.main, 0.2)}`,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="h3" fontWeight="800" sx={{
                    textAlign: 'center',
                    mb: 4,
                    background: themeColors.gradient.hero,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    📈 Trending Insights
                  </Typography>
                  
                  <Grid container spacing={4} textAlign="center">
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 3 }}>
                        <BarChart sx={{ fontSize: 48, color: themeColors.orange.main, mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color={themeColors.orange.main}>
                          {Math.round(trendingBlogs[0]?.trendingScore / 1000)}K
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Top Story Score
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 3 }}>
                        <TrendingUp sx={{ fontSize: 48, color: themeColors.purple.main, mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color={themeColors.purple.main}>
                          {trendingBlogs.filter(b => b.trendingScore > 500).length}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          High-Engagement Posts
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 3 }}>
                        <EmojiEvents sx={{ fontSize: 48, color: themeColors.orange.dark, mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color={themeColors.orange.dark}>
                          {trendingMetrics.trendingWriters}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Trending Writers
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Slide>
            )}
          </Container>
        </Fade>
      </Box>
    </>
  );
};

export default TrendingPage;