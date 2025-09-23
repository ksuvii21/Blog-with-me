import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, Grid, Stack, Button, Fade, Divider, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Chip, Tooltip, Card, CardContent, LinearProgress,
  useTheme, alpha, Slide, Zoom, Fab
} from '@mui/material';
import {
  BarChart, TrendingUp, People, Article, Delete, Visibility,
  ThumbUp, Refresh, ExpandLess, Dashboard, Tag, Security
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import api from '../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

// Orange and Purple Theme Colors (same as homepage)
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

// Scroll to top component
function ScrollTop({ children }) {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Zoom in={isVisible}>
      <Box onClick={scrollToTop} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        {children}
      </Box>
    </Zoom>
  );
}

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ blogs: 0, users: 0, views: 0, likes: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, blogsRes] = await Promise.all([
        api.get('/users'),
        api.get('/blogs'),
      ]);
      setUsers(usersRes.data);
      setBlogs(blogsRes.data);
      
      // Calculate stats with animation
      setTimeout(() => {
        setStats({
          blogs: blogsRes.data.length,
          users: usersRes.data.length,
          views: blogsRes.data.reduce((sum, blog) => sum + (blog.views || 0), 0),
          likes: blogsRes.data.reduce((sum, blog) => sum + (blog.likes || 0), 0)
        });
      }, 500);
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  // Analytics Data
  const totalUsers = users.length;
  const totalBlogs = blogs.length;
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);

  // Trending tags
  const trendingTags = (() => {
    const tagCount = {};
    blogs.forEach(blog => {
      (blog.tags || blog.categories || []).forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
  })();

  // Chart data
  const blogTrendsData = {
    labels: blogs.slice(0, 7).map(blog => blog.title.substring(0, 15) + '...'),
    datasets: [
      {
        label: 'Views',
        data: blogs.slice(0, 7).map(blog => blog.views || 0),
        backgroundColor: themeColors.orange.main,
        borderColor: themeColors.orange.dark,
        borderWidth: 2,
      },
      {
        label: 'Likes',
        data: blogs.slice(0, 7).map(blog => blog.likes || 0),
        backgroundColor: themeColors.purple.main,
        borderColor: themeColors.purple.dark,
        borderWidth: 2,
      }
    ]
  };

  const userActivityData = {
    labels: ['Active', 'New', 'Inactive'],
    datasets: [
      {
        data: [users.filter(u => u.isActive).length, users.filter(u => u.isNew).length, users.filter(u => !u.isActive).length],
        backgroundColor: [themeColors.orange.main, themeColors.purple.main, '#cccccc'],
        borderWidth: 0,
      }
    ]
  };

  // User management
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  // Blog management
  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/blogs/${id}`);
        setBlogs(blogs.filter(b => b._id !== id));
      } catch (err) {
        alert('Failed to delete blog');
      }
    }
  };

  const StatCard = ({ icon, value, label, color, delay }) => (
    <Slide direction="up" in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
      <Paper sx={{
        p: 3,
        background: themeColors.gradient.card,
        border: `2px solid ${alpha(color, 0.2)}`,
        borderRadius: 3,
        textAlign: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${alpha(color, 0.3)}`
        }
      }}>
        <Box sx={{
          display: 'inline-flex',
          p: 1,
          borderRadius: '50%',
          background: alpha(color, 0.1),
          color: color,
          mb: 2
        }}>
          {icon}
        </Box>
        <Typography variant="h4" fontWeight={800} color={color}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
      </Paper>
    </Slide>
  );

  return (
    <Fade in timeout={700}>
      <Box sx={{ 
        minHeight: '100vh', 
        background: themeColors.gradient.dashboard,
        py: 4 
      }}>
        <Box id="back-to-top-anchor" />
        <Box maxWidth="xl" mx="auto" px={3}>
          {/* Header Section */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 3,
              background: themeColors.gradient.card,
              mb: 3
            }}>
              <Dashboard sx={{ fontSize: 40, color: themeColors.orange.main, mr: 2 }} />
              <Typography variant="h3" fontWeight={900} sx={{
                background: themeColors.gradient.button,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Admin Dashboard
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Comprehensive platform analytics, user management, and content oversight
            </Typography>
          </Box>

          {error && (
            <Paper sx={{ 
              p: 2, 
              mb: 3, 
              background: alpha('#ff4444', 0.1),
              border: `1px solid ${alpha('#ff4444', 0.3)}`,
              borderRadius: 2
            }}>
              <Typography color="error" align="center">
                {error}
              </Typography>
            </Paper>
          )}

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<Article sx={{ fontSize: 30 }} />}
                value={stats.blogs}
                label="Total Blogs"
                color={themeColors.orange.main}
                delay={100}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<People sx={{ fontSize: 30 }} />}
                value={stats.users}
                label="Total Users"
                color={themeColors.purple.main}
                delay={200}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<Visibility sx={{ fontSize: 30 }} />}
                value={stats.views}
                label="Total Views"
                color={themeColors.orange.dark}
                delay={300}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<ThumbUp sx={{ fontSize: 30 }} />}
                value={stats.likes}
                label="Total Likes"
                color={themeColors.purple.dark}
                delay={400}
              />
            </Grid>
          </Grid>

          {/* Main Content Grid */}
          <Grid container spacing={4}>
            {/* Analytics Section */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={2} sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(themeColors.orange.main, 0.2)}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <BarChart sx={{ color: themeColors.orange.main, mr: 2 }} />
                  <Typography variant="h5" fontWeight={700} color={themeColors.orange.dark}>
                    Platform Analytics
                  </Typography>
                  <Button 
                    startIcon={<Refresh />}
                    onClick={fetchData}
                    sx={{ 
                      ml: 'auto',
                      background: themeColors.gradient.button,
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)'
                      }
                    }}
                  >
                    Refresh Data
                  </Button>
                </Box>

                {/* Trending Tags */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Tag sx={{ mr: 1, color: themeColors.purple.main }} />
                    Trending Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {trendingTags.length > 0 ? trendingTags.map((tag, index) => (
                      <Chip 
                        key={tag.tag}
                        label={`#${tag.tag} (${tag.count})`}
                        sx={{
                          background: themeColors.gradient.card,
                          color: themeColors.purple.dark,
                          fontWeight: 600,
                          border: `1px solid ${alpha(themeColors.purple.main, 0.3)}`,
                          animation: `fadeIn 0.5s ease ${index * 100}ms both`
                        }}
                      />
                    )) : (
                      <Typography color="text.secondary">No tags available</Typography>
                    )}
                  </Box>
                </Box>

                {/* Charts Grid */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, background: alpha(themeColors.orange.main, 0.05), borderRadius: 3 }}>
                      <Typography variant="subtitle1" fontWeight={600} color={themeColors.orange.dark} align="center">
                        Blog Performance
                      </Typography>
                      <Box sx={{ height: 200, mt: 2 }}>
                        <Bar
                          data={blogTrendsData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'top',
                              },
                            },
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, background: alpha(themeColors.purple.main, 0.05), borderRadius: 3 }}>
                      <Typography variant="subtitle1" fontWeight={600} color={themeColors.purple.dark} align="center">
                        User Activity
                      </Typography>
                      <Box sx={{ height: 200, mt: 2 }}>
                        <Pie
                          data={userActivityData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'top',
                              },
                            },
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Quick Actions Sidebar */}
            <Grid item xs={12} lg={4}>
              <Paper elevation={2} sx={{ 
                p: 3, 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(themeColors.purple.main, 0.2)}`,
                mb: 4
              }}>
                <Typography variant="h6" fontWeight={700} color={themeColors.purple.dark} sx={{ mb: 2 }}>
                  <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                    Manage User Roles
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                    Content Moderation
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                    System Settings
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                    Generate Reports
                  </Button>
                </Stack>
              </Paper>

              {/* Recent Activity */}
              <Paper elevation={2} sx={{ 
                p: 3, 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(themeColors.orange.main, 0.2)}`
              }}>
                <Typography variant="h6" fontWeight={700} color={themeColors.orange.dark} sx={{ mb: 2 }}>
                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Activity
                </Typography>
                <Stack spacing={2}>
                  {blogs.slice(0, 3).map(blog => (
                    <Box key={blog._id} sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      background: themeColors.gradient.card,
                      border: `1px solid ${alpha(themeColors.orange.main, 0.1)}`
                    }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {blog.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        By {blog.author?.username} • {new Date(blog.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Management Tables */}
          <Grid container spacing={4} sx={{ mt: 2, mb: 6 }}>
            {/* User Management */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(themeColors.purple.main, 0.2)}`
              }}>
                <Typography variant="h5" fontWeight={700} sx={{ 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  color: themeColors.purple.dark
                }}>
                  <People sx={{ mr: 1 }} />
                  User Management
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ background: alpha(themeColors.purple.main, 0.1) }}>
                        <TableCell sx={{ fontWeight: 700, color: themeColors.purple.dark }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: themeColors.purple.dark }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: themeColors.purple.dark }}>Role</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: themeColors.purple.dark }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow 
                          key={user._id} 
                          sx={{ 
                            animation: `slideInLeft 0.5s ease ${index * 100}ms both`,
                            '&:hover': { background: alpha(themeColors.purple.main, 0.05) }
                          }}
                        >
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={user.role} 
                              size="small"
                              sx={{ 
                                background: user.role === 'admin' ? themeColors.orange.main : themeColors.purple.main,
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Delete User">
                              <IconButton 
                                color="error" 
                                onClick={() => handleDeleteUser(user._id)}
                                sx={{
                                  '&:hover': { background: alpha('#ff4444', 0.1) }
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Blog Management */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(themeColors.orange.main, 0.2)}`
              }}>
                <Typography variant="h5" fontWeight={700} sx={{ 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  color: themeColors.orange.dark
                }}>
                  <Article sx={{ mr: 1 }} />
                  Blog Management
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ background: alpha(themeColors.orange.main, 0.1) }}>
                        <TableCell sx={{ fontWeight: 700, color: themeColors.orange.dark }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: themeColors.orange.dark }}>Author</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: themeColors.orange.dark }}>Created</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: themeColors.orange.dark }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {blogs.map((blog, index) => (
                        <TableRow 
                          key={blog._id}
                          sx={{ 
                            animation: `slideInRight 0.5s ease ${index * 100}ms both`,
                            '&:hover': { background: alpha(themeColors.orange.main, 0.05) }
                          }}
                        >
                          <TableCell sx={{ maxWidth: 200 }}>
                            <Tooltip title={blog.title}>
                              <Typography noWrap variant="body2">
                                {blog.title}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{blog.author?.username || 'N/A'}</TableCell>
                          <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Delete Blog">
                              <IconButton 
                                color="error" 
                                onClick={() => handleDeleteBlog(blog._id)}
                                sx={{
                                  '&:hover': { background: alpha('#ff4444', 0.1) }
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 5, borderColor: alpha(themeColors.purple.main, 0.3) }} />
          
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            Advanced analytics and real-time monitoring features coming soon...
          </Typography>
        </Box>

        {/* Scroll to Top Button */}
        <ScrollTop>
          <Fab 
            size="medium" 
            aria-label="scroll back to top"
            sx={{
              background: themeColors.gradient.button,
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)'
              }
            }}
          >
            <ExpandLess />
          </Fab>
        </ScrollTop>

        {/* Custom Animations */}
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default AdminDashboardPage;