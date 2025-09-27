import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import blogSlice from './slices/blogSlice';
import commentSlice from './slices/commentSlice';
import userSlice from './slices/userSlice';

const preloadedState = {
  auth: {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null
  }
};

export const store = configureStore({
  reducer: {
    auth: authSlice,
    blogs: blogSlice,
    comments: commentSlice,
    users: userSlice,
  },
  preloadedState
});
