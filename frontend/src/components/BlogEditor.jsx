import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './BlogEditor.css';
import { uploadImage } from '../utils/cloudinary';

const BlogEditor = ({ content, setContent }) => {
  const quillRef = useRef(null);

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          // Show loading indicator
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertText(range.index, 'Uploading image...', 'bold', true);

          const imageUrl = await uploadImage(file);

          if (imageUrl) {
            // Remove loading text and insert image
            quill.deleteText(range.index, 'Uploading image...'.length);
            quill.insertEmbed(range.index, 'image', imageUrl);
            quill.setSelection(range.index + 1);
          } else {
            // Remove loading text and show error
            quill.deleteText(range.index, 'Uploading image...'.length);
            alert('Failed to upload image. Please try again.');
          }
        } catch (error) {
          console.error('Image upload failed:', error);
          alert('Failed to upload image. Please try again.');
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image', 'color', 'background', 'align'
  ];

  return (
    <div className="blog-editor">
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        theme="snow"
        style={{
          height: '500px',
          marginBottom: '50px'
        }}
        placeholder="Write your blog content here..."
      />
    </div>
  );
};

export default BlogEditor;
