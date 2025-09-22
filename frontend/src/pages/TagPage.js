import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import Layout from '../components/Layout';
import { Box, Paper, Typography, Chip, Stack, Fade } from '@mui/material';

const TagPage = () => {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (!blogs.length) dispatch(fetchBlogs());
    else setFiltered(blogs.filter(b => b.tags.includes(tag)));
  }, [dispatch, blogs, tag]);

  useEffect(() => {
    setFiltered(blogs.filter(b => b.tags.includes(tag)));
  }, [blogs, tag]);

  return (
    <Layout>
      <Fade in timeout={700}>
        <Box maxWidth="md" mx="auto" py={4}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight={800} mb={2}>
              Tag: <Chip label={`#${tag}`} color="secondary" />
            </Typography>
            <Stack spacing={3}>
              {filtered.length > 0 ? filtered.map(blog => (
                <Box key={blog._id}>
                  <Typography variant="h6" fontWeight={700}>
                    <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                  </Typography>
                  <Typography color="text.secondary" fontSize={15}>
                    {blog.summary || blog.content.replace(/<[^>]+>/g, '').slice(0, 120) + '...'}
                  </Typography>
                </Box>
              )) : (
                <Typography color="text.secondary">No blogs found for this tag.</Typography>
              )}
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </Layout>
  );
};

export default TagPage;
