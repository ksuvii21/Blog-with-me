import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs, deleteBlog } from '../redux/slices/blogSlice';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import {
  Box, Typography, Avatar, Button, Grid, Chip, Fade, Stack, IconButton,
  Tooltip, Card, CardContent, Dialog, DialogTitle, DialogContent,
  DialogActions, useTheme, useMediaQuery, Tabs, Tab,
  Skeleton, Divider, alpha, Paper, Container
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
import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NewReleasesIcon from '@mui/icons-material/NewReleases';


// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Animated Card Component
const MotionCard = Card;

// Stats Card Component
const StatsCard = ({ icon, title, value, subtitle, color }) => (
  <MotionCard
    elevation={2}
    sx={{
      borderRadius: 3,
      background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
      border: `1px solid ${alpha(color, 0.2)}`,
      p: 3,
      textAlign: 'center',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 8px 25px ${alpha(color, 0.15)}`,
      }
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: alpha(color, 0.1),
          mb: 2
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 30, color } })}
      </Box>
      <Typography variant="h4" fontWeight={800} color={color}>
        {value}
      </Typography>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  </MotionCard>
);

// Enhanced Blog Card Component
const BlogCard = ({ blog, onDeleteClick }) => {
  const theme = useTheme();

  return (
    <MotionCard
      elevation={2}
      sx={{
        borderRadius: 3,
        transition: 'all 0.3s ease',
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with title and actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              component={Link}
              to={`/blogs/${blog._id}`}
              sx={{ 
                fontWeight: 700,
                textDecoration: 'none',
                color: 'text.primary',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                },
                display: 'block',
                mb: 1,
                lineHeight: 1.3
              }}
            >
              {blog.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {blog.description || 'No description available'}
            </Typography>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
            <Tooltip title="Edit Blog">
              <IconButton 
                component={Link} 
                to={`/edit/${blog._id}`} 
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': { 
                    bgcolor: theme.palette.primary.main,
                    color: 'white'
                  }
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
                  '&:hover': { 
                    bgcolor: theme.palette.error.main,
                    color: 'white'
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Categories */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {blog.categories.slice(0, 3).map((category, idx) => (
            <Chip
              key={idx}
              label={category}
              size="small"
              variant="filled"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                  color: 'white'
                }
              }}
            />
          ))}
          {blog.categories.length > 3 && (
            <Chip 
              label={`+${blog.categories.length - 3}`} 
              size="small" 
              variant="outlined" 
            />
          )}
        </Box>

        {/* Stats row */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.default, 0.5)
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              {new Date(blog.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Tooltip title="Views">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 16, color: 'info.main' }} />
                <Typography variant="caption" fontWeight={600} color="info.main">
                  {blog.views || 0}
                </Typography>
              </Box>
            </Tooltip>
            
            <Tooltip title="Likes">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FavoriteIcon sx={{ fontSize: 16, color: 'error.main' }} />
                <Typography variant="caption" fontWeight={600} color="error.main">
                  {blog.likes?.length || 0}
                </Typography>
              </Box>
            </Tooltip>
            
            <Tooltip title="Comments">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CommentIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" fontWeight={600} color="success.main">
                  {blog.comments?.length || 0}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

// Enhanced Blogs List Component
const BlogsList = ({ blogs, isLoading, onDeleteClick, emptyMessage, layout = 'grid' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading) {
    return (
      <Grid container spacing={3} sx={{ p: 3 }}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (blogs.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
        <BookIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom fontWeight={600}>
          {emptyMessage}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
          Start your blogging journey by creating your first post and sharing your thoughts with the world.
        </Typography>
        <Button
          component={Link}
          to="/create"
          variant="contained"
          size="large"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
            }
          }}
        >
          Create Your First Blog
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {blogs.map((blog, index) => (
        <Grid item xs={12} sm={6} lg={4} key={blog._id}>
          <BlogCard blog={blog} onDeleteClick={onDeleteClick} index={index} />
        </Grid>
      ))}
    </Grid>
  );
};

// Main Enhanced Component
const UserDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { blogs, isLoading } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [userBlogs, setUserBlogs] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({ 
    totalBlogs: 0, 
    totalLikes: 0, 
    totalViews: 0, 
    totalComments: 0,
    avgViews: 0,
    engagementRate: 0 
  });

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

      // Calculate enhanced statistics
      const totalBlogs = filteredBlogs.length;
      const totalLikes = filteredBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
      const totalViews = filteredBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
      const totalComments = filteredBlogs.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0);
      const avgViews = totalBlogs > 0 ? (totalViews / totalBlogs).toFixed(1) : 0;
      const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(1) : 0;

      setStats({ totalBlogs, totalLikes, totalViews, totalComments, avgViews, engagementRate });
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
      case 'trending':
        return sorted.sort((a, b) => {
          const aScore = (a.views || 0) + (a.likes?.length || 0) * 2 + (a.comments?.length || 0) * 3;
          const bScore = (b.views || 0) + (b.likes?.length || 0) * 2 + (b.comments?.length || 0) * 3;
          return bScore - aScore;
        });
      default:
        return sorted;
    }
  };

  const recentBlogs = getSortedBlogs('recent');
  const popularBlogs = getSortedBlogs('popular');
  const trendingBlogs = getSortedBlogs('trending');
  const likedBlogs = getSortedBlogs('likes');

  if (!user) {
    return (
      <Layout>
        <Box textAlign="center" py={12}>
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Welcome to Your Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3}>
            Please log in to view your personalized dashboard
          </Typography>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            size="large"
            sx={{ 
              borderRadius: 3,
              px: 4,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          >
            Sign In to Continue
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Fade in timeout={800}>
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
          {/* Enhanced Hero Section */}
          <Box sx={{ 
            position: 'relative',
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
            color: 'white',
            py: { xs: 8, md: 12 },
            overflow: 'hidden'
          }}>
            {/* Background Pattern */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 30% 20%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 50%)`,
            }} />
            
            <Container maxWidth="xl">
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Typography 
                      variant="h1" 
                      fontWeight={800} 
                      gutterBottom
                      sx={{ 
                        fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                        lineHeight: 1.1
                      }}
                    >
                      Welcome back,{' '}
                      <Box component="span" sx={{ 
                        background: 'linear-gradient(45deg, #FFD700, #FF6B6B)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        {user.username}!
                      </Box>
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        opacity: 0.9,
                        mb: 4,
                        fontWeight: 300
                      }}
                    >
                      Your creative journey continues. Manage your blogs, track performance, and connect with your audience.
                    </Typography>
                    <Button
                      component={Link}
                      to="/create"
                      variant="contained"
                      size="large"
                      startIcon={<AddCircleOutlineIcon />}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.3)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Create New Blog
                    </Button>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ textAlign: 'center' }}
                  >
                    <Avatar
                      src={user.profilePicture || '/default-avatar.png'}
                      alt={user.username}
                      sx={{ 
                        width: 200,
                        height: 200,
                        mx: 'auto',
                        mb: 3,
                        border: '4px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                      }}
                    />
                    <Typography variant="h5" fontWeight={600}>
                      {user.username}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      {user.email}
                    </Typography>
                  </motion.div>
                </Grid>
              </Grid>
            </Container>
          </Box>

          {/* Stats Overview Section */}
          <Container maxWidth="xl" sx={{ py: 6, mt: -8 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard
                  icon={<ArticleIcon />}
                  title="Total Blogs"
                  value={stats.totalBlogs}
                  subtitle="Published articles"
                  color={theme.palette.primary.main}
                  delay={0.1}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard
                  icon={<VisibilityIcon />}
                  title="Total Views"
                  value={stats.totalViews}
                  subtitle="All-time reads"
                  color={theme.palette.info.main}
                  delay={0.2}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard
                  icon={<FavoriteIcon />}
                  title="Total Likes"
                  value={stats.totalLikes}
                  subtitle="Reader appreciation"
                  color={theme.palette.error.main}
                  delay={0.3}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard
                  icon={<AnalyticsIcon />}
                  title="Engagement Rate"
                  value={`${stats.engagementRate}%`}
                  subtitle="Likes & comments per view"
                  color={theme.palette.success.main}
                  delay={0.4}
                />
              </Grid>
            </Grid>
          </Container>

          {/* Main Content Area */}
          <Container maxWidth="xl" sx={{ py: 6 }}>
            <Grid container spacing={4}>
              {/* Sidebar */}
              <Grid item xs={12} lg={3}>
                <Stack spacing={3}>
                  {/* Quick Actions */}
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    elevation={4}
                    sx={{ borderRadius: 3 }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <DashboardIcon sx={{ mr: 1 }} />
                        Quick Actions
                      </Typography>
                      <Stack spacing={2} mt={2}>
                        <Button
                          fullWidth
                          component={Link}
                          to="/create"
                          variant="contained"
                          startIcon={<AddCircleOutlineIcon />}
                          sx={{ 
                            justifyContent: 'flex-start',
                            py: 1.5,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          }}
                        >
                          Create New Blog
                        </Button>
                        <Button
                          fullWidth
                          component={Link}
                          to="/profile"
                          variant="outlined"
                          startIcon={<AccountCircleIcon />}
                          sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
                        >
                          Edit Profile
                        </Button>
                        <Button
                          fullWidth
                          component={Link}
                          to="/analytics"
                          variant="outlined"
                          startIcon={<AnalyticsIcon />}
                          sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}
                        >
                          View Analytics
                        </Button>
                      </Stack>
                    </CardContent>
                  </MotionCard>

                  {/* Performance Metrics */}
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    elevation={4}
                    sx={{ borderRadius: 3 }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon sx={{ mr: 1 }} />
                        Performance
                      </Typography>
                      <Stack spacing={2} mt={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">Avg. Views/Blog</Typography>
                          <Chip label={stats.avgViews} size="small" color="primary" />
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">Total Comments</Typography>
                          <Chip label={stats.totalComments} size="small" color="secondary" />
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">Engagement</Typography>
                          <Chip label={`${stats.engagementRate}%`} size="small" color="success" />
                        </Box>
                      </Stack>
                    </CardContent>
                  </MotionCard>
                </Stack>
              </Grid>

              {/* Main Content - Blogs Management */}
              <Grid item xs={12} lg={9}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  elevation={8}
                  sx={{ borderRadius: 4 }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ 
                      borderBottom: 1, 
                      borderColor: 'divider',
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
                    }}>
                      <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        centered={isMobile}
                        sx={{
                          '& .MuiTab-root': {
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            py: 2,
                            minHeight: 'auto'
                          }
                        }}
                      >
                        <Tab icon={<ArticleIcon />} label="All Blogs" />
                        <Tab icon={<LocalFireDepartmentIcon />} label="Trending" />
                        <Tab icon={<TrendingUpIcon />} label="Popular" />
                        <Tab icon={<FavoriteIcon />} label="Most Liked" />
                        <Tab icon={<NewReleasesIcon />} label="Recent" />
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
                        blogs={trendingBlogs} 
                        isLoading={isLoading} 
                        onDeleteClick={handleDeleteClick} 
                        emptyMessage="No trending blogs yet. Create engaging content to get more visibility!"
                      />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                      <BlogsList 
                        blogs={popularBlogs} 
                        isLoading={isLoading} 
                        onDeleteClick={handleDeleteClick} 
                        emptyMessage="No popular blogs available. Focus on creating valuable content!"
                      />
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                      <BlogsList 
                        blogs={likedBlogs} 
                        isLoading={isLoading} 
                        onDeleteClick={handleDeleteClick} 
                        emptyMessage="Your blogs will appear here once they receive likes!"
                      />
                    </TabPanel>
                    <TabPanel value={tabValue} index={4}>
                      <BlogsList 
                        blogs={recentBlogs} 
                        isLoading={isLoading} 
                        onDeleteClick={handleDeleteClick} 
                        emptyMessage="No recent blogs. Create a new one to get started!"
                      />
                    </TabPanel>
                  </CardContent>
                </MotionCard>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Fade>

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.main', 
          color: 'error.contrastText',
          fontWeight: 700
        }}>
          <DeleteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Delete "{blogToDelete?.title}"?
          </Typography>
          <Typography color="text.secondary">
            This action cannot be undone. All comments, likes, and associated data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={handleDeleteCancel} 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: 2 }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserDashboardPage;