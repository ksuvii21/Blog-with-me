import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment, likeComment, deleteComment } from '../redux/slices/commentSlice';

const CommentSection = ({ blogId }) => {
  const dispatch = useDispatch();
  const { comments, isLoading } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    dispatch(fetchComments(blogId));
  }, [dispatch, blogId]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      dispatch(addComment({ blogId, content: newComment, parentComment: null }));
      setNewComment('');
    }
  };

  const handleAddReply = (parentId) => {
    if (replyText.trim()) {
      dispatch(addComment({ blogId, content: replyText, parentComment: parentId }));
      setReplyText('');
      setReplyTo(null);
    }
  };

  const handleLike = (commentId) => {
    dispatch(likeComment(commentId));
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(commentId));
    }
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment._id} className={`${isReply ? 'ml-8' : ''} mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg`}>
      <div className="flex items-start space-x-3">
        <img src={comment.author.profilePicture || '/default-avatar.png'} alt={comment.author.username} className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white">{comment.author.username}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={() => handleLike(comment._id)}
              className={`flex items-center space-x-1 text-sm ${
                comment.likes.includes(user?._id) ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              } hover:text-red-600 dark:hover:text-red-400`}
            >
              <svg className="w-4 h-4" fill={comment.likes.includes(user?._id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{comment.likes.length}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyTo(comment._id)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Reply
              </button>
            )}
            {(user?._id === comment.author._id || user?.role === 'admin') && (
              <button
                onClick={() => handleDelete(comment._id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>
          {replyTo === comment._id && (
            <div className="mt-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white"
                rows="2"
                placeholder="Write a reply..."
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleAddReply(comment._id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Reply
                </button>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-gray-500 dark:text-gray-400 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Comments</h3>
      {user ? (
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            rows="4"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-6">Please login to comment.</p>
      )}
      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading comments...</p>
      ) : (
        <div>
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
