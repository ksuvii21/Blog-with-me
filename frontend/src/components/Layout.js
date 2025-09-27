import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileBottomBar from './MobileBottomBar';
import { useLocation } from 'react-router-dom';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      light: '#fed7aa', // orange-200
      main: '#f97316', // orange-500
      dark: '#ea580c', // orange-600
      contrastText: '#fff',
    },
    secondary: {
      light: '#d8b4fe', // purple-300
      main: '#a855f7', // purple-500
      dark: '#9333ea', // purple-600
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

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const showSidebarPages = [];
  const canShowSidebar = showSidebarPages.includes(location.pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Set sidebar open by default on allowed pages, closed on others
    setIsSidebarOpen(canShowSidebar);
  }, [canShowSidebar]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const theme = createTheme(getDesignTokens('light'));

  if (!mounted) return <div />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen flex flex-col bg-gray-50">

        {/* Header - Always visible */}
        <Header isHomePage={isHomePage} />

        {/* Content area */}
        <div className="flex flex-1 mt-16 min-h-[calc(100vh-4rem)]">

          {/* Desktop Sidebar - Visible on allowed pages when toggled */}
          {canShowSidebar && isSidebarOpen && (
            <div className="hidden lg:block fixed left-0 top-16 w-70 h-[calc(100vh-4rem-12rem)] z-10">
              <Sidebar isMobile={false} showCloseButton={true} />
            </div>
          )}

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <>
              <div className="lg:hidden fixed top-16 left-0 z-[1300] w-70 h-[calc(100vh-4rem)]">
                <Sidebar isMobile={true} toggleSidebar={toggleSidebar} />
              </div>

              {/* Overlay */}
              <div
                className="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[1200]"
                onClick={toggleSidebar}
              />
            </>
          )}

          {/* Main content */}
          <main className={`flex-1 min-h-[calc(100vh-4rem)] p-6 w-full ${
            canShowSidebar && isSidebarOpen ? 'lg:ml-70 lg:w-[calc(100%-17.5rem)]' : ''
          }`}>
            {children}
          </main>
        </div>

        {/* Footer - Only on home page */}
        {isHomePage && <Footer />}

        {/* Mobile Bottom Bar - Only on non-homepage mobile */}
        {!isHomePage && (
          <div className="lg:hidden">
            <MobileBottomBar />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Layout;
