const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/', commentController.getComments);
router.post('/', auth, commentController.addComment);
router.post('/:id/like', auth, commentController.likeComment);
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;
