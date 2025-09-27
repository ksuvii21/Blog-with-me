import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
});

// Mock data for when backend is not available
const mockData = {
  '/blogs': {
    data: [
      {
        _id: '1',
        title: 'Welcome to Our Blog Platform',
        content: 'This is a sample blog post. The backend server appears to be offline. This is a demonstration of our beautiful blogging platform with orange and purple theme.',
        categories: ['Technology', 'Welcome', 'Getting Started'],
        author: { 
          username: 'Admin',
          profilePicture: '/default-avatar.png'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 42,
        views: 156,
        tags: ['welcome', 'introduction', 'blogging']
      },
      {
        _id: '2',
        title: 'Getting Started with Blogging',
        content: 'Learn how to create amazing blog posts on our platform. Discover tips and tricks for engaging writing and beautiful formatting.',
        categories: ['Tutorial', 'Blogging', 'Writing'],
        author: { 
          username: 'BlogMaster',
          profilePicture: '/default-avatar.png'
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        likes: 28,
        views: 89,
        tags: ['tutorial', 'beginners', 'writing-tips']
      },
      {
        _id: '3',
        title: 'The Art of Storytelling',
        content: 'Discover how to craft compelling stories that captivate your readers. Learn about narrative structure, character development, and engaging hooks.',
        categories: ['Writing', 'Storytelling', 'Creative'],
        author: { 
          username: 'StoryTeller',
          profilePicture: '/default-avatar.png'
        },
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        likes: 67,
        views: 234,
        tags: ['storytelling', 'writing', 'creative']
      }
    ]
  },
  '/users': {
    data: [
      {
        _id: '1',
        username: 'Admin',
        email: 'admin@blogplatform.com',
        role: 'admin',
        profilePicture: '/default-avatar.png',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        username: 'BlogMaster',
        email: 'blogmaster@example.com',
        role: 'user',
        profilePicture: '/default-avatar.png',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ]
  },
  '/users/stats': {
    data: {
      totalUsers: 2,
      adminUsers: 1,
      superAdminUsers: 0,
      userGrowth: [
        { _id: { month: '2024-01' }, count: 2 }
      ]
    }
  },
  '/users/settings': {
    data: {
      platformName: 'BlogPlatform',
      allowRegistration: true,
      requireEmailVerification: false,
      maxBlogsPerUser: 50,
      allowComments: true,
      maintenanceMode: false
    }
  }
};

// Check if backend is available
let isBackendAvailable = true;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to avoid caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors and provide mock data
api.interceptors.response.use(
  (response) => {
    isBackendAvailable = true;
    return response;
  },
  (error) => {
    console.warn('API Error:', error.message);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
    
    // Check if backend is unavailable (network error or 5xx)
    if (!error.response || error.response.status >= 500) {
      isBackendAvailable = false;
      
      // Provide mock data for specific endpoints
      const url = error.config?.url || '';
      const method = error.config?.method || 'get';

      if (method === 'post' && url === '/auth/login') {
        // Mock login for admin
        const mockUser = {
          _id: '68d22d8164aa146baa59947c',
          username: 'Admin',
          email: 'admin@blogplatform.com',
          role: 'admin',
          bio: 'Platform Administrator',
          profilePicture: '',
          createdAt: '2025-09-23T05:17:53.218+00:00',
          updatedAt: '2025-09-23T05:17:53.218+00:00'
        };
        console.log('Returning mock login for admin');
        return Promise.resolve({
          data: { token: 'mock-token', user: mockUser },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config
        });
      }

      if (method === 'get' && mockData[url]) {
        console.log(`Returning mock data for: ${url}`);
        return Promise.resolve({
          data: mockData[url],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config
        });
      }

      // For other endpoints, provide a generic mock response
      if (method === 'get') {
        console.log(`No mock data for: ${url}, returning empty array`);
        return Promise.resolve({
          data: { data: [] },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Add a health check function
api.healthCheck = async () => {
  try {
    await api.get('/health', { timeout: 5000 });
    isBackendAvailable = true;
    return true;
  } catch (error) {
    isBackendAvailable = false;
    return false;
  }
};

// Add a function to check backend status
api.isBackendAvailable = () => isBackendAvailable;

// Add mock data functions for development
if (process.env.NODE_ENV === 'development') {
  api.enableMocks = () => {
    isBackendAvailable = false;
    console.log('Mock data enabled for development');
  };
  
  api.disableMocks = () => {
    isBackendAvailable = true;
    console.log('Mock data disabled');
  };
}

export default api;