import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBlogs } from '../redux/slices/blogSlice';
import { updateProfile } from '../redux/slices/authSlice';
import { uploadImage } from '../utils/cloudinary';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Button,
  TextField,
  Avatar,
  Chip,
  Stack,
  Paper,
  IconButton,
  Fade,
  Zoom,
  Divider
} from '@mui/material';
import {
  Edit,
  CameraAlt,
  AutoStories,
  People,
  Favorite,
  Share,
  Bookmark,
  Dashboard,
  Settings,
  Logout,
  ArrowBack,
  Check,
  Close
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
    avatar: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 100%)'
  }
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const { blogs, isLoading: blogsLoading } = useSelector((state) => state.blogs);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    profilePicture: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
      });
      setImagePreview(user.profilePicture || '');
      if (blogs.length === 0) {
        dispatch(fetchBlogs());
      }
    }
  }, [user, blogs.length, dispatch, navigate]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setError('');
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, profilePicture: imageUrl }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        setError('Failed to upload image');
      }
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    setError('');
    setIsUploading(true);
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (err) {
      setError(err || 'Failed to update profile');
    }
    setIsUploading(false);
  };

  if (authLoading) return <LoadingSpinner />;

  if (!user) return null;

  const userBlogs = blogs.filter((blog) => blog.author._id === user.id);

  return (
    <Layout>
      {/* Hero Section */}
      <Box sx={{
        background: themeColors.gradient.hero,
        color: 'white',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="xl">
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h2" fontWeight="900" sx={{ mb: 2 }}>
                Your Writing Journey
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
                Share your stories, inspire the world
              </Typography>
            </Box>
          </Fade>

          {/* Profile Card */}
          <Zoom in timeout={1000}>
            <Card sx={{
              maxWidth: 800,
              mx: 'auto',
              p: 6,
              borderRadius: 6,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
            }}>
              <Grid container spacing={4} alignItems="center">
                {/* Profile Picture */}
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={imagePreview || '/default-avatar.png'}
                      sx={{
                        width: 160,
                        height: 160,
                        border: '4px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        background: themeColors.gradient.avatar
                      }}
                    />
                    {isEditing && (
                      <IconButton
                        component="label"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          bgcolor: themeColors.orange.main,
                          color: 'white',
                          '&:hover': {
                            bgcolor: themeColors.orange.dark
                          }
                        }}
                      >
                        <CameraAlt />
                        <input
                          type="file"
                          hidden
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </IconButton>
                    )}
                  </Box>
                  {isUploading && (
                    <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,0.8)' }}>
                      Uploading...
                    </Typography>
                  )}
                </Grid>

                {/* Profile Info */}
                <Grid item xs={12} md={8}>
                  {isEditing ? (
                    <Fade in timeout={500}>
                      <Box component="form" onSubmit={handleSubmit} sx={{ spaceY: 3 }}>
                        <TextField
                          fullWidth
                          label="Username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(255,255,255,0.9)',
                              borderRadius: 2
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Tell us about yourself..."
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(255,255,255,0.9)',
                              borderRadius: 2
                            }
                          }}
                        />
                        {error && (
                          <Typography color="error" variant="body2">
                            {error}
                          </Typography>
                        )}
                        <Stack direction="row" spacing={2}>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Check />}
                            disabled={isUploading}
                            sx={{
                              background: themeColors.gradient.button,
                              borderRadius: 3,
                              px: 4,
                              fontWeight: 600
                            }}
                          >
                            {isUploading ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Close />}
                            onClick={() => setIsEditing(false)}
                            sx={{
                              borderColor: 'white',
                              color: 'white',
                              borderRadius: 3,
                              px: 4,
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.1)'
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </Box>
                    </Fade>
                  ) : (
                    <Fade in timeout={500}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Typography variant="h3" fontWeight="800">
                            {user.username}
                          </Typography>
                          <Chip
                            label={user.role}
                            sx={{
                              bgcolor: user.role === 'admin' ? '#EF4444' : themeColors.purple.main,
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                          {user.email}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
                          {user.bio || 'No bio yet. Share something about yourself!'}
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Edit />}
                          onClick={() => setIsEditing(true)}
                          sx={{
                            background: themeColors.gradient.button,
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)'
                            }
                          }}
                        >
                          Edit Profile
                        </Button>
                      </Box>
                    </Fade>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Zoom>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)' }}>
        <Container maxWidth="xl">
          <Fade in timeout={800}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="800" sx={{ mb: 2 }}>
                Your Writing Stats
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Track your progress and impact
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4} justifyContent="center">
            {[
              { icon: AutoStories, number: userBlogs.length, label: 'Stories Published', color: themeColors.orange.main },
              { icon: Favorite, number: '1.2K', label: 'Total Likes', color: themeColors.purple.main },
              { icon: People, number: '456', label: 'Followers', color: '#2196F3' },
              { icon: Dashboard, number: '45K', label: 'Views', color: '#4CAF50' }
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <Zoom in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 4,
                    background: themeColors.gradient.card,
                    border: `2px solid ${stat.color}20`,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${stat.color}20`,
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <stat.icon sx={{ fontSize: 48, color: stat.color, mb: 2 }} />
                    <Typography variant="h3" fontWeight="bold" color={stat.color} sx={{ mb: 1 }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {stat.label}
                    </Typography>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Blogs Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)' }}>
        <Container maxWidth="xl">
          <Fade in timeout={800}>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h3" fontWeight="800" sx={{ mb: 1 }}>
                    Your Stories
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {userBlogs.length} {userBlogs.length === 1 ? 'story' : 'stories'} published
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  href="/create"
                  sx={{
                    background: themeColors.gradient.button,
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  Write New Story
                </Button>
              </Box>
              <Divider />
            </Box>
          </Fade>

          {blogsLoading ? (
            <LoadingSpinner />
          ) : userBlogs.length > 0 ? (
            <Grid container spacing={4}>
              {userBlogs.map((blog, index) => (
                <Grid item xs={12} md={6} lg={4} key={blog._id}>
                  <Fade in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Box
                      sx={{
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          transition: 'transform 0.3s ease'
                        }
                      }}
                    >
                      <BlogCard blog={blog} />
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Zoom in timeout={800}>
              <Card sx={{
                p: 8,
                textAlign: 'center',
                borderRadius: 4,
                background: 'white',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
              }}>
                <AutoStories sx={{ fontSize: 80, color: themeColors.orange.main, mb: 3, opacity: 0.6 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main">
                  No stories yet
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                  Start your writing journey by creating your first story. Share your thoughts, experiences, and creativity with the world.
                </Typography>
                <Button
                  variant="contained"
                  href="/create"
                  startIcon={<Edit />}
                  size="large"
                  sx={{
                    background: themeColors.gradient.button,
                    borderRadius: 3,
                    px: 6,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}
                >
                  Create Your First Story
                </Button>
              </Card>
            </Zoom>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default ProfilePage;