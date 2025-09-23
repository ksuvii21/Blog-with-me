import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Grid, Stack, Button, Fade, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Tooltip, Switch, FormControlLabel, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  Card, CardContent, LinearProgress, Tabs, Tab, alpha,
  Slide, Zoom, Fab, useTheme
} from '@mui/material';
import {
  Security, Insights, Settings, People, TrendingUp, Delete, 
  Edit, Refresh, CheckCircle, Warning, Error as ErrorIcon,
  ExpandLess, Dashboard, Storage, Cloud, Build
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
    dashboard: 'linear-gradient(135deg, #FFF3E0 0%, #F3E5F5 100%)'
  }
};

// Scroll to top component
function ScrollTop({ children }) {
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

const SuperAdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [systemSettings, setSystemSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [tempSettings, setTempSettings] = useState({});
  const [stats, setStats] = useState({ totalUsers: 0, adminUsers: 0, superAdminUsers: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, statsRes, settingsRes] = await Promise.all([
        api.get('/users'),
        api.get('/users/stats'),
        api.get('/users/settings'),
      ]);
      setUsers(usersRes.data);
      setUserStats(statsRes.data);
      setSystemSettings(settingsRes.data);
      setTempSettings(settingsRes.data);
      
      // Animate stats
      setTimeout(() => {
        setStats({
          totalUsers: usersRes.data.length,
          adminUsers: usersRes.data.filter(u => u.role === 'admin').length,
          superAdminUsers: usersRes.data.filter(u => u.role === 'superadmin').length
        });
      }, 500);
    } catch (err) {
      setError('Failed to fetch superadmin data');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (setting, value) => {
    setTempSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await api.put('/users/settings', { settings: tempSettings });
      setSystemSettings(tempSettings);
      setSettingsDialog(false);
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  const handleBulkAction = async (action) => {
    const selectedUsers = users.filter(u => u.selected);
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    const userIds = selectedUsers.map(u => u._id);

    try {
      await api.post('/users/bulk-update', { userIds, action });
      fetchData();
    } catch (err) {
      setError(`Failed to ${action} users`);
    }
  };

  const handleUserSelect = (userId) => {
    setUsers(users.map(u =>
      u._id === userId ? { ...u, selected: !u.selected } : u
    ));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin': return themeColors.orange.main;
      case 'admin': return themeColors.purple.main;
      default: return '#666';
    }
  };

  const StatCard = ({ icon, value, label, color, delay }) => (
    <Slide direction="up" in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
      <Card sx={{
        background: themeColors.gradient.card,
        border: `2px solid ${alpha(color, 0.2)}`,
        borderRadius: 3,
        p: 3,
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
      </Card>
    </Slide>
  );

  // Chart data
  const userGrowthData = {
    labels: userStats?.userGrowth?.map(stat => stat._id.month) || [],
    datasets: [
      {
        label: 'User Growth',
        data: userStats?.userGrowth?.map(stat => stat.count) || [],
        borderColor: themeColors.orange.main,
        backgroundColor: alpha(themeColors.orange.main, 0.1),
        tension: 0.4,
        fill: true
      }
    ]
  };

  const userDistributionData = {
    labels: ['Users', 'Admins', 'Superadmins'],
    datasets: [
      {
        data: [
          stats.totalUsers - stats.adminUsers - stats.superAdminUsers,
          stats.adminUsers,
          stats.superAdminUsers
        ],
        backgroundColor: [
          themeColors.purple.light,
          themeColors.purple.main,
          themeColors.orange.main
        ],
        borderWidth: 0,
      }
    ]
  };

  if (loading) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: themeColors.gradient.dashboard
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{
            display: 'inline-block',
            p: 3,
            background: themeColors.gradient.card,
            borderRadius: '50%',
            mb: 2
          }}>
            <Box sx={{
              width: 50,
              height: 50,
              border: `4px solid ${themeColors.orange.light}30`,
              borderTop: `4px solid ${themeColors.orange.main}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </Box>
          <Typography variant="h6" color={themeColors.purple.dark}>
            Loading SuperAdmin Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

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
              mb: 3,
              border: `2px solid ${alpha(themeColors.orange.main, 0.3)}`
            }}>
              <Security sx={{ fontSize: 40, color: themeColors.orange.main, mr: 2 }} />
              <Typography variant="h3" fontWeight={900} sx={{
                background: themeColors.gradient.button,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                SuperAdmin Dashboard
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Ultimate platform control, advanced analytics, and system configuration
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ 
              mb: 3, 
              borderRadius: 2,
              background: alpha('#ff4444', 0.1),
              border: `1px solid ${alpha('#ff4444', 0.3)}`
            }}>
              {error}
            </Alert>
          )}

          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={4}>
              <StatCard 
                icon={<People sx={{ fontSize: 30 }} />}
                value={stats.totalUsers}
                label="Total Users"
                color={themeColors.purple.main}
                delay={100}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard 
                icon={<Security sx={{ fontSize: 30 }} />}
                value={stats.adminUsers}
                label="Admin Users"
                color={themeColors.orange.main}
                delay={200}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard 
                icon={<Dashboard sx={{ fontSize: 30 }} />}
                value={stats.superAdminUsers}
                label="SuperAdmins"
                color={themeColors.orange.dark}
                delay={300}
              />
            </Grid>
          </Grid>

          {/* Enhanced Tabs */}
          <Paper elevation={2} sx={{ 
            mb: 4, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, v) => setActiveTab(v)}
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: themeColors.purple.dark,
                  }
                },
                '& .MuiTabs-indicator': {
                  background: themeColors.gradient.button,
                  height: 3,
                  borderRadius: 2
                }
              }}
            >
              <Tab icon={<Insights />} label="Analytics" />
              <Tab icon={<People />} label="User Management" />
              <Tab icon={<Settings />} label="System Settings" />
            </Tabs>
          </Paper>

          {/* Analytics Tab */}
          {activeTab === 0 && (
            <Grid container spacing={4}>
              {/* User Growth Chart */}
              <Grid item xs={12} lg={8}>
                <Paper elevation={2} sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(themeColors.orange.main, 0.2)}`
                }}>
                  <Typography variant="h5" fontWeight={700} sx={{ 
                    mb: 3,
                    color: themeColors.orange.dark,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <TrendingUp sx={{ mr: 1 }} />
                    User Growth Over Time
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line
                      data={userGrowthData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                        elements: {
                          point: {
                            radius: 4,
                            backgroundColor: themeColors.orange.main
                          }
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* User Distribution */}
              <Grid item xs={12} lg={4}>
                <Paper elevation={2} sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(themeColors.purple.main, 0.2)}`
                }}>
                  <Typography variant="h5" fontWeight={700} sx={{ 
                    mb: 3,
                    color: themeColors.purple.dark,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <People sx={{ mr: 1 }} />
                    User Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Pie
                      data={userDistributionData}
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

              {/* System Health */}
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ 
                  p: 4, 
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(themeColors.orange.main, 0.2)}`
                }}>
                  <Typography variant="h5" fontWeight={700} sx={{ 
                    mb: 3,
                    color: themeColors.orange.dark
                  }}>
                    System Health
                  </Typography>
                  <Grid container spacing={3}>
                    {[
                      { icon: <Storage />, status: 'Connected', color: 'success', label: 'Database', value: 'Operational' },
                      { icon: <Cloud />, status: 'Connected', color: 'success', label: 'API', value: 'Operational' },
                      { icon: <Warning />, status: 'Warning', color: 'warning', label: 'Storage', value: '85% Used' },
                      { icon: <Build />, status: 'Optimal', color: 'success', label: 'Performance', value: '96%' }
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{
                          background: themeColors.gradient.card,
                          border: `2px solid ${alpha(
                            item.color === 'success' ? themeColors.orange.main : 
                            item.color === 'warning' ? themeColors.orange.dark : themeColors.purple.main, 
                            0.2
                          )}`,
                          borderRadius: 3,
                          p: 2,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 15px ${alpha(themeColors.purple.main, 0.2)}`
                          }
                        }}>
                          <Box sx={{ 
                            display: 'inline-flex',
                            p: 1,
                            borderRadius: '50%',
                            background: alpha(
                              item.color === 'success' ? themeColors.orange.main : 
                              item.color === 'warning' ? themeColors.orange.dark : themeColors.purple.main, 
                              0.1
                            ),
                            color: item.color === 'success' ? themeColors.orange.main : 
                                   item.color === 'warning' ? themeColors.orange.dark : themeColors.purple.main,
                            mb: 1
                          }}>
                            {item.icon}
                          </Box>
                          <Typography variant="h6" fontWeight={600}>{item.label}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.value}</Typography>
                          <Chip 
                            label={item.status} 
                            size="small" 
                            sx={{ 
                              mt: 1,
                              background: item.color === 'success' ? 
                                alpha(themeColors.orange.main, 0.2) : 
                                alpha(themeColors.orange.dark, 0.2),
                              color: item.color === 'success' ? 
                                themeColors.orange.dark : themeColors.orange.dark
                            }}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* User Management Tab */}
          {activeTab === 1 && (
            <Paper elevation={2} sx={{ 
              p: 4, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(themeColors.purple.main, 0.2)}`,
              mb: 4
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight={700} sx={{ 
                  color: themeColors.purple.dark,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <People sx={{ mr: 1 }} />
                  User Management
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleBulkAction('promote_to_admin')}
                    sx={{
                      background: themeColors.gradient.button,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)'
                      }
                    }}
                  >
                    Promote to Admin
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleBulkAction('demote_to_user')}
                    sx={{
                      borderColor: themeColors.orange.main,
                      color: themeColors.orange.main,
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: themeColors.orange.dark,
                        background: alpha(themeColors.orange.main, 0.1)
                      }
                    }}
                  >
                    Demote to User
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleBulkAction('delete')}
                  >
                    Delete Selected
                  </Button>
                </Stack>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: alpha(themeColors.purple.main, 0.1) }}>
                      <TableCell sx={{ fontWeight: 700, color: themeColors.purple.dark }}>Select</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: themeColors.purple.dark }}>Username</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: themeColors.purple.dark }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: themeColors.purple.dark }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: themeColors.purple.dark }}>Created</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: themeColors.purple.dark }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow 
                        key={user._id}
                        sx={{ 
                          animation: `fadeIn 0.5s ease ${index * 50}ms both`,
                          '&:hover': { background: alpha(themeColors.purple.main, 0.05) }
                        }}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={user.selected || false}
                            onChange={() => handleUserSelect(user._id)}
                            disabled={user.role === 'superadmin'}
                            style={{
                              accentColor: themeColors.orange.main,
                              transform: 'scale(1.2)'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={600}>{user.username}</Typography>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            sx={{
                              background: getRoleColor(user.role),
                              color: 'white',
                              fontWeight: 600,
                              minWidth: 80
                            }}
                          />
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Role">
                            <IconButton
                              sx={{
                                color: themeColors.orange.main,
                                '&:hover': { background: alpha(themeColors.orange.main, 0.1) }
                              }}
                              onClick={() => {/* TODO: Implement role editing */}}
                              disabled={user.role === 'superadmin'}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              color="error"
                              onClick={() => {/* TODO: Implement user deletion */}}
                              disabled={user.role === 'superadmin'}
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
          )}

          {/* System Settings Tab */}
          {activeTab === 2 && (
            <Paper elevation={2} sx={{ 
              p: 4, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(themeColors.orange.main, 0.2)}`,
              mb: 4
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight={700} sx={{ 
                  color: themeColors.orange.dark,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Settings sx={{ mr: 1 }} />
                  System Settings
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setSettingsDialog(true)}
                  sx={{
                    background: themeColors.gradient.button,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)'
                    }
                  }}
                >
                  Edit Settings
                </Button>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Platform Name"
                    value={systemSettings?.platformName || ''}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 3 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings?.allowRegistration || false}
                        disabled
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: themeColors.orange.main,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: themeColors.orange.main,
                          },
                        }}
                      />
                    }
                    label="Allow User Registration"
                    sx={{ mb: 3, display: 'block' }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings?.requireEmailVerification || false}
                        disabled
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: themeColors.orange.main,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: themeColors.orange.main,
                          },
                        }}
                      />
                    }
                    label="Require Email Verification"
                    sx={{ mb: 3, display: 'block' }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Max Blogs Per User"
                    value={systemSettings?.maxBlogsPerUser || ''}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 3 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings?.allowComments || false}
                        disabled
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: themeColors.orange.main,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: themeColors.orange.main,
                          },
                        }}
                      />
                    }
                    label="Allow Comments"
                    sx={{ mb: 3, display: 'block' }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings?.maintenanceMode || false}
                        disabled
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: themeColors.orange.main,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: themeColors.orange.main,
                          },
                        }}
                      />
                    }
                    label="Maintenance Mode"
                    sx={{ mb: 3, display: 'block' }}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          <Divider sx={{ my: 5, borderColor: alpha(themeColors.purple.main, 0.3) }} />
          
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            SuperAdmin features operational. Advanced monitoring and analytics available.
          </Typography>
        </Box>

        {/* Settings Dialog */}
        <Dialog 
          open={settingsDialog} 
          onClose={() => setSettingsDialog(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: themeColors.gradient.button,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700
          }}>
            Edit System Settings
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Platform Name"
                  value={tempSettings.platformName || ''}
                  onChange={(e) => handleSettingsChange('platformName', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Blogs Per User"
                  type="number"
                  value={tempSettings.maxBlogsPerUser || ''}
                  onChange={(e) => handleSettingsChange('maxBlogsPerUser', parseInt(e.target.value))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tempSettings.allowRegistration || false}
                      onChange={(e) => handleSettingsChange('allowRegistration', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: themeColors.orange.main,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: themeColors.orange.main,
                        },
                      }}
                    />
                  }
                  label="Allow User Registration"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tempSettings.requireEmailVerification || false}
                      onChange={(e) => handleSettingsChange('requireEmailVerification', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: themeColors.orange.main,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: themeColors.orange.main,
                        },
                      }}
                    />
                  }
                  label="Require Email Verification"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tempSettings.allowComments || false}
                      onChange={(e) => handleSettingsChange('allowComments', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: themeColors.orange.main,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: themeColors.orange.main,
                        },
                      }}
                    />
                  }
                  label="Allow Comments"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tempSettings.maintenanceMode || false}
                      onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: themeColors.orange.main,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: themeColors.orange.main,
                        },
                      }}
                    />
                  }
                  label="Maintenance Mode"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setSettingsDialog(false)}
              sx={{ color: themeColors.purple.main }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSettings} 
              variant="contained"
              sx={{
                background: themeColors.gradient.button,
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)'
                }
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

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
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default SuperAdminDashboardPage;