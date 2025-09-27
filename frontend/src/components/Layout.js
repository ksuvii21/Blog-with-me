import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileBottomBar from './MobileBottomBar';

// Enhanced theme configuration
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
    text: {
      primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none'
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
          }
        }
      }
    }
  }
});

// Enhanced global styles
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .gradient-text {
    background: linear-gradient(45deg, #FF9800 30%, #9C27B0 90%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const theme = React.useMemo(() =>
    createTheme(getDesignTokens(isDarkMode ? 'dark' : 'light')),
    [isDarkMode]
  );

  useEffect(() => {
    setMounted(true);
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    
    // Add class to body for theme
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.body.className = newDarkMode ? 'dark-theme' : 'light-theme';
  };

  if (!mounted) {
    return <div />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        width: '100%',
        overflowX: 'hidden'
      }}>
        {/* Fixed Header */}
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />

        {/* Main Content Area */}
        <Box sx={{
          display: 'flex',
          flex: 1,
          mt: { xs: 7, sm: 8 }, // Responsive header height
          minHeight: 'calc(100vh - 64px)'
        }}>
          {/* Sidebar - Desktop */}
          <Box sx={{
            display: { xs: 'none', lg: 'block' },
            width: 280,
            flexShrink: 0,
            position: 'fixed',
            left: 0,
            top: 64,
            height: 'calc(100vh - 64px)',
            zIndex: 100
          }}>
            <Sidebar isMobile={false} />
          </Box>

          {/* Sidebar - Mobile */}
          {isSidebarOpen && (
            <>
              <Box sx={{
                display: { xs: 'block', lg: 'none' },
                position: 'fixed',
                top: { xs: 56, sm: 64 },
                left: 0,
                zIndex: 1300,
                width: 280,
                height: 'calc(100vh - 64px)',
                animation: 'slideInLeft 0.3s ease-out'
              }}>
                <Sidebar isMobile={true} toggleSidebar={toggleSidebar} />
              </Box>

              {/* Overlay for mobile sidebar */}
              <Box
                sx={{
                  position: 'fixed',
                  top: { xs: 56, sm: 64 },
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

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flex: 1,
              minHeight: 'calc(100vh - 64px)',
              p: { xs: 2, sm: 3 },
              pb: { xs: 10, sm: 12 },
              transition: 'all 0.3s ease',
              ml: { lg: 280 },
              width: { lg: 'calc(100% - 280px)' }
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