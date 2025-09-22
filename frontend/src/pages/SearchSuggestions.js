import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import Layout from '../components/Layout';
import { Box, TextField, Paper, List, ListItem, ListItemButton, ListItemText, Typography, Fade } from '@mui/material';

const SearchSuggestions = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!blogs.length) dispatch(fetchBlogs());
  }, [dispatch, blogs.length]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = blogs.filter(
      (b) => b.title.toLowerCase().includes(q) || b.tags.some(tag => tag.toLowerCase().includes(q))
    ).slice(0, 7);
    setSuggestions(matches);
  }, [query, blogs]);

  const handleSelect = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  return (
    <Layout>
      <Fade in timeout={700}>
        <Box maxWidth="sm" mx="auto" py={8}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>Search Blogs</Typography>
            <TextField
              label="Search by title or tag"
              value={query}
              onChange={e => setQuery(e.target.value)}
              fullWidth
              autoFocus
              sx={{ mb: 2 }}
            />
            {suggestions.length > 0 && (
              <List>
                {suggestions.map(blog => (
                  <ListItem key={blog._id} disablePadding>
                    <ListItemButton onClick={() => handleSelect(blog._id)}>
                      <ListItemText
                        primary={blog.title}
                        secondary={blog.tags.length ? `Tags: ${blog.tags.join(', ')}` : null}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
            {query.length > 1 && suggestions.length === 0 && (
              <Typography color="text.secondary">No results found.</Typography>
            )}
          </Paper>
        </Box>
      </Fade>
    </Layout>
  );
};

export default SearchSuggestions;
