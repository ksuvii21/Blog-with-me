import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileBottomBar from './MobileBottomBar';

// Fixed theme colors with proper structure
const themeColors = {
  orange: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  purple: {
    light: '#BA68C8',
    main: '#9C27B0',
    dark: '#7B1FA2',
  },
};

// Proper MUI theme configuration
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      light: themeColors.orange.light,
      main: themeColors.orange.main,
      dark: themeColors.orange.dark,
      contrastText: '#fff',
    },
    secondary: {
      light: themeColors.purple.light,
      main: themeColors.purple.main,
      dark: themeColors.purple.dark,
      contrastText: '#fff',
    },
    background: {
      default: mode === 'light' ? '#FFF3E0' : '#121212',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

// CSS for animations (separate from JSX)
const globalStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Inject global styles
const styleSheet = document.createElement('style');
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = React.useMemo(() =>
    createTheme(getDesignTokens(isDarkMode ? 'dark' : 'light')),
    [isDarkMode]
  );

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        width: '100%',
      }}>
        {/* Fixed Header */}
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />

        {/* Main Content */}
        <Box sx={{
          display: 'flex',
          flex: 1,
          mt: 8, // Header height
        }}>
          {/* Sidebar - Desktop */}
          <Box sx={{
            display: { xs: 'none', md: 'block' },
            width: 280,
            flexShrink: 0
          }}>
            <Sidebar isMobile={false} toggleSidebar={toggleSidebar} />
          </Box>

          {/* Sidebar - Mobile */}
          {isSidebarOpen && (
            <>
              <Box sx={{
                display: { xs: 'block', md: 'none' },
                position: 'fixed',
                top: 64,
                left: 0,
                zIndex: 1200,
                width: 280,
                height: 'calc(100vh - 64px)'
              }}>
                <Sidebar isMobile={true} toggleSidebar={toggleSidebar} />
              </Box>

              {/* Overlay for mobile sidebar */}
              <Box
                sx={{
                  position: 'fixed',
                  top: 64,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1100,
                  display: { xs: 'block', md: 'none' }
                }}
                onClick={toggleSidebar}
              />
            </>
          )}

          {/* Main Content Area */}
          <Box
            component="main"
            sx={{
              flex: 1,
              minHeight: 'calc(100vh - 64px)',
              p: 3,
              transition: 'margin-left 0.3s ease',
              ml: { md: isSidebarOpen ? '280px' : 0 },
              width: { md: isSidebarOpen ? 'calc(100% - 280px)' : '100%' }
            }}
          >
            {children}
          </Box>
        </Box>

        {/* Footer */}
        <Footer />

        {/* Mobile Bottom Navigation */}
        <MobileBottomBar />
      </Box>
    </ThemeProvider>
  );
};

export default Layout;