import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Typography, Paper, Fade, Container, Chip, Stack, IconButton,
  Drawer, Grid, Card, CardContent, Avatar, Divider, Skeleton, Zoom
} from '@mui/material';
import { 
  Search, FilterList, ExpandMore, Favorite, TrendingUp, NewReleases, 
  Menu, AutoStories, People, Visibility, Star, BookmarkBorder,
  ArrowForward, Category, Timeline, LocalFireDepartment, EmojiEvents,
  Explore, BookmarkAdd, Share, Comment, PersonAdd, Language,
  Psychology, Spa, FitnessCenter, MusicNote, Movie, SportsEsports,
  School, Work, Pets, Home, Flight, Restaurant
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
    button: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
    dashboard: 'linear-gradient(135deg, #FFF3E0 0%, #F3E5F5 100%)'
  }
};

// Animated Flowers Component
const AnimatedFlowers = () => {
  const flowers = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
    size: 20 + Math.random() * 30,
    type: ['🌸', '🌺', '🌼', '🌻', '🏵️', '💮', '🌷'][Math.floor(Math.random() * 7)],
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
      zIndex: 0
    }}>
      {/* Special Hibiscus Flower - Left Center */}
<Box
  sx={{
    position: 'absolute',
    left: '2%',     // push it further left into circled area
    top: '28%',     // raise it higher to fit inside
    transform: 'translateY(-50%)',
    width: '500px', // reduced size so it doesn’t overlap button/text
    height: '500px',
    animation: `float 6s ease-in-out infinite`,
    animationDelay: '0s',
    opacity: 0.8,
    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))',
    zIndex: 2,
  }}
>
  <img 
    src="/image.png" 
    alt="flower" 
    style={{ 
      width: '100%', 
      height: '100%',
      objectFit: 'contain'
    }} 
  />
</Box>
      {/* Smaller Flower - Right Top */}
      <Box
        sx={{
          position: 'absolute',
          right: '10%',
          top: '15%',
          width: '400px',
          height: '400px',
          animation: `float 8s ease-in-out infinite`,
          animationDelay: '2s',
          opacity: 0.7,
          filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))',
          zIndex: 1,
        }}
      >
        <img 
          src="/image.png" 
          alt="flower" 
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'contain'
          }} 
        />
      </Box>

      {flowers.map((flower) => (
        <Box
          key={flower.id}
          sx={{
            position: 'absolute',
            left: `${flower.left}%`,
            top: '-50px',
            fontSize: `${flower.size}px`,
            animation: `fall ${flower.duration}s linear infinite`,
            animationDelay: `${flower.delay}s`,
            opacity: 0.6,
            transform: `rotate(${flower.rotation}deg)`,
          }}
        >
          {flower.type}
        </Box>
      ))}
      <style jsx>{`
        @keyframes fall {
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
        @keyframes float {
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
  const [hoveredBlog, setHoveredBlog] = useState(null);

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

  // Expanded featured categories with icons
  const featuredCategories = [
    { name: 'Technology', icon: '💻', color: '#2196F3', Icon: Language },
    { name: 'Travel', icon: '✈️', color: '#4CAF50', Icon: Flight },
    { name: 'Food', icon: '🍕', color: '#FF5722', Icon: Restaurant },
    { name: 'Lifestyle', icon: '🌟', color: '#9C27B0', Icon: Spa },
    { name: 'Programming', icon: '⚡', color: '#FF9800', Icon: Psychology },
    { name: 'Design', icon: '🎨', color: '#E91E63', Icon: AutoStories },
    { name: 'Health', icon: '💪', color: '#00BCD4', Icon: FitnessCenter },
    { name: 'Music', icon: '🎵', color: '#FF6F00', Icon: MusicNote },
    { name: 'Movies', icon: '🎬', color: '#673AB7', Icon: Movie },
    { name: 'Gaming', icon: '🎮', color: '#F44336', Icon: SportsEsports },
    { name: 'Education', icon: '📚', color: '#3F51B5', Icon: School },
    { name: 'Business', icon: '💼', color: '#607D8B', Icon: Work },
    { name: 'Pets', icon: '🐾', color: '#795548', Icon: Pets },
    { name: 'Home', icon: '🏠', color: '#8BC34A', Icon: Home }
  ];

  // Stats for the hero section
  const stats = [
    { number: '50K+', label: 'Writers', icon: People, color: '#FF9800' },
    { number: '100K+', label: 'Stories', icon: AutoStories, color: '#9C27B0' },
    { number: '2M+', label: 'Readers', icon: Visibility, color: '#2196F3' },
    { number: '4.9★', label: 'Rating', icon: Star, color: '#FFC107' }
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

      {/* Revolutionary Hero Section with Animated Flowers */}
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 50%, #673AB7 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        }
      }}>
        {/* Animated Flowers */}
        <AnimatedFlowers />

        <Container maxWidth="xl" sx={{ 
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
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
                transform: 'scale(1.1) rotate(90deg)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Menu />
          </IconButton>

          {/* Centered Content */}
          <Box sx={{ 
            textAlign: 'center',
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto',
            py: 4
          }}>
            {/* Status Badge */}
            <Zoom in timeout={800}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Chip 
                  icon={<LocalFireDepartment sx={{ color: 'white !important' }} />}
                  label="Join 50K+ Active Writers" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    px: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.3s ease'
                  }} 
                />
              </Box>
            </Zoom>
            
            {/* Main Headline */}
            <Fade in timeout={1000}>
              <Typography variant="h1" sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                fontWeight: 900,
                lineHeight: 1.1,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.02em',
                textAlign: 'center',
                textShadow: '0 0 40px rgba(255,255,255,0.3)'
              }}>
                Write Your Story,
                <Box component="span" sx={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}>
                  Share Your Voice
                </Box>
              </Typography>
            </Fade>
            
            {/* Subheadline */}
            <Fade in timeout={1200}>
              <Typography variant="h5" sx={{ 
                mb: 6, 
                opacity: 0.9, 
                fontWeight: 300,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                lineHeight: 1.6,
                textAlign: 'center'
              }}>
                Discover extraordinary stories, share your unique perspective, and connect with a global community of passionate storytellers.
              </Typography>
            </Fade>

            {/* CTA Buttons */}
            <Fade in timeout={1400}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mb: 8 
              }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
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
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: '0 15px 40px rgba(255, 107, 107, 0.6)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    START YOUR JOURNEY
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
                    EXPLORE STORIES
                  </Button>
                </Stack>
              </Box>
            </Fade>

            {/* Stats Grid */}
            <Fade in timeout={1600}>
              <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '900px', mx: 'auto' }}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Zoom in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Box sx={{
                        p: 3,
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.15)',
                          transform: 'translateY(-8px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
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
        </Container>
      </Box>

      {/* Main Content Section */}
      <Box sx={{ 
        py: 10, 
        background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)',
        position: 'relative'
      }}>
        <Container maxWidth="xl">
          {/* Trending Topics Section */}
          <Fade in timeout={800}>
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <LocalFireDepartment sx={{ fontSize: 40, color: '#FF5722', mr: 2 }} />
                <Typography variant="h3" fontWeight="bold">
                  Trending Topics
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                {[
                  'AI Revolution', 'Sustainable Living', 'Remote Work', 'Mental Health', 
                  'Crypto', 'Web3', 'Space Exploration', 'Climate Action', 'Digital Nomad',
                  'Minimalism', 'Personal Growth', 'Blockchain', 'AR/VR', 'Future Tech',
                  'Creative Writing', 'Self Improvement'
                ].map((topic, index) => (
                  <Zoom in timeout={600} style={{ transitionDelay: `${index * 50}ms` }} key={topic}>
                    <Chip
                      label={topic}
                      clickable
                      sx={{
                        px: 2,
                        py: 3,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 100%)',
                        color: 'white',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: '0 8px 20px rgba(156, 39, 176, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Zoom>
                ))}
              </Stack>
            </Box>
          </Fade>

          {/* Category Explorer */}
          <Fade in timeout={800}>
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Category sx={{ fontSize: 40, color: themeColors.purple.main, mr: 2 }} />
                <Box>
                  <Typography variant="h3" fontWeight="bold" sx={{
                    background: themeColors.gradient.hero,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}>
                    Explore by Category
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Discover stories that match your interests and passions
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                {featuredCategories.map((category, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={category.name}>
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
                            : 'white',
                          boxShadow: selectedCategory === category.name 
                            ? `0 10px 30px ${category.color}40`
                            : '0 4px 20px rgba(0,0,0,0.08)',
                          '&:hover': {
                            transform: 'translateY(-12px) scale(1.05)',
                            boxShadow: `0 20px 40px ${category.color}40`,
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
                        onMouseEnter={() => setHoveredCategory(category.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
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
          </Fade>

          {/* Enhanced Search and Filter - "Find Your Perfect Story" */}
          <Fade in timeout={1000}>
            <Card elevation={0} sx={{
              p: 6,
              mb: 8,
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(255,152,0,0.05) 0%, rgba(156,39,176,0.05) 100%)',
              border: '2px solid',
              borderImage: 'linear-gradient(45deg, #FF9800, #9C27B0) 1',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: themeColors.gradient.button,
                borderRadius: '24px',
                zIndex: -1,
                opacity: 0.1
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                <Box sx={{
                  p: 2.5,
                  borderRadius: 4,
                  background: themeColors.gradient.button,
                  mr: 3,
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  <Search sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h3" fontWeight="900" sx={{
                    background: themeColors.gradient.hero,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 1
                  }}>
                    Find Your Perfect Story
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    Use our advanced filters to discover content tailored to your interests
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    label="Search stories, authors, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Search sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        bgcolor: 'white',
                        fontSize: '1.1rem',
                        '& fieldset': {
                          borderColor: 'rgba(156, 39, 176, 0.3)',
                          borderWidth: 2
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: 3,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'text.secondary',
                        fontSize: '1.1rem'
                      }
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
                        borderRadius: 4,
                        bgcolor: 'white',
                        fontSize: '1rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(156, 39, 176, 0.3)',
                          borderWidth: 2
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        }
                      }}
                    >
                      <MenuItem value="">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Category sx={{ mr: 1, fontSize: 20 }} />
                          All Categories
                        </Box>
                      </MenuItem>
                      {featuredCategories.map(category => (
                        <MenuItem key={category.name} value={category.name}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: 8 }}>{category.icon}</span>
                            {category.name}
                          </Box>
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
                        borderRadius: 4,
                        bgcolor: 'white',
                        fontSize: '1rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(156, 39, 176, 0.3)',
                          borderWidth: 2
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        }
                      }}
                    >
                      <MenuItem value="newest">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <NewReleases sx={{ mr: 1, fontSize: 20, color: '#4CAF50' }} />
                          Latest Stories
                        </Box>
                      </MenuItem>
                      <MenuItem value="oldest">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Timeline sx={{ mr: 1, fontSize: 20, color: '#FF9800' }} />
                          Classic Stories
                        </Box>
                      </MenuItem>
                      <MenuItem value="popular">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Visibility sx={{ mr: 1, fontSize: 20, color: '#2196F3' }} />
                          Most Popular
                        </Box>
                      </MenuItem>
                      <MenuItem value="trending">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUp sx={{ mr: 1, fontSize: 20, color: '#E91E63' }} />
                          Trending Now
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Quick Filter Tags */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                  Quick Filters:
                </Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {['Most Liked', 'Editor\'s Pick', 'New Writers', 'Long Reads', 'Quick Reads'].map((filter) => (
                    <Chip
                      key={filter}
                      label={filter}
                      clickable
                      variant="outlined"
                      sx={{
                        borderColor: themeColors.purple.main,
                        color: themeColors.purple.main,
                        fontWeight: 600,
                        '&:hover': {
                          background: themeColors.gradient.button,
                          color: 'white',
                          borderColor: 'transparent',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Card>
          </Fade>

          {/* Featured Writers Section */}
          <Fade in timeout={800}>
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEvents sx={{ fontSize: 40, color: '#FFC107', mr: 2 }} />
                  <Typography variant="h3" fontWeight="bold">
                    Featured Writers
                  </Typography>
                </Box>
                <Button variant="text" endIcon={<ArrowForward />}>
                  View All
                </Button>
              </Box>
              <Grid container spacing={3}>
                {[
                  { name: 'Sarah Johnson', avatar: '👩', stories: 45, followers: '12K', specialty: 'Technology' },
                  { name: 'Mike Chen', avatar: '👨', stories: 38, followers: '8.5K', specialty: 'Travel' },
                  { name: 'Emma Davis', avatar: '👱‍♀️', stories: 52, followers: '15K', specialty: 'Lifestyle' },
                  { name: 'Alex Kumar', avatar: '👨‍💻', stories: 41, followers: '10K', specialty: 'Programming' }
                ].map((writer, index) => (
                  <Grid item xs={12} sm={6} md={3} key={writer.name}>
                    <Zoom in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 4,
                        cursor: 'pointer',
                        border: '2px solid transparent',
                        '&:hover': {
                          borderColor: themeColors.purple.main,
                          transform: 'translateY(-10px)',
                          boxShadow: '0 20px 40px rgba(156, 39, 176, 0.3)',
                          '& .writer-avatar': {
                            transform: 'scale(1.2) rotate(5deg)'
                          }
                        },
                        transition: 'all 0.4s ease'
                      }}>
                        <Box className="writer-avatar" sx={{
                          fontSize: 60,
                          mb: 2,
                          transition: 'transform 0.4s ease'
                        }}>
                          {writer.avatar}
                        </Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {writer.name}
                        </Typography>
                        <Chip 
                          label={writer.specialty} 
                          size="small" 
                          sx={{ 
                            mb: 2,
                            background: themeColors.gradient.button,
                            color: 'white',
                            fontWeight: 600
                          }} 
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                          <Box>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              {writer.stories}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Stories
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight="bold" color="secondary">
                              {writer.followers}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Followers
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<PersonAdd />}
                          sx={{ 
                            mt: 2,
                            borderRadius: 3,
                            '&:hover': {
                              background: themeColors.gradient.button,
                              color: 'white',
                              borderColor: 'transparent'
                            }
                          }}
                        >
                          Follow
                        </Button>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>

          {/* Results Header - Enhanced */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 6,
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(156,39,176,0.1) 100%)',
            border: '2px solid rgba(156,39,176,0.2)'
          }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{
                background: themeColors.gradient.hero,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}>
                {filteredBlogs.length === 0 && !isLoading ? '🔍 No stories found' : 
                 searchTerm || selectedCategory ? '✨ Search Results' : '📚 Latest Stories'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                {!isLoading && `Showing ${Math.min(visibleBlogs.length, filteredBlogs.length)} of ${filteredBlogs.length} amazing stories`}
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
                  fontSize: '1rem',
                  px: 2,
                  py: 3,
                  '& .MuiChip-deleteIcon': {
                    color: 'white',
                  }
                }}
              />
            )}
          </Box>

          {/* Blog Grid - Enhanced with Interactive Cards */}
          {isLoading ? (
            <Grid container spacing={4}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                    <Skeleton variant="rectangular" height={200} animation="wave" />
                    <CardContent>
                      <Skeleton variant="text" height={32} sx={{ mb: 1 }} animation="wave" />
                      <Skeleton variant="text" height={20} animation="wave" />
                      <Skeleton variant="text" height={20} animation="wave" />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Skeleton variant="circular" width={32} height={32} animation="wave" />
                        <Skeleton variant="text" width={80} animation="wave" />
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
              border: '2px solid rgba(244, 67, 54, 0.2)'
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
                  <Grid 
                    item 
                    xs={12} 
                    sm={index === 0 ? 12 : 6} 
                    lg={index === 0 ? 8 : 4} 
                    key={blog._id}
                  >
                    <Fade in timeout={600} style={{ transitionDelay: `${index * 50}ms` }}>
                      <Box 
                        sx={{
                          position: 'relative',
                          '&:hover': {
                            transform: index === 0 ? 'translateY(-8px)' : 'translateY(-12px)',
                            '& .blog-overlay': {
                              opacity: 1
                            }
                          },
                          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onMouseEnter={() => setHoveredBlog(blog._id)}
                        onMouseLeave={() => setHoveredBlog(null)}
                      >
                        <Box sx={{ 
                          position: 'relative',
                          transform: index === 0 ? 'scale(1.02)' : 'scale(1)',
                          '&:hover': {
                            transform: index === 0 ? 'scale(1.05)' : 'scale(1.02)'
                          },
                          transition: 'transform 0.3s ease'
                        }}>
                          <BlogCard blog={blog} />
                          {/* Interactive Overlay */}
                          <Box 
                            className="blog-overlay"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(135deg, rgba(255,152,0,0.9) 0%, rgba(156,39,176,0.9) 100%)',
                              opacity: 0,
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'opacity 0.3s ease',
                              pointerEvents: hoveredBlog === blog._id ? 'auto' : 'none'
                            }}
                          >
                            <Stack direction="row" spacing={2}>
                              <IconButton 
                                sx={{ 
                                  bgcolor: 'white', 
                                  color: themeColors.purple.main,
                                  '&:hover': { 
                                    bgcolor: 'white', 
                                    transform: 'scale(1.2)' 
                                  }
                                }}
                              >
                                <BookmarkAdd />
                              </IconButton>
                              <IconButton 
                                sx={{ 
                                  bgcolor: 'white', 
                                  color: themeColors.orange.main,
                                  '&:hover': { 
                                    bgcolor: 'white', 
                                    transform: 'scale(1.2)' 
                                  }
                                }}
                              >
                                <Share />
                              </IconButton>
                              <IconButton 
                                sx={{ 
                                  bgcolor: 'white', 
                                  color: '#2196F3',
                                  '&:hover': { 
                                    bgcolor: 'white', 
                                    transform: 'scale(1.2)' 
                                  }
                                }}
                              >
                                <Comment />
                              </IconButton>
                            </Stack>
                          </Box>
                        </Box>
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
                      borderRadius: 5,
                      fontWeight: 700,
                      px: 8,
                      py: 2.5,
                      fontSize: '1.2rem',
                      background: themeColors.gradient.button,
                      boxShadow: '0 10px 30px rgba(156, 39, 176, 0.4)',
                      '&:hover': {
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 15px 40px rgba(156, 39, 176, 0.6)',
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
              border: '2px solid rgba(102, 126, 234, 0.2)'
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

          {/* Community Stats Section - Centered */}
          <Fade in timeout={1000}>
            <Box sx={{ mt: 12, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 6 }}>
                Join Our Thriving Community
              </Typography>
              <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '1200px' }}>
                {[
                  { 
                    icon: AutoStories, 
                    number: '100K+', 
                    label: 'Stories Published', 
                    color: '#FF9800',
                    description: 'New stories every day'
                  },
                  { 
                    icon: People, 
                    number: '50K+', 
                    label: 'Active Writers', 
                    color: '#9C27B0',
                    description: 'From around the world'
                  },
                  { 
                    icon: Visibility, 
                    number: '2M+', 
                    label: 'Monthly Readers', 
                    color: '#2196F3',
                    description: 'Engaging with content'
                  },
                  { 
                    icon: Favorite, 
                    number: '5M+', 
                    label: 'Stories Liked', 
                    color: '#E91E63',
                    description: 'Community appreciation'
                  }
                ].map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={stat.label} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Zoom in timeout={800} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 4,
                        background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                        border: `2px solid ${stat.color}30`,
                        cursor: 'pointer',
                        width: '100%',
                        maxWidth: '280px',
                        '&:hover': {
                          transform: 'translateY(-15px) scale(1.05)',
                          boxShadow: `0 20px 40px ${stat.color}40`,
                          '& .stat-icon': {
                            transform: 'scale(1.3) rotate(360deg)'
                          }
                        },
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}>
                        <Box className="stat-icon" sx={{ transition: 'transform 0.6s ease' }}>
                          <stat.icon sx={{ fontSize: 50, color: stat.color, mb: 2 }} />
                        </Box>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color, mb: 1 }}>
                          {stat.number}
                        </Typography>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                          {stat.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.description}
                        </Typography>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes float {
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
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
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