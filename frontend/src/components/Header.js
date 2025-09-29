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
  Paper
} from '@mui/material';
import {
  Add,
  Notifications,
  Search,
  Close,
  Edit
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

// Theme Constants based on HomePage.js
const PRIMARY_GRADIENT = 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)';
const HOVER_GRADIENT = 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)';
const PURPLE_MAIN = '#9C27B0';


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
        bgcolor: 'white', // Ensure white background
        color: 'text.primary',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Enhanced shadow
        zIndex: 1300,
        width: '100%'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        px: { xs: 1, sm: 3, md: 5 },
        minHeight: { xs: 60, sm: 70 } // Taller toolbar
      }}>
        {/* Left Section - Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background: PRIMARY_GRADIENT,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.6rem', sm: '2.1rem' },
                transition: 'transform 0.2s ease',
                '&:hover': {
                    transform: 'scale(1.05)'
                }
              }}
            >
              Writely-Log
            </Typography>
          </Link>
        </Box>

        {/* Center Section - Search (Desktop) */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          flex: 1, 
          maxWidth: 600, // Wider search bar
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
              left: 14, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: PURPLE_MAIN, // Primary color icon
              fontSize: 24
            }} />
            <input 
              type="text" 
              placeholder="Search stories, authors, or topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px', // Increased padding for large icon
                border: '2px solid #f0f0f0',
                borderRadius: 12,
                backgroundColor: '#f9f9f9', // Slightly off-white background
                outline: 'none',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                fontWeight: 500,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = PURPLE_MAIN;
                e.target.style.boxShadow = `0 0 0 4px rgba(156, 39, 176, 0.2)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#f0f0f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Mobile Search Toggle */}
          <IconButton onClick={handleSearchToggle} sx={{ display: { md: 'none' } }} color="inherit" >
            <Search />
          </IconButton>
          
          {user ? (
            <>
              {/* Create Blog Button - Prominent CTA */}
              <Button
                component={Link}
                to="/create"
                startIcon={<Edit />} // Changed icon to Edit for writing
                variant="contained"
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  background: PRIMARY_GRADIENT,
                  borderRadius: 5, // More rounded, matching home page
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(156, 39, 176, 0.4)',
                  '&:hover': {
                    background: HOVER_GRADIENT,
                    transform: 'translateY(-2px)', // Interactive lift
                    boxShadow: '0 8px 25px rgba(156, 39, 176, 0.6)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Create Post
              </Button>
              
              {/* Notifications */}
              <IconButton color="inherit" sx={{ '&:hover': { color: PURPLE_MAIN, transform: 'scale(1.1)' } }}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              
              {/* User Menu */}
              <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, '&:hover': { opacity: 0.8 } }}>
                <Avatar 
                  src={user.profilePicture} 
                  alt={user.username} 
                  sx={{ 
                    width: 40, // Larger Avatar
                    height: 40, 
                    border: '3px solid', 
                    borderColor: PURPLE_MAIN,
                    boxShadow: '0 0 0 2px white',
                    transition: 'all 0.3s ease'
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
                    minWidth: 200, 
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  } 
                }}
              >
                <MenuItem onClick={handleMenuClose} component={Link} to="/profile"> 
                  <Box sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: PURPLE_MAIN } }}>
                    👤 Profile
                  </Box> 
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard"> 
                  <Box sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: PURPLE_MAIN } }}>
                    📊 Dashboard
                  </Box> 
                </MenuItem>
                {user.role === 'admin' && (
                  <MenuItem onClick={handleMenuClose} component={Link} to="/admin"> 
                    <Box sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: PURPLE_MAIN } }}>
                        🛠️ Admin
                    </Box> 
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 'bold' }}> 
                  🚀 Logout 
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Button 
                component={Link} 
                to="/login" 
                variant="text" 
                sx={{ 
                  color: 'text.primary', 
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    color: PURPLE_MAIN,
                    bgcolor: 'transparent',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </Button>
              {/* Sign Up Button - CTA */}
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  background: PRIMARY_GRADIENT,
                  borderRadius: 5,
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
                  '&:hover': {
                    background: HOVER_GRADIENT,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255, 152, 0, 0.6)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Sign Up
              </Button>
            </>
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
              p: 2,
              borderRadius: 0,
              zIndex: 1301
            }}
          >
            <Box 
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{ display: 'flex', gap: 1 }}
            >
              <Box sx={{ position: 'relative', flex: 1 }}>
                <Search sx={{ 
                  position: 'absolute', 
                  left: 12, 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: PURPLE_MAIN
                }} />
                <input 
                  ref={searchRef}
                  type="text" 
                  placeholder="Search stories, authors, or topics..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #f0f0f0',
                    borderRadius: 8,
                    outline: 'none',
                    fontSize: '16px',
                    backgroundColor: '#f9f9f9',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = PURPLE_MAIN;
                    e.target.style.boxShadow = `0 0 0 3px rgba(156, 39, 176, 0.2)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#f0f0f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Box>
              <IconButton onClick={() => setSearchOpen(false)} sx={{ '&:hover': { color: PURPLE_MAIN } }}>
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