import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import {
  Box, Button, Typography, Grid, Paper, Fade, Container, Chip, Stack, IconButton,
  Avatar, Card, CardContent, Divider, List, ListItem, ListItemAvatar, ListItemText,
  Drawer, Zoom, Slide, alpha, useTheme
} from '@mui/material';
import {
  People, Menu, Group, Diversity3, Forum, Share, Favorite,
  RocketLaunch, LocalFireDepartment, EmojiEvents, TrendingUp,
  AutoStories, Visibility, Comment, Bookmark
} from '@mui/icons-material';

// Orange and Purple Theme Colors
const themeColors = {
  orange: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)'
  },
  purple: {
    light: '#BA68C8',
    main: '#9C27B0',
    dark: '#7B1FA2',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)'
  },
  gradient: {
    hero: 'linear-gradient(135deg, #FF9800 0%, #9C27B0 50%, #673AB7 100%)',
    card: 'linear-gradient(145deg, rgba(255,152,0,0.1) 0%, rgba(156,39,176,0.1) 100%)',
    button: 'linear-gradient(45deg, #FF9800 30%, #9C27B0 90%)'
  }
};

// Floating Community Icons Animation
const FloatingCommunityIcons = () => {
  const icons = ['👥', '💬', '🌟', '🚀', '💡', '🎯', '📚', '🤝'];
  const floatingIcons = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    icon: icons[Math.floor(Math.random() * icons.length)],
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
    size: 20 + Math.random() * 30
  }));

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {floatingIcons.map((item) => (
        <Box
          key={item.id}
          sx={{
            position: 'absolute',
            left: `${item.left}%`,
            top: '-50px',
            fontSize: `${item.size}px`,
            animation: `floatCommunity ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
            opacity: 0.7,
          }}
        >
          {item.icon}
        </Box>
      ))}
      <style jsx>{`
        @keyframes floatCommunity {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  );
};

const CommunityPage = () => {
  const { blogs, isLoading, error } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('writers');
  const [hoveredWriter, setHoveredWriter] = useState(null);
  const [stats, setStats] = useState({ writers: 0, discussions: 0, events: 0 });

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Dynamic community data with enhanced structure
  const featuredWriters = [
    { 
      id: 1, 
      name: 'Alice Johnson', 
      username: 'alicewrites', 
      followers: 1250, 
      stories: 45,
      avatar: '', 
      bio: 'Tech enthusiast and full-stack developer',
      joinDate: '2023-01-15',
      expertise: ['Technology', 'Programming', 'AI']
    },
    { 
      id: 2, 
      name: 'Bob Smith', 
      username: 'bobtravels', 
      followers: 890, 
      stories: 23,
      avatar: '', 
      bio: 'World traveler and adventure blogger',
      joinDate: '2023-03-20',
      expertise: ['Travel', 'Adventure', 'Photography']
    },
    { 
      id: 3, 
      name: 'Carol Lee', 
      username: 'carolfoodie', 
      followers: 2100, 
      stories: 67,
      avatar: '', 
      bio: 'Food critic and recipe creator',
      joinDate: '2022-11-08',
      expertise: ['Food', 'Recipes', 'Lifestyle']
    },
    { 
      id: 4, 
      name: 'David Kim', 
      username: 'daviddesign', 
      followers: 670, 
      stories: 32,
      avatar: '', 
      bio: 'UI/UX designer and creative thinker',
      joinDate: '2023-06-12',
      expertise: ['Design', 'Creativity', 'Art']
    },
  ];

  const discussions = [
    { 
      id: 1, 
      title: 'Best blogging platforms in 2024?', 
      replies: 45, 
      author: 'techlover',
      views: 1200,
      lastActivity: '2 hours ago',
      tags: ['Technology', 'Blogging', 'Tools']
    },
    { 
      id: 2, 
      title: 'How to grow your blog audience?', 
      replies: 32, 
      author: 'writerpro',
      views: 890,
      lastActivity: '5 hours ago',
      tags: ['Marketing', 'Growth', 'Audience']
    },
    { 
      id: 3, 
      title: 'Share your favorite writing tips!', 
      replies: 67, 
      author: 'wordsmith',
      views: 2100,
      lastActivity: '1 day ago',
      tags: ['Writing', 'Tips', 'Community']
    },
  ];

  const events = [
    { 
      id: 1, 
      title: 'Virtual Writing Workshop', 
      date: 'Dec 15, 2024', 
      attendees: 120,
      type: 'Workshop',
      duration: '2 hours',
      host: 'Writing Masters'
    },
    { 
      id: 2, 
      title: 'Blogging Conference 2024', 
      date: 'Jan 20, 2025', 
      attendees: 350,
      type: 'Conference',
      duration: '2 days',
      host: 'Bloggers United'
    },
    { 
      id: 3, 
      title: 'Community Meetup', 
      date: 'Dec 10, 2024', 
      attendees: 85,
      type: 'Networking',
      duration: '3 hours',
      host: 'Local Writers Group'
    },
  ];

  // Enhanced community blogs with engagement metrics
  const communityBlogs = blogs
    .filter(blog => (blog.likes || 0) > 10 || (blog.views || 0) > 50)
    .sort((a, b) => ((b.likes || 0) + (b.views || 0)) - ((a.likes || 0) + (a.views || 0)))
    .slice(0, 12);

  const tabs = [
    { value: 'writers', label: 'Top Writers', icon: <Diversity3 />, color: themeColors.orange.main },
    { value: 'discussions', label: 'Discussions', icon: <Forum />, color: themeColors.purple.main },
    { value: 'events', label: 'Events', icon: <Group />, color: themeColors.orange.dark },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'writers':
        return (
          <Grid container spacing={3}>
            {featuredWriters.map((writer, index) => (
              <Grid item xs={12} sm={6} md={3} key={writer.id}>
                <Zoom in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: themeColors.gradient.card,
                      border: `2px solid ${alpha(themeColors.orange.main, 0.2)}`,
                      '&:hover': {
                        transform: 'translateY(-12px) scale(1.02)',
                        borderColor: themeColors.orange.main,
                        boxShadow: `0 20px 40px ${alpha(themeColors.orange.main, 0.3)}`,
                      }
                    }}
                    onMouseEnter={() => setHoveredWriter(writer.id)}
                    onMouseLeave={() => setHoveredWriter(null)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            border: `3px solid ${themeColors.orange.main}`,
                            background: themeColors.gradient.button,
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            transform: hoveredWriter === writer.id ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
                          }}
                        >
                          {writer.name.charAt(0)}
                        </Avatar>
                        {hoveredWriter === writer.id && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -5,
                              right: -5,
                              background: themeColors.gradient.button,
                              color: 'white',
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                          >
                            <Favorite sx={{ fontSize: 14 }} />
                          </Box>
                        )}
                      </Box>
                      
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: themeColors.purple.dark }}>
                        {writer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        @{writer.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block', lineHeight: 1.4 }}>
                        {writer.bio}
                      </Typography>

                      {/* Expertise Tags */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mb: 2 }}>
                        {writer.expertise.slice(0, 2).map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            size="small"
                            sx={{
                              bgcolor: alpha(themeColors.purple.main, 0.1),
                              color: themeColors.purple.dark,
                              fontSize: '0.7rem',
                              height: 20
                            }}
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" color={themeColors.orange.main}>
                            {writer.followers.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Followers
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" color={themeColors.purple.main}>
                            {writer.stories}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Stories
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<People />}
                        fullWidth
                        sx={{
                          borderRadius: 3,
                          background: themeColors.gradient.button,
                          fontWeight: 600,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${alpha(themeColors.orange.main, 0.4)}`
                          }
                        }}
                      >
                        Follow Writer
                      </Button>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        );

      case 'discussions':
        return (
          <Grid container spacing={3}>
            {discussions.map((discussion, index) => (
              <Grid item xs={12} md={6} key={discussion.id}>
                <Slide direction="up" in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card sx={{
                    transition: 'all 0.3s ease',
                    background: themeColors.gradient.card,
                    border: `2px solid ${alpha(themeColors.purple.main, 0.2)}`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: themeColors.purple.main,
                      boxShadow: `0 15px 35px ${alpha(themeColors.purple.main, 0.2)}`
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: themeColors.purple.main,
                          width: 50,
                          height: 50
                        }}>
                          <Forum />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: themeColors.purple.dark }}>
                            {discussion.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {discussion.tags.map((tag, idx) => (
                              <Chip
                                key={idx}
                                label={tag}
                                size="small"
                                sx={{
                                  bgcolor: alpha(themeColors.purple.main, 0.1),
                                  color: themeColors.purple.dark,
                                  fontSize: '0.7rem'
                                }}
                              />
                            ))}
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              by @{discussion.author} • {discussion.replies} replies
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {discussion.lastActivity}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Comment />}
                              sx={{
                                borderColor: themeColors.purple.main,
                                color: themeColors.purple.main,
                                borderRadius: 2
                              }}
                            >
                              Join Discussion
                            </Button>
                            <IconButton size="small" sx={{ color: themeColors.orange.main }}>
                              <Bookmark />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        );

      case 'events':
        return (
          <Grid container spacing={3}>
            {events.map((event, index) => (
              <Grid item xs={12} md={4} key={event.id}>
                <Zoom in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    background: themeColors.gradient.card,
                    border: `2px solid ${alpha(themeColors.orange.main, 0.2)}`,
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      borderColor: themeColors.orange.main,
                      boxShadow: `0 15px 35px ${alpha(themeColors.orange.main, 0.2)}`
                    }
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: alpha(themeColors.orange.main, 0.1),
                        color: themeColors.orange.main,
                        mb: 2
                      }}>
                        <Group sx={{ fontSize: 32 }} />
                      </Box>

                      <Chip
                        label={event.type}
                        size="small"
                        sx={{
                          bgcolor: themeColors.gradient.button,
                          color: 'white',
                          fontWeight: 600,
                          mb: 2
                        }}
                      />

                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: themeColors.purple.dark }}>
                        {event.title}
                      </Typography>

                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        📅 {event.date}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        ⏰ {event.duration} • 👥 {event.attendees} attendees
                      </Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                        Hosted by {event.host}
                      </Typography>

                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<People />}
                        sx={{
                          background: themeColors.gradient.button,
                          borderRadius: 3,
                          fontWeight: 600,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${alpha(themeColors.orange.main, 0.4)}`
                          }
                        }}
                      >
                        Join Event
                      </Button>
                    </CardContent>
                  </Card>
                </Zoom>
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
            boxShadow: '0 20px 60px rgba(255,152,0,0.3)',
            border: 'none',
            borderRadius: '0 24px 24px 0',
            background: themeColors.gradient.hero,
          },
        }}
      >
        <Sidebar isMobile={true} toggleSidebar={() => setSidebarOpen(false)} />
      </Drawer>

      {/* Enhanced Hero Section */}
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        background: themeColors.gradient.hero,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <FloatingCommunityIcons />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              {/* Floating Menu Button */}
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  position: 'fixed',
                  top: 80,
                  left: 24,
                  zIndex: 1400,
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                    transform: 'scale(1.1) rotate(90deg)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Menu />
              </IconButton>

              <RocketLaunch sx={{
                fontSize: 80,
                mb: 3,
                background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }} />

              <Typography variant="h1" fontWeight={900} sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(45deg, #FFFFFF 30%, #FFE0B2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2,
                textShadow: '0 0 30px rgba(255,255,255,0.3)'
              }}>
                Join Our Thriving
                <Box component="span" sx={{
                  display: 'block',
                  background: 'linear-gradient(45deg, #FFD700 30%, #FF6B6B 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}>
                  Writing Community
                </Box>
              </Typography>

              <Typography variant="h5" sx={{
                mb: 4,
                opacity: 0.9,
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.5rem' }
              }}>
                Connect with fellow writers, share ideas, and grow together in our vibrant blogging ecosystem.
              </Typography>

              {/* Community Stats */}
              <Fade in timeout={1400}>
                <Grid container spacing={3} sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}>
                  {[
                    { number: '50K+', label: 'Writers', icon: People },
                    { number: '100K+', label: 'Stories', icon: AutoStories },
                    { number: '1M+', label: 'Discussions', icon: Forum },
                    { number: '500+', label: 'Events', icon: Group }
                  ].map((stat, index) => (
                    <Grid item xs={6} sm={3} key={stat.label}>
                      <Zoom in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Box sx={{
                          p: 2,
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          textAlign: 'center',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.15)',
                            transform: 'translateY(-8px)',
                          },
                          transition: 'all 0.3s ease'
                        }}>
                          <stat.icon sx={{ fontSize: 36, mb: 1, color: '#FFD700' }} />
                          <Typography variant="h4" fontWeight="bold">
                            {stat.number}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              </Fade>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  href="/register"
                  endIcon={<RocketLaunch />}
                  sx={{
                    fontWeight: 700,
                    px: 6,
                    py: 2,
                    borderRadius: 5,
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FFD93D 90%)',
                    fontSize: '1.1rem',
                    boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
                    '&:hover': {
                      transform: 'translateY(-3px) scale(1.05)',
                      boxShadow: '0 15px 40px rgba(255, 107, 107, 0.6)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
                    px: 6,
                    py: 2,
                    borderRadius: 5,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderColor: 'white',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
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
      <Box sx={{ py: 8, background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)' }} id="community">
        <Fade in timeout={800}>
          <Container maxWidth="xl">
            {/* Interactive Tab Navigation */}
            <Paper elevation={0} sx={{
              p: 4,
              mb: 6,
              borderRadius: 4,
              background: themeColors.gradient.card,
              border: `2px solid ${alpha(themeColors.orange.main, 0.2)}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h3" fontWeight="800" sx={{
                textAlign: 'center',
                mb: 4,
                background: themeColors.gradient.hero,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Community Hub
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" flexWrap="wrap">
                {tabs.map((tab, index) => (
                  <Zoom in timeout={600} style={{ transitionDelay: `${index * 150}ms` }} key={tab.value}>
                    <Button
                      variant={activeTab === tab.value ? 'contained' : 'outlined'}
                      startIcon={tab.icon}
                      onClick={() => setActiveTab(tab.value)}
                      sx={{
                        borderRadius: 4,
                        fontWeight: 700,
                        px: 4,
                        py: 2,
                        minWidth: 200,
                        background: activeTab === tab.value ? themeColors.gradient.button : 'transparent',
                        color: activeTab === tab.value ? 'white' : tab.color,
                        borderColor: tab.color,
                        borderWidth: 2,
                        '&:hover': {
                          background: activeTab === tab.value ? 'linear-gradient(45deg, #F57C00 30%, #7B1FA2 90%)' : alpha(tab.color, 0.1),
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: `0 8px 25px ${alpha(tab.color, 0.3)}`
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {tab.label}
                    </Button>
                  </Zoom>
                ))}
              </Stack>
            </Paper>

            {/* Animated Tab Content */}
            <Fade in timeout={500} key={activeTab}>
              <Box sx={{ mb: 8 }}>
                {renderTabContent()}
              </Box>
            </Fade>

            {/* Featured Community Blogs */}
            <Box sx={{ mt: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                <LocalFireDepartment sx={{ fontSize: 40, color: themeColors.orange.main, mr: 2 }} />
                <Typography variant="h2" fontWeight="800" sx={{
                  background: themeColors.gradient.hero,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center'
                }}>
                  Community Favorites
                </Typography>
              </Box>

              {isLoading ? (
                <Box textAlign="center" py={10}>
                  <Box sx={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                  }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      border: '4px solid',
                      borderColor: themeColors.orange.light,
                      borderTopColor: themeColors.orange.main,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <Typography variant="h5" color={themeColors.orange.main} fontWeight={600}>
                      Loading Community Content...
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Gathering the best stories from our community
                    </Typography>
                  </Box>
                </Box>
              ) : communityBlogs.length > 0 ? (
                <Grid container spacing={4}>
                  {communityBlogs.map((blog, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={blog._id}>
                      <Fade in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Box sx={{
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            transition: 'transform 0.3s ease'
                          }
                        }}>
                          <BlogCard blog={blog} />
                        </Box>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Zoom in timeout={800}>
                  <Card sx={{
                    p: 8,
                    textAlign: 'center',
                    borderRadius: 4,
                    background: themeColors.gradient.card,
                    border: `2px solid ${alpha(themeColors.purple.main, 0.2)}`,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                  }}>
                    <People sx={{ fontSize: 80, color: themeColors.orange.main, mb: 3, opacity: 0.6 }} />
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{
                      background: themeColors.gradient.button,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Community Awaits!
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                      Be the first to share your story and start amazing conversations in our community.
                    </Typography>
                    <Button
                      variant="contained"
                      href="/create"
                      startIcon={<RocketLaunch />}
                      size="large"
                      sx={{
                        background: themeColors.gradient.button,
                        borderRadius: 4,
                        px: 6,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 10px 30px rgba(255, 152, 0, 0.4)'
                        }
                      }}
                    >
                      Share Your Story
                    </Button>
                  </Card>
                </Zoom>
              )}
            </Box>
          </Container>
        </Fade>
      </Box>
    </>
  );
};

export default CommunityPage;