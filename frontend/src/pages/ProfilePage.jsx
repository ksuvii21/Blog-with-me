import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { fetchBlogs } from '../redux/slices/blogSlice';
import { uploadImage } from '../utils/cloudinary';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { blogs, isLoading: blogsLoading } = useSelector((state) => state.blogs);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    profilePicture: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Initialize form data with current user info
    setFormData({
      username: user.username || '',
      bio: user.bio || '',
      profilePicture: user.profilePicture || ''
    });
    setImagePreview(user.profilePicture || '/default-avatar.png');

    // Fetch blogs if not already loaded
    if (blogs.length === 0) {
      dispatch(fetchBlogs());
    }
  }, [user, navigate, dispatch, blogs.length]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUpdateError('');
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
        setImagePreview(imageUrl);
      }
    } catch (error) {
      setUpdateError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');

    if (!formData.username.trim()) {
      setUpdateError('Username is required');
      return;
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
      // The auth slice will update the user state
    } catch (error) {
      setUpdateError(error || 'Failed to update profile');
    }
  };

  const userBlogs = blogs.filter(blog => blog.author && blog.author._id === user._id);

  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  const defaultAvatar = '/default-avatar.png';

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <img
                src={imagePreview || defaultAvatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2 text-sm text-gray-500"
                  disabled={isUploading}
                />
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{formData.username}</h1>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <p className="mt-4 text-gray-700">{formData.bio || 'No bio yet.'}</p>
            </div>
            <div className="flex-1 text-center md:text-right">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800">Your Stats</h3>
                <p className="text-2xl font-bold text-orange-600">{userBlogs.length}</p>
                <p className="text-sm text-orange-700">Blogs Published</p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <div className="mt-6 text-center md:text-right">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
            {updateError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{updateError}</p>
              </div>
            )}
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{authError}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                {isUploading && <LoadingSpinner size="sm" />}
                <p className="text-sm text-gray-500 mb-2">Current: {imagePreview ? 'Uploaded' : 'None'}</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || authLoading}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {authLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User's Blogs */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Blogs</h2>
          {blogsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : userBlogs.length === 0 ? (
            <EmptyState
              title="No Blogs Yet"
              message="You haven't published any blogs. Create your first one!"
              actionText="Create Blog"
              onAction={() => navigate('/create')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBlogs.map((blog) => (
                <div key={blog._id}>
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
