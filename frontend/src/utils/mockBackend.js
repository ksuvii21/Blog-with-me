// src/utils/mockBackend.js
export const mockBackend = {
  blogs: [
    {
      _id: '1',
      title: 'Welcome to Our Blog Platform',
      content: 'This is a fully functional blogging platform with orange and purple theme...',
      categories: ['Technology', 'Welcome'],
      author: { username: 'Admin', profilePicture: '/default-avatar.png' },
      createdAt: new Date().toISOString(),
      likes: 42,
      views: 156,
      comments: [
        { user: 'Reader1', text: 'Great platform!', createdAt: new Date().toISOString() }
      ]
    }
  ],
  users: []
};