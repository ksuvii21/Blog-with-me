import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { setCredentials } from './redux/slices/authSlice';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CreateBlogPage from './pages/CreateBlogPage';
import EditBlogPage from './pages/EditBlogPage';
import ProfilePage from './pages/ProfilePage';
import AuthorProfilePage from './pages/AuthorProfilePage';
import SearchSuggestions from './pages/SearchSuggestions';
import TagPage from './pages/TagPage';
import TrendingTagsPage from './pages/TrendingTagsPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage';
import DiscoverPage from './pages/DiscoverPage';
import TrendingPage from './pages/TrendingPage';
import CommunityPage from './pages/CommunityPage';

// Placeholder components for missing routes
const FavoritesPage = () => <div>Favorites Page - Coming Soon</div>;
const BookmarksPage = () => <div>Bookmarks Page - Coming Soon</div>;
const SettingsPage = () => <div>Settings Page - Coming Soon</div>;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            <Route path="/create" element={<CreateBlogPage />} />
            <Route path="/edit/:id" element={<EditBlogPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/author/:id" element={<AuthorProfilePage />} />
            <Route path="/search" element={<SearchSuggestions />} />
            <Route path="/tag/:tag" element={<TagPage />} />
            <Route path="/trending-tags" element={<TrendingTagsPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/superadmin" element={<SuperAdminDashboardPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
