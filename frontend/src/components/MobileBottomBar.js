import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MobileBottomBar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center py-2 md:hidden">
      <Link to="/" className={`flex flex-col items-center text-xs ${location.pathname === '/' ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}>🏠<span>Home</span></Link>
      <Link to="/search" className={`flex flex-col items-center text-xs ${location.pathname.startsWith('/search') ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}>🔍<span>Search</span></Link>
      <Link to="/trending-tags" className={`flex flex-col items-center text-xs ${location.pathname.startsWith('/trending-tags') ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}>🔥<span>Trending</span></Link>
      {user ? (
        <Link to="/dashboard" className={`flex flex-col items-center text-xs ${location.pathname.startsWith('/dashboard') ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}>👤<span>Me</span></Link>
      ) : (
        <Link to="/login" className={`flex flex-col items-center text-xs ${location.pathname.startsWith('/login') ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}>🔑<span>Login</span></Link>
      )}
    </nav>
  );
};

export default MobileBottomBar;
