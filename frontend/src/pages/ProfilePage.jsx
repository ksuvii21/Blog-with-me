import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBlogs } from '../redux/slices/blogSlice';
import { updateProfile } from '../redux/slices/authSlice';
import { uploadImage } from '../utils/cloudinary';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const { blogs, isLoading: blogsLoading } = useSelector((state) => state.blogs);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    profilePicture: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
      });
      setImagePreview(user.profilePicture || '');
      if (blogs.length === 0) {
        dispatch(fetchBlogs());
      }
    }
  }, [user, blogs.length, dispatch, navigate]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setError('');
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, profilePicture: imageUrl }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        setError('Failed to upload image');
      }
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    setError('');
    setIsUploading(true);
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (err) {
      setError(err || 'Failed to update profile');
    }
    setIsUploading(false);
  };

  if (authLoading) return <LoadingSpinner />;

  if (!user) return null;

  const userBlogs = blogs.filter((blog) => blog.author._id === user._id);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <img
                src={imagePreview || '/default-avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
              />
              {isEditing && (
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="mt-2"
                />
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Username"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Bio"
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="3"
                    maxLength="500"
                  />
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isUploading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  {error && <p className="text-red-500">{error}</p>}
                </form>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
                  <p className="text-gray-600">{user.email}</p>
                  <span className={`px-2 py-1 rounded text-sm ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                  <p className="mt-2 text-gray-700">{user.bio || 'No bio yet.'}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-orange-50 p-4 rounded">
              <h3 className="text-lg font-semibold text-orange-800">Blogs</h3>
              <p className="text-2xl font-bold text-orange-600">{userBlogs.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="text-lg font-semibold text-purple-800">Followers</h3>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-lg font-semibold text-gray-800">Following</h3>
              <p className="text-2xl font-bold text-gray-600">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Blogs</h2>
          {blogsLoading ? (
            <LoadingSpinner />
          ) : userBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No blogs yet"
              description="Get started by creating your first blog post."
              actionText="Create Blog"
              actionLink="/create"
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
