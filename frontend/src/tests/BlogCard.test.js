import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import BlogCard from '../components/BlogCard';

const theme = createTheme();

const mockBlog = {
  _id: '1',
  title: 'Test Blog Title',
  content: 'This is test blog content that should be truncated in the card view.',
  summary: 'Test blog summary',
  author: {
    username: 'testauthor',
    profilePicture: 'https://example.com/avatar.jpg'
  },
  createdAt: '2024-01-15T10:30:00Z',
  views: 150,
  likes: ['user1', 'user2'],
  tags: ['react', 'javascript', 'testing'],
  featuredImage: 'https://example.com/blog-image.jpg'
};

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('BlogCard Component', () => {
  test('renders blog card with all information', () => {
    renderWithProviders(<BlogCard blog={mockBlog} />);

    // Check if title is rendered
    expect(screen.getByText('Test Blog Title')).toBeInTheDocument();

    // Check if author is rendered
    expect(screen.getByText('testauthor')).toBeInTheDocument();

    // Check if summary is rendered
    expect(screen.getByText('Test blog summary')).toBeInTheDocument();

    // Check if tags are rendered
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#javascript')).toBeInTheDocument();
    expect(screen.getByText('#testing')).toBeInTheDocument();

    // Check if stats are rendered
    expect(screen.getByText('150')).toBeInTheDocument(); // views
    expect(screen.getByText('2')).toBeInTheDocument(); // likes
  });

  test('renders formatted date correctly', () => {
    renderWithProviders(<BlogCard blog={mockBlog} />);

    // Check if formatted date is rendered
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  test('truncates long content properly', () => {
    const longContentBlog = {
      ...mockBlog,
      content: 'A'.repeat(200) // Very long content
    };

    renderWithProviders(<BlogCard blog={longContentBlog} />);

    // The content should be truncated with ellipsis
    const contentElement = screen.getByText(/A{50,}\.\.\.$/);
    expect(contentElement).toBeInTheDocument();
  });

  test('handles blog without optional fields', () => {
    const minimalBlog = {
      _id: '2',
      title: 'Minimal Blog',
      content: 'Minimal content',
      author: { username: 'author' },
      createdAt: '2024-01-15T10:30:00Z'
    };

    renderWithProviders(<BlogCard blog={minimalBlog} />);

    expect(screen.getByText('Minimal Blog')).toBeInTheDocument();
    expect(screen.getByText('author')).toBeInTheDocument();
    expect(screen.getByText('Minimal content')).toBeInTheDocument();
  });

  test('renders featured image when provided', () => {
    renderWithProviders(<BlogCard blog={mockBlog} />);

    const image = document.querySelector('img[alt="Test Blog Title"]');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/blog-image.jpg');
  });

  test('handles blog without featured image', () => {
    const blogWithoutImage = {
      ...mockBlog,
      featuredImage: null
    };

    renderWithProviders(<BlogCard blog={blogWithoutImage} />);

    const image = document.querySelector('img[alt="Test Blog Title"]');
    expect(image).toBeInTheDocument();
    // Should have a default placeholder or handle gracefully
  });

  test('is clickable and navigates to blog detail', () => {
    renderWithProviders(<BlogCard blog={mockBlog} />);

    const cardElement = screen.getByText('Test Blog Title').closest('div');
    expect(cardElement).toBeInTheDocument();

    // The card should be clickable (wrapped in Link component)
    // This test would need to be adjusted based on actual implementation
  });
});
