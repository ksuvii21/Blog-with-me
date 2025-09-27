import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBlogs } from '../redux/slices/blogSlice';
import { updateProfile } from '../redux/slices/authSlice';
import { uploadImage } from '../utils/cloudinary';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const { user, isLoading: authLoading, error: authError } = useSelector(state => state.auth);
  const { blogs, isLoading: blogLoading, error: blogError } = useSelector(state => state.blogs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (blogs.length === 0) {
      dispatch(fetchBlogs());
    }
  }, [user, blogs.length, dispatch, navigate]);

  const filteredBlogs = blogs.filter(blog => blog.author._id === user?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profilePicture = user?.profilePicture;
    if (avatarFile) {
      const url = await uploadImage(avatarFile);
      if (url) profilePicture = url;
    }
    dispatch(updateProfile({ ...formData, profilePicture }));
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (authLoading || blogLoading) {
    return <LoadingSpinner />;
  }

  if (authError || blogError) {
    return <div className="text-red-500 text-center">Error: {authError || blogError}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">My Profile</h1>

      {/* Profile Display */}
      <div className="flex items-center mb-6">
        <img
          src={user?.profilePicture || '/default-avatar.png'}
          alt="Avatar"
          className="w-24 h-24 rounded-full mr-6 border-2 border-orange-500"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{user?.username}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-500">{user?.bio || 'No bio yet.'}</p>
          <p className="text-sm text-orange-600 capitalize">{user?.role}</p>
          <p className="text-sm text-gray-500">{filteredBlogs.length} blogs</p>
        </div>
      </div>

      {/* Edit Toggle */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4"
      >
        {editMode ? 'Cancel Edit' : 'Edit Profile'}
      </button>

      {/* Edit Form */}
      {editMode && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* User's Blogs */}
      <h3 className="text-2xl font-bold text-purple-600 mb-4">My Blogs</h3>
      {filteredBlogs.length === 0 ? (
        <p className="text-gray-500">No blogs yet. <a href="/create" className="text-orange-500">Create one!</a></p>
      ) : (
        <div className="grid gap-4">
          {filteredBlogs.map(blog => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
