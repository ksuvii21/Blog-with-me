import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Add,
  Notifications,
  Search
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import BackendStatus from './BackendStatus';

const Header = ({ toggleSidebar, toggleDarkMode, isDarkMode }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleMenuClose();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={toggleSidebar}
            sx={{ color: 'primary.main', display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography 
              variant="h5" 
              fontWeight="bold"
              sx={{ 
                background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              BlogPlatform
            </Typography>
          </Link>
        </Box>

        {/* Center Section - Search */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          flex: 1, 
          maxWidth: 400, 
          mx: 4 
        }}>
          <Box sx={{ 
            position: 'relative', 
            width: '100%',
            '& input': {
              width: '100%',
              padding: '8px 16px 8px 40px',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.default',
              outline: 'none',
              transition: 'all 0.3s ease',
              '&:focus': {
                borderColor: 'primary.main',
                boxShadow: '0 0 0 2px rgba(255, 152, 0, 0.2)'
              }
            }
          }}>
            <Search sx={{ 
              position: 'absolute', 
              left: 12, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'primary.main' 
            }} />
            <input type="text" placeholder="Search blogs..." />
          </Box>
        </Box>
            <BackendStatus />
        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Dark Mode Toggle */}
          <IconButton onClick={toggleDarkMode} color="inherit">
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {user ? (
            <>
              {/* Create Blog Button */}
              <Button
                component={Link}
                to="/create"
                startIcon={<Add />}
                variant="contained"
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                Create
              </Button>

              {/* Notifications */}
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* User Menu */}
              <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                <Avatar 
                  src={user.profilePicture} 
                  alt={user.username}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">
                  Dashboard
                </MenuItem>
                {user.role === 'admin' && (
                  <MenuItem onClick={handleMenuClose} component={Link} to="/admin">
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register" 
                variant="contained"
                sx={{ bgcolor: 'primary.main' }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;