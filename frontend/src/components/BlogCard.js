import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlog } from '../redux/slices/blogSlice';

const BlogCard = ({ blog }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLike = () => {
    if (user) {
      dispatch(likeBlog(blog._id));
    } else {
      alert('Please login to like blogs.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {blog.featuredImage && (
        <img src={blog.featuredImage} alt={blog.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <Link to={`/blogs/${blog._id}`} className="text-xl font-semibold text-indigo-600 hover:underline">
          {blog.title}
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">{blog.summary || blog.content.substring(0, 100) + '...'}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-2">
            {blog.categories.map((cat) => (
              <span key={cat} className="text-xs bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 rounded-full px-2 py-1">
                {cat}
              </span>
            ))}
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 text-sm font-medium ${
              blog.likes.includes(user?._id) ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            } hover:text-red-600 dark:hover:text-red-400 focus:outline-none`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={blog.likes.includes(user?._id) ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            <span>{blog.likes.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
