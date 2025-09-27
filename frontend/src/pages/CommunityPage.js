import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import {
  Box, Button, Typography, Grid, Paper, Fade, Container, Chip, Stack, IconButton,
  Avatar, Card, CardContent, Divider, List, ListItem, ListItemAvatar, ListItemText,
  Drawer
} from '@mui/material';
import { People, Menu, Group, Diversity3, Forum, Share } from '@mui/icons-material';

const CommunityPage = () => {
  const { blogs, isLoading, error } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('writers'); // 'writers', 'discussions', 'events'

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Sample community data (in real app, fetch from API)
  const featuredWriters = [
    { id: 1, name: 'Alice Johnson', username: 'alicewrites', followers: 1250, avatar: '', bio: 'Tech enthusiast and full-stack developer' },
    { id: 2, name: 'Bob Smith', username: 'bobtravels', followers: 890, avatar: '', bio: 'World traveler and adventure blogger' },
    { id: 3, name: 'Carol Lee', username: 'carolfoodie', followers: 2100, avatar: '', bio: 'Food critic and recipe creator' },
    { id: 4, name: 'David Kim', username: 'daviddesign', followers: 670, avatar: '', bio: 'UI/UX designer and creative thinker' },
  ];

  const discussions = [
    { id: 1, title: 'Best blogging platforms in 2024?', replies: 45, author: 'techlover' },
    { id: 2, title: 'How to grow your blog audience?', replies: 32, author: 'writerpro' },
    { id: 3, title: 'Share your favorite writing tips!', replies: 67, author: 'wordsmith' },
    { id: 4, title: 'SEO strategies for bloggers', replies: 28, author: 'digitalmarketer' },
  ];

  const events = [
    { id: 1, title: 'Virtual Writing Workshop', date: 'Dec 15, 2024', attendees: 120 },
    { id: 2, title: 'Blogging Conference 2024', date: 'Jan 20, 2025', attendees: 350 },
    { id: 3, title: 'Community Meetup', date: 'Dec 10, 2024', attendees: 85 },
  ];

  // Filter blogs by community engagement (high likes/views)
  const communityBlogs = blogs
    .filter(blog => (blog.likes || 0) > 10 || (blog.views || 0) > 50)
    .sort((a, b) => ((b.likes || 0) + (b.views || 0)) - ((a.likes || 0) + (a.views || 0)))
    .slice(0, 12);

  const tabs = [
    { value: 'writers', label: 'Top Writers', icon: <Diversity3 /> },
    { value: 'discussions', label: 'Discussions', icon: <Forum /> },
    { value: 'events', label: 'Events', icon: <Group /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'writers':
        return (
          <Grid container spacing={3}>
            {featuredWriters.map((writer) => (
              <Grid item xs={12} sm={6} md={3} key={writer.id}>
                <Card sx={{ height: '100%', transition: 'all 0.3s ease' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: 'primary.main'
                      }}
                    >
                      {writer.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {writer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      @{writer.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      {writer.bio}
                    </Typography>
                    <Chip
                      label={`${writer.followers.toLocaleString()} followers`}
                      color="primary"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<People />}
                      fullWidth
                      sx={{ borderRadius: 2 }}
                    >
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case 'discussions':
        return (
          <List sx={{ maxWidth: 800, mx: 'auto' }}>
            {discussions.map((discussion) => (
              <ListItem key={discussion.id} alignItems="flex-start" sx={{ mb: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Forum />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                      {discussion.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        by @{discussion.author} • {discussion.replies} replies
                      </Typography>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<Share />}
                        sx={{ mt: 1, textTransform: 'none' }}
                      >
                        Join Discussion
                      </Button>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        );
      case 'events':
        return (
          <Grid container spacing={3} sx={{ maxWidth: 800, mx: 'auto' }}>
            {events.map((event) => (
              <Grid item xs={12} md={6} key={event.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Group sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        {event.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {event.date}
                    </Typography>
                    <Chip
                      label={`${event.attendees} attendees`}
                      color="success"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<People />}
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)'
                      }}
                    >
                      Join Event
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <>
<Drawer
  anchor="left"
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  sx={{
    '& .MuiDrawer-paper': {
      boxShadow: '0 0 30px rgba(255,152,0,0.3)',
      border: 'none',
    },
  }}
>
  <Sidebar isMobile={true} toggleSidebar={() => setSidebarOpen(false)} />
</Drawer>

      {/* Hero Section */}
      <Box sx={{
        width: '100%',
        background: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        px: 2,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite'
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box>
              {/* Menu Button */}
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                <Menu />
              </IconButton>

              <People sx={{
                fontSize: 80,
                mb: 3,
                background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }} />

              <Typography variant="h1" fontWeight={900} sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2
              }}>
                Join Our Community
              </Typography>

              <Typography variant="h5" sx={{
                mb: 4,
                opacity: 0.9,
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.5rem' }
              }}>
                Connect with fellow writers, share ideas, and grow together in our vibrant blogging community.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  href="/register"
                  sx={{
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)',
                    fontSize: '1.1rem',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Become a Member
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="#community"
                  sx={{
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'white',
                      color: 'primary.main',
                    }
                  }}
                >
                  Explore Community
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 8, width: '100%' }} id="community">
        <Fade in timeout={800}>
          <Container maxWidth="lg">
            {/* Tab Navigation */}
            <Paper elevation={2} sx={{
              p: 3,
              mb: 6,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255,152,0,0.05) 0%, rgba(156,39,176,0.05) 100%)',
              border: '1px solid',
              borderColor: 'primary.light'
            }}>
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                {tabs.map((tab) => (
                  <Button
                    key={tab.value}
                    variant={activeTab === tab.value ? 'contained' : 'outlined'}
                    startIcon={tab.icon}
                    onClick={() => setActiveTab(tab.value)}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      background: activeTab === tab.value ? 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)' : 'transparent',
                      color: activeTab === tab.value ? 'white' : 'primary.main',
                      borderColor: 'primary.main',
                      '&:hover': {
                        background: activeTab === tab.value ? 'primary.dark' : 'primary.light',
                        color: activeTab === tab.value ? 'white' : 'primary.dark'
                      }
                    }}
                  >
                    {tab.label}
                  </Button>
                ))}
              </Stack>
            </Paper>

            {/* Tab Content */}
            {renderTabContent()}

            {/* Featured Community Blogs */}
            <Box sx={{ mt: 8 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center', color: 'primary.main' }}>
                Community Favorites
              </Typography>
              {isLoading ? (
                <Box textAlign="center" py={10}>
                  <Box sx={{
                    display: 'inline-block',
                    p: 3,
                    borderRadius: '50%',
                    mb: 2,
                    bgcolor: 'background.default'
                  }}>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      border: '4px solid',
                      borderColor: 'primary.light',
                      borderTopColor: 'primary.main',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  </Box>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    Loading community content...
                  </Typography>
                </Box>
              ) : communityBlogs.length > 0 ? (
                <Grid container spacing={3}>
                  {communityBlogs.map((blog, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={blog._id}>
                      <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Box>
                          <BlogCard blog={blog} />
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={10}>
                  <People sx={{ fontSize: 64, color: 'primary.light', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" gutterBottom>
                    No community content yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Join the conversation and share your thoughts!
                  </Typography>
                  <Button
                    variant="contained"
                    href="/create"
                    sx={{ borderRadius: 3 }}
                  >
                    Share Your Story
                  </Button>
                </Box>
              )}
            </Box>
          </Container>
        </Fade>
      </Box>
    </>
  );
};

export default CommunityPage;
