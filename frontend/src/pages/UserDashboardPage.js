import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs, deleteBlog } from '../redux/slices/blogSlice';
import Layout from '../components/Layout';
import {
  Box, Typography, Avatar, Button, Grid, Chip, Fade, Stack, IconButton,
  Tooltip, Card, CardContent, Dialog, DialogTitle, DialogContent,
  DialogActions, useTheme, useMediaQuery, Tabs, Tab,
  Skeleton, Divider, alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Blog Card Component
const BlogCard = ({ blog, onDeleteClick }) => {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={2} 
      sx={{ 
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              component={Link}
              to={`/blogs/${blog._id}`}
              sx={{ 
                fontWeight: 600,
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': { color: 'primary.main' },
                display: 'block',
                mb: 1
              }}
            >
              {blog.title}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {blog.description || 'No description available'}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {blog.categories.slice(0, 3).map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderColor: alpha(theme.palette.primary.main, 0.3)
                  }}
                />
              ))}
              {blog.categories.length > 3 && (
                <Chip label={`+${blog.categories.length - 3}`} size="small" variant="outlined" />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {blog.views || 0} views
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FavoriteIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {blog.likes?.length || 0} likes
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
            <Tooltip title="Edit Blog">
              <IconButton 
                component={Link} 
                to={`/edit/${blog._id}`} 
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Blog">
              <IconButton 
                size="small"
                onClick={() => onDeleteClick(blog)}
                sx={{ 
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Blogs List Component
const BlogsList = ({ blogs, isLoading, onDeleteClick, emptyMessage }) => {
  if (isLoading) {
    return (
      <Stack spacing={2} sx={{ p: 3 }}>
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
        ))}
      </Stack>
    );
  }

  if (blogs.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
        <BookIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {emptyMessage}
        </Typography>
        <Button
          component={Link}
          to="/create"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ mt: 2 }}
        >
          Create Your First Blog
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      {blogs.map(blog => (
        <BlogCard key={blog._id} blog={blog} onDeleteClick={onDeleteClick} />
      ))}
    </Stack>
  );
};

// Main Component
const UserDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { blogs, isLoading } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [userBlogs, setUserBlogs] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({ totalBlogs: 0, totalLikes: 0, totalViews: 0, avgViews: 0 });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (user) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user && blogs.length > 0) {
      const filteredBlogs = blogs.filter(blog => blog.author?._id === user._id || blog.author === user._id);
      setUserBlogs(filteredBlogs);

      // Calculate statistics
      const totalBlogs = filteredBlogs.length;
      const totalLikes = filteredBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
      const totalViews = filteredBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
      const avgViews = totalBlogs > 0 ? (totalViews / totalBlogs).toFixed(1) : 0;

      setStats({ totalBlogs, totalLikes, totalViews, avgViews });
    }
  }, [user, blogs]);

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (blogToDelete) {
      try {
        await dispatch(deleteBlog(blogToDelete._id)).unwrap();
        setUserBlogs(userBlogs.filter(blog => blog._id !== blogToDelete._id));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
    setDeleteDialogOpen(false);
    setBlogToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBlogToDelete(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Sort blogs by different criteria
  const getSortedBlogs = (sortBy) => {
    const sorted = [...userBlogs];
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'popular':
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'likes':
        return sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      default:
        return sorted;
    }
  };

  const recentBlogs = getSortedBlogs('recent');
  const popularBlogs = getSortedBlogs('popular');

  if (!user) {
    return (
      <Layout>
        <Box textAlign="center" py={12}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Welcome to Your Dashboard
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Please log in to view your personalized dashboard
          </Typography>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            size="large"
            sx={{ borderRadius: 3 }}
          >
            Sign In
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Fade in timeout={800}>
        <Box sx={{ maxWidth: 'xl', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
          {/* Background decorative elements */}
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '400px', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            zIndex: -1 
          }} />
          
          {/* Header Section */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 6 }}>
            <Typography 
              variant="h2" 
              fontWeight={800} 
              gutterBottom
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Welcome back, {user.username}!
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ maxWidth: '600px', mx: { xs: 'auto', md: 0 } }}
            >
              Here's what's happening with your blogs today
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Left Sidebar - Profile & Stats */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                {/* Profile Card */}
                <Card 
                  elevation={8} 
                  sx={{ 
                    borderRadius: 4, 
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`
                  }}
                >
                  <Box sx={{ 
                    height: '120px', 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` 
                  }} />
                  <Box sx={{ p: 3, mt: -8 }}>
                    <Avatar
                      src={user.profilePicture || '/default-avatar.png'}
                      alt={user.username}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mx: 'auto', 
                        mb: 2, 
                        border: '4px solid white',
                        boxShadow: theme.shadows[8]
                      }}
                    />
                    <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
                      {user.username}
                    </Typography>
                    <Typography color="text.secondary" textAlign="center" gutterBottom>
                      {user.email}
                    </Typography>
                    {user.bio && (
                      <Typography 
                        color="text.secondary" 
                        textAlign="center" 
                        sx={{ 
                          fontStyle: 'italic',
                          mt: 1,
                          px: 2
                        }}
                      >
                        "{user.bio}"
                      </Typography>
                    )}
                    <Button
                      fullWidth
                      component={Link}
                      to="/profile"
                      variant="contained"
                      size="large"
                      startIcon={<EditIcon />}
                      sx={{
                        borderRadius: 3,
                        mt: 3,
                        py: 1.5,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[8],
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </Card>

                {/* Stats Overview */}
                <Card elevation={4} sx={{ borderRadius: 4 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <DashboardIcon sx={{ mr: 1 }} />
                      Dashboard Overview
                    </Typography>
                    <Stack spacing={2} mt={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ArticleIcon color="primary" sx={{ mr: 2 }} />
                          <Typography>Total Blogs</Typography>
                        </Box>
                        <Chip label={stats.totalBlogs} color="primary" variant="filled" />
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FavoriteIcon color="secondary" sx={{ mr: 2 }} />
                          <Typography>Total Likes</Typography>
                        </Box>
                        <Chip label={stats.totalLikes} color="secondary" variant="filled" />
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VisibilityIcon color="info" sx={{ mr: 2 }} />
                          <Typography>Total Views</Typography>
                        </Box>
                        <Chip label={stats.totalViews} color="info" variant="filled" />
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                          <Typography>Avg. Views per Blog</Typography>
                        </Box>
                        <Chip label={stats.avgViews} color="success" variant="filled" />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card elevation={4} sx={{ borderRadius: 4 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Quick Actions
                    </Typography>
                    <Stack spacing={2} mt={2}>
                      <Button
                        fullWidth
                        component={Link}
                        to="/create"
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ justifyContent: 'flex-start', py: 1.5 }}
                      >
                        Create New Blog
                      </Button>
                      <Button
                        fullWidth
                        component={Link}
                        to="/profile"
                        variant="outlined"
                        startIcon={<AccountCircleIcon />}
                        sx={{ justifyContent: 'flex-start', py: 1.5 }}
                      >
                        Edit Profile
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            {/* Main Content - Blogs Management */}
            <Grid item xs={12} lg={8}>
              <Card elevation={8} sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} centered={isMobile}>
                      <Tab icon={<ArticleIcon />} label="All Blogs" />
                      <Tab icon={<TrendingUpIcon />} label="Most Popular" />
                      <Tab icon={<CalendarTodayIcon />} label="Recent" />
                    </Tabs>
                  </Box>

                  <TabPanel value={tabValue} index={0}>
                    <BlogsList 
                      blogs={userBlogs} 
                      isLoading={isLoading} 
                      onDeleteClick={handleDeleteClick} 
                      emptyMessage="You haven't created any blogs yet. Start sharing your thoughts with the world!"
                    />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <BlogsList 
                      blogs={popularBlogs} 
                      isLoading={isLoading} 
                      onDeleteClick={handleDeleteClick} 
                      emptyMessage="No blogs available. Create your first blog to see it here!"
                    />
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    <BlogsList 
                      blogs={recentBlogs} 
                      isLoading={isLoading} 
                      onDeleteClick={handleDeleteClick} 
                      emptyMessage="No recent blogs. Create a new one to get started!"
                    />
                  </TabPanel>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography>
            Are you sure you want to delete the blog "{blogToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete Blog
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserDashboardPage;