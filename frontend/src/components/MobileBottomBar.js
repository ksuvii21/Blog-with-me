import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
  Home,
  Explore,
  Add,
  Favorite,
  Person
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const themeColors = {
  orange: {
    main: '#FF9800',
  },
  purple: {
    main: '#9C27B0',
  }
};

const MobileBottomBar = () => {
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Explore, label: 'Explore', path: '/explore' },
    { icon: Add, label: 'Create', path: '/create' },
    { icon: Favorite, label: 'Likes', path: '/favorites' },
    { icon: Person, label: 'Profile', path: '/profile' },
  ];

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1100,
        display: { xs: 'block', md: 'none' },
        borderTop: `2px solid ${themeColors.orange.main}20`
      }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: themeColors.orange.main,
            }
          }
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            component={Link}
            to={item.path}
            label={item.label}
            icon={<item.icon />}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomBar;