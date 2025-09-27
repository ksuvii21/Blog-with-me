// components/BlogCard.jsx
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Favorite, Share, Visibility, Comment } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog, compact = false, theme }) => {
  return (
    <Link to={`/blogs/${blog._id}`} style={{ textDecoration: 'none' }}>
      <Card sx={{
        height: '100%',
        background: theme?.gradient || 'white',
        border: `1px solid ${theme?.primary || '#ccc'}20`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 30px ${theme?.primary || '#000'}20`
        }
      }} className="blog-card">
        <CardContent>
        <Typography variant="h6" fontWeight={600} color={theme?.primary}>
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ mt: 1, opacity: 0.8 }}>
          {compact ? `${blog.content.substring(0, 100)}...` : blog.content}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {blog.categories.map(cat => (
            <Chip 
              key={cat} 
              label={cat} 
              size="small"
              sx={{ 
                background: theme?.gradient,
                color: theme?.secondary,
                fontWeight: 600
              }}
            />
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: theme?.primary }}>
              <Favorite fontSize="small" />
              <Typography variant="body2">{blog.likes || 0}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', color: theme?.secondary }}>
              <Visibility fontSize="small" />
              <Typography variant="body2">{blog.views || 0}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', color: theme?.secondary }}>
              <Comment fontSize="small" />
              <Typography variant="body2">{blog.comments || 0}</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
    </Link>
  );
};

export default BlogCard;