import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Avatar,
  Badge,
  Button
} from '@mui/material';
import {
  Home,
  Dashboard,
  AdminPanelSettings,
  TrendingUp,
  Favorite,
  Bookmark,
  People,
  Settings,
  Star,
  Close,
  Add,
  Search,
  Notifications,
  Edit,
  Whatshot
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ isMobile = false, toggleSidebar, showCloseButton = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', auth: false, badge: 0 },
    { icon: Search, label: 'Discover', path: '/discover', auth: false, badge: 0 },
    { icon: Whatshot, label: 'Trending', path: '/trending', auth: false, badge: 12 },
    { icon: Dashboard, label: 'Dashboard', path: '/dashboard', auth: true, badge: 0 },
    { icon: Add, label: 'Create Blog', path: '/create', auth: true, badge: 0 },
    { icon: Favorite, label: 'Favorites', path: '/favorites', auth: true, badge: 8 },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks', auth: true, badge: 15 },
    { icon: People, label: 'Community', path: '/community', auth: false, badge: 23 },
    { icon: AdminPanelSettings, label: 'Admin Panel', path: '/admin', auth: true, admin: true, badge: 0 },
    { icon: Settings, label: 'Settings', path: '/settings', auth: true, badge: 0 },
  ];

  const popularTags = [
    { name: 'Technology', count: 142, hot: true },
    { name: 'Travel', count: 89, hot: true },
    { name: 'Food', count: 76, hot: false },
    { name: 'Lifestyle', count: 64, hot: false },
    { name: 'Programming', count: 53, hot: true },
    { name: 'Design', count: 47, hot: false }
  ];

  const handleItemClick = () => {
    if (isMobile && toggleSidebar) {
      toggleSidebar();
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/tag/${tag.toLowerCase()}`);
    if (isMobile && toggleSidebar) {
      toggleSidebar();
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        height: '100%',
        background: 'linear-gradient(180deg, #FFF8E1 0%, #F3E5F5 100%)',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        boxShadow: isMobile ? '2px 0 20px rgba(0,0,0,0.1)' : 'none',
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'primary.main',
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'background.default',
        }
      }}
    >
      {/* Mobile Header */}
      {isMobile && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 100%)',
          color: 'white'
        }}>
          <Typography variant="h6" fontWeight="bold">
            BlogPlatform
          </Typography>
          <IconButton 
            onClick={toggleSidebar} 
            size="small"
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </Box>
      )}

      {/* User Profile Section */}
      {user ? (
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', background: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: 'success.main',
                  border: '2px solid white'
                }} />
              }
            >
              <Avatar
                src={user.profilePicture}
                alt={user.username}
                sx={{
                  width: 56,
                  height: 56,
                  border: '3px solid',
                  borderColor: 'primary.main'
                }}
              />
            </Badge>
            <Box flex={1}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.dark">
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {user.role === 'admin' && (
              <Chip
                icon={<AdminPanelSettings />}
                label="Administrator"
                size="small"
                color="secondary"
                sx={{ fontWeight: 600, flex: 1 }}
              />
            )}
            <Button
              variant="contained"
              startIcon={<Edit />}
              size="small"
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
                fontWeight: 600
              }}
            >
              Write
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="h6" color="primary.main" gutterBottom>
            Join Our Community
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
              fontWeight: 600,
              mb: 1
            }}
          >
            Sign Up
          </Button>
          <Button variant="outlined" fullWidth sx={{ borderRadius: 2 }}>
            Login
          </Button>
        </Box>
      )}

      {/* Navigation Menu */}
      <Box sx={{ p: 2, flex: 1 }}>
        <Typography variant="overline" sx={{
          color: 'primary.main',
          fontWeight: 700,
          display: 'block',
          mb: 2,
          fontSize: '0.75rem',
          letterSpacing: 1,
          background: 'rgba(255,152,0,0.1)',
          px: 2,
          py: 1,
          borderRadius: 2
        }}>
          Navigation
        </Typography>

        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            if (item.auth && !user) return null;
            if (item.admin && user?.role !== 'admin' && user?.role !== 'superadmin') return null;

            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={handleItemClick}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    py: 1.5,
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'rgba(255,152,0,0.1)',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.3s ease',
                    border: isActive ? 'none' : '1px solid transparent',
                    borderColor: 'primary.light'
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive ? 'white' : 'primary.main',
                    minWidth: 40
                  }}>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.95rem'
                    }}
                  />
                  {item.badge > 0 && (
                    <Badge 
                      badgeContent={item.badge} 
                      color="error" 
                      sx={{ 
                        ml: 1,
                        '& .MuiBadge-badge': {
                          fontWeight: 'bold'
                        }
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 3, borderColor: 'primary.light' }} />

        {/* Popular Tags */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{
            color: 'secondary.main',
            fontWeight: 700,
            display: 'block',
            mb: 2,
            fontSize: '0.75rem',
            letterSpacing: 1,
            background: 'rgba(156,39,176,0.1)',
            px: 2,
            py: 1,
            borderRadius: 2
          }}>
            Trending Tags
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {popularTags.map((tag) => (
              <Chip
                key={tag.name}
                icon={tag.hot ? <Whatshot sx={{ color: 'orange' }} /> : undefined}
                label={`${tag.name} (${tag.count})`}
                size="small"
                variant="outlined"
                onClick={() => handleTagClick(tag.name)}
                sx={{
                  borderColor: tag.hot ? 'orange' : 'primary.light',
                  color: tag.hot ? 'orange' : 'text.secondary',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: tag.hot ? 600 : 400,
                  '&:hover': {
                    bgcolor: tag.hot ? 'rgba(255,152,0,0.1)' : 'rgba(156,39,176,0.1)',
                    transform: 'translateY(-1px)',
                    boxShadow: 1
                  },
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Quick Stats */}
        {user && (
          <>
            <Divider sx={{ my: 3, borderColor: 'primary.light' }} />
            <Box sx={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(156,39,176,0.1) 100%)',
              p: 2,
              borderRadius: 3
            }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Your Writing Stats
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {user.stats?.posts || 24}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Posts
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="secondary.main">
                    {user.stats?.views || '1.2K'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Views
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {user.stats?.likes || 89}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Likes
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Sidebar Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        background: 'white',
        textAlign: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          © 2024 BlogPlatform v2.0
        </Typography>
        <Typography variant="caption" color="primary.main" display="block" fontWeight={600}>
          Orange-Purple Theme
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;