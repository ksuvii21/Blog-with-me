import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BlogEditor from '../components/BlogEditor';

const CreateBlogPage = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <BlogEditor onSave={handleSave} />
    </Layout>
  );
};

export default CreateBlogPage;
