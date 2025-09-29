import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, Grid, Stack, Button, Fade, Divider, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Chip, Tooltip, Card, CardContent, LinearProgress,
  Avatar,
  useTheme, alpha, Slide, Zoom, Fab, Container
} from '@mui/material';
import {
  BarChart, TrendingUp, People, Article, Delete, Visibility,
  ThumbUp, Refresh, ExpandLess, Dashboard, Tag, Security,
  LocalFireDepartment, AutoStories, Favorite, RocketLaunch
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

  const StatCard = ({ icon, value, label, color, delay }) => (
    <Slide direction="up" in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
      <Card sx={{
        p: 4,
        background: themeColors.gradient.card,
        border: `2px solid ${alpha(color, 0.2)}`,
        borderRadius: 4,
        textAlign: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 40px ${alpha(color, 0.3)}`
        }
      }}>
        <Box sx={{
          display: 'inline-flex',
          p: 2,
          borderRadius: '50%',
          background: alpha(color, 0.1),
          color: color,
          mb: 2
        }}>
          {icon}
        </Box>
        <Typography variant="h3" fontWeight={800} color={color}>
          {value}
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
      </Card>
    </Slide>
  );

  return (
    <Fade in timeout={700}>
      <Box sx={{ 
        minHeight: '100vh', 
        background: themeColors.gradient.dashboard,
        py: 4 
      }}>
        <Container maxWidth="xl">
          {/* Hero Header */}
          <Box sx={{ 
            background: themeColors.gradient.hero,
            color: 'white',
            py: 8,
            borderRadius: 4,
            mb: 6,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)'
            }} />
            <RocketLaunch sx={{ fontSize: 60, mb: 3, opacity: 0.9 }} />
            <Typography variant="h2" fontWeight="900" sx={{ mb: 2 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
              Comprehensive platform analytics and management
            </Typography>
          </Box>

          {error && (
            <Paper sx={{ 
              p: 3, 
              mb: 4, 
              background: alpha('#ff4444', 0.1),
              border: `2px solid ${alpha('#ff4444', 0.3)}`,
              borderRadius: 3
            }}>
              <Typography color="error" align="center" variant="h6">
                {error}
              </Typography>
            </Paper>
          )}

          {/* Stats Overview */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<AutoStories sx={{ fontSize: 40 }} />}
                value={stats.blogs}
                label="Total Blogs"
                color={themeColors.orange.main}
                delay={100}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<People sx={{ fontSize: 40 }} />}
                value={stats.users}
                label="Total Users"
                color={themeColors.purple.main}
                delay={200}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<Visibility sx={{ fontSize: 40 }} />}
                value={stats.views}
                label="Total Views"
                color={themeColors.orange.dark}
                delay={300}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<Favorite sx={{ fontSize: 40 }} />}
                value={stats.likes}
                label="Total Likes"
                color={themeColors.purple.dark}
                delay={400}
              />
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Analytics Section */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${alpha(themeColors.orange.main, 0.2)}`,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <LocalFireDepartment sx={{ color: themeColors.orange.main, mr: 2, fontSize: 32 }} />
                  <Typography variant="h4" fontWeight={800} sx={{
                    background: themeColors.gradient.button,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
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
                      borderRadius: 3,
                      px: 4,
                      py: 1,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255, 152, 0, 0.4)'
                      }
                    }}
                  >
                    Refresh Data
                  </Button>
                </Box>

                {/* Charts Grid */}
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, background: themeColors.gradient.card, borderRadius: 3 }}>
                      <Typography variant="h6" fontWeight={700} color={themeColors.orange.dark} align="center" gutterBottom>
                        Blog Performance
                      </Typography>
                      <Box sx={{ height: 250, mt: 2 }}>
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
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, background: themeColors.gradient.card, borderRadius: 3 }}>
                      <Typography variant="h6" fontWeight={700} color={themeColors.purple.dark} align="center" gutterBottom>
                        User Activity
                      </Typography>
                      <Box sx={{ height: 250, mt: 2 }}>
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
                    </Card>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Quick Actions Sidebar */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${alpha(themeColors.purple.main, 0.2)}`,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                mb: 4
              }}>
                <Typography variant="h5" fontWeight={800} color={themeColors.purple.dark} sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Security sx={{ mr: 2 }} />
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  {['Manage User Roles', 'Content Moderation', 'System Settings', 'Generate Reports'].map((action, index) => (
                    <Button 
                      key={action}
                      variant="outlined" 
                      fullWidth 
                      sx={{ 
                        justifyContent: 'flex-start', 
                        py: 2,
                        borderRadius: 2,
                        borderColor: themeColors.purple.main,
                        color: themeColors.purple.main,
                        fontWeight: 600,
                        '&:hover': {
                          background: themeColors.purple.main,
                          color: 'white',
                          transform: 'translateX(8px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {action}
                    </Button>
                  ))}
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* Management Tables */}
          <Grid container spacing={4} sx={{ mt: 2, mb: 8 }}>
            {/* User Management */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${alpha(themeColors.purple.main, 0.2)}`,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h4" fontWeight={800} sx={{ 
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  background: themeColors.gradient.button,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  <People sx={{ mr: 2 }} />
                  User Management
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: alpha(themeColors.purple.main, 0.1) }}>
                        <TableCell sx={{ fontWeight: 700, color: themeColors.purple.dark }}>User</TableCell>
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
                            '&:hover': { background: alpha(themeColors.purple.main, 0.05) },
                            animation: `slideInLeft 0.5s ease ${index * 100}ms both`
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar src={user.profilePicture} sx={{ width: 40, height: 40 }} />
                              <Typography fontWeight={600}>{user.username}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={user.role} 
                              sx={{ 
                                background: user.role === 'admin' ? themeColors.gradient.button : themeColors.purple.main,
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Delete User">
                              <IconButton 
                                sx={{
                                  color: '#ff4444',
                                  '&:hover': { 
                                    background: alpha('#ff4444', 0.1),
                                    transform: 'scale(1.1)'
                                  }
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
              </Card>
            </Grid>

            {/* Blog Management */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `2px solid ${alpha(themeColors.orange.main, 0.2)}`,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h4" fontWeight={800} sx={{ 
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  background: themeColors.gradient.button,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  <Article sx={{ mr: 2 }} />
                  Blog Management
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: alpha(themeColors.orange.main, 0.1) }}>
                        <TableCell sx={{ fontWeight: 700, color: themeColors.orange.dark }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: themeColors.orange.dark }}>Author</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: themeColors.orange.dark }}>Date</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: themeColors.orange.dark }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {blogs.map((blog, index) => (
                        <TableRow 
                          key={blog._id}
                          sx={{ 
                            '&:hover': { background: alpha(themeColors.orange.main, 0.05) },
                            animation: `slideInRight 0.5s ease ${index * 100}ms both`
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                              {blog.title}
                            </Typography>
                          </TableCell>
                          <TableCell>{blog.author?.username || 'N/A'}</TableCell>
                          <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Delete Blog">
                              <IconButton 
                                sx={{
                                  color: '#ff4444',
                                  '&:hover': { 
                                    background: alpha('#ff4444', 0.1),
                                    transform: 'scale(1.1)'
                                  }
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
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll to Top Button */}
        <ScrollTop>
          <Fab 
            size="medium" 
            sx={{
              background: themeColors.gradient.button,
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)',
                transform: 'scale(1.1)'
              }
            }}
          >
            <ExpandLess />
          </Fab>
        </ScrollTop>
      </Box>
    </Fade>
  );
};

export default AdminDashboardPage;