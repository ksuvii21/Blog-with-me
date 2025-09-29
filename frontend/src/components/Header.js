import React, { useState, useRef } from 'react';
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
  Badge,
  ClickAwayListener,
  Paper,
  TextField
} from '@mui/material';
import {
  Edit,
  Notifications,
  Search,
  Close,
  ChevronRight,
  Person,
  Dashboard,
  AdminPanelSettings,
  ExitToApp,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

// Orange and Purple Theme Colors (matching home page)
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
    button: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
    text: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 100%)'
  },
  background: {
    light: '#f8fafc',
    white: '#ffffff'
  },
  text: {
    primary: '#2d3748',
    secondary: '#718096'
  },
  border: {
    light: '#e2e8f0'
  }
};

const Header = ({ isHomePage }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleMenuClose();
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchClickAway = () => {
    setSearchOpen(false);
  };

  return (
    <AppBar
  position="fixed"
  sx={{
    bgcolor: isHomePage ? 'transparent' : themeColors.background.white,
    color: isHomePage ? 'white' : themeColors.text.primary,
    boxShadow: isHomePage ? 'none' : '0 2px 20px rgba(0,0,0,0.08)',
    zIndex: 1300,
    width: '100%',
    borderBottom: isHomePage ? '1px solid rgba(255,255,255,0.2)' : `1px solid ${themeColors.border.light}`,
    backdropFilter: isHomePage ? 'blur(20px)' : 'blur(10px)',
    background: isHomePage 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.95)',
  }}
>
  <Toolbar sx={{ 
    justifyContent: 'space-between', 
    px: { xs: 2, sm: 3, md: 4 },
    minHeight: { xs: 70, sm: 80 },
    // Add this to ensure content is visible
    background: isHomePage ? 'transparent' : 'inherit',
  }}>
    {/* Left Section - Logo */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Typography
          variant="h4"
          fontWeight="900"
          sx={{
            background: isHomePage 
              ? 'linear-gradient(135deg, #FF9800 0%, #9C27B0 50%, #673AB7 100%)'
              : themeColors.gradient.text,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.8rem', sm: '2.3rem' },
            letterSpacing: '-1.5px',
            textShadow: isHomePage ? '0 2px 4px rgba(255,255,255,0.3)' : '0 2px 4px rgba(255,152,0,0.1)'
          }}
        >
          Writely Log
        </Typography>
      </Link>
    </Box>

    {/* Center Section - Search (Desktop) */}
    <Box sx={{ 
      display: { xs: 'none', md: 'flex' }, 
      flex: 1, 
      maxWidth: 600, 
      mx: 4
    }}>
      <Box 
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ 
          position: 'relative', 
          width: '100%',
          transition: 'all 0.3s ease'
        }}
      >
        <Search sx={{ 
          position: 'absolute', 
          left: 16, 
          top: '50%', 
          transform: 'translateY(-50%)',
          color: isHomePage ? 'rgba(255,255,255,0.7)' : themeColors.text.secondary, 
          fontSize: 22
        }} />
        <TextField
          variant="outlined"
          placeholder="Search stories, authors, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: isHomePage ? 'rgba(255,255,255,0.15)' : '#f8fafc',
              color: isHomePage ? 'white' : 'inherit',
              paddingLeft: '50px',
              border: isHomePage ? '1px solid rgba(255,255,255,0.3)' : '1px solid #e2e8f0',
              '&:hover fieldset': {
                borderColor: isHomePage ? 'rgba(255,255,255,0.5)' : themeColors.orange.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: isHomePage ? 'white' : themeColors.purple.main,
                boxShadow: isHomePage ? '0 0 0 2px rgba(255,255,255,0.2)' : '0 0 0 3px rgba(156, 39, 176, 0.1)'
              },
              '& .MuiInputBase-input::placeholder': {
                color: isHomePage ? 'rgba(255,255,255,0.7)' : themeColors.text.secondary,
              }
            },
            '& .MuiInputBase-input': {
              padding: '12px 14px',
              fontSize: '15px',
              fontWeight: 500,
              color: isHomePage ? 'white' : 'inherit'
            }
          }}
        />
      </Box>
    </Box>

    {/* Rest of your header code remains the same... */}

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Mobile Search Toggle */}
          <IconButton 
            onClick={handleSearchToggle} 
            sx={{ 
              display: { md: 'none' }, 
              color: isHomePage ? 'white' : themeColors.text.secondary,
              '&:hover': {
                backgroundColor: isHomePage ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
                color: isHomePage ? 'white' : themeColors.purple.main
              }
            }}
          >
            <Search />
          </IconButton>
          
          {user ? (
            <>
              {/* Create Post Button */}
              <Button
                component={Link}
                to="/create"
                startIcon={<Edit sx={{ fontSize: 18 }} />}
                variant="contained"
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  background: themeColors.gradient.button,
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF7B3F 30%, #8E24AA 90%)',
                    boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Write Story
              </Button>
              
              {/* Notifications */}
              <IconButton
                color="inherit"
                sx={{
                  color: isHomePage ? 'white' : themeColors.text.secondary,
                  '&:hover': {
                    color: isHomePage ? 'white' : themeColors.purple.main,
                    backgroundColor: isHomePage ? 'rgba(255,255,255,0.1)' : '#f1f5f9'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Badge badgeContent={3} color="error" overlap="circular">
                  <Notifications />
                </Badge>
              </IconButton>
              
              {/* User Menu */}
              <IconButton 
                onClick={handleMenuOpen} 
                sx={{ 
                  p: 0.5, 
                  '&:hover': { 
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s ease'
                  } 
                }}
              >
                <Avatar 
                  src={user.profilePicture} 
                  alt={user.username} 
                  sx={{ 
                    width: 42, 
                    height: 42, 
                    border: isHomePage ? '2px solid rgba(255,255,255,0.3)' : `2px solid ${themeColors.border.light}`,
                    boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: isHomePage ? 'white' : themeColors.purple.main,
                      boxShadow: '0 4px 12px rgba(255, 152, 0, 0.5)'
                    }
                  }} 
                />
              </IconButton>
              
              <Menu 
                anchorEl={anchorEl} 
                open={Boolean(anchorEl)} 
                onClose={handleMenuClose} 
                PaperProps={{ 
                  sx: { 
                    mt: 1.5, 
                    minWidth: 220, 
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: `1px solid ${themeColors.border.light}`,
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      transition: 'all 0.2s ease'
                    }
                  } 
                }}
              >
                <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Person sx={{ color: themeColors.purple.main, fontSize: 20 }} />
                    <Typography fontWeight="500">My Profile</Typography>
                  </Box> 
                </MenuItem>
                
                <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Dashboard sx={{ color: themeColors.orange.main, fontSize: 20 }} />
                    <Typography fontWeight="500">Dashboard</Typography>
                  </Box>
                </MenuItem>
                
                {user.role === 'admin' && (
                  <MenuItem onClick={handleMenuClose} component={Link} to="/admin">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <AdminPanelSettings sx={{ color: '#10B981', fontSize: 20 }} />
                      <Typography fontWeight="500">Admin Panel</Typography>
                    </Box>
                  </MenuItem>
                )}
                
                <MenuItem onClick={handleLogout} sx={{ color: '#EF4444' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <ExitToApp sx={{ fontSize: 20 }} />
                    <Typography fontWeight="500">Logout</Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              {/* Login Button */}
              <Button
                component={Link}
                to="/login"
                variant="text"
                sx={{
                  color: isHomePage ? 'white' : themeColors.text.secondary,
                  fontWeight: 600,
                  px: 2.5,
                  borderRadius: 2,
                  '&:hover': {
                    color: isHomePage ? 'white' : themeColors.purple.main,
                    backgroundColor: isHomePage ? 'rgba(255,255,255,0.1)' : '#f8fafc'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Sign In
              </Button>
              
              {/* Sign Up Button */}
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  background: themeColors.gradient.button,
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF7B3F 30%, #8E24AA 90%)',
                    boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <ClickAwayListener onClickAway={handleSearchClickAway}>
          <Paper 
            elevation={8}
            sx={{
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0,
              p: 3,
              borderRadius: 0,
              zIndex: 1301,
              borderTop: `1px solid ${themeColors.border.light}`,
              background: isHomePage ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <Box 
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
            >
              <TextField
                inputRef={searchRef}
                variant="outlined"
                placeholder="Search stories, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: isHomePage ? 'rgba(255,255,255,0.1)' : '#f8fafc',
                    color: isHomePage ? 'white' : 'inherit',
                    '&:hover fieldset': {
                      borderColor: themeColors.orange.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: themeColors.purple.main,
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: isHomePage ? 'rgba(255,255,255,0.7)' : themeColors.text.secondary,
                    }
                  },
                  '& .MuiInputBase-input': {
                    padding: '14px 16px',
                    fontSize: '16px',
                    color: isHomePage ? 'white' : 'inherit'
                  }
                }}
              />
              <IconButton 
                onClick={() => setSearchOpen(false)} 
                sx={{ 
                  color: isHomePage ? 'white' : themeColors.text.secondary,
                  '&:hover': { 
                    color: isHomePage ? 'white' : themeColors.purple.main,
                    backgroundColor: isHomePage ? 'rgba(255,255,255,0.1)' : '#f1f5f9'
                  } 
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Paper>
        </ClickAwayListener>
      )}
    </AppBar>
  );
};

export default Header;