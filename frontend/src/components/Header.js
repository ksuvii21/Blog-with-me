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
  ExitToApp
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

// New Light Theme Colors (matching footer)
const PRIMARY_GRADIENT = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
const SECONDARY_GRADIENT = 'linear-gradient(45deg, #FF9A9E 0%, #FECFEF 99%)';
const BACKGROUND_LIGHT = '#ffffff';
const TEXT_PRIMARY = '#2d3748';
const TEXT_SECONDARY = '#718096';
const ACCENT_PURPLE = '#805ad5';
const ACCENT_BLUE = '#4299e1';
const BORDER_LIGHT = '#e2e8f0';

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
        bgcolor: BACKGROUND_LIGHT,
        color: TEXT_PRIMARY,
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        zIndex: 1300,
        width: '100%',
        borderBottom: `1px solid ${BORDER_LIGHT}`,
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: { xs: 70, sm: 80 } 
      }}>
        {/* Left Section - Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{
                background: PRIMARY_GRADIENT,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.8rem', sm: '2.3rem' },
                letterSpacing: '-1.5px',
                textShadow: '0 2px 4px rgba(102, 126, 234, 0.1)'
              }}
            >
              Writely.log
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
              color: TEXT_SECONDARY, 
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
                  backgroundColor: '#f8fafc',
                  paddingLeft: '50px',
                  '&:hover fieldset': {
                    borderColor: ACCENT_BLUE,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: ACCENT_PURPLE,
                    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '12px 14px',
                  fontSize: '15px',
                  fontWeight: 500
                }
              }}
            />
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Mobile Search Toggle */}
          <IconButton 
            onClick={handleSearchToggle} 
            sx={{ 
              display: { md: 'none' }, 
              color: TEXT_SECONDARY,
              '&:hover': {
                backgroundColor: '#f1f5f9',
                color: ACCENT_PURPLE
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
                  background: SECONDARY_GRADIENT,
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(255, 154, 158, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF7B7F 0%, #FDB5E3 99%)',
                    boxShadow: '0 6px 20px rgba(255, 154, 158, 0.4)',
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
                  color: TEXT_SECONDARY,
                  '&:hover': {
                    color: ACCENT_PURPLE,
                    backgroundColor: '#f1f5f9'
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
                    border: `2px solid ${BORDER_LIGHT}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: ACCENT_PURPLE,
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
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
                    border: `1px solid ${BORDER_LIGHT}`,
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
                    <Person sx={{ color: ACCENT_PURPLE, fontSize: 20 }} />
                    <Typography fontWeight="500">My Profile</Typography>
                  </Box> 
                </MenuItem>
                
                <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Dashboard sx={{ color: ACCENT_BLUE, fontSize: 20 }} />
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
                  color: TEXT_SECONDARY,
                  fontWeight: 600,
                  px: 2.5,
                  borderRadius: 2,
                  '&:hover': {
                    color: ACCENT_PURPLE,
                    backgroundColor: '#f8fafc'
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
                  background: PRIMARY_GRADIENT,
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
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
              borderTop: `1px solid ${BORDER_LIGHT}`,
              background: 'rgba(255, 255, 255, 0.98)',
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
                    backgroundColor: '#f8fafc',
                    '&:hover fieldset': {
                      borderColor: ACCENT_BLUE,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: ACCENT_PURPLE,
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: '14px 16px',
                    fontSize: '16px'
                  }
                }}
              />
              <IconButton 
                onClick={() => setSearchOpen(false)} 
                sx={{ 
                  color: TEXT_SECONDARY,
                  '&:hover': { 
                    color: ACCENT_PURPLE,
                    backgroundColor: '#f1f5f9'
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