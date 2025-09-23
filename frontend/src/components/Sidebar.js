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
  IconButton
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
  Close
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const themeColors = {
  orange: { main: '#FF9800' },
  purple: { main: '#9C27B0' },
};

const Sidebar = ({ isMobile = false, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', auth: false },
    { icon: TrendingUp, label: 'Trending', path: '/trending', auth: false },
    { icon: Dashboard, label: 'Dashboard', path: '/dashboard', auth: true },
    { icon: Favorite, label: 'Favorites', path: '/favorites', auth: true },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks', auth: true },
    { icon: People, label: 'Community', path: '/community', auth: false },
    { icon: AdminPanelSettings, label: 'Admin Panel', path: '/admin', auth: true, admin: true },
    { icon: Settings, label: 'Settings', path: '/settings', auth: true },
  ];

  const handleItemClick = () => {
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
        overflowY: 'auto'
      }}
    >
      {/* Mobile Header */}
      {isMobile && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            Menu
          </Typography>
          <IconButton onClick={toggleSidebar} size="small">
            <Close />
          </IconButton>
        </Box>
      )}

      {/* Navigation Menu */}
      <Box sx={{ p: 2, flex: 1 }}>
        <Typography variant="overline" sx={{ 
          color: 'primary.main', 
          fontWeight: 600,
          display: 'block',
          mb: 2
        }}>
          Navigation
        </Typography>
        
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            if (item.auth && !user) return null;
            if (item.admin && user?.role !== 'admin') return null;
            
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={handleItemClick}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'action.hover',
                    }
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
                      fontWeight: isActive ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 3 }} />

        {/* Popular Tags */}
        <Typography variant="overline" sx={{ 
          color: 'secondary.main', 
          fontWeight: 600,
          display: 'block',
          mb: 2
        }}>
          Popular Tags
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['Technology', 'Travel', 'Food', 'Lifestyle'].map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              onClick={handleItemClick}
              sx={{
                borderColor: 'primary.light',
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white'
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;