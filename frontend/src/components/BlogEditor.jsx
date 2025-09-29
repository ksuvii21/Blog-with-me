import React, { useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Typography,
  LinearProgress,
  Zoom,
  Fade,
  alpha
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { uploadImage } from '../utils/cloudinary';

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

const BlogEditor = ({ content, setContent, wordCount = 0 }) => {
  const quillRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        const position = range?.index || 0;

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        // Insert placeholder
        quill.insertEmbed(position, 'text', '📸 Uploading image...', 'user');
        
        const imageUrl = await uploadImage(file);
        
        clearInterval(progressInterval);
        setUploadProgress(100);

        if (imageUrl) {
          // Remove placeholder and insert image
          quill.deleteText(position, '📸 Uploading image...'.length);
          quill.insertEmbed(position, 'image', imageUrl);
          quill.setSelection(position + 1);
          
          // Add success animation
          setTimeout(() => {
            const imageElement = document.querySelector(`img[src="${imageUrl}"]`);
            if (imageElement) {
              imageElement.style.transform = 'scale(1.05)';
              imageElement.style.transition = 'transform 0.3s ease';
              setTimeout(() => {
                imageElement.style.transform = 'scale(1)';
              }, 300);
            }
          }, 100);
        } else {
          quill.deleteText(position, '📸 Uploading image...'.length);
          quill.insertText(position, '❌ Upload failed. Please try again.', { color: '#ff4444' });
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.deleteText(range.index, '📸 Uploading image...'.length);
        quill.insertText(range.index, '❌ Upload failed. Please try again.', { color: '#ff4444' });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['undo', 'redo']
      ],
      handlers: {
        image: imageHandler,
        undo: () => {
          const quill = quillRef.current.getEditor();
          quill.history.undo();
        },
        redo: () => {
          const quill = quillRef.current.getEditor();
          quill.history.redo();
        }
      }
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align',
    'undo', 'redo'
  ];



  return (
    <Zoom in timeout={800}>
      <Box sx={{ position: 'relative' }}>
        {/* Editor Stats */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          p: 2,
          borderRadius: 2,
          background: themeColors.gradient.card,
          border: `1px solid ${alpha(themeColors.orange.main, 0.2)}`
        }}>
          <Typography variant="h6" fontWeight={700} sx={{
            background: themeColors.gradient.button,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ✨ Rich Text Editor
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={800} color={themeColors.orange.main}>
                {wordCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Words
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={800} color={themeColors.purple.main}>
                {Math.ceil(wordCount / 200)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Min Read
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* React Quill Editor */}
        <Box sx={{
          '& .blog-editor': {
            border: `2px solid ${alpha(themeColors.orange.main, 0.2)}`,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:focus-within': {
              borderColor: themeColors.orange.main,
              boxShadow: `0 8px 32px ${alpha(themeColors.orange.main, 0.2)}`
            }
          },
          '& .ql-container': {
            fontFamily: 'inherit',
            fontSize: '16px',
            lineHeight: 1.6,
            border: 'none',
            minHeight: '400px',
            background: 'white'
          },
          '& .ql-editor': {
            minHeight: '400px',
            padding: '24px',
            '&.ql-blank::before': {
              color: alpha('#000', 0.4),
              fontStyle: 'normal',
              fontSize: '16px'
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: '1.5em',
              marginBottom: '0.5em',
              fontWeight: 700
            },
            '& h1': {
              color: themeColors.orange.dark,
              fontSize: '2.5rem'
            },
            '& h2': {
              color: themeColors.purple.dark,
              fontSize: '2rem'
            },
            '& h3': {
              color: themeColors.orange.main,
              fontSize: '1.5rem'
            },
            '& blockquote': {
              borderLeft: `4px solid ${themeColors.orange.main}`,
              background: alpha(themeColors.orange.main, 0.05),
              padding: '16px 20px',
              margin: '20px 0',
              borderRadius: '0 8px 8px 0',
              fontStyle: 'italic'
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              margin: '20px auto',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
              }
            },
            '& pre': {
              background: alpha(themeColors.purple.main, 0.05),
              border: `1px solid ${alpha(themeColors.purple.main, 0.1)}`,
              borderRadius: '8px',
              padding: '16px',
              overflow: 'auto',
              fontFamily: 'Monaco, Consolas, monospace'
            },
            '& a': {
              color: themeColors.orange.main,
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': {
                textDecoration: 'underline'
              }
            },
            '& ul, & ol': {
              paddingLeft: '24px'
            },
            '& li': {
              marginBottom: '8px'
            }
          },
          '& .ql-toolbar.ql-snow': {
            border: 'none',
            borderBottom: `1px solid ${alpha(themeColors.orange.main, 0.1)}`,
            background: themeColors.gradient.card,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3
          }
        }}>
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            theme="snow"
            className="blog-editor"
            placeholder="Start writing your amazing story... ✍️"
          />
        </Box>

        {/* Editor Tips */}
        <Fade in timeout={1000}>
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            borderRadius: 2,
            background: alpha(themeColors.purple.main, 0.05),
            border: `1px solid ${alpha(themeColors.purple.main, 0.1)}`
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              💡 <strong>Pro Tip:</strong> Use headers for structure, images for visual appeal, and code blocks for technical content. 
              Your content automatically saves as you type!
            </Typography>
          </Box>
        </Fade>
      </Box>
    </Zoom>
  );
};

export default BlogEditor;