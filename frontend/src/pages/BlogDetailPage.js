import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentBlog, likeBlog } from '../redux/slices/blogSlice'
import Layout from '../components/Layout';
import CommentSection from '../components/CommentSection';
import axios from 'axios';
import {
  Box, Container, Card, Typography, Avatar, Chip, Stack, Button,
  Fade, IconButton, Tooltip, Divider, Snackbar, Paper, Grid, alpha
} from '@mui/material';
import { 
  Favorite, Share, Edit, Bookmark, ArrowBack, 
  Visibility, Schedule, LocalFireDepartment 
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

const BlogDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs);
  const currentBlog = useSelector((state) => state.blogs.currentBlog);
  const isLoading = useSelector((state) => state.blogs.isLoading);
  const user = useSelector((state) => state.auth.user);

  const [clapCount, setClapCount] = useState(0);
  const [isClapped, setIsClapped] = useState(false);
  const [clapAnimating, setClapAnimating] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  function fetchBlog() {
    axios.get(`/api/blogs/${id}`)
      .then(response => {
        dispatch(setCurrentBlog(response.data));
      })
      .catch(error => {
        console.error('Error fetching blog:', error);
      });
  }

  useEffect(() => {
    if (currentBlog && user) {
      setClapCount(currentBlog.likes.length);
      setIsClapped(currentBlog.likes.includes(user.id));
    }
  }, [currentBlog, user]);

  const handleClap = async () => {
    if (!user) {
      alert('Please login to clap for this blog.');
      return;
    }
    setClapAnimating(true);
    setTimeout(() => setClapAnimating(false), 500);
    try {
      const result = await dispatch(likeBlog(currentBlog._id)).unwrap();
      setClapCount(result.likes.length);
      setIsClapped(result.likes.some(like => like._id === user.id));
    } catch (error) {
      console.error('Like failed:', error);
      setClapAnimating(false);
    }
  };

  if (isLoading || !currentBlog) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box textAlign="center" py={12}>
            <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 inline-block"></span>
            <Typography color="text.secondary" mt={4}>Loading blog...</Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  const relatedStories = currentBlog ? blogs
    .filter(b => b._id !== currentBlog._id && (b.author._id === currentBlog.author._id || b.categories.some(cat => currentBlog.categories.includes(cat))))
    .slice(0, 3) : [];

  return (
    <Layout>
      <Fade in timeout={700}>
        <Box sx={{ background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)', minHeight: '100vh', py: 4 }}>
          <Container maxWidth="lg">
            {/* Back Button */}
            <Button
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
              sx={{
                mb: 3,
                color: themeColors.purple.main,
                fontWeight: 600,
                '&:hover': {
                  background: alpha(themeColors.purple.main, 0.1)
                }
              }}
            >
              Back to Stories
            </Button>

            {/* Main Blog Card */}
            <Card sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              mb: 6,
              background: 'white',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              border: `1px solid ${themeColors.orange.light}20`
            }}>
              {/* Featured Image */}
              {currentBlog.featuredImage && (
                <Box sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                  <img
                    src={currentBlog.featuredImage}
                    alt={currentBlog.title}
                    style={{ width: '100%', maxHeight: 500, objectFit: 'cover' }}
                  />
                </Box>
              )}

              {/* Blog Header */}
              <Box sx={{ mb: 4 }}>
                <Chip
                  icon={<LocalFireDepartment />}
                  label="Featured Story"
                  sx={{
                    background: themeColors.gradient.button,
                    color: 'white',
                    fontWeight: 600,
                    mb: 3
                  }}
                />
                <Typography variant="h2" fontWeight="900" sx={{
                  background: themeColors.gradient.hero,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  lineHeight: 1.2
                }}>
                  {currentBlog.title}
                </Typography>

                {/* Author & Stats */}
                <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={currentBlog.author.profilePicture || '/default-avatar.png'} 
                        sx={{ 
                          width: 60, 
                          height: 60,
                          border: `3px solid ${themeColors.orange.light}`
                        }} 
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="700">
                          {currentBlog.author.username}
                        </Typography>
                        <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Schedule sx={{ fontSize: 16 }} />
                          {new Date(currentBlog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight="800" color={themeColors.orange.main}>
                          {currentBlog.views || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Views
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight="800" color={themeColors.purple.main}>
                          {clapCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Claps
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Categories */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {currentBlog.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      sx={{
                        background: themeColors.gradient.card,
                        color: themeColors.purple.dark,
                        fontWeight: 600,
                        border: `1px solid ${themeColors.purple.light}`
                      }}
                    />
                  ))}
                </Box>

                {/* Summary */}
                {currentBlog.summary && (
                  <Typography variant="h6" color="text.secondary" sx={{
                    fontStyle: 'italic',
                    p: 3,
                    background: themeColors.gradient.card,
                    borderRadius: 3,
                    borderLeft: `4px solid ${themeColors.orange.main}`
                  }}>
                    {currentBlog.summary}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Blog Content */}
              <Box
                className="prose prose-lg max-w-none"
                sx={{
                  '& h2': { color: themeColors.orange.dark },
                  '& h3': { color: themeColors.purple.main },
                  '& a': { color: themeColors.orange.main },
                  mb: 6
                }}
                dangerouslySetInnerHTML={{ __html: currentBlog.content }}
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                <Tooltip title={isClapped ? 'Unlike' : 'Clap'}>
                  <Button
                    startIcon={<Favorite sx={{ 
                      color: isClapped ? '#ff4444' : 'inherit',
                      animation: clapAnimating ? 'pulse 0.5s' : 'none'
                    }} />}
                    onClick={handleClap}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      borderColor: isClapped ? '#ff4444' : themeColors.orange.main,
                      color: isClapped ? '#ff4444' : themeColors.orange.main,
                      fontWeight: 600
                    }}
                  >
                    {clapCount} Claps
                  </Button>
                </Tooltip>

                <Button
                  startIcon={<Bookmark />}
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    borderColor: themeColors.purple.main,
                    color: themeColors.purple.main,
                    fontWeight: 600
                  }}
                >
                  Save
                </Button>

                {user && (user.id === currentBlog.author._id || user.role === 'admin') && (
                  <Button
                    component={Link}
                    to={`/edit/${currentBlog._id}`}
                    startIcon={<Edit />}
                    variant="contained"
                    sx={{
                      background: themeColors.gradient.button,
                      borderRadius: 3,
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255, 152, 0, 0.4)'
                      }
                    }}
                  >
                    Edit Blog
                  </Button>
                )}
              </Box>

              {/* Author Bio */}
              <Card sx={{
                p: 4,
                background: themeColors.gradient.card,
                borderRadius: 3,
                border: `2px solid ${themeColors.orange.light}20`
              }}>
                <Typography variant="h5" fontWeight="800" sx={{ mb: 3, color: themeColors.purple.dark }}>
                  About the Author
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar 
                    src={currentBlog.author.profilePicture || '/default-avatar.png'} 
                    sx={{ width: 80, height: 80 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                      {currentBlog.author.username}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {currentBlog.author.bio || 'Passionate writer sharing stories and experiences with the world.'}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Card>

            {/* Related Stories */}
            {relatedStories.length > 0 && (
              <Box sx={{ mb: 8 }}>
                <Typography variant="h3" fontWeight="800" sx={{ 
                  mb: 4,
                  background: themeColors.gradient.hero,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center'
                }}>
                  More Stories You'll Love
                </Typography>
                <Grid container spacing={3}>
                  {relatedStories.map(story => (
                    <Grid item xs={12} md={4} key={story._id}>
                      <Card sx={{
                        p: 3,
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                        }
                      }}>
                        {story.featuredImage && (
                          <img 
                            src={story.featuredImage} 
                            alt={story.title}
                            style={{ 
                              width: '100%', 
                              height: 200, 
                              objectFit: 'cover', 
                              borderRadius: 12,
                              marginBottom: 16
                            }} 
                          />
                        )}
                        <Typography variant="h6" fontWeight="700" gutterBottom>
                          {story.title}
                        </Typography>
                        <Typography color="text.secondary" noWrap>
                          {story.summary || story.content.replace(/<[^>]+>/g, '').slice(0, 100) + '...'}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Comments Section */}
            <CommentSection blogId={currentBlog._id} />
          </Container>
        </Box>
      </Fade>
    </Layout>
  );
};

export default BlogDetailPage;