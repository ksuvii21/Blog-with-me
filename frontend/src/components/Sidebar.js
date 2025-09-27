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
  Badge
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
  Notifications
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ isMobile = false, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', auth: false, badge: 0 },
    { icon: Search, label: 'Discover', path: '/discover', auth: false, badge: 0 },
    { icon: TrendingUp, label: 'Trending', path: '/trending', auth: false, badge: 12 },
    { icon: Dashboard, label: 'Dashboard', path: '/dashboard', auth: true, badge: 0 },
    { icon: Add, label: 'Create Blog', path: '/create', auth: true, badge: 0 },
    { icon: Favorite, label: 'Favorites', path: '/favorites', auth: true, badge: 8 },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks', auth: true, badge: 15 },
    { icon: People, label: 'Community', path: '/community', auth: false, badge: 23 },
    { icon: AdminPanelSettings, label: 'Admin Panel', path: '/admin', auth: true, admin: true, badge: 0 },
    { icon: Settings, label: 'Settings', path: '/settings', auth: true, badge: 0 },
  ];

  const popularTags = [
    { name: 'Technology', count: 142 },
    { name: 'Travel', count: 89 },
    { name: 'Food', count: 76 },
    { name: 'Lifestyle', count: 64 },
    { name: 'Programming', count: 53 },
    { name: 'Design', count: 47 }
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
        width: 280,
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: 4,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'primary.light',
          borderRadius: 2,
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
          bgcolor: 'background.default'
        }}>
          <Typography variant="h6" className="gradient-text" fontWeight="bold">
            Menu
          </Typography>
          <IconButton 
            onClick={toggleSidebar} 
            size="small"
            sx={{ color: 'primary.main' }}
          >
            <Close />
          </IconButton>
        </Box>
      )}

      {/* User Profile Section */}
      {user && (
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              src={user.profilePicture} 
              alt={user.username}
              sx={{ 
                width: 48, 
                height: 48,
                border: '3px solid',
                borderColor: 'primary.main'
              }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          {user.role === 'admin' && (
            <Chip
              label="Administrator"
              size="small"
              color="secondary"
              sx={{ fontWeight: 600 }}
            />
          )}
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
          letterSpacing: 1
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
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    py: 1.5,
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'action.hover',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.3s ease'
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
                      sx={{ ml: 1 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 3 }} />

        {/* Popular Tags */}
        <Typography variant="overline" sx={{
          color: 'secondary.main',
          fontWeight: 700,
          display: 'block',
          mb: 2,
          fontSize: '0.75rem',
          letterSpacing: 1
        }}>
          Popular Tags
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {popularTags.map((tag) => (
            <Chip
              key={tag.name}
              label={`${tag.name} (${tag.count})`}
              size="small"
              variant="outlined"
              onClick={() => handleTagClick(tag.name)}
              sx={{
                borderColor: 'primary.light',
                color: 'text.secondary',
                cursor: 'pointer',
                fontSize: '0.75rem',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </Box>

        {/* Quick Stats */}
        {user && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Your Stats
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    24
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Posts
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="secondary.main">
                    1.2K
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Views
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    89
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
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          © 2024 BlogPlatform v2.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;