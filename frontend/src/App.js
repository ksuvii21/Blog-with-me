import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

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

function App() {
  return (
    <Provider store={store}>
      <Router>
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
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
