import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Typography, Grid, Paper, Fade, Container, Chip, Stack, IconButton,
  Drawer, Zoom, Slide, alpha, Card, CardContent
} from '@mui/material';
import { 
  Search, FilterList, ExpandMore, Favorite, TrendingUp, NewReleases, 
  Menu, Explore, LocalFireDepartment, Category, AutoStories, 
  Psychology, Flight, Restaurant, Spa, MusicNote, Movie, SportsEsports
} from '@mui/icons-material';

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

// Animated Search Icons
const FloatingSearchIcons = () => {
  const icons = ['🔍', '📚', '💡', '🌟', '📖', '🎯', '💎', '🚀'];
  const floatingIcons = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    icon: icons[Math.floor(Math.random() * icons.length)],
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 12 + Math.random() * 8,
    size: 24 + Math.random() * 20
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
      {floatingIcons.map((item) => (
        <Box
          key={item.id}
          sx={{
            position: 'absolute',
            left: `${item.left}%`,
            top: '-50px',
            fontSize: `${item.size}px`,
            animation: `floatDiscover ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
            opacity: 0.6,
          }}
        >
          {item.icon}
        </Box>
      ))}
      <style jsx>{`
        @keyframes floatDiscover {
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
      `}</style>
    </Box>
  );
};

const DiscoverPage = () => {
  const { blogs, isLoading, error } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  useEffect(() => {
    dispatch(fetchBlogs()).then((result) => {
      if (result.payload) {
        const allCategories = result.payload.flatMap(blog => blog.categories || []);
        setCategories([...new Set(allCategories)]);
      }
    });
  }, [dispatch]);

  // Enhanced featured categories with icons and colors
  const featuredCategories = [
    { name: 'Technology', icon: '💻', color: '#2196F3', Icon: Psychology },
    { name: 'Travel', icon: '✈️', color: '#4CAF50', Icon: Flight },
    { name: 'Food', icon: '🍕', color: '#FF5722', Icon: Restaurant },
    { name: 'Lifestyle', icon: '🌟', color: '#9C27B0', Icon: Spa },
    { name: 'Programming', icon: '⚡', color: '#FF9800', Icon: AutoStories },
    { name: 'Design', icon: '🎨', color: '#E91E63', Icon: Category },
    { name: 'Health', icon: '💪', color: '#00BCD4', Icon: Favorite },
    { name: 'Music', icon: '🎵', color: '#FF6F00', Icon: MusicNote },
    { name: 'Movies', icon: '🎬', color: '#673AB7', Icon: Movie },
    { name: 'Gaming', icon: '🎮', color: '#F44336', Icon: SportsEsports },
  ];

  // Filter and sort blogs with enhanced logic
  const filteredBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.categories && blog.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())));
      
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
          const scoreA = (a.likes || 0) + (a.views || 0) * 0.5;
          const scoreB = (b.likes || 0) + (b.views || 0) * 0.5;
          return scoreB - scoreA;
        default:
          return 0;
      }
    });

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((c) => c + 12);

  // Search suggestions
  useEffect(() => {
    if (searchTerm.length > 2) {
      const suggestions = [
        ...new Set(blogs.flatMap(blog => 
          blog.categories?.filter(cat => 
            cat.toLowerCase().includes(searchTerm.toLowerCase())
          ) || []
        ))
      ].slice(0, 5);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm, blogs]);

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
        <FloatingSearchIcons />
        
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

              <Explore sx={{
                fontSize: 80,
                mb: 3,
                background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }} />

              <Typography variant="h1" fontWeight={900} sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2,
                textShadow: '0 0 30px rgba(255,255,255,0.3)'
              }}>
                Discover Amazing
                <Box component="span" sx={{
                  display: 'block',
                  background: 'linear-gradient(45deg, #FFD700 30%, #FF6B6B 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}>
                  Stories & Ideas
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
                Explore diverse topics, find inspiration, and connect with writers from around the world in our vibrant community.
              </Typography>

              {/* Enhanced Search Bar */}
              <Fade in timeout={1400}>
                <Card sx={{
                  p: 4,
                  maxWidth: 800,
                  mx: 'auto',
                  mb: 6,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                }}>
                  <Box sx={{ position: 'relative' }}>
                    <TextField
                      fullWidth
                      placeholder="Search stories, authors, topics, or categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <Search sx={{ 
                            color: 'rgba(255,255,255,0.7)', 
                            mr: 2, 
                            fontSize: 28 
                          }} />
                        ),
                        sx: {
                          color: 'white',
                          fontSize: '1.1rem',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255,255,255,0.3)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255,255,255,0.5)',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                          },
                          '& input::placeholder': {
                            color: 'rgba(255,255,255,0.7)',
                          }
                        }
                      }}
                    />
                    
                    {/* Search Suggestions */}
                    {searchSuggestions.length > 0 && (
                      <Paper sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        mt: 1,
                        bgcolor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(20px)',
                        zIndex: 10,
                        borderRadius: 2
                      }}>
                        <Stack spacing={1} sx={{ p: 2 }}>
                          {searchSuggestions.map((suggestion, index) => (
                            <Chip
                              key={index}
                              label={suggestion}
                              clickable
                              onClick={() => {
                                setSearchTerm(suggestion);
                                setSearchSuggestions([]);
                              }}
                              sx={{
                                justifyContent: 'flex-start',
                                bgcolor: alpha(themeColors.orange.main, 0.1),
                                color: themeColors.orange.dark,
                                fontWeight: 600
                              }}
                            />
                          ))}
                        </Stack>
                      </Paper>
                    )}
                  </Box>
                </Card>
              </Fade>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  href="/register"
                  endIcon={<TrendingUp />}
                  sx={{
                    fontWeight: 700,
                    px: 6,
                    py: 2,
                    borderRadius: 5,
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FFD93D 90%)',
                    fontSize: '1.1rem',
                    boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
                    '&:hover': {
                      transform: 'translateY(-3px) scale(1.05)',
                      boxShadow: '0 15px 40px rgba(255, 107, 107, 0.6)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Start Your Journey
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="#explore"
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
                    transition: 'all 0.3s ease'
                  }}
                >
                  Explore Now
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 8, background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)' }} id="explore">
        <Fade in timeout={800}>
          <Container maxWidth="xl">
            {/* Interactive Categories Grid */}
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                <Category sx={{ fontSize: 40, color: themeColors.purple.main, mr: 2 }} />
                <Typography variant="h2" fontWeight="800" sx={{
                  background: themeColors.gradient.hero,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center'
                }}>
                  Explore by Category
                </Typography>
              </Box>
              
              <Grid container spacing={3} justifyContent="center">
                {featuredCategories.map((category, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={2.4} key={category.name}>
                    <Zoom in timeout={600} style={{ transitionDelay: `${index * 50}ms` }}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          cursor: 'pointer',
                          borderRadius: 4,
                          border: '2px solid',
                          borderColor: selectedCategory === category.name ? category.color : 'transparent',
                          background: selectedCategory === category.name 
                            ? `linear-gradient(135deg, ${category.color}20, ${category.color}10)`
                            : themeColors.gradient.card,
                          boxShadow: selectedCategory === category.name 
                            ? `0 10px 30px ${alpha(category.color, 0.4)}`
                            : '0 4px 20px rgba(0,0,0,0.08)',
                          '&:hover': {
                            transform: 'translateY(-12px) scale(1.05)',
                            boxShadow: `0 20px 40px ${alpha(category.color, 0.4)}`,
                            borderColor: category.color,
                            '& .category-icon': {
                              transform: 'scale(1.3) rotate(360deg)',
                            }
                          },
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.name ? '' : category.name
                        )}
                      >
                        <Box className="category-icon" sx={{
                          fontSize: 36,
                          mb: 1,
                          transition: 'transform 0.6s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {category.icon}
                        </Box>
                        <Typography variant="subtitle1" fontWeight="700" sx={{ 
                          color: selectedCategory === category.name ? category.color : 'text.primary',
                          fontSize: '0.9rem'
                        }}>
                          {category.name}
                        </Typography>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Enhanced Search and Filter Section */}
            <Card sx={{
              p: 5,
              mb: 6,
              borderRadius: 4,
              background: themeColors.gradient.card,
              border: `2px solid ${alpha(themeColors.orange.main, 0.2)}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <FilterList sx={{ color: themeColors.orange.main, mr: 2, fontSize: 32 }} />
                <Typography variant="h3" fontWeight="800" sx={{
                  background: themeColors.gradient.button,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Find Your Perfect Read
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    label="Search stories, authors, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ color: themeColors.orange.main, mr: 1, fontSize: 28 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: 'white',
                        fontSize: '1.1rem',
                        '& fieldset': {
                          borderColor: alpha(themeColors.purple.main, 0.3),
                          borderWidth: 2
                        },
                        '&:hover fieldset': {
                          borderColor: themeColors.orange.main,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: themeColors.orange.main,
                          borderWidth: 3,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ fontSize: '1.1rem' }}>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      sx={{ 
                        borderRadius: 3,
                        bgcolor: 'white',
                        fontSize: '1rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(themeColors.purple.main, 0.3),
                          borderWidth: 2
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: themeColors.orange.main,
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
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ fontSize: '1.1rem' }}>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{ 
                        borderRadius: 3,
                        bgcolor: 'white',
                        fontSize: '1rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(themeColors.purple.main, 0.3),
                          borderWidth: 2
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: themeColors.orange.main,
                        }
                      }}
                    >
                      <MenuItem value="newest">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <NewReleases sx={{ mr: 1, fontSize: 20, color: '#4CAF50' }} />
                          Latest Stories
                        </Box>
                      </MenuItem>
                      <MenuItem value="oldest">Oldest First</MenuItem>
                      <MenuItem value="popular">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Favorite sx={{ mr: 1, fontSize: 20, color: '#F44336' }} />
                          Most Popular
                        </Box>
                      </MenuItem>
                      <MenuItem value="trending">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUp sx={{ mr: 1, fontSize: 20, color: themeColors.orange.main }} />
                          Trending Now
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Quick Stats */}
              <Box sx={{ mt: 4, p: 3, background: alpha(themeColors.purple.main, 0.05), borderRadius: 3 }}>
                <Grid container spacing={3} textAlign="center">
                  <Grid item xs={4}>
                    <Typography variant="h4" fontWeight="bold" color={themeColors.orange.main}>
                      {blogs.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Stories
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" fontWeight="bold" color={themeColors.purple.main}>
                      {new Set(blogs.map(blog => blog.author?.username)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Writers
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" fontWeight="bold" color={themeColors.orange.dark}>
                      {categories.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Categories
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            {/* Results Header */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 6,
              p: 4,
              borderRadius: 4,
              background: themeColors.gradient.card,
              border: `2px solid ${alpha(themeColors.purple.main, 0.2)}`
            }}>
              <Box>
                <Typography variant="h3" fontWeight="800" gutterBottom sx={{
                  background: themeColors.gradient.hero,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {filteredBlogs.length === 0 ? '🔍 No stories found' : 
                   searchTerm || selectedCategory ? '✨ Search Results' : '📚 All Stories'}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {!isLoading && `Showing ${Math.min(visibleBlogs.length, filteredBlogs.length)} of ${filteredBlogs.length} amazing stories`}
                </Typography>
              </Box>
              {searchTerm && (
                <Chip 
                  label={`"${searchTerm}"`}
                  onDelete={() => setSearchTerm('')}
                  sx={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 2,
                    py: 3,
                    bgcolor: themeColors.gradient.button,
                    color: 'white',
                  }}
                />
              )}
            </Box>

            {/* Enhanced Blog Feed */}
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
                    Discovering Amazing Content...
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Please wait while we find the perfect blogs for you
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
                    We couldn't load the stories right now. Please try again.
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
            ) : filteredBlogs.length > 0 ? (
              <>
                <Grid container spacing={4}>
                  {visibleBlogs.map((blog, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={blog._id}>
                      <Fade in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Box sx={{
                          '&:hover': {
                            transform: 'translateY(-12px)',
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                          }
                        }}>
                          <BlogCard blog={blog} />
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>

                {visibleCount < filteredBlogs.length && (
                  <Box textAlign="center" mt={8}>
                    <Button
                      variant="contained"
                      onClick={handleLoadMore}
                      endIcon={<ExpandMore />}
                      size="large"
                      sx={{
                        borderRadius: 5,
                        fontWeight: 700,
                        px: 8,
                        py: 2.5,
                        fontSize: '1.2rem',
                        background: themeColors.gradient.button,
                        boxShadow: '0 10px 30px rgba(255, 152, 0, 0.4)',
                        '&:hover': {
                          transform: 'translateY(-5px) scale(1.05)',
                          boxShadow: '0 15px 40px rgba(255, 152, 0, 0.6)',
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
              <Zoom in timeout={800}>
                <Card sx={{
                  p: 8,
                  textAlign: 'center',
                  borderRadius: 4,
                  background: themeColors.gradient.card,
                  border: `2px solid ${alpha(themeColors.purple.main, 0.2)}`,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                }}>
                  <Explore sx={{ fontSize: 80, color: themeColors.orange.main, mb: 3, opacity: 0.6 }} />
                  <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
                    background: themeColors.gradient.button,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
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
                        background: themeColors.gradient.button,
                        borderRadius: 4,
                        px: 6,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem'
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
                          px: 6,
                          py: 1.5,
                          borderColor: themeColors.purple.main,
                          color: themeColors.purple.main,
                          fontWeight: 600
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </Stack>
                </Card>
              </Zoom>
            )}
          </Container>
        </Fade>
      </Box>
    </>
  );
};

export default DiscoverPage;