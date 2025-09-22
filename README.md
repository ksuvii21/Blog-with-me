# MERN Blogging Platform

A full-featured blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring advanced admin dashboards, AI-powered content generation, and comprehensive user management.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with role-based access control
- **Blog Management**: Create, read, update, delete blogs with rich text editor
- **User Profiles**: Customizable user profiles with bio and profile pictures
- **Comments System**: Full commenting functionality on blog posts
- **Search & Filtering**: Advanced search with category and tag filtering
- **Image Uploads**: Cloudinary integration for image management
- **AI Integration**: OpenAI-powered content generation (summaries, titles, tags)

### Admin Features
- **Admin Dashboard**: Comprehensive analytics and user management
- **SuperAdmin Dashboard**: Advanced platform controls and system settings
- **User Management**: Bulk operations, role management, user statistics
- **Content Moderation**: Blog and comment moderation tools
- **Analytics Dashboard**: Charts and metrics for platform performance
- **System Settings**: Platform-wide configuration management

### Advanced Features
- **Responsive Design**: Mobile-first design with Material-UI
- **Real-time Updates**: Live statistics and user engagement metrics
- **SEO Optimization**: Meta tags, structured data, and SEO-friendly URLs
- **Performance Monitoring**: System health monitoring and analytics
- **Testing Suite**: Comprehensive test coverage for backend and frontend

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image management
- **OpenAI** - AI content generation
- **Jest** - Testing framework

### Frontend
- **React** - UI library
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Quill** - Rich text editor

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager
- Cloudinary account (for image uploads)
- OpenAI API key (for AI features)

## 🚀 Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blogging-platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blogging-platform
   JWT_SECRET=your-super-secret-jwt-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
```

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Use the `backend/deploy/render.yaml` configuration
3. Set environment variables in Render dashboard
4. Deploy automatically on git push

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Use the `frontend/deploy/netlify.toml` configuration
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Deploy automatically on git push

## 📁 Project Structure

```
blogging-platform/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── tests/           # Test files
│   ├── deploy/          # Deployment configurations
│   └── server.js        # Application entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # State management
│   │   ├── utils/       # Utility functions
│   │   └── tests/       # Test files
│   ├── deploy/          # Deployment configurations
│   └── package.json
└── README.md
```

## 🔐 Authentication & Authorization

### User Roles
- **User**: Basic user with blog creation and commenting privileges
- **Admin**: Administrative user with user and content management
- **SuperAdmin**: Platform administrator with system-level controls

### JWT Tokens
- Access tokens expire in 7 days
- Tokens contain user ID and role information
- Protected routes require valid JWT token

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create new blog
- `GET /api/blogs/:id` - Get blog by ID
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/blogs/:id/like` - Like/unlike blog

### Users
- `GET /api/users` - Get all users (Admin/SuperAdmin)
- `GET /api/users/stats` - Get user statistics (Admin/SuperAdmin)
- `PUT /api/users/:id/role` - Update user role (SuperAdmin)
- `DELETE /api/users/:id` - Delete user (Admin/SuperAdmin)

### AI Features
- `POST /api/ai/generate-summary` - Generate blog summary
- `POST /api/ai/suggest-title` - Suggest blog title
- `POST /api/ai/suggest-tags` - Suggest blog tags

## 🎨 UI Components

### Admin Dashboard
- Real-time analytics with charts
- User management interface
- Blog moderation tools
- System performance metrics

### SuperAdmin Dashboard
- Advanced user management
- System settings configuration
- Platform health monitoring
- Bulk user operations

## 🔧 Development

### Available Scripts

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

#### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

### Code Quality
- ESLint configuration for code linting
- Prettier configuration for code formatting
- Jest configuration for testing
- Coverage reporting

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, email support@bloggingplatform.com or join our Discord community.

## 📈 Roadmap

- [ ] Email notifications system
- [ ] Social media integration
- [ ] Advanced search with filters
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Content recommendation engine

---

Built with ❤️ using the MERN stack
