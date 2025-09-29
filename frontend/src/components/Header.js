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
  Edit,
  Notifications,
  Search,
  Close,
  ChevronRight,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

// Theme Constants
const PRIMARY_GRADIENT = 'linear-gradient(90deg, #FF9800 10%, #E91E63 90%)'; // Orange to Pink/Purple
const HOVER_GRADIENT = 'linear-gradient(90deg, #F57C00 10%, #C2185B 90%)';
const PURPLE_ACCENT = '#9C27B0';
const ORANGE_ACCENT = '#FF9800';


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
        bgcolor: 'rgba(255, 255, 255, 0.95)', // Subtle glassmorphism base
        backdropFilter: 'blur(10px)', // Glassmorphism
        color: 'text.primary',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)', // Deeper shadow
        zIndex: 1300,
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0.05)' // Subtle separator
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        px: { xs: 2, sm: 4, md: 6 },
        minHeight: { xs: 60, sm: 72 } 
      }}>
        {/* Left Section - Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h4"
              fontWeight="900" // Extra bold
              sx={{
                background: PRIMARY_GRADIENT,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.6rem', sm: '2.2rem' },
                letterSpacing: '-1px', // Tighter kerning
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)' // Dynamic effect
                }
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
          maxWidth: 650, 
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
              left: 18, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: PURPLE_ACCENT, 
              fontSize: 24,
              opacity: 0.7
            }} />
            <input 
              type="text" 
              placeholder="Explore stories, authors, or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px 14px 52px',
                border: '1px solid #e0e0e0', // Thinner, cleaner border
                borderRadius: 999, // Pill shape
                backgroundColor: '#f9f9f9',
                outline: 'none',
                fontSize: '15px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = PURPLE_ACCENT;
                e.target.style.boxShadow = `0 0 0 4px ${PURPLE_ACCENT}30`; // Accent glow
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = 'none';
                e.target.style.backgroundColor = '#f9f9f9';
              }}
            />
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Mobile Search Toggle */}
          <IconButton 
            onClick={handleSearchToggle} 
            sx={{ display: { md: 'none' }, color: 'text.secondary' }}
          >
            <Search />
          </IconButton>
          
          {user ? (
            <>
              {/* Create Post Button - Prominent CTA with Lift */}
              <Button
                component={Link}
                to="/create"
                startIcon={<Edit />}
                variant="contained"
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  background: PRIMARY_GRADIENT,
                  borderRadius: 999, // Pill shape
                  px: 3,
                  py: 1.2, // Taller button
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'white',
                  boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                  '&:hover': {
                    background: HOVER_GRADIENT,
                    transform: 'translateY(-3px)', // Pronounced lift
                    boxShadow: '0 10px 30px rgba(233, 30, 99, 0.6)', // Pinker, deeper shadow
                  },
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
              >
                Create Post
              </Button>
              
              {/* Notifications with Scale Effect */}
              <IconButton 
                color="inherit" 
                sx={{ 
                    color: 'text.secondary',
                    '&:hover': { 
                        color: PURPLE_ACCENT, 
                        transform: 'scale(1.15) rotate(5deg)',
                    },
                    transition: 'transform 0.3s ease'
                }}
              >
                <Badge badgeContent={3} color="error" overlap="circular" variant="dot">
                  <Notifications />
                </Badge>
              </IconButton>
              
              {/* User Menu - Hover Border Effect */}
              <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, '&:hover': { opacity: 0.9 } }}>
                <Avatar 
                  src={user.profilePicture} 
                  alt={user.username} 
                  sx={{ 
                    width: 44, 
                    height: 44, 
                    border: '3px solid #eee', 
                    boxShadow: '0 0 0 2px white, 0 0 0 3px transparent',
                    transition: 'all 0.3s ease-out',
                    '&:hover': {
                        borderColor: ORANGE_ACCENT,
                        boxShadow: '0 0 0 2px white, 0 0 0 5px rgba(255, 152, 0, 0.5)',
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
                    borderRadius: 4, // More rounded menu
                    boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                    p: 1 // Internal padding
                  } 
                }}
              >
                <MenuItem onClick={handleMenuClose} component={Link} to="/profile" sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.1)' } }}> 
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: PURPLE_ACCENT, fontSize: '0.8rem' }}>{user.username?.[0]}</Avatar>
                    <Typography fontWeight="500">My Profile</Typography>
                    <ChevronRight sx={{ ml: 'auto', color: 'text.disabled' }} />
                  </Box> 
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard" sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.1)' } }}> 
                  📊 Dashboard
                </MenuItem>
                {user.role === 'admin' && (
                  <MenuItem onClick={handleMenuClose} component={Link} to="/admin" sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.1)' } }}> 
                    🛠️ Admin Panel
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout} sx={{ color: '#E91E63', fontWeight: 'bold', borderRadius: 2, '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.1)' } }}> 
                  🚪 Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Login Button - Subtle Hover */}
              <Button 
                component={Link} 
                to="/login" 
                variant="text" 
                sx={{ 
                  color: 'text.secondary', 
                  fontWeight: 600,
                  px: 2,
                  '&:hover': {
                    color: PURPLE_ACCENT,
                    bgcolor: 'transparent',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Sign In
              </Button>
              {/* Sign Up Button - CTA with Lift */}
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  background: PRIMARY_GRADIENT,
                  borderRadius: 999, // Pill shape
                  px: 3,
                  py: 1.2,
                  fontWeight: 700,
                  color: 'white',
                  boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                  '&:hover': {
                    background: HOVER_GRADIENT,
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 30px rgba(255, 152, 0, 0.6)',
                  },
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
              >
                Join Free
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <ClickAwayListener onClickAway={handleSearchClickAway}>
          <Paper 
            elevation={10}
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
                  color: PURPLE_ACCENT
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
                    border: '2px solid #ddd',
                    borderRadius: 999, // Pill shape
                    outline: 'none',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = PURPLE_ACCENT;
                    e.target.style.boxShadow = `0 0 0 3px ${PURPLE_ACCENT}30`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ddd';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Box>
              <IconButton onClick={() => setSearchOpen(false)} sx={{ '&:hover': { color: PURPLE_ACCENT } }}>
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