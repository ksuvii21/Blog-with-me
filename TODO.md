# TODO: Implement Create/Edit/Delete Blogs with Rich Text Editor

## Current Status
- ✅ Rich text editor (Quill.js) implemented in BlogEditor.jsx
- ✅ Create functionality complete in CreateBlogPage.js
- ✅ Delete functionality available in UserDashboardPage.js
- ❌ Edit functionality incomplete in EditBlogPage.js

## Tasks
- [ ] Create TODO.md file (this file)
- [ ] Fix EditBlogPage.js to load and edit blog data
  - [ ] Add state variables for title, content, categories, featuredImage, etc.
  - [ ] Fetch blog data on mount using fetchBlogById thunk
  - [ ] Populate form states with blog data
  - [ ] Update BlogEditor usage to pass content and setContent
  - [ ] Implement handleSave to dispatch updateBlog thunk
  - [ ] Add validation and error handling
  - [ ] Add image upload handling for featuredImage changes
  - [ ] Add category management (add/remove)
  - [ ] Navigate to blog detail after successful update
- [ ] Test edit functionality
  - [ ] Run frontend development server
  - [ ] Create a test blog
  - [ ] Edit the blog via EditBlogPage
  - [ ] Verify rich text content loads and saves correctly
  - [ ] Verify delete works from dashboard
- [ ] Optional: Add tags and summary fields to Create/Edit forms for full model support

## Notes
- Backend already supports updateBlog and deleteBlog
- Quill.js handles rich text HTML content
- Auth checks in place for edit/delete
