import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import {
  Box, Button, Typography, Grid, Paper, Fade, Container, Chip, Stack, IconButton,
  Drawer, Avatar, Badge
} from '@mui/material';
import { TrendingUp, Menu, Whatshot, Favorite, Visibility, AccessTime } from '@mui/icons-material';

const TrendingPage = () => {
  const { blogs, isLoading, error } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Sort blogs by trending score (likes + views) and recency
  const trendingBlogs = blogs
    .filter(blog => {
      const blogDate = new Date(blog.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - blogDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (timeframe) {
        case 'day':
          return diffDays <= 1;
        case 'week':
          return diffDays <= 7;
        case 'month':
          return diffDays <= 30;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      const scoreA = (a.likes || 0) + (a.views || 0) * 0.1;
      const scoreB = (b.likes || 0) + (b.views || 0) * 0.1;
      return scoreB - scoreA;
    })
    .slice(0, 20);

  const timeframes = [
    { value: 'day', label: 'Today', icon: AccessTime },
    { value: 'week', label: 'This Week', icon: TrendingUp },
    { value: 'month', label: 'This Month', icon: Whatshot }
  ];

  return (
    <>
<Drawer
  anchor="left"
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  sx={{
    '& .MuiDrawer-paper': {
      boxShadow: '0 0 30px rgba(255,152,0,0.3)',
      border: 'none',
    },
  }}
>
  <Sidebar isMobile={true} toggleSidebar={() => setSidebarOpen(false)} />
</Drawer>

      {/* Hero Section */}
      <Box sx={{
        width: '100%',
        background: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        px: 2,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite'
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box>
              {/* Menu Button */}
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                <Menu />
              </IconButton>

              <Whatshot sx={{
                fontSize: 80,
                mb: 3,
                background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }} />

              <Typography variant="h1" fontWeight={900} sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2
              }}>
                Trending Now
              </Typography>

              <Typography variant="h5" sx={{
                mb: 4,
                opacity: 0.9,
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.5rem' }
              }}>
                Discover the hottest stories, viral posts, and trending topics that everyone's talking about.
              </Typography>

              {/* Timeframe Selector */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.value}
                    variant={timeframe === tf.value ? 'contained' : 'outlined'}
                    startIcon={<tf.icon />}
                    onClick={() => setTimeframe(tf.value)}
                    sx={{
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: 3,
                      borderColor: 'white',
                      color: timeframe === tf.value ? 'primary.main' : 'white',
                      bgcolor: timeframe === tf.value ? 'white' : 'transparent',
                      '&:hover': {
                        bgcolor: timeframe === tf.value ? 'grey.100' : 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {tf.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 8, width: '100%' }}>
        <Fade in timeout={800}>
          <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
            {/* Trending Stats */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: 'primary.main' }}>
                🔥 Hot Right Now
              </Typography>
              <Stack direction="row" spacing={4} justifyContent="center" flexWrap="wrap">
                {[
                  { label: 'Trending Posts', value: trendingBlogs.length, icon: TrendingUp },
                  { label: 'Total Engagement', value: trendingBlogs.reduce((sum, blog) => sum + (blog.likes || 0) + (blog.views || 0), 0), icon: Favorite },
                  { label: 'Active Writers', value: new Set(trendingBlogs.map(blog => blog.author?.username)).size, icon: Visibility }
                ].map((stat, index) => (
                  <Box key={index} textAlign="center" sx={{ minWidth: 120 }}>
                    <stat.icon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {stat.value.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Blog Feed */}
            {isLoading ? (
              <Box textAlign="center" py={10}>
                <Box sx={{
                  display: 'inline-block',
                  p: 3,
                  borderRadius: '50%',
                  mb: 2,
                  bgcolor: 'background.default'
                }}>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    border: '4px solid',
                    borderColor: 'primary.light',
                    borderTopColor: 'primary.main',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                </Box>
                <Typography variant="h6" color="primary.main" fontWeight={600}>
                  Finding trending content...
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Analyzing the hottest posts right now
                </Typography>
              </Box>
            ) : error ? (
              <Box textAlign="center" py={10}>
                <Favorite sx={{ fontSize: 64, color: 'error.light', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="error" gutterBottom>
                  Oops! Something went wrong
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => dispatch(fetchBlogs())}
                >
                  Try Again
                </Button>
              </Box>
            ) : trendingBlogs.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {trendingBlogs.map((blog, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={blog._id}>
                      <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Box sx={{ position: 'relative' }}>
                          {/* Trending Badge */}
                          <Box sx={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            zIndex: 2,
                            bgcolor: 'error.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 3
                          }}>
                            <Typography variant="caption" fontWeight="bold">
                              #{index + 1}
                            </Typography>
                          </Box>
                          <BlogCard blog={blog} />
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box textAlign="center" py={10}>
                <Whatshot sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  No trending content yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Check back later for the latest trending posts!
                </Typography>
                <Button
                  variant="contained"
                  href="/create"
                  sx={{ borderRadius: 3 }}
                >
                  Be the First Trend
                </Button>
              </Box>
            )}
          </Box>
        </Fade>
      </Box>
    </>
  );
};

export default TrendingPage;
