import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import blogSlice from './slices/blogSlice';
import commentSlice from './slices/commentSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    blogs: blogSlice,
    comments: commentSlice,
    users: userSlice,
  },
});
