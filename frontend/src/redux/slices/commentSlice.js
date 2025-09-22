import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchComments = createAsyncThunk('comments/fetchComments', async (blogId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/blogs/${blogId}/comments`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addComment = createAsyncThunk('comments/addComment', async ({ blogId, content, parentComment }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/blogs/${blogId}/comments`, { content, parentComment });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const likeComment = createAsyncThunk('comments/likeComment', async (commentId, { rejectWithValue }) => {
  try {
    const response = await api.post(`/blogs/comments/${commentId}/like`);
    return { id: commentId, likes: response.data.likes };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteComment = createAsyncThunk('comments/deleteComment', async (commentId, { rejectWithValue }) => {
  try {
    await api.delete(`/blogs/comments/${commentId}`);
    return commentId;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const commentSlice = createSlice({
  name: 'comments',
  initialState: { comments: [], isLoading: false, error: null },
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
    updateComment: (state, action) => {
      const index = state.comments.findIndex(c => c._id === action.payload._id);
      if (index !== -1) state.comments[index] = action.payload;
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(c => c._id !== action.payload);
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
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(likeComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.isLoading = false;
        const comment = state.comments.find(c => c._id === action.payload.id);
        if (comment) comment.likes = action.payload.likes;
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = state.comments.filter(c => c._id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setComments, setLoading, setError } = commentSlice.actions;
export default commentSlice.reducer;
