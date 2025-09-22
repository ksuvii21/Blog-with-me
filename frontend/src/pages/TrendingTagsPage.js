import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import Layout from '../components/Layout';
import { Box, Paper, Typography, Chip, Stack, Fade } from '@mui/material';
import { Link } from 'react-router-dom';

const TrendingTagsPage = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (!blogs.length) dispatch(fetchBlogs());
    else calcTrending();
  }, [dispatch, blogs.length]);

  useEffect(() => {
    calcTrending();
  }, [blogs]);

  const calcTrending = () => {
    const tagCount = {};
    blogs.forEach(blog => {
      (blog.tags || []).forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    const sorted = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
    setTrending(sorted);
  };

  return (
    <Layout>
      <Fade in timeout={700}>
        <Box maxWidth="sm" mx="auto" py={8}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>Trending Tags</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {trending.length > 0 ? trending.map(t => (
                <Chip
                  key={t.tag}
                  label={`#${t.tag} (${t.count})`}
                  color="secondary"
                  component={Link}
                  to={`/tag/${t.tag}`}
                  clickable
                  sx={{ mb: 1 }}
                />
              )) : (
                <Typography color="text.secondary">No trending tags found.</Typography>
              )}
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </Layout>
  );
};

export default TrendingTagsPage;
