import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Grid, Paper, Fade } from '@mui/material';

const HomePage = () => {
  const { blogs, isLoading } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchBlogs()).then((result) => {
      if (result.payload) {
        // Extract unique categories
        const allCategories = result.payload.flatMap(blog => blog.categories);
        setCategories([...new Set(allCategories)]);
      }
    });
  }, [dispatch]);

  // Medium-style: show a limited number, then load more
  const [visibleCount, setVisibleCount] = useState(6);
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || blog.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });
  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const handleLoadMore = () => setVisibleCount((c) => c + 6);



  return (
    <Layout>
      <Fade in timeout={800}>
        <div>
          {/* Hero Section - Vibrant Gradient, Decorative SVGs */}
          <div className="relative overflow-hidden rounded-3xl mb-12 shadow-lg bg-gradient-to-br from-primary via-accent to-info py-20 px-4 flex flex-col items-center text-center">
            {/* Decorative SVGs */}
            <svg className="absolute left-0 top-0 w-40 h-40 opacity-30 -z-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle fill="#a21caf" cx="100" cy="100" r="100" />
            </svg>
            <svg className="absolute right-0 bottom-0 w-56 h-56 opacity-20 -z-10" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
              <circle fill="#06b6d4" cx="110" cy="110" r="110" />
            </svg>
            <Typography variant="h2" fontWeight={900} sx={{ mb: 2, letterSpacing: 1, fontFamily: 'Merriweather, serif', color: '#fff', textShadow: '0 2px 16px #0002' }}>
              Transform Blogging Into Art
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255,255,255,0.95)', fontFamily: 'Inter, sans-serif' }}>
              Create, discover, and share stunning blogs with a vibrant community.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                fontWeight: 700,
                px: 5,
                py: 1.8,
                borderRadius: 999,
                background: 'linear-gradient(90deg, #a21caf 0%, #6366f1 100%)',
                color: '#fff',
                boxShadow: 4,
                fontSize: 20,
                textTransform: 'none',
                mt: 2,
                '&:hover': { background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)' }
              }}
              href="/register"
            >
              Get Started Free
            </Button>
            <Typography sx={{ mt: 6, color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontSize: 18 }}>
              <span className="inline-block mr-6">🚀 10k+ Blogs Created</span>
              <span className="inline-block mr-6">🔥 5x More Engagement</span>
              <span className="inline-block">💡 AI-Powered Insights</span>
            </Typography>
          </div>

          {/* Features Section - Cards */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            <div className="bg-card rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-primary hover:scale-105 transition-transform">
              <img src="/logo192.png" alt="Import" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-primary">Easy Blog Import</h3>
              <p className="text-gray-600">Import and publish your stories in seconds with our seamless editor.</p>
            </div>
            <div className="bg-card rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-accent hover:scale-105 transition-transform">
              <img src="/logo512.png" alt="Visualize" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-accent">Smart Visualizations</h3>
              <p className="text-gray-600">AI-powered suggestions for images, tags, and formatting to make your blog pop.</p>
            </div>
            <div className="bg-card rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border-t-4 border-info hover:scale-105 transition-transform">
              <img src="/favicon.ico" alt="Collaboration" className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-info">Team Collaboration</h3>
              <p className="text-gray-600">Work with others, share drafts, and get feedback in real time.</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <Paper elevation={3} sx={{ p: 3, mb: 5, borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Search blogs..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ background: 'white', borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    sx={{ background: 'white', borderRadius: 2 }}
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

          {/* Blog Feed - Modern Cards */}
          {isLoading ? (
            <Box textAlign="center" py={8}>
              <Box sx={{ display: 'inline-block', p: 2 }}>
                <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 inline-block"></span>
              </Box>
              <Typography variant="body1" color="text.secondary" mt={2}>
                Loading blogs...
              </Typography>
            </Box>
          ) : filteredBlogs.length > 0 ? (
            <>
              <Grid container spacing={4}>
                {visibleBlogs.map(blog => (
                  <Grid item xs={12} sm={6} md={6} key={blog._id}>
                    <BlogCard blog={blog} />
                  </Grid>
                ))}
              </Grid>
              {visibleCount < filteredBlogs.length && (
                <Box textAlign="center" mt={4}>
                  <Button variant="outlined" size="large" onClick={handleLoadMore} sx={{ borderRadius: 999, fontWeight: 700, px: 5, py: 1.5, color: '#6366f1', borderColor: '#6366f1', '&:hover': { background: '#f3f4f6' } }}>
                    Load more
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">
                No blogs found matching your criteria.
              </Typography>
            </Box>
          )}
        </div>
      </Fade>
    </Layout>
  );
};

export default HomePage;
