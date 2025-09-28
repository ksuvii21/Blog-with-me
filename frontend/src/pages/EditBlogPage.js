import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateBlog, fetchBlogById } from '../redux/slices/blogSlice';
import { uploadImage } from '../utils/cloudinary';
import Layout from '../components/Layout';
import BlogEditor from '../components/BlogEditor';
import LoadingSpinner from '../components/LoadingSpinner';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBlog, isLoading, error } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Predefined categories
  const predefinedCategories = [
    'Technology',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Business',
    'Education',
    'Entertainment',
    'Sports',
    'Science',
    'Art',
    'Music',
    'Photography',
    'Writing',
    'Personal Development',
    'Finance',
    'Politics',
    'Environment',
    'Fashion',
    'Gaming'
  ];

  useEffect(() => {
    if (!currentBlog || currentBlog._id !== id) {
      dispatch(fetchBlogById(id));
    }
  }, [id, currentBlog, dispatch]);

  useEffect(() => {
    if (currentBlog && currentBlog._id === id) {
      setTitle(currentBlog.title || '');
      setContent(currentBlog.content || '');
      setCategories(currentBlog.categories || []);
      setFeaturedImage(currentBlog.featuredImage || '');
      setImagePreview(currentBlog.featuredImage || '');
    }
  }, [currentBlog, id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFeaturedImage(imageUrl);
      setImagePreview(imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput('');
    }
  };

  const handleAddCategoryFromDropdown = () => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setCategories([...categories, selectedCategory]);
      setSelectedCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!content.trim()) {
      alert('Please enter some content');
      return;
    }

    if (!user) {
      alert('Please log in to update the blog');
      return;
    }

    try {
      const blogData = {
        title: title.trim(),
        content,
        categories,
        featuredImage,
      };

      await dispatch(updateBlog({ blogId: id, blogData })).unwrap();

      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error('Failed to update blog:', error);
      alert('Failed to update blog. Please try again.');
    }
  };

  if (isLoading || !currentBlog) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      </Layout>
    );
  }

  // Check if user is authorized to edit
  if (!user || (user._id !== currentBlog.author._id && user.role !== 'admin')) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to edit this blog.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go Home
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Edit Blog</h1>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Update Blog'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
              required
            />
          </div>

          {/* Featured Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg cursor-pointer transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Change Image'}
              </label>
              {imagePreview && (
                <div className="flex items-center gap-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setFeaturedImage('');
                      setImagePreview('');
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="flex gap-2 mb-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">Select a category...</option>
                {predefinedCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddCategoryFromDropdown}
                disabled={!selectedCategory}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                placeholder="Or add a custom category..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleAddCategory}
                disabled={!categoryInput.trim()}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Add Custom
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {category}
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <BlogEditor content={content} setContent={setContent} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditBlogPage;
