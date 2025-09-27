const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/', blogController.getBlogs);
router.get('/search', blogController.searchBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', auth, blogController.createBlog);
router.put('/:id', auth, blogController.updateBlog);
router.delete('/:id', auth, blogController.deleteBlog);
router.post('/:id/like', auth, blogController.likeBlog);


module.exports = router;
