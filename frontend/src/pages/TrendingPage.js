import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import {
  Box, Button, Typography, Paper, Fade, Container, Chip, Stack, IconButton,
  Drawer, Avatar, Badge, Grid, Zoom, Slide, alpha, Card, CardContent
} from '@mui/material';
import {
  TrendingUp, Menu, Whatshot, Favorite, Visibility, AccessTime,
  LocalFireDepartment, EmojiEvents, RocketLaunch, FlashOn,
  BarChart, TrendingFlat, NewReleases
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

// Floating Fire Animation
const FloatingFireAnimation = () => {
  const fireElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 7,
    size: 20 + Math.random() * 40
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
      zIndex: 0
    }}>
      {fireElements.map((item) => (
        <Box
          key={item.id}
          sx={{
            position: 'absolute',
            left: `${item.left}%`,
            top: '-50px',
            fontSize: `${item.size}px`,
            animation: `floatFire ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
            opacity: 0.7,
            color: '#FF6B35'
          }}
        >
          🔥
        </Box>
      ))}
      <style jsx>{`
        @keyframes floatFire {
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
            transform: translateY(100vh) rotate(360deg) scale(0.5);
            opacity: 0;
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
      const likes = blog.likes || 0;
      const views = blog.views || 0;
      const comments = blog.comments?.length || 0;
      const shares = blog.shares || 0;
      
      // Enhanced trending score calculation
      const recency = Math.max(0, 1 - (new Date() - new Date(blog.createdAt)) / (7 * 24 * 60 * 60 * 1000));
      const engagementRate = (likes + comments * 2 + shares * 3) / Math.max(views, 1);
      const trendingScore = (likes * 1 + views * 0.1 + comments * 2 + shares * 3) * (1 + recency) * (1 + engagementRate);
      
      return {
        ...blog,
        trendingScore,
        engagementRate
      };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 20);

  // Update trending metrics
  useEffect(() => {
    if (trendingBlogs.length > 0) {
      setTrendingMetrics({
        totalEngagement: trendingBlogs.reduce((sum, blog) => sum + (blog.likes || 0) + (blog.views || 0), 0),
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

      {/* Enhanced Hero Section */}
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        background: themeColors.gradient.hero,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <FloatingFireAnimation />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              {/* Floating Menu Button */}
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  position: 'fixed',
                  top: 80,
                  left: 24,
                  zIndex: 1400,
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                    transform: 'scale(1.1) rotate(90deg)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Menu />
              </IconButton>

              <Whatshot sx={{
                fontSize: 80,
                mb: 3,
                background: 'linear-gradient(45deg, #FF6B35 30%, #FFD93D 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }} />

              <Typography variant="h1" fontWeight={900} sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(45deg, #FF6B35 30%, #FFD93D 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2,
                textShadow: '0 0 30px rgba(255,107,53,0.3)'
              }}>
                Trending Now
                <Box component="span" sx={{
                  display: 'block',
                  background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}>
                  Viral Stories & Hot Topics
                </Box>
              </Typography>

              <Typography variant="h5" sx={{
                mb: 6,
                opacity: 0.9,
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.5rem' }
              }}>
                Discover the hottest stories, viral posts, and trending topics that everyone's talking about right now.
              </Typography>

              {/* Interactive Timeframe Selector */}
              <Fade in timeout={1400}>
                <Card sx={{
                  p: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  mb: 6,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 3, textAlign: 'center' }}>
                    📊 Trending Timeframe
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    {timeframes.map((tf, index) => (
                      <Zoom in timeout={800} style={{ transitionDelay: `${index * 150}ms` }} key={tf.value}>
                        <Button
                          variant={timeframe === tf.value ? 'contained' : 'outlined'}
                          startIcon={<tf.icon />}
                          onClick={() => setTimeframe(tf.value)}
                          sx={{
                            fontWeight: 700,
                            px: 4,
                            py: 2,
                            borderRadius: 4,
                            minWidth: 150,
                            borderColor: tf.color,
                            color: timeframe === tf.value ? 'white' : tf.color,
                            bgcolor: timeframe === tf.value ? tf.color : 'transparent',
                            '&:hover': {
                              bgcolor: timeframe === tf.value ? `${tf.color}DD` : alpha(tf.color, 0.1),
                              transform: 'translateY(-4px) scale(1.05)',
                              boxShadow: `0 8px 25px ${alpha(tf.color, 0.4)}`
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          {tf.label}
                        </Button>
                      </Zoom>
                    ))}
                  </Stack>
                </Card>
              </Fade>

              {/* Live Trending Metrics */}
              <Fade in timeout={1600}>
                <Grid container spacing={3} sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}>
                  {[
                    { 
                      number: trendingBlogs.length, 
                      label: 'Trending Posts', 
                      icon: TrendingUp,
                      color: '#FF6B35'
                    },
                    { 
                      number: trendingMetrics.totalEngagement.toLocaleString(), 
                      label: 'Total Engagement', 
                      icon: Favorite,
                      color: '#FF9800'
                    },
                    { 
                      number: trendingMetrics.trendingWriters, 
                      label: 'Trending Writers', 
                      icon: LocalFireDepartment,
                      color: '#F44336'
                    },
                    { 
                      number: trendingMetrics.viralStories, 
                      label: 'Viral Stories', 
                      icon: RocketLaunch,
                      color: '#9C27B0'
                    }
                  ].map((stat, index) => (
                    <Grid item xs={6} sm={3} key={stat.label}>
                      <Zoom in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Box sx={{
                          p: 3,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          textAlign: 'center',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.15)',
                            transform: 'translateY(-8px)',
                            boxShadow: `0 15px 30px ${alpha(stat.color, 0.3)}`
                          },
                          transition: 'all 0.3s ease'
                        }}>
                          <stat.icon sx={{ fontSize: 36, mb: 1, color: stat.color }} />
                          <Typography variant="h4" fontWeight="bold">
                            {stat.number}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              </Fade>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 8, background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)' }}>
        <Fade in timeout={800}>
          <Container maxWidth="xl">
            {/* Trending Categories */}
            {topCategories.length > 0 && (
              <Box sx={{ mb: 6 }}>
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