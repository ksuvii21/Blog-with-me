import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard', auth: true },
    { to: '/admin', label: 'Admin Panel', auth: true, admin: true },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto`}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Navigation</h2>
        <nav>
          <ul>
            {navLinks.map((link) => {
              if (link.auth && !user) return null;
              if (link.admin && user?.role !== 'admin') return null;
              return (
                <li key={link.to} className="mb-2">
                  <Link
                    to={link.to}
                    className={`block px-4 py-2 rounded-md ${
                      location.pathname === link.to
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={toggleSidebar}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
