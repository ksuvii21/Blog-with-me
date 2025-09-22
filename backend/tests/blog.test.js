const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Blog = require('../models/Blog');
const bcrypt = require('bcryptjs');

describe('Blog API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Blog.deleteMany({});

    // Create a test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });

    userId = user._id;

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    token = loginResponse.body.token;
  });

  describe('POST /api/blogs', () => {
    it('should create a new blog successfully', async () => {
      const blogData = {
        title: 'Test Blog Title',
        content: 'This is test blog content',
        summary: 'Test summary',
        categories: 'Technology,Programming',
        tags: 'javascript,nodejs,testing'
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogData)
        .expect(201);

      expect(response.body).toHaveProperty('title', 'Test Blog Title');
      expect(response.body).toHaveProperty('content', 'This is test blog content');
      expect(response.body).toHaveProperty('author', userId.toString());
      expect(response.body.categories).toEqual(['Technology', 'Programming']);
      expect(response.body.tags).toEqual(['javascript', 'nodejs', 'testing']);
    });

    it('should not create blog without authentication', async () => {
      const blogData = {
        title: 'Test Blog Title',
        content: 'This is test blog content'
      };

      const response = await request(app)
        .post('/api/blogs')
        .send(blogData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token, authorization denied');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/blogs', () => {
    beforeEach(async () => {
      // Create test blogs
      await Blog.create([
        {
          title: 'First Blog',
          content: 'First blog content',
          author: userId
        },
        {
          title: 'Second Blog',
          content: 'Second blog content',
          author: userId
        }
      ]);
    });

    it('should get all blogs', async () => {
      const response = await request(app)
        .get('/api/blogs')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('author');
    });

    it('should populate author information', async () => {
      const response = await request(app)
        .get('/api/blogs')
        .expect(200);

      expect(response.body[0].author).toHaveProperty('username', 'testuser');
    });
  });

  describe('GET /api/blogs/:id', () => {
    let blogId;

    beforeEach(async () => {
      const blog = await Blog.create({
        title: 'Test Blog',
        content: 'Test content',
        author: userId
      });
      blogId = blog._id;
    });

    it('should get blog by id', async () => {
      const response = await request(app)
        .get(`/api/blogs/${blogId}`)
        .expect(200);

      expect(response.body).toHaveProperty('title', 'Test Blog');
      expect(response.body).toHaveProperty('content', 'Test content');
    });

    it('should increment view count', async () => {
      const response1 = await request(app)
        .get(`/api/blogs/${blogId}`)
        .expect(200);

      expect(response1.body.views).toBe(1);

      const response2 = await request(app)
        .get(`/api/blogs/${blogId}`)
        .expect(200);

      expect(response2.body.views).toBe(2);
    });

    it('should return 404 for non-existent blog', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/blogs/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Blog not found');
    });
  });

  describe('PUT /api/blogs/:id', () => {
    let blogId;

    beforeEach(async () => {
      const blog = await Blog.create({
        title: 'Original Title',
        content: 'Original content',
        author: userId
      });
      blogId = blog._id;
    });

    it('should update blog successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      const response = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('title', 'Updated Title');
      expect(response.body).toHaveProperty('content', 'Updated content');
    });

    it('should not update blog without authentication', async () => {
      const updateData = {
        title: 'Updated Title'
      };

      const response = await request(app)
        .put(`/api/blogs/${blogId}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token, authorization denied');
    });

    it('should not update blog by non-author', async () => {
      // Create another user
      const otherUser = await User.create({
        username: 'otheruser',
        email: 'other@example.com',
        password: await bcrypt.hash('password123', 10)
      });

      const otherLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'other@example.com', password: 'password123' });

      const updateData = {
        title: 'Updated Title'
      };

      const response = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${otherLoginResponse.body.token}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Not authorized');
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    let blogId;

    beforeEach(async () => {
      const blog = await Blog.create({
        title: 'Test Blog',
        content: 'Test content',
        author: userId
      });
      blogId = blog._id;
    });

    it('should delete blog successfully', async () => {
      const response = await request(app)
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Blog removed');
    });

    it('should not delete blog without authentication', async () => {
      const response = await request(app)
        .delete(`/api/blogs/${blogId}`)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token, authorization denied');
    });
  });

  describe('POST /api/blogs/:id/like', () => {
    let blogId;

    beforeEach(async () => {
      const blog = await Blog.create({
        title: 'Test Blog',
        content: 'Test content',
        author: userId
      });
      blogId = blog._id;
    });

    it('should like blog successfully', async () => {
      const response = await request(app)
        .post(`/api/blogs/${blogId}/like`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('likes', 1);
    });

    it('should unlike blog when liked again', async () => {
      // Like first time
      await request(app)
        .post(`/api/blogs/${blogId}/like`)
        .set('Authorization', `Bearer ${token}`);

      // Like second time (unlike)
      const response = await request(app)
        .post(`/api/blogs/${blogId}/like`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('likes', 0);
    });
  });
});
