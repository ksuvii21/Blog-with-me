const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId, parentComment: null })
      .populate('author', 'username profilePicture')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username profilePicture' }
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.addComment = async (req, res) => {
  const { content, parentComment } = req.body;

  try {
    const comment = new Comment({
      content,
      author: req.user.id,
      blog: req.params.blogId,
      parentComment: parentComment || null,
    });

    await comment.save();
    await comment.populate('author', 'username profilePicture');

    res.status(201).json(comment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();
    res.json({ likes: comment.likes.length });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await comment.remove();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
