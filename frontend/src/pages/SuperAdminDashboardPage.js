import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Grid, Stack, Button, Fade, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Tooltip, Switch, FormControlLabel, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  Card, CardContent, LinearProgress, Tabs, Tab
} from '@mui/material';
import {
  SecurityIcon, InsightsIcon, SettingsIcon, PeopleIcon,
  TrendingUpIcon, DeleteIcon, EditIcon, RefreshIcon,
  CheckCircleIcon, WarningIcon, ErrorIcon
} from '@mui/icons-material';
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

const SuperAdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [systemSettings, setSystemSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [tempSettings, setTempSettings] = useState({});

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
      fetchData(); // Refresh data
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
      case 'superadmin': return 'error';
      case 'admin': return 'warning';
      default: return 'default';
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Fade in timeout={700}>
      <Box maxWidth="lg" mx="auto" px={2} py={4}>
        <Typography variant="h4" fontWeight={800} mb={1} color="primary.main">
          Superadmin Dashboard
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Platform controls, advanced analytics, and system settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab icon={<InsightsIcon />} label="Analytics" />
          <Tab icon={<PeopleIcon />} label="User Management" />
          <Tab icon={<SettingsIcon />} label="System Settings" />
        </Tabs>

        {/* Analytics Tab */}
        {activeTab === 0 && (
          <Grid container spacing={4}>
            {/* User Growth Chart */}
            <Grid item xs={12} md={8}>
              <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  User Growth Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userStats?.userGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id.month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* User Distribution */}
            <Grid item xs={12} md={4}>
              <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  User Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Users', value: userStats?.totalUsers - userStats?.adminUsers - userStats?.superAdminUsers },
                        { name: 'Admins', value: userStats?.adminUsers },
                        { name: 'Superadmins', value: userStats?.superAdminUsers }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* System Health */}
            <Grid item xs={12}>
              <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  System Health
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CheckCircleIcon color="success" />
                          <Typography variant="h6">Database</Typography>
                        </Stack>
                        <Typography color="text.secondary">Connected</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CheckCircleIcon color="success" />
                          <Typography variant="h6">API</Typography>
                        </Stack>
                        <Typography color="text.secondary">Operational</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <WarningIcon color="warning" />
                          <Typography variant="h6">Storage</Typography>
                        </Stack>
                        <Typography color="text.secondary">85% Used</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* User Management Tab */}
        {activeTab === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={700}>
                    User Management
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleBulkAction('promote_to_admin')}
                    >
                      Promote to Admin
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => handleBulkAction('demote_to_user')}
                    >
                      Demote to User
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleBulkAction('delete')}
                    >
                      Delete Selected
                    </Button>
                  </Stack>
                </Stack>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Select</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map(user => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={user.selected || false}
                              onChange={() => handleUserSelect(user._id)}
                              disabled={user.role === 'superadmin'}
                            />
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              color={getRoleColor(user.role)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit Role">
                              <IconButton
                                color="primary"
                                onClick={() => {/* TODO: Implement role editing */}}
                                disabled={user.role === 'superadmin'}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete User">
                              <IconButton
                                color="error"
                                onClick={() => {/* TODO: Implement user deletion */}}
                                disabled={user.role === 'superadmin'}
                              >
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
        )}

        {/* System Settings Tab */}
        {activeTab === 2 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={700}>
                    System Settings
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSettingsDialog(true)}
                  >
                    Edit Settings
                  </Button>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Platform Name"
                      value={systemSettings?.platformName || ''}
                      InputProps={{ readOnly: true }}
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings?.allowRegistration || false}
                          disabled
                        />
                      }
                      label="Allow User Registration"
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings?.requireEmailVerification || false}
                          disabled
                        />
                      }
                      label="Require Email Verification"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Max Blogs Per User"
                      value={systemSettings?.maxBlogsPerUser || ''}
                      InputProps={{ readOnly: true }}
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings?.allowComments || false}
                          disabled
                        />
                      }
                      label="Allow Comments"
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={systemSettings?.maintenanceMode || false}
                          disabled
                        />
                      }
                      label="Maintenance Mode"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        <Divider sx={{ my: 5 }} />
        <Typography color="text.secondary" align="center">
          Superadmin features operational. More features coming soon.
        </Typography>

        {/* Settings Dialog */}
        <Dialog open={settingsDialog} onClose={() => setSettingsDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit System Settings</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Platform Name"
                  value={tempSettings.platformName || ''}
                  onChange={(e) => handleSettingsChange('platformName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Blogs Per User"
                  type="number"
                  value={tempSettings.maxBlogsPerUser || ''}
                  onChange={(e) => handleSettingsChange('maxBlogsPerUser', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tempSettings.allowRegistration || false}
                      onChange={(e) => handleSettingsChange('allowRegistration', e.target.checked)}
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
                    />
                  }
                  label="Maintenance Mode"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveSettings} variant="contained">Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default SuperAdminDashboardPage;
