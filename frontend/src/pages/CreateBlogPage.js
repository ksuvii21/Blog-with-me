import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createBlog } from '../redux/slices/blogSlice';
import { uploadImage } from '../utils/cloudinary';
import Layout from '../components/Layout';
import BlogEditor from '../components/BlogEditor';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Box,
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Fade,
  Zoom,
  Divider,
  Paper
} from '@mui/material';
import {
  Edit,
  AddPhotoAlternate,
  Delete,
  Category,
  Schedule,
  AutoStories,
  RocketLaunch
} from '@mui/icons-material';

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

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const predefinedCategories = [
    'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business',
    'Education', 'Entertainment', 'Sports', 'Science', 'Art', 'Music',
    'Photography', 'Writing', 'Personal Development', 'Finance'
  ];

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (title || content) {
        localStorage.setItem('blogDraft', JSON.stringify({
          title,
          content,
          categories,
          featuredImage,
          timestamp: Date.now()
        }));
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [title, content, categories, featuredImage]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('blogDraft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        if (Date.now() - parsedDraft.timestamp < 24 * 60 * 60 * 1000) {
          setTitle(parsedDraft.title || '');
          setContent(parsedDraft.content || '');
          setCategories(parsedDraft.categories || []);
          setFeaturedImage(parsedDraft.featuredImage || '');
          setImagePreview(parsedDraft.featuredImage || '');
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Calculate word count and reading time
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setReadingTime(Math.ceil(words.length / 200));
  }, [content]);

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
      alert('Please log in to create a blog');
      return;
    }

    try {
      const blogData = {
        title: title.trim(),
        content,
        categories,
        featuredImage,
        author: user._id
      };

      await dispatch(createBlog(blogData)).unwrap();
      localStorage.removeItem('blogDraft');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save blog:', error);
      alert('Failed to save blog. Please try again.');
    }
  };

  if (!user) {
    return (
      <Layout>
        <Container maxWidth="md">
          <Box textAlign="center" py={12}>
            <Typography variant="h3" fontWeight="800" gutterBottom>
              Please Log In
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You need to be logged in to create a blog post.
            </Typography>
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                background: themeColors.gradient.button,
                borderRadius: 3,
                px: 6,
                py: 1.5,
                fontWeight: 600
              }}
            >
              Go to Login
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <RocketLaunch sx={{ fontSize: 60, color: themeColors.orange.main, mb: 2 }} />
              <Typography variant="h2" fontWeight="900" sx={{
                background: themeColors.gradient.hero,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}>
                Create Your Masterpiece
              </Typography>
              <Typography variant="h5" color="text.secondary">
                Share your story with the world
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {/* Main Editor */}
            <Grid item xs={12} lg={8}>
              <Card sx={{
                p: 4,
                borderRadius: 4,
                background: 'white',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                border: `1px solid ${themeColors.orange.light}20`
              }}>
                {error && (
                  <Paper sx={{ 
                    p: 2, 
                    mb: 3, 
                    background: '#ff444410',
                    border: `1px solid #ff444430`
                  }}>
                    <Typography color="error">{error}</Typography>
                  </Paper>
                )}

                {/* Title Input */}
                <TextField
                  fullWidth
                  label="Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Craft an engaging title that captures attention..."
                  sx={{ mb: 4 }}
                  InputProps={{
                    sx: {
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.orange.main,
                      },
                    }
                  }}
                />

                {/* Featured Image */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Featured Image
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      component="label"
                      startIcon={<AddPhotoAlternate />}
                      variant="outlined"
                      disabled={isUploading}
                      sx={{
                        borderColor: themeColors.purple.main,
                        color: themeColors.purple.main,
                        fontWeight: 600
                      }}
                    >
                      {isUploading ? 'Uploading...' : 'Choose Image'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    {imagePreview && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                        />
                        <IconButton
                          onClick={() => {
                            setFeaturedImage('');
                            setImagePreview('');
                          }}
                          sx={{ color: '#ff4444' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Categories */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    <Category sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Categories
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Select Category</InputLabel>
                        <Select
                          value={selectedCategory}
                          label="Select Category"
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          {predefinedCategories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        onClick={handleAddCategoryFromDropdown}
                        disabled={!selectedCategory}
                        variant="contained"
                        sx={{
                          background: themeColors.gradient.button,
                          fontWeight: 600
                        }}
                      >
                        Add Category
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Custom Category"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                        placeholder="Or add a custom category..."
                      />
                      <Button
                        onClick={handleAddCategory}
                        disabled={!categoryInput.trim()}
                        variant="outlined"
                        sx={{
                          borderColor: themeColors.purple.main,
                          color: themeColors.purple.main,
                          fontWeight: 600
                        }}
                      >
                        Add Custom
                      </Button>
                    </Box>

                    {/* Selected Categories */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          onDelete={() => handleRemoveCategory(category)}
                          sx={{
                            background: themeColors.gradient.card,
                            color: themeColors.purple.dark,
                            fontWeight: 600,
                            '& .MuiChip-deleteIcon': {
                              color: themeColors.purple.main
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Stack>
                </Box>

                {/* Content Editor */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    <Edit sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Your Story
                  </Typography>
                  <BlogEditor content={content} setContent={setContent} />
                </Box>

                {/* Stats */}
                <Paper sx={{ 
                  p: 3, 
                  background: themeColors.gradient.card,
                  borderRadius: 3
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color={themeColors.orange.dark}>
                        {wordCount} words
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total words
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700} color={themeColors.purple.dark}>
                        {readingTime} min read
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reading time
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Auto-saving draft...
                    </Typography>
                  </Box>
                </Paper>
              </Card>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                {/* Publish Card */}
                <Card sx={{
                  p: 3,
                  borderRadius: 3,
                  background: themeColors.gradient.card,
                  border: `2px solid ${themeColors.orange.light}20`
                }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Ready to Publish?
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Share your amazing story with our community of readers and writers.
                  </Typography>
                  <Button
                    fullWidth
                    onClick={handleSave}
                    disabled={isLoading || !title.trim() || !content.trim()}
                    startIcon={<AutoStories />}
                    variant="contained"
                    sx={{
                      background: themeColors.gradient.button,
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255, 152, 0, 0.4)'
                      }
                    }}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Publish Story'}
                  </Button>
                </Card>

                {/* Tips Card */}
                <Card sx={{
                  p: 3,
                  borderRadius: 3,
                  background: themeColors.gradient.card
                }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom color={themeColors.purple.dark}>
                    Writing Tips
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      'Craft a compelling title',
                      'Use engaging featured images',
                      'Add relevant categories',
                      'Write clear, concise content',
                      'Proofread before publishing'
                    ].map((tip, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: themeColors.orange.main
                        }} />
                        <Typography variant="body2">{tip}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default CreateBlogPage;