exports.generateSummary = async (req, res) => {
  const { content } = req.body;

  try {
    // Mock summary: Take first 100 characters and add a generic ending
    const summary = content.length > 100 ? content.substring(0, 100) + '...' : content;
    res.json({ summary: `Summary: ${summary}` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Summary generation failed' });
  }
};

exports.suggestTitle = async (req, res) => {
  const { content } = req.body;

  try {
    // Mock title: Use first few words of content
    const words = content.split(' ').slice(0, 5).join(' ');
    const title = words ? `${words}...` : 'Untitled Blog Post';
    res.json({ title });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Title suggestion failed' });
  }
};

exports.suggestTags = async (req, res) => {
  const { content } = req.body;

  try {
    // Mock tags: Some default tags
    const tags = ['blog', 'writing', 'content', 'article'];
    res.json({ tags });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Tag suggestion failed' });
  }
};

exports.getInsights = async (req, res) => {
  // For simplicity, provide mock insights. In a real app, analyze blog data.
  const insights = {
    engagement: 'High',
    readability: 'Good',
    seoScore: 85,
    suggestions: ['Add more images', 'Include calls to action'],
  };

  res.json(insights);
};
