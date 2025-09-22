import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Stack, Button, Fade, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Tooltip, Card, CardContent, LinearProgress } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  
  Legend,
} from 'chart.js';
import api from '../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  
  Legend
);

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  // Analytics
  const totalUsers = users.length;
  const totalBlogs = blogs.length;
  const trendingTags = (() => {
    const tagCount = {};
    blogs.forEach(blog => {
      (blog.tags || []).forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
  })();

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

  return (
    <Fade in timeout={700}>
      <Box maxWidth="lg" mx="auto" px={2} py={4}>
        <Typography variant="h4" fontWeight={800} mb={1} color="primary.main">
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Platform analytics, user & blog management
        </Typography>

        {error && (
          <Typography color="error" mb={2}>{error}</Typography>
        )}

        <Grid container spacing={4} mb={4}>
          {/* Analytics Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
              <BarChartIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" fontWeight={700} mb={1}>Analytics</Typography>
              <Stack direction="column" spacing={1} alignItems="center" mb={2}>
                <Typography color="text.secondary">Total Blogs: <b>{totalBlogs}</b></Typography>
                <Typography color="text.secondary">Total Users: <b>{totalUsers}</b></Typography>
                <Box>
                  <Typography color="text.secondary" fontWeight={600} mb={0.5}>Trending Tags:</Typography>
                  {trendingTags.length > 0 ? trendingTags.map(t => (
                    <Chip key={t.tag} label={`#${t.tag} (${t.count})`} size="small" sx={{ m: 0.5 }} />
                  )) : <Typography color="text.secondary">No tags</Typography>}
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* User Management Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
              <GroupIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" fontWeight={700} mb={2}>User Management</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user._id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete User">
                            <IconButton color="error" onClick={() => handleDeleteUser(user._id)}>
                              <DeleteIcon />
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

          {/* Blog Management Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
              <ArticleIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" fontWeight={700} mb={2}>Blog Management</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {blogs.map(blog => (
                      <TableRow key={blog._id}>
                        <TableCell>{blog.title}</TableCell>
                        <TableCell>{blog.author?.username || 'N/A'}</TableCell>
                        <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete Blog">
                            <IconButton color="error" onClick={() => handleDeleteBlog(blog._id)}>
                              <DeleteIcon />
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

        <Divider sx={{ my: 5 }} />
        <Typography color="text.secondary" align="center">
          More admin features and analytics coming soon.
        </Typography>
      </Box>
    </Fade>
  );
};

export default AdminDashboardPage;
