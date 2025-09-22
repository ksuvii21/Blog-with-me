import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setBlogs, deleteBlog } from '../redux/slices/blogSlice';
import Layout from '../components/Layout';
import axios from 'axios';
import { Box, Paper, Typography, Avatar, Button, Grid, Chip, Fade, Stack, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';

const UserDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { blogs } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [userBlogs, setUserBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserBlogs();
    }
  }, [user]);

  const fetchUserBlogs = async () => {
    try {
      const response = await axios.get('/api/blogs', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const filteredBlogs = response.data.filter(blog => blog.author._id === user.id);
      setUserBlogs(filteredBlogs);
      dispatch(setBlogs(response.data));
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`/api/blogs/${blogId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        dispatch(deleteBlog(blogId));
        setUserBlogs(userBlogs.filter(blog => blog._id !== blogId));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (!user) {
    return (
      <Layout>
        <Box textAlign="center" py={12}>
          <Typography color="text.secondary">Please log in to view your dashboard.</Typography>
        </Box>
      </Layout>
    );
  }

  // Dashboard summary
  const totalBlogs = userBlogs.length;
  const totalLikes = userBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
  const totalViews = userBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);

  return (
    <Layout>
      <Fade in timeout={700}>
        <Box maxWidth="lg" mx="auto" px={2} py={4} position="relative">
          {/* Decorative SVGs */}
          <svg className="absolute left-0 top-0 w-48 h-48 opacity-10 -z-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle fill="#a21caf" cx="100" cy="100" r="100" />
          </svg>
          <svg className="absolute right-0 bottom-0 w-64 h-64 opacity-5 -z-10" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
            <circle fill="#06b6d4" cx="110" cy="110" r="110" />
          </svg>
          <Typography variant="h3" fontWeight={900} mb={1} color="primary.main" sx={{ fontFamily: 'Merriweather, serif', letterSpacing: 1 }}>
            My Dashboard
          </Typography>
          <Typography color="text.secondary" mb={4} fontSize={18} fontWeight={500}>
            Manage your blogs and profile
          </Typography>

          <Grid container spacing={4}>
            {/* Profile Section */}
            <Grid item xs={12} md={4}>
              <Paper elevation={8} sx={{ p: 4, borderRadius: 6, textAlign: 'center', mb: 2, boxShadow: 8, background: 'rgba(255,255,255,0.98)' }}>
                <Avatar
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={user.username}
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2, boxShadow: 3 }}
                />
                <Typography variant="h5" fontWeight={800} gutterBottom sx={{ fontFamily: 'Merriweather, serif' }}>
                  {user.username}
                </Typography>
                <Typography color="text.secondary" gutterBottom fontWeight={500}>
                  {user.email}
                </Typography>
                {user.bio && (
                  <Typography color="text.secondary" mb={2} fontSize={15}>
                    {user.bio}
                  </Typography>
                )}
                <Button
                  component={Link}
                  to="/profile"
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 999,
                    fontWeight: 800,
                    mt: 1,
                    background: 'linear-gradient(90deg, #a21caf 0%, #6366f1 100%)',
                    color: '#fff',
                    boxShadow: 4,
                    textTransform: 'none',
                    px: 3,
                    py: 1.2,
                    fontSize: 17,
                    '&:hover': { background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)' }
                  }}
                  startIcon={<EditIcon />}
                >
                  Edit Profile
                </Button>
              </Paper>

              {/* Dashboard Summary */}
              <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                <Paper elevation={4} sx={{ p: 2, borderRadius: 6, minWidth: 90, textAlign: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #a21caf 100%)', color: '#fff', boxShadow: 6 }}>
                  <ArticleIcon />
                  <Typography variant="h6" fontWeight={900}>{totalBlogs}</Typography>
                  <Typography variant="caption" color="#e0e7ff">Blogs</Typography>
                </Paper>
                <Paper elevation={4} sx={{ p: 2, borderRadius: 6, minWidth: 90, textAlign: 'center', background: 'linear-gradient(135deg, #a21caf 0%, #06b6d4 100%)', color: '#fff', boxShadow: 6 }}>
                  <FavoriteIcon />
                  <Typography variant="h6" fontWeight={900}>{totalLikes}</Typography>
                  <Typography variant="caption" color="#fbcfe8">Likes</Typography>
                </Paper>
                <Paper elevation={4} sx={{ p: 2, borderRadius: 6, minWidth: 90, textAlign: 'center', background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)', color: '#fff', boxShadow: 6 }}>
                  <VisibilityIcon />
                  <Typography variant="h6" fontWeight={900}>{totalViews}</Typography>
                  <Typography variant="caption" color="#cffafe">Views</Typography>
                </Paper>
              </Stack>
            </Grid>

            {/* Blogs Section */}
            <Grid item xs={12} md={8}>
              <Paper elevation={8} sx={{ p: 4, borderRadius: 6, boxShadow: 8, background: 'rgba(255,255,255,0.98)' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" fontWeight={800} sx={{ fontFamily: 'Merriweather, serif' }}>My Blogs</Typography>
                  <Button
                    component={Link}
                    to="/create"
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 800,
                      background: 'linear-gradient(90deg, #06b6d4 0%, #a21caf 100%)',
                      color: '#fff',
                      boxShadow: 4,
                      textTransform: 'none',
                      px: 3,
                      py: 1.2,
                      fontSize: 17,
                      '&:hover': { background: 'linear-gradient(90deg, #a21caf 0%, #06b6d4 100%)' }
                    }}
                  >
                    Create New Blog
                  </Button>
                </Box>

                {isLoading ? (
                  <Box textAlign="center" py={6}>
                    <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 inline-block"></span>
                    <Typography color="text.secondary" mt={2}>Loading your blogs...</Typography>
                  </Box>
                ) : userBlogs.length > 0 ? (
                  <Stack spacing={3}>
                    {userBlogs.map(blog => (
                      <Paper key={blog._id} elevation={4} sx={{ p: 3, borderRadius: 6, boxShadow: 6, background: 'linear-gradient(90deg, #f8fafc 60%, #a5b4fc 100%)' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box flex={1} minWidth={0}>
                            <Typography variant="subtitle1" fontWeight={800} mb={0.5} noWrap sx={{ color: '#a21caf' }}>
                              <Link to={`/blogs/${blog._id}`} style={{ color: '#a21caf', textDecoration: 'none' }}>
                                {blog.title}
                              </Link>
                            </Typography>
                            <Typography color="text.secondary" variant="body2" mb={1} fontWeight={500}>
                              {new Date(blog.createdAt).toLocaleDateString()} • {blog.views} views • {blog.likes.length} likes
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                              {blog.categories.slice(0, 3).map((category, index) => (
                                <Chip
                                  key={index}
                                  label={category}
                                  color="primary"
                                  size="small"
                                  sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 700 }}
                                />
                              ))}
                            </Box>
                          </Box>
                          <Stack direction="row" spacing={1} ml={2}>
                            <Tooltip title="Edit Blog">
                              <IconButton component={Link} to={`/edit/${blog._id}`} color="primary">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Blog">
                              <IconButton onClick={() => handleDeleteBlog(blog._id)} color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Box textAlign="center" py={6}>
                    <Typography color="text.secondary" mb={2}>You haven't created any blogs yet.</Typography>
                    <Button
                      component={Link}
                      to="/create"
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      sx={{
                        borderRadius: 999,
                        fontWeight: 800,
                        background: 'linear-gradient(90deg, #06b6d4 0%, #a21caf 100%)',
                        color: '#fff',
                        boxShadow: 4,
                        textTransform: 'none',
                        px: 3,
                        py: 1.2,
                        fontSize: 17,
                        '&:hover': { background: 'linear-gradient(90deg, #a21caf 0%, #06b6d4 100%)' }
                      }}
                    >
                      Create Your First Blog
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Layout>
  );
};

export default UserDashboardPage;
