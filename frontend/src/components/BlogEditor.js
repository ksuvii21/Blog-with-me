import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { createBlog, updateBlog } from '../redux/slices/blogSlice';
import axios from 'axios';
import { Box, Paper, TextField, Button, Typography, Stack, Fade, Chip, CircularProgress } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const BlogEditor = ({ blog, onSave }) => {
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [summary, setSummary] = useState(blog?.summary || '');
  const [categories, setCategories] = useState(blog?.categories?.join(', ') || '');
  const [tags, setTags] = useState(blog?.tags?.join(', ') || '');
  const [featuredImage, setFeaturedImage] = useState(blog?.featuredImage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [autosaveMsg, setAutosaveMsg] = useState('');
  const quillRef = useRef(null);
  const dispatch = useDispatch();

  // Drag-and-drop image upload
  useEffect(() => {
    const quill = quillRef.current && quillRef.current.getEditor();
    if (!quill) return;
    const editor = quill.root;
    const handleDrop = async (e) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          const url = await handleImageUpload(file);
          if (url) {
            const range = quill.getSelection() || { index: quill.getLength() };
            quill.insertEmbed(range.index, 'image', url);
          }
        }
      }
    };
    editor.addEventListener('drop', handleDrop);
    return () => editor.removeEventListener('drop', handleDrop);
  }, []);

  // Autosave to localStorage every 5s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        localStorage.setItem('blogDraft', JSON.stringify({ title, content, summary, categories, tags, featuredImage }));
        setAutosaveMsg('Draft autosaved');
        setTimeout(() => setAutosaveMsg(''), 1200);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [title, content, summary, categories, tags, featuredImage]);

  // Restore draft on mount
  useEffect(() => {
    if (!blog) {
      const draft = localStorage.getItem('blogDraft');
      if (draft) {
        const d = JSON.parse(draft);
        setTitle(d.title || '');
        setContent(d.content || '');
        setSummary(d.summary || '');
        setCategories(d.categories || '');
        setTags(d.tags || '');
        setFeaturedImage(d.featuredImage || '');
      }
    }
  }, [blog]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/blogs/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const url = await handleImageUpload(file);
        if (url) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', url);
        }
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      },
      // Floating toolbar
      // Quill's toolbar is already floating on scroll, but we can add a sticky effect
    },
  };

  const handleSave = async () => {
    setIsLoading(true);
    const blogData = {
      title,
      content,
      summary,
      categories: categories.split(',').map(cat => cat.trim()),
      tags: tags.split(',').map(tag => tag.trim()),
      featuredImage,
    };

    try {
      if (blog) {
        await dispatch(updateBlog({ id: blog._id, ...blogData }));
      } else {
        await dispatch(createBlog(blogData));
      }
      onSave && onSave();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fade in timeout={700}>
      <Box maxWidth="md" mx="auto" py={4}>
        <Paper elevation={4} sx={{ p: { xs: 2, md: 5 }, borderRadius: 4 }}>
          <Typography variant="h4" fontWeight={800} mb={3} color="primary.main">
            {blog ? 'Edit Blog' : 'Create Blog'}
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
            <Box>
              <Typography fontWeight={600} mb={1}>Content</Typography>
              <Box sx={{ position: 'relative' }}>
                <ReactQuill
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  theme="snow"
                  className="dark:text-white"
                  style={{ minHeight: 200 }}
                />
                {/* Floating toolbar sticky effect */}
                <style>{`.ql-toolbar { position: sticky; top: 0; z-index: 10; background: #fff; }`}</style>
              </Box>
              <Button variant="text" size="small" sx={{ mt: 1 }} onClick={() => setShowPreview((v) => !v)}>
                {showPreview ? 'Hide Live Preview' : 'Show Live Preview'}
              </Button>
              {showPreview && (
                <Paper elevation={2} sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" color="text.secondary" mb={1}>Live Preview</Typography>
                  <Box className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                </Paper>
              )}
            </Box>
            <TextField
              label="Categories (comma-separated)"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              fullWidth
              placeholder="e.g., Technology, Programming"
            />
            <TextField
              label="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              fullWidth
              placeholder="e.g., React, JavaScript"
            />
            <TextField
              label="Featured Image URL"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              fullWidth
              placeholder="https://example.com/image.jpg"
            />
            <Button
              onClick={handleSave}
              disabled={isLoading}
              variant="contained"
              color="primary"
              size="large"
              startIcon={isLoading ? <CircularProgress size={20} /> : <AddCircleOutlineIcon />}
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              {isLoading ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
            </Button>
            {autosaveMsg && <Typography color="success.main" fontSize={13}>{autosaveMsg}</Typography>}
          </Stack>
        </Paper>
      </Box>
    </Fade>
  );
};

export default BlogEditor;
