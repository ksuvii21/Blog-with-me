// pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import { 
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, 
  Typography, Grid, Paper, Fade, Container 
} from '@mui/material';
import { Search, FilterList, ExpandMore, Favorite } from '@mui/icons-material';

const HomePage = () => {
  const { blogs, isLoading, error } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    dispatch(fetchBlogs()).then((result) => {
      if (result.payload) {
        const allCategories = result.payload.flatMap(blog => blog.categories || []);
        setCategories([...new Set(allCategories)]);
      }
    });
  }, [dispatch]);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || (blog.categories && blog.categories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((c) => c + 6);

  return (
    <>
      {/* Hero Section */}
      <Box sx={{ 
        width: '100%',
        background: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 50%, #673AB7 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        px: 2,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight={900} sx={{
            mb: 3,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>
            Create. Share. Inspire.
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
            Join thousands of creators sharing their stories
          </Typography>

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
              '&:hover': {
                background: 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)',
              }
            }}
          >
            Start Writing Now
          </Button>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Fade in timeout={800}>
          <Box>
            {/* Search and Filter */}
            <Paper elevation={2} sx={{ p: 3, mb: 6, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterList sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Discover Blogs
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ color: 'primary.main', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Blog Feed */}
            {isLoading ? (
              <Box textAlign="center" py={8}>
                <Box sx={{ 
                  display: 'inline-block',
                  p: 3,
                  borderRadius: '50%',
                  mb: 2
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
                <Typography variant="h6" color="primary.main">
                  Loading blogs...
                </Typography>
              </Box>
            ) : error ? (
              <Box textAlign="center" py={8}>
                <Typography color="error">Error: {error}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Please check if the backend server is running
                </Typography>
              </Box>
            ) : filteredBlogs.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {visibleBlogs.map((blog) => (
                    <Grid item xs={12} sm={6} lg={4} key={blog._id}>
                      <BlogCard blog={blog} />
                    </Grid>
                  ))}
                </Grid>
                
                {visibleCount < filteredBlogs.length && (
                  <Box textAlign="center" mt={6}>
                    <Button 
                      variant="outlined" 
                      onClick={handleLoadMore}
                      endIcon={<ExpandMore />}
                      sx={{ borderRadius: 3, fontWeight: 700 }}
                    >
                      Load More
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Box textAlign="center" py={8}>
                <Favorite sx={{ fontSize: 64, color: 'primary.light', mb: 2 }} />
                <Typography variant="h6">
                  No blogs found
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
    </>
  );
};

export default HomePage;