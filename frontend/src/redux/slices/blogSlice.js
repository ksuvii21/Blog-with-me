import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/blogs');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createBlog = createAsyncThunk('blogs/createBlog', async (blogData, { rejectWithValue }) => {
  try {
    const response = await api.post('/blogs', blogData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateBlog = createAsyncThunk('blogs/updateBlog', async ({ id, blogData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteBlog = createAsyncThunk('blogs/deleteBlog', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/blogs/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const likeBlog = createAsyncThunk('blogs/likeBlog', async (id, { rejectWithValue }) => {
  try {
    const response = await api.post(`/blogs/${id}/like`);
    return { id, likes: response.data.likes };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const blogSlice = createSlice({
  name: 'blogs',
  initialState: { blogs: [], currentBlog: null, isLoading: false, error: null },
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
    addBlog: (state, action) => {
      state.blogs.push(action.payload);
    },
    updateBlog: (state, action) => {
      const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
      if (index !== -1) state.blogs[index] = action.payload;
    },
    deleteBlog: (state, action) => {
      state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs.push(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) state.blogs[index] = action.payload;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(likeBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        const blog = state.blogs.find(b => b._id === action.payload.id);
        if (blog) blog.likes = action.payload.likes;
      })
      .addCase(likeBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setBlogs, setCurrentBlog, addBlog, setLoading, setError } = blogSlice.actions;
export default blogSlice.reducer;
