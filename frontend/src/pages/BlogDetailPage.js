import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentBlog } from '../redux/slices/blogSlice';
import Layout from '../components/Layout';
import CommentSection from '../components/CommentSection';
import axios from 'axios';
import { Box, Paper, Typography, Avatar, Chip, Stack, Button, Fade, IconButton, Tooltip, Divider, Snackbar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';

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
    // eslint-disable-next-line
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

  // Animated claps handler
  const handleClap = () => {
    if (!user) {
      alert('Please login to clap for this blog.');
      return;
    }
    setClapAnimating(true);
    setTimeout(() => setClapAnimating(false), 500);
    setIsClapped((prev) => !prev);
    setClapCount((prev) => (isClapped ? prev - 1 : prev + 1));
    dispatch({ type: 'blogs/likeBlog/pending' });
    dispatch({ type: 'blogs/likeBlog/fulfilled', payload: { id: currentBlog._id, likes: isClapped ? currentBlog.likes.length - 1 : currentBlog.likes.length + 1 } });
    dispatch({ type: 'blogs/likeBlog', payload: currentBlog._id });
  };

  // Highlight-to-share handler
  useEffect(() => {
    const handleMouseUp = (e) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 10) {
        setHighlightedText(selection.toString());
        setSnackbarOpen(true);
      }
    };
    const contentBox = document.getElementById('blog-content');
    if (contentBox) {
      contentBox.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      if (contentBox) contentBox.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleShare = () => {
    if (highlightedText) {
      navigator.clipboard.writeText(highlightedText);
      setSnackbarOpen(false);
    }
  };

  // Related stories: show 3 other blogs by same author or in same category
  const relatedStories = blogs
    .filter(b => b._id !== currentBlog._id && (b.author._id === currentBlog.author._id || b.categories.some(cat => currentBlog.categories.includes(cat))))
    .slice(0, 3);

  if (isLoading || !currentBlog) {
    return (
      <Layout>
        <Box textAlign="center" py={12}>
          <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 inline-block"></span>
          <Typography color="text.secondary" mt={4}>Loading blog...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Fade in timeout={700}>
        <Box maxWidth="md" mx="auto" py={4}>
          <Paper elevation={4} sx={{ p: { xs: 2, md: 5 }, borderRadius: 4, mb: 4 }}>
            {/* Blog Header */}
            {currentBlog.featuredImage && (
              <Box mb={3}>
                <img
                  src={currentBlog.featuredImage}
                  alt={currentBlog.title}
                  style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 16 }}
                />
              </Box>
            )}
            <Typography variant="h3" fontWeight={800} mb={2} color="primary.main">
              {currentBlog.title}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} mb={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={currentBlog.author.profilePicture || '/default-avatar.png'} alt={currentBlog.author.username} sx={{ width: 48, height: 48 }} />
                <Box>
                  <Typography fontWeight={700}>{currentBlog.author.username}</Typography>
                  <Typography color="text.secondary" fontSize={14}>
                    {new Date(currentBlog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="center">
                <Typography color="text.secondary" fontSize={14}>
                  {currentBlog.views} views
                </Typography>
                <Tooltip title={isClapped ? 'Unlike' : 'Clap'}>
                  <span style={{ position: 'relative', display: 'inline-block' }}>
                    <IconButton
                      color={isClapped ? 'error' : 'default'}
                      onClick={handleClap}
                      sx={{ transition: 'transform 0.2s', transform: clapAnimating ? 'scale(1.3)' : 'scale(1)' }}
                    >
                      <FavoriteIcon sx={{ transition: 'color 0.2s', color: isClapped ? '#ef4444' : undefined }} />
                      <Typography ml={0.5}>{clapCount}</Typography>
                    </IconButton>
                    {clapAnimating && (
                      <span style={{
                        position: 'absolute',
                        top: -16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: '#ef4444',
                        fontWeight: 700,
                        fontSize: 18,
                        pointerEvents: 'none',
                        opacity: 0.8,
                        animation: 'clap-pop 0.5s',
                      }}>+1</span>
                    )}
                    <style>{`@keyframes clap-pop { 0% { opacity: 0; transform: translateY(0) scale(0.8); } 50% { opacity: 1; transform: translateY(-10px) scale(1.2); } 100% { opacity: 0; transform: translateY(-20px) scale(1); } }`}</style>
                  </span>
                </Tooltip>
              </Stack>
            </Stack>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {currentBlog.categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  color="primary"
                  size="small"
                  sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}
                />
              ))}
            </Box>
            {currentBlog.summary && (
              <Typography color="text.secondary" fontStyle="italic" mb={3}>
                {currentBlog.summary}
              </Typography>
            )}
            <Divider sx={{ my: 3 }} />
            {/* Blog Content */}
            <Box
              id="blog-content"
              className="prose prose-lg dark:prose-invert max-w-none"
              mb={4}
              dangerouslySetInnerHTML={{ __html: currentBlog.content }}
            />
            {/* Highlight-to-share Snackbar */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={() => setSnackbarOpen(false)}
              message={
                <span>
                  <ShareIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Share highlighted text
                </span>
              }
              action={
                <Button color="secondary" size="small" onClick={handleShare}>
                  Copy
                </Button>
              }
            />
            {/* Tags */}
            {currentBlog.tags.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>Tags</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {currentBlog.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={`#${tag}`}
                      color="secondary"
                      size="small"
                      sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            {/* Edit Button for Author */}
            {user && (user.id === currentBlog.author._id || user.role === 'admin') && (
              <Box mb={3}>
                <Button
                  component={Link}
                  to={`/edit/${currentBlog._id}`}
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  sx={{ borderRadius: 3, fontWeight: 700 }}
                >
                  Edit Blog
                </Button>
              </Box>
            )}
            {/* Author Bio */}
            <Divider sx={{ my: 4 }} />
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar src={currentBlog.author.profilePicture || '/default-avatar.png'} sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography fontWeight={700}>{currentBlog.author.username}</Typography>
                <Typography color="text.secondary" fontSize={14}>{currentBlog.author.bio || 'No bio provided.'}</Typography>
              </Box>
            </Box>
            {/* Related Stories */}
            {relatedStories.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" fontWeight={700} mb={2}>Related Stories</Typography>
                <Stack spacing={2}>
                  {relatedStories.map(story => (
                    <Paper key={story._id} elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        {story.featuredImage && (
                          <img src={story.featuredImage} alt={story.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                        )}
                        <Box flex={1}>
                          <Typography fontWeight={700} noWrap>
                            <Link to={`/blogs/${story._id}`} style={{ color: '#222', textDecoration: 'none' }}>{story.title}</Link>
                          </Typography>
                          <Typography color="text.secondary" fontSize={13} noWrap>
                            {story.summary || story.content.replace(/<[^>]+>/g, '').slice(0, 80) + '...'}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
          {/* Comments Section */}
          <CommentSection blogId={currentBlog._id} />
        </Box>
      </Fade>
    </Layout>
  );
};

export default BlogDetailPage;
