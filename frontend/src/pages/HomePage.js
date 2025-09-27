import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import { 
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, 
  Typography, Grid, Paper, Fade, Container, Chip, Stack
} from '@mui/material';
import { Search, FilterList, ExpandMore, Favorite, TrendingUp, NewReleases } from '@mui/icons-material';

const HomePage = () => {
  const { blogs, isLoading, error } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    dispatch(fetchBlogs()).then((result) => {
      if (result.payload) {
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

  // Featured categories
  const featuredCategories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Programming', 'Design'];

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <Box sx={{ 
        width: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 10, md: 15 },
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
              <Chip 
                label="🎉 New Features Added!" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white', 
                  mb: 3,
                  fontWeight: 600
                }} 
              />
              
              <Typography variant="h1" fontWeight={900} sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2
              }}>
                Write Your Story,<br />Share Your Voice
              </Typography>
              
              <Typography variant="h5" sx={{ 
                mb: 4, 
                opacity: 0.9, 
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.5rem' }
              }}>
                Join our community of passionate writers and readers. Share your knowledge, experiences, and stories with the world.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  href="/register"
                  sx={{
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
                    fontSize: '1.1rem',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Start Writing Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="/discover"
                  sx={{
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'white',
                      color: 'primary.main',
                    }
                  }}
                >
                  Explore Blogs
                </Button>
              </Stack>

              {/* Stats */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={4} 
                justifyContent="center" 
                sx={{ mt: 6 }}
              >
                {[
                  { number: '10K+', label: 'Active Writers' },
                  { number: '50K+', label: 'Blog Posts' },
                  { number: '1M+', label: 'Monthly Readers' },
                  { number: '95%', label: 'Satisfaction' }
                ].map((stat, index) => (
                  <Box key={index} textAlign="center">
                    <Typography variant="h4" fontWeight="bold" sx={{ opacity: 0.9 }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Fade in timeout={800}>
          <Box>
            {/* Featured Categories */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                Explore Categories
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                {featuredCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    clickable
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category ? '' : category
                    )}
                    sx={{
                      m: 0.5,
                      px: 2,
                      py: 1,
                      fontSize: '1rem',
                      bgcolor: selectedCategory === category ? 'primary.main' : 'transparent',
                      color: selectedCategory === category ? 'white' : 'text.primary',
                      '&:hover': {
                        bgcolor: selectedCategory === category ? 'primary.dark' : 'action.hover'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Search and Filter Section */}
            <Paper elevation={2} sx={{ p: 4, mb: 6, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterList sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h5" fontWeight={600}>
                  Discover Amazing Content
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Search blogs, authors, topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ color: 'primary.main', mr: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      sx={{ borderRadius: 3 }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{ borderRadius: 3 }}
                    >
                      <MenuItem value="newest">
                        <NewReleases sx={{ mr: 1, fontSize: 20 }} />
                        Newest First
                      </MenuItem>
                      <MenuItem value="oldest">Oldest First</MenuItem>
                      <MenuItem value="popular">Most Popular</MenuItem>
                      <MenuItem value="trending">
                        <TrendingUp sx={{ mr: 1, fontSize: 20 }} />
                        Trending
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Results Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Showing {Math.min(visibleBlogs.length, filteredBlogs.length)} of {filteredBlogs.length} blogs
              </Typography>
              {searchTerm && (
                <Chip 
                  label={`Search: "${searchTerm}"`} 
                  onDelete={() => setSearchTerm('')}
                  color="primary"
                  variant="outlined"
                />
              )}
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
                  Loading amazing content...
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Please wait while we prepare the best blogs for you
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
            ) : filteredBlogs.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {visibleBlogs.map((blog, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={blog._id}>
                      <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Box>
                          <BlogCard blog={blog} />
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
                
                {visibleCount < filteredBlogs.length && (
                  <Box textAlign="center" mt={8}>
                    <Button 
                      variant="outlined" 
                      onClick={handleLoadMore}
                      endIcon={<ExpandMore />}
                      sx={{ 
                        borderRadius: 3, 
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Load More ({filteredBlogs.length - visibleCount} remaining)
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Box textAlign="center" py={10}>
                <Favorite sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  No blogs found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {searchTerm || selectedCategory 
                    ? `Try adjusting your search filters for "${searchTerm || selectedCategory}"`
                    : 'Be the first to write a blog in this category!'
                  }
                </Typography>
                <Button 
                  variant="contained" 
                  href="/create"
                  sx={{ borderRadius: 3 }}
                >
                  Write First Blog
                </Button>
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
    </Layout>
  );
};

export default HomePage;