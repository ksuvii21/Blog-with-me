import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileBottomBar from './MobileBottomBar';
import { useLocation } from 'react-router-dom';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      light: '#FFB74D',
      main: '#FF9800',
      dark: '#F57C00',
      contrastText: '#fff',
    },
    secondary: {
      light: '#BA68C8',
      main: '#9C27B0',
      dark: '#7B1FA2',
      contrastText: '#fff',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  const theme = createTheme(getDesignTokens(isDarkMode ? 'dark' : 'light'));

  const isHomePage = location.pathname === '/';
  const showSidebarPages = ['/', '/discover', '/trending', '/community'];
  const canShowSidebar = showSidebarPages.includes(location.pathname);

  useEffect(() => {
    setMounted(true);
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  if (!mounted) return <div />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Main container */}
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}>
        
        {/* Header - Always visible */}
        <Header
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          isHomePage={isHomePage}
        />

        {/* Content area */}
        <Box sx={{ 
          display: 'flex', 
          flex: 1, 
          mt: 8, // Header height
          minHeight: 'calc(100vh - 64px)'
        }}>
          
          {/* Desktop Sidebar - Visible on allowed pages when toggled */}
          {canShowSidebar && isSidebarOpen && (
            <Box sx={{
              display: { xs: 'none', lg: 'block' },
              width: 280,
              position: 'fixed',
              left: 0,
              top: 64,
              height: 'calc(100vh - 64px - 300px)',
              zIndex: 100
            }}>
              <Sidebar isMobile={false} showCloseButton={true} />
            </Box>
          )}

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <>
              <Box sx={{
                display: { xs: 'block', lg: 'none' },
                position: 'fixed',
                top: 64,
                left: 0,
                zIndex: 1300,
                width: 280,
                height: 'calc(100vh - 64px)'
              }}>
                <Sidebar isMobile={true} toggleSidebar={toggleSidebar} />
              </Box>
              
              {/* Overlay */}
              <Box
                sx={{
                  position: 'fixed',
                  top: 64,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1200,
                  display: { xs: 'block', lg: 'none' }
                }}
                onClick={toggleSidebar}
              />
            </>
          )}

          {/* Main content */}
          <Box
            component="main"
            sx={{
              flex: 1,
              minHeight: 'calc(100vh - 64px)',
              p: 3,
              width: '100%',
              // Apply sidebar margin only on allowed pages desktop when sidebar is open
              ...(canShowSidebar && isSidebarOpen && {
                marginLeft: { lg: '280px' },
                width: { lg: 'calc(100% - 280px)' }
              })
            }}
          >
            {children}
          </Box>
        </Box>

        {/* Footer - Only on home page */}
        {isHomePage && <Footer />}

        {/* Mobile Bottom Bar - Only on non-homepage mobile */}
        {!isHomePage && (
          <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
            <MobileBottomBar />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Layout;