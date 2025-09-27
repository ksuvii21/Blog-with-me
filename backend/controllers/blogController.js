const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  const { title, content, summary, categories, tags, featuredImage } = req.body;

  try {
    const blog = new Blog({
      title,
      content,
      summary,
      categories: categories ? categories.split(',').map(cat => cat.trim()) : [],
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featuredImage,
      author: req.user.id,
    });

    await blog.save();
    await blog.populate('author', 'username');

    res.status(201).json(blog);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('likes', 'username');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.updateBlog = async (req, res) => {
  const { title, content, summary, categories, tags, featuredImage } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.summary = summary || blog.summary;
    blog.categories = categories ? categories.split(',').map(cat => cat.trim()) : blog.categories;
    blog.tags = tags ? tags.split(',').map(tag => tag.trim()) : blog.tags;
    blog.featuredImage = featuredImage || blog.featuredImage;

    await blog.save();
    await blog.populate('author', 'username profilePicture');

    res.json(blog);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await blog.remove();
    res.json({ message: 'Blog removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const likeIndex = blog.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
    } else {
      blog.likes.push(req.user.id);
    }

    await blog.save();
    res.json({ likes: blog.likes.length });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};



exports.searchBlogs = async (req, res) => {
  const { q, category, tag } = req.query;

  let query = {};

  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
    ];
  }

  if (category) {
    query.categories = { $in: [category] };
  }

  if (tag) {
    query.tags = { $in: [tag] };
  }

  try {
    const blogs = await Blog.find(query)
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
