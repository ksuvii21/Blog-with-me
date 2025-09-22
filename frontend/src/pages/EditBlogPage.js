import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import BlogEditor from '../components/BlogEditor';
import { useSelector } from 'react-redux';
import axios from 'axios';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs } = useSelector((state) => state.blogs);
  const blog = blogs.find((b) => b._id === id);

  useEffect(() => {
    if (!blog) {
      // Fetch blog if not in state
      axios.get(`/api/blogs/${id}`).then((res) => {
        // Could dispatch to store if needed
      }).catch(() => {
        navigate('/');
      });
    }
  }, [id, blog, navigate]);

  const handleSave = () => {
    navigate(`/blogs/${id}`);
  };

  if (!blog) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 inline-block"></span>
          <p style={{ marginTop: 16, color: '#6b7280' }}>Loading blog...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BlogEditor blog={blog} onSave={handleSave} />
    </Layout>
  );
};

export default EditBlogPage;
