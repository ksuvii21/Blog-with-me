# Blog-with-me: MERN Stack Blogging Platform

A full-stack blogging application built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform allows users to create, edit, delete, and interact with blog posts using a rich text editor (Quill.js). Features include user authentication, blog management with categories and featured images, likes, comments, and a user dashboard. The backend handles CRUD operations securely with JWT authentication, and the frontend uses Redux for state management.

## 🚀 Features

### User Features
- **Authentication**: Secure login/register with JWT tokens and role-based access (user/admin).
- **Blog Creation**: Rich text editing with Quill.js, including image uploads via Cloudinary.
- **Blog Management**: View, edit, and delete personal blogs from the user dashboard.
- **Blog Interaction**: Like/unlike blogs, add comments, view details with author info and related posts.
- **Search & Categories**: Filter blogs by categories; basic search functionality.
- **Responsive UI**: Built with Material-UI for a modern, mobile-friendly interface.

### Admin Features
- **User Dashboard**: View and manage user's own blogs with edit/delete options.
- **Protected Routes**: Only authors or admins can edit/delete blogs.
- **Content Moderation**: Backend auth middleware ensures secure operations.

### Technical Highlights
- **Rich Text Editor**: Quill.js integration for formatted content (bold, italics, lists, images).
- **State Management**: Redux Toolkit with async thunks for API calls.
- **Image Handling**: Cloudinary for uploading and storing featured images and editor embeds.
- **Real-time Updates**: Redux updates UI state for likes and blog changes without full reloads.

## 📱 Preview

### Screenshots
- **Home/Dashboard**: List of blogs with search and categories.
  ![Home Page](https://via.placeholder.com/800x400?text=Blog+List+Dashboard) <!-- Replace with actual screenshot URL if available -->

- **Create/Edit Blog**: Form with title, rich text editor, categories, and image upload.
  ![Create Blog](https://via.placeholder.com/800x600?text=Create+Blog+Page) <!-- Replace with actual screenshot -->

- **Blog Detail**: Full post view with likes, comments, and edit button for authors.
  ![Blog Detail](https://via.placeholder.com/800x600?text=Blog+Detail+Page) <!-- Replace with actual screenshot -->

- **User Dashboard**: Manage personal blogs with edit/delete actions.
  ![User Dashboard](https://via.placeholder.com/800x400?text=User+Dashboard) <!-- Replace with actual screenshot -->

### Live Demo
- **Website Link**: [Blog-with-me Demo](https://blog-with-me.netlify.app) <!-- Replace with actual deployed URL, e.g., Netlify or Vercel -->
- **GitHub Repository**: [github.com/hp/Blog-with-me](https://github.com/hp/Blog-with-me) <!-- Adjust username/repo as needed -->

## 🛠️ Technology Stack

### Backend
- **Node.js & Express.js**: Server and API framework.
- **MongoDB & Mongoose**: NoSQL database for blogs, users, and comments.
- **JWT (jsonwebtoken)**: Authentication and authorization.
- **bcryptjs**: Password hashing.
- **Cloudinary & Multer**: Image upload and storage.
- **dotenv**: Environment variables.
- **cors**: Cross-origin resource sharing.

### Frontend
- **React.js**: UI library with hooks.
- **Redux Toolkit**: State management with slices and async thunks.
- **React Router**: Client-side routing.
- **Material-UI (MUI)**: Component library for styling.
- **React Quill**: Rich text editor integration.
- **Axios**: HTTP client for API requests.
- **react-scripts**: Build tools (Create React App).

### Development Tools
- **Nodemon**: Auto-restart for backend dev server.
- **ESLint & Prettier**: Code linting and formatting (configured in frontend).

## 📋 Prerequisites

- Node.js (v16+)
- npm (v8+)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/hp/Blog-with-me.git
cd Blog-with-me
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # If .env.example exists, or create .env manually
```

Update `backend/.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-with-me  # Or your MongoDB Atlas URI
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Seed admin user (optional):
```bash
npm run seed:admin
```

Start backend:
```bash
npm run dev  # Development with nodemon
# or
npm start    # Production
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Update `frontend/.env` if needed (proxy is set to backend port 5000 in package.json).

Start frontend:
```bash
npm start  # Runs on http://localhost:3000
```

### 4. Run the Application
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- The frontend proxies API calls to the backend automatically.

## 📁 Project Structure

```
Blog-with-me/
├── backend/
│   ├── config/          # Database and env configs
│   ├── controllers/     # API logic (e.g., blogController.js)
│   ├── middleware/      # Auth, validation middleware
│   ├── models/          # Mongoose schemas (Blog, User)
│   ├── routes/          # API routes (auth, blogs)
│   ├── server.js        # Express app entry
│   ├── package.json     # Backend dependencies
│   └── .env             # Environment variables
├── frontend/
│   ├── public/          # Static files (index.html)
│   ├── src/
│   │   ├── components/  # Reusable UI (BlogEditor, Header, LoadingSpinner)
│   │   ├── pages/       # Routes (CreateBlogPage, EditBlogPage, BlogDetailPage, UserDashboardPage)
│   │   ├── redux/       # Slices (blogSlice.js, authSlice)
│   │   ├── utils/       # Helpers (api.js, cloudinary.js)
│   │   └── App.js       # Main app with routing
│   ├── package.json     # Frontend dependencies
│   └── .env             # Frontend env (optional)
├── README.md            # This file
├── TODO.md              # Pending tasks
└── package.json         # Root (if monorepo scripts)
```

## 🔗 API Endpoints

All endpoints prefixed with `/api`.

### Authentication
- `POST /auth/register` - Create user { username, email, password }
- `POST /auth/login` - Login { email, password } → Returns JWT token
- `GET /auth/profile` - Get user profile (protected)

### Blogs
- `GET /blogs` - Fetch all blogs (paginated/sorted)
- `POST /blogs` - Create blog (protected) { title, content, categories, featuredImage }
- `GET /blogs/:id` - Get single blog (increments views)
- `PUT /blogs/:id` - Update blog (protected, author/admin only)
- `DELETE /blogs/:id` - Delete blog (protected, author/admin only)
- `POST /blogs/:id/like` - Like/unlike blog (protected)
- `POST /blogs/:id/comment` - Add comment { comment } (protected)

### Images
- `POST /blogs/upload` - Upload image (Multer + Cloudinary)

## 🧪 Testing

### Backend
- Basic tests not implemented yet. Run:
  ```bash
  cd backend
  # Add Jest config and tests in /tests/
  ```

### Frontend
- Run tests:
  ```bash
  cd frontend
  npm test
  ```
- Uses Jest + React Testing Library for components.

## 🚀 Deployment

### Backend (Render/Heroku)
1. Push to GitHub.
2. On Render: New Web Service → Connect repo → Set build command `npm install` → Start command `npm start`.
3. Add env vars in dashboard.

### Frontend (Netlify/Vercel)
1. Push to GitHub.
2. On Netlify: New site from Git → Build command `npm run build` → Publish dir `build`.
3. Update API base URL in frontend utils/api.js for production.

### Database
- Use MongoDB Atlas for cloud DB.
- Update MONGODB_URI in env.

## 🔧 Usage

1. Register/Login as user.
2. Create a blog: Navigate to /create-blog → Use editor for content → Add categories/image → Publish.
3. View blogs: /blogs or /:id for details.
4. Edit/Delete: From /dashboard (user's blogs).
5. Like: Click heart on blog detail → Updates count and state.

## 🤝 Contributing

1. Fork the repo.
2. Create feature branch: `git checkout -b feature/new-feature`.
3. Commit changes: `git commit -m 'Add new feature'`.
4. Push: `git push origin feature/new-feature`.
5. Open PR.

Follow ESLint/Prettier rules. Add tests for new features.

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 📞 Contact & Social Media

- **LinkedIn**: [Kritika Gupta](https://www.linkedin.com/in/kritika-gupta2106)
- **GitHub**: [ksuvii21](https://github.com/ksuvii21)
- **Portfolio**: [Personal Portfolio](https://ksuvii21.github.io/ksuvii.github.io/)
- Issues: [Create Issue](https://github.com/hp/Blog-with-me/issues)

## 📈 Future Enhancements (from TODO.md)
- Add tags and summary fields to create/edit forms.
- Implement comments fully.
- Add admin dashboard for moderation.
- Email notifications.
- Advanced search.

---

Built with ❤️ for blogging enthusiasts. Contributions welcome!
