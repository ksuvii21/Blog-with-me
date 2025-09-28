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
  Close
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';


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
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        zIndex: 1300,
        width: '100%'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        px: { xs: 1, sm: 2 },
        minHeight: { xs: 60, sm: 64 }
      }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              Writely Log BlogPlatform
            </Typography>
          </Link>
        </Box>

        {/* Center Section - Search (Desktop) */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          flex: 1, 
          maxWidth: 500, 
          mx: 4
        }}>
          <Box 
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{ 
              position: 'relative', 
              width: '100%'
            }}
          >
            <Search sx={{ 
              position: 'absolute', 
              left: 14, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'primary.main',
              fontSize: 20
            }} />
            <input 
              type="text" 
              placeholder="Search blogs, topics, authors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 44px',
                border: '2px solid #e0e0e0',
                borderRadius: 12,
                backgroundColor: 'transparent',
                outline: 'none',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FF9800';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 152, 0, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </Box>
        </Box>



        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Mobile Search Toggle */}
          <IconButton 
            onClick={handleSearchToggle}
            sx={{ display: { md: 'none' } }}
            color="inherit"
          >
            <Search />
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
                  background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
                  borderRadius: 3,
                  px: 3,
                  fontWeight: 600
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
                  sx={{ 
                    width: 36, 
                    height: 36,
                    border: '2px solid',
                    borderColor: 'primary.main'
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
                    borderRadius: 3
                  }
                }}
              >
                <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                  👤 Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">
                  📊 Dashboard
                </MenuItem>
                {user.role === 'admin' && (
                  <MenuItem onClick={handleMenuClose} component={Link} to="/admin">
                    ⚙️ Admin Panel
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                component={Link} 
                to="/login" 
                color="inherit"
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register" 
                variant="contained"
                sx={{ 
                  background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
                  borderRadius: 3,
                  fontWeight: 600
                }}
              >
                Join Free
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Search Panel */}
      {searchOpen && (
        <ClickAwayListener onClickAway={handleSearchClickAway}>
          <Paper 
            sx={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0,
              p: 2,
              borderRadius: 0
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
                  color: 'primary.main'
                }} />
                <input 
                  ref={searchRef}
                  type="text" 
                  placeholder="Search blogs, topics, authors..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '2px solid #ddd',
                    borderRadius: 8,
                    outline: 'none',
                    fontSize: '16px'
                  }}
                />
              </Box>
              <IconButton onClick={() => setSearchOpen(false)}>
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