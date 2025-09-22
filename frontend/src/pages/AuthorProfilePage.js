import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import axios from 'axios';
import { Box, Paper, Typography, Avatar, Button, Stack, Chip, Fade, Divider } from '@mui/material';

const AuthorProfilePage = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchAuthor();
  }, [id]);

  const fetchAuthor = async () => {
    setLoading(true);
    try {
      const userRes = await axios.get(`/api/users/${id}`);
      setAuthor(userRes.data);
      const blogsRes = await axios.get(`/api/blogs?author=${id}`);
      setBlogs(blogsRes.data);
      // TODO: fetch following status if implemented
    } catch (err) {
      setAuthor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    // TODO: implement follow/unfollow API
    setIsFollowing((f) => !f);
  };

  if (loading) {
    return (
      <Layout>
        <Box textAlign="center" py={12}>
          <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 inline-block"></span>
          <Typography color="text.secondary" mt={4}>Loading author...</Typography>
        </Box>
      </Layout>
    );
  }

  if (!author) {
    return (
      <Layout>
        <Box textAlign="center" py={12}>
          <Typography color="text.secondary">Author not found.</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Fade in timeout={700}>
        <Box maxWidth="md" mx="auto" py={4}>
          <Paper elevation={4} sx={{ p: { xs: 2, md: 5 }, borderRadius: 4, mb: 4 }}>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Avatar src={author.profilePicture || '/default-avatar.png'} sx={{ width: 72, height: 72 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>{author.username}</Typography>
                <Typography color="text.secondary" fontSize={16}>{author.bio || 'No bio provided.'}</Typography>
                {/* Social links placeholder */}
                <Stack direction="row" spacing={1} mt={1}>
                  {/* Example: <a href={author.twitter} target="_blank" rel="noopener noreferrer">Twitter</a> */}
                </Stack>
                {user && user.id !== author._id && (
                  <Button
                    variant={isFollowing ? 'outlined' : 'contained'}
                    color="primary"
                    sx={{ mt: 2, borderRadius: 3, fontWeight: 700 }}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </Box>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" fontWeight={700} mb={2}>Blogs by {author.username}</Typography>
            <Stack spacing={3}>
              {blogs.length > 0 ? blogs.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              )) : (
                <Typography color="text.secondary">No blogs yet.</Typography>
              )}
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </Layout>
  );
};

export default AuthorProfilePage;
