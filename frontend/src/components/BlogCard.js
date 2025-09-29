import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Fade,
  Zoom,
  alpha 
} from '@mui/material';
import { 
  Favorite, 
  Visibility, 
  Comment, 
  BookmarkBorder,
  Bookmark,
  Share,
  MoreHoriz 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

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

const BlogCard = ({ blog, compact = false, theme = themeColors, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const initialLikeCount = Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  
  const [showActions, setShowActions] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const formatContent = (content) => {
    // Remove HTML tags and limit length
    const plainText = content.replace(/<[^>]*>/g, '');
    return compact ? `${plainText.substring(0, 120)}...` : `${plainText.substring(0, 200)}...`;
  };

  const getReadingTime = (content) => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  return (
    <Fade in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
      <Box
        sx={{
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-12px)',
            '& .blog-image': {
              transform: 'scale(1.1)'
            },
            '& .blog-actions': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          },
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/blogs/${blog._id}`} style={{ textDecoration: 'none' }}>
          <Card 
            sx={{
              height: '100%',
              background: theme.gradient.card,
              border: `2px solid ${alpha(theme.orange.main, 0.2)}`,
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: isHovered 
                ? `0 25px 50px ${alpha(theme.orange.main, 0.3)}`
                : '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="blog-card"
          >
            {/* Featured Image */}
            {blog.featuredImage && (
              <Box 
                sx={{
                  height: compact ? 160 : 200,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="blog-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                />
                
                {/* Gradient Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)'
                  }}
                />

                {/* Reading Time Badge */}
                <Chip
                  label={`${getReadingTime(blog.content)} min read`}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    color: theme.orange.dark,
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />

                {/* Category Badge */}
                {blog.categories?.[0] && (
                  <Chip
                    label={blog.categories[0]}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: theme.gradient.button,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              </Box>
            )}

            <CardContent sx={{ p: 3, pb: 2 }}>
              {/* Author & Date */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: theme.gradient.button,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {blog.author?.username?.charAt(0) || 'U'}
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight={600} color="text.primary">
                      {blog.author?.username || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Quick Actions */}
                <Box className="blog-actions" sx={{ opacity: 0, transform: 'translateY(10px)', transition: 'all 0.3s ease' }}>
                  <IconButton 
                    size="small" 
                    onClick={handleBookmark}
                    sx={{
                      color: isBookmarked ? theme.orange.main : 'text.secondary',
                      '&:hover': {
                        background: alpha(theme.orange.main, 0.1),
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Box>
              </Box>

              {/* Title */}
              <Typography 
                variant="h6" 
                fontWeight={800} 
                sx={{
                  mb: 1.5,
                  background: theme.gradient.hero,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.3,
                  fontSize: compact ? '1rem' : '1.1rem',
                  minHeight: compact ? 'auto' : '52px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {blog.title}
              </Typography>

              {/* Content Preview */}
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{
                  mb: 2,
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: compact ? 2 : 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: compact ? '40px' : '60px'
                }}
              >
                {formatContent(blog.content)}
              </Typography>

              {/* Categories */}
              {blog.categories && blog.categories.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {blog.categories.slice(0, 2).map((cat, index) => (
                    <Zoom in timeout={400} style={{ transitionDelay: `${index * 100}ms` }} key={cat}>
                      <Chip 
                        label={cat} 
                        size="small"
                        sx={{ 
                          background: alpha(theme.purple.main, 0.1),
                          color: theme.purple.dark,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 24,
                          '&:hover': {
                            background: alpha(theme.purple.main, 0.2),
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      />
                    </Zoom>
                  ))}
                  {blog.categories.length > 2 && (
                    <Chip 
                      label={`+${blog.categories.length - 2}`} 
                      size="small"
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: 24,
                        borderColor: theme.orange.main,
                        color: theme.orange.main
                      }}
                    />
                  )}
                </Box>
              )}

              {/* Engagement Stats */}
              <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    pt: 1.5,
    borderTop: `1px solid ${alpha(theme.orange.main, 0.1)}`
  }}>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          cursor: 'pointer',
          '&:hover': {
            '& .like-icon': {
              transform: 'scale(1.2)',
              color: theme.orange.main
            }
          }
        }}
        onClick={handleLike}
      >
        <Favorite 
          className="like-icon"
          fontSize="small" 
          sx={{ 
            color: isLiked ? '#ff4444' : 'text.secondary',
            transition: 'all 0.2s ease'
          }} 
        />
        <Typography 
          variant="caption" 
          fontWeight={600}
          sx={{ color: isLiked ? '#ff4444' : 'text.secondary' }}
        >
          {likeCount > 1000 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount} {/* Format large numbers */}
        </Typography>
      </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Visibility fontSize="small" sx={{ color: 'text.secondary' }} />
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          {blog.views > 1000 ? `${(blog.views / 1000).toFixed(1)}k` : (blog.views || 0)}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Comment fontSize="small" sx={{ color: 'text.secondary' }} />
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          {Array.isArray(blog.comments) ? blog.comments.length : (blog.comments || 0)}
        </Typography>
      </Box>
    </Box>

                {/* Read More Indicator */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    opacity: isHovered ? 1 : 0.7,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography variant="caption" fontWeight={700} color={theme.orange.main}>
                    Read More
                  </Typography>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: theme.gradient.button,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.7rem',
                      transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    →
                  </Box>
                </Box>
              </Box>
            </CardContent>

            {/* Hover Effect Border */}
            {isHovered && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  border: `2px solid ${theme.orange.main}`,
                  borderRadius: 4,
                  pointerEvents: 'none',
                  animation: 'pulse 2s infinite'
                }}
              />
            )}
          </Card>
        </Link>

        {/* Custom Animations */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
            }
          }
        `}</style>
      </Box>
    </Fade>
  );
};

export default BlogCard;