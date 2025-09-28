import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Typography, Paper, Fade, Container, Chip, Stack, IconButton,
  Drawer, Grid, Card, CardContent, Avatar, Divider, Skeleton
} from '@mui/material';
import { 
  Search, FilterList, ExpandMore, Favorite, TrendingUp, NewReleases, 
  Menu, AutoStories, People, Visibility, Star, BookmarkBorder,
  ArrowForward, Category, Timeline
} from '@mui/icons-material';

// Orange and Purple Theme Colors (same as AdminDashboard)
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
    button: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
    dashboard: 'linear-gradient(135deg, #FFF3E0 0%, #F3E5F5 100%)'
  }
};

const HomePage = () => {
  const { blogs, isLoading, error } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchBlogs()).then((result) => {
      if (result.payload && Array.isArray(result.payload)) {
        const allCategories = result.payload.flatMap(blog => blog.categories || []);
        setCategories([...new Set(allCategories)]);
      }
    });
  }, [dispatch]);

  // Filter and sort blogs
  const filteredBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.username?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || (blog.categories && blog.categories.includes(selectedCategory));
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'trending':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((c) => c + 9);

  // Featured categories with icons
  const featuredCategories = [
    { name: 'Technology', icon: '💻', color: '#2196F3' },
    { name: 'Travel', icon: '✈️', color: '#4CAF50' },
    { name: 'Food', icon: '🍕', color: '#FF5722' },
    { name: 'Lifestyle', icon: '🌟', color: '#9C27B0' },
    { name: 'Programming', icon: '⚡', color: '#FF9800' },
    { name: 'Design', icon: '🎨', color: '#E91E63' }
  ];

  return (
    <>
      {/* Enhanced Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            border: 'none',
            borderRadius: '0 24px 24px 0',
            background: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 100%)',
          },
        }}
      >
        <Sidebar isMobile={true} toggleSidebar={() => setSidebarOpen(false)} />
      </Drawer>

      {/* Revolutionary Hero Section */}
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 50%, #673AB7 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 152, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 152, 0, 0.2) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite'
        }
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Floating Menu Button */}
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{
              position: 'fixed',
              top: 24,
              left: 24,
              zIndex: 1000,
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.25)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Menu />
          </IconButton>

          <Grid container spacing={6} alignItems="center" sx={{ minHeight: '100vh' }}>
            <Grid item xs={12} lg={7}>
              <Fade in timeout={1200}>
                <Box>
                  {/* Status Badge */}
                  <Chip 
                    label="🚀 Join 50K+ Active Writers" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      mb: 4,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      px: 2,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                      }
                    }} 
                  />
                  
                  {/* Main Headline */}
                  <Typography variant="h1" sx={{
                    mb: 3,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                    fontWeight: 900,
                    lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '-0.02em'
                  }}>
                    Where Stories
                    <Box component="span" sx={{ 
                      display: 'block',
                      background: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}>
                      Come Alive
                    </Box>
                  </Typography>
                  
                  {/* Subheadline */}
                  <Typography variant="h5" sx={{ 
                    mb: 6, 
                    opacity: 0.9, 
                    fontWeight: 300,
                    maxWidth: 500,
                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                    lineHeight: 1.6
                  }}>
                    Discover extraordinary stories, share your unique perspective, and connect with a global community of passionate storytellers.
                  </Typography>

                  {/* CTA Buttons */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 8 }}>
                    <Button
                      variant="contained"
                      size="large"
                      href="/register"
                      endIcon={<ArrowForward />}
                      sx={{
                        fontWeight: 700,
                        px: 6,
                        py: 2,
                        borderRadius: 5,
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
                        boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 15px 40px rgba(255, 107, 107, 0.5)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      Start Your Journey
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      href="/discover"
                      sx={{
                        fontWeight: 600,
                        px: 6,
                        py: 2,
                        borderRadius: 5,
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                          borderColor: 'white',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      Explore Stories
                    </Button>
                  </Stack>

                  {/* Enhanced Stats */}
                  <Grid container spacing={3}>
                    {[
                      { number: '50K+', label: 'Writers', icon: People },
                      { number: '100K+', label: 'Stories', icon: AutoStories },
                      { number: '2M+', label: 'Readers', icon: Visibility },
                      { number: '4.9★', label: 'Rating', icon: Star }
                    ].map((stat, index) => (
                      <Grid item xs={6} sm={3} key={index}>
                        <Box textAlign="center" sx={{
                          p: 2,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}>
                          <stat.icon sx={{ fontSize: 24, mb: 1, opacity: 0.8 }} />
                          <Typography variant="h5" fontWeight="bold">
                            {stat.number}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            </Grid>

            {/* Hero Illustration/Animation */}
            <Grid item xs={12} lg={5}>
              <Fade in timeout={1500}>
                <Box sx={{
                  position: 'relative',
                  height: { xs: 300, md: 500 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Animated Floating Cards */}
                  {[1, 2, 3].map((i) => (
                    <Card key={i} sx={{
                      position: 'absolute',
                      width: 200,
                      height: 120,
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      animation: `float 6s ease-in-out infinite ${i * 0.5}s`,
                      transform: `translate(${i * 30 - 45}px, ${i * 40 - 60}px) rotate(${i * 10 - 15}deg)`,
                    }}>
                      <CardContent sx={{ color: 'white' }}>
                        <Typography variant="h6" gutterBottom>
                          Story {i}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Amazing content that inspires and engages readers worldwide.
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content Section */}
      <Box sx={{ 
        py: 10, 
        background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)',
        position: 'relative'
      }}>
        <Container maxWidth="xl">
          {/* Category Explorer */}
          <Fade in timeout={800}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" sx={{
                mb: 2,
                background: themeColors.gradient.hero,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}>
                Explore by Category
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
                Discover stories that match your interests and passions
              </Typography>
              
              <Grid container spacing={3} justifyContent="center">
                {featuredCategories.map((category, index) => (
                  <Grid item xs={6} sm={4} md={2} key={category.name}>
                    <Fade in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          borderRadius: 4,
                          border: '2px solid',
                          borderColor: selectedCategory === category.name ? category.color : 'transparent',
                          background: selectedCategory === category.name 
                            ? `linear-gradient(135deg, ${category.color}15, ${category.color}08)`
                            : 'white',
                          boxShadow: selectedCategory === category.name 
                            ? `0 10px 30px ${category.color}30`
                            : '0 4px 20px rgba(0,0,0,0.08)',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 15px 40px ${category.color}30`,
                            borderColor: category.color,
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.name ? '' : category.name
                        )}
                        onMouseEnter={() => setHoveredCategory(category.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <Box sx={{
                          fontSize: 40,
                          mb: 2,
                          transform: hoveredCategory === category.name ? 'scale(1.2) rotate(10deg)' : 'scale(1)',
                          transition: 'transform 0.3s ease'
                        }}>
                          {category.icon}
                        </Box>
                        <Typography variant="h6" fontWeight="600" sx={{ 
                          color: selectedCategory === category.name ? category.color : 'text.primary'
                        }}>
                          {category.name}
                        </Typography>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>

          {/* Enhanced Search and Filter */}
          <Fade in timeout={1000}>
            <Card elevation={0} sx={{
              p: 6,
              mb: 8,
              borderRadius: 6,
              background: themeColors.gradient.card,
              border: '1px solid rgba(255,152,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: themeColors.gradient.button
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  mr: 3
                }}>
                  <Search sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                    Find Your Perfect Story
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Use our advanced filters to discover content tailored to your interests
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    label="Search stories, authors, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Search sx={{ color: 'primary.main', mr: 2 }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        bgcolor: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(102, 126, 234, 0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'text.secondary',
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      sx={{ 
                        borderRadius: 4,
                        bgcolor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(102, 126, 234, 0.2)',
                        }
                      }}
                    >
                      <MenuItem value="">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Category sx={{ mr: 1, fontSize: 20 }} />
                          All Categories
                        </Box>
                      </MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>
                          {featuredCategories.find(cat => cat.name === category)?.icon || '📝'} {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{ 
                        borderRadius: 4,
                        bgcolor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(102, 126, 234, 0.2)',
                        }
                      }}
                    >
                      <MenuItem value="newest">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <NewReleases sx={{ mr: 1, fontSize: 20 }} />
                          Latest Stories
                        </Box>
                      </MenuItem>
                      <MenuItem value="oldest">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Timeline sx={{ mr: 1, fontSize: 20 }} />
                          Classic Stories
                        </Box>
                      </MenuItem>
                      <MenuItem value="popular">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Visibility sx={{ mr: 1, fontSize: 20 }} />
                          Most Popular
                        </Box>
                      </MenuItem>
                      <MenuItem value="trending">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUp sx={{ mr: 1, fontSize: 20 }} />
                          Trending Now
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Card>
          </Fade>

          {/* Results Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {filteredBlogs.length === 0 && !isLoading ? 'No stories found' : 
                 searchTerm || selectedCategory ? 'Search Results' : 'Latest Stories'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {!isLoading && `Showing ${Math.min(visibleBlogs.length, filteredBlogs.length)} of ${filteredBlogs.length} stories`}
              </Typography>
            </Box>
            {searchTerm && (
              <Chip 
                label={`"${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                color="primary"
                variant="filled"
                sx={{
                  fontWeight: 600,
                  '& .MuiChip-deleteIcon': {
                    color: 'white',
                  }
                }}
              />
            )}
          </Box>

          {/* Blog Grid */}
          {isLoading ? (
            <Grid container spacing={4}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} />
                      <Skeleton variant="text" height={20} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="text" width={80} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : error ? (
            <Card sx={{ 
              p: 8, 
              textAlign: 'center', 
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(244, 67, 54, 0.02) 100%)',
              border: '1px solid rgba(244, 67, 54, 0.1)'
            }}>
              <Favorite sx={{ fontSize: 80, color: 'error.light', mb: 3, opacity: 0.6 }} />
              <Typography variant="h5" color="error" fontWeight="bold" gutterBottom>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                We couldn't load the stories right now. Please try again.
              </Typography>
              <Button 
                variant="contained" 
                color="error"
                size="large"
                onClick={() => dispatch(fetchBlogs())}
                sx={{ borderRadius: 3 }}
              >
                Try Again
              </Button>
            </Card>
          ) : filteredBlogs.length > 0 ? (
            <>
              <Grid container spacing={4}>
                {visibleBlogs.map((blog, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={blog._id}>
                    <Fade in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Box sx={{
                        '&:hover': {
                          transform: 'translateY(-8px)',
                        },
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}>
                        <BlogCard blog={blog} />
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
              
              {visibleCount < filteredBlogs.length && (
                <Box textAlign="center" mt={10}>
                  <Button
                    variant="contained"
                    onClick={handleLoadMore}
                    endIcon={<ExpandMore />}
                    size="large"
                    sx={{
                      borderRadius: 4,
                      fontWeight: 700,
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      background: themeColors.gradient.button,
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    Load More Stories ({filteredBlogs.length - visibleCount} remaining)
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Card sx={{ 
              p: 10, 
              textAlign: 'center', 
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              <BookmarkBorder sx={{ fontSize: 80, color: 'primary.light', mb: 3, opacity: 0.6 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main">
                No stories found
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                {searchTerm || selectedCategory 
                  ? `We couldn't find any stories matching "${searchTerm || selectedCategory}". Try adjusting your search criteria.`
                  : 'Be the first to share your story with our community!'
                }
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  href="/create"
                  size="large"
                  startIcon={<AutoStories />}
                  sx={{
                    borderRadius: 4,
                    px: 4,
                    py: 1.5,
                    background: themeColors.gradient.button,
                  }}
                >
                  Write Your First Story
                </Button>
                {(searchTerm || selectedCategory) && (
                  <Button 
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    sx={{ 
                      borderRadius: 4,
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Stack>
            </Card>
          )}
        </Container>
      </Box>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default HomePage;