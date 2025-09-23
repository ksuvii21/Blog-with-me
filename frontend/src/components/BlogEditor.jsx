// components/BlogEditor.jsx
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const BlogEditor = ({ content, setContent }) => {
  return (
    <ReactQuill
      value={content}
      onChange={setContent}
      modules={modules}
      theme="snow"
      style={{ height: '400px', marginBottom: '50px' }}
    />
  );
};

export default BlogEditor;