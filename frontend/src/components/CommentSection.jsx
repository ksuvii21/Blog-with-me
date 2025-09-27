// components/CommentsSection.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../redux/slices/blogSlice';
import { Box, TextField, Button, Typography, Avatar, Paper, Divider } from '@mui/material';

const CommentSection = ({ blogId, comments }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await dispatch(addComment({ blogId, comment: commentText })).unwrap();
        setCommentText('');
      } catch (error) {
        console.error('Failed to add comment:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Comments ({comments?.length || 0})
      </Typography>

      {isAuthenticated && user ? (
        <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={user.profilePicture || '/default-avatar.png'}
              alt={user.username}
              sx={{ mr: 2 }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {user.username}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!commentText.trim() || isSubmitting}
              sx={{ borderRadius: 2 }}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        </Paper>
      ) : (
        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Please <a href="/login" style={{ color: 'primary.main', textDecoration: 'none' }}>login</a> to join the conversation
          </Typography>
        </Paper>
      )}

      <Box>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <Box key={comment._id || index}>
              <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar
                    src={comment.author?.profilePicture || '/default-avatar.png'}
                    alt={comment.author?.username || comment.user}
                    sx={{ mr: 2, width: 32, height: 32 }}
                  />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {comment.author?.username || comment.user}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ ml: 6 }}>
                  {comment.text || comment.comment}
                </Typography>
              </Paper>
              {index < comments.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))
        ) : (
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="body1" color="text.secondary">
              No comments yet. Be the first to share your thoughts!
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default CommentsSection;
