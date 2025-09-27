import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
  Home,
  Search,
  Add,
  Dashboard,
  Person
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MobileBottomBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Determine active tab based on current path
  const getActiveValue = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname === '/search') return 1;
    if (location.pathname === '/create') return 2;
    if (location.pathname === '/dashboard') return 3;
    if (location.pathname === '/profile') return 4;
    return 0;
  };

  const [value, setValue] = React.useState(getActiveValue());

  React.useEffect(() => {
    setValue(getActiveValue());
  }, [location.pathname]);

  const navItems = [
    { icon: Home, label: 'Home', path: '/', auth: false },
    { icon: Search, label: 'Search', path: '/search', auth: false },
    { icon: Add, label: 'Create', path: '/create', auth: true },
    { icon: Dashboard, label: 'Dashboard', path: '/dashboard', auth: true },
    { icon: Person, label: 'Profile', path: '/profile', auth: true },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const item = navItems[newValue];
    if (item.auth && !user) {
      navigate('/login');
    } else {
      navigate(item.path);
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        display: { xs: 'block', md: 'none' },
        borderTop: '2px solid',
        borderColor: 'primary.main',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden'
      }}
      elevation={8}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          height: 70,
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            minWidth: 'auto',
            padding: '6px 8px',
            '&.Mui-selected': {
              color: 'primary.main',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 600
              }
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.7rem',
              mt: 0.5
            }
          }
        }}
      >
        {navItems.map((item, index) => {
          // Hide auth-required items if not logged in
          if (item.auth && !user) return null;

          return (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              icon={<item.icon />}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: 24
                }
              }}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomBar;
