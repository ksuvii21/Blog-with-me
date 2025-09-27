import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../redux/slices/authSlice';
import { fetchBlogs } from '../redux/slices/blogSlice';
import { uploadImage } from '../utils/cloudinary';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { blogs, isLoading: blogsLoading } = useSelector((state) => state.blogs);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (blogs.length === 0) {
      dispatch(fetchBlogs());
    }
  }, [user, blogs.length, dispatch, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    try {
      let profilePicture = user.profilePicture;
      if (selectedFile) {
        profilePicture = await uploadImage(selectedFile);
      }
      const updatedData = { ...formData, profilePicture };
      await dispatch(updateProfile(updatedData)).unwrap();
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  const userBlogs = blogs.filter((blog) => blog.author._id === user?._id);

  if (!user) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
        <img
          src={previewUrl || user.profilePicture || "https://via.placeholder.com/120"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-700 mt-2">{user.bio || 'No bio available'}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            {user.role}
          </span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>
          <button
            type="submit"
            disabled={uploadLoading}
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {uploadLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}

      {/* Error Display */}
      {authError && <p className="text-red-500 mb-4">{authError}</p>}

      {/* User's Blogs */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Blogs ({userBlogs.length})</h2>
        {blogsLoading ? (
          <LoadingSpinner />
        ) : userBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <EmptyState message="You haven't created any blogs yet." actionText="Create your first blog" actionLink="/create" />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
