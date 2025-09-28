const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateSummary = async (req, res) => {
  const { content } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Summarize the following blog content in 2-3 sentences: ${content}` }],
      max_tokens: 150,
    });

    res.json({ summary: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'AI summary generation failed' });
  }
};

exports.suggestTitle = async (req, res) => {
  const { content } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Suggest an SEO-friendly, catchy title for this blog content: ${content}` }],
      max_tokens: 50,
    });

    res.json({ title: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'AI title suggestion failed' });
  }
};

exports.suggestTags = async (req, res) => {
  const { content } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Suggest 5-7 relevant tags for this blog content, separated by commas: ${content}` }],
      max_tokens: 100,
    });

    const tags = response.choices[0].message.content.trim().split(',').map(tag => tag.trim());
    res.json({ tags });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'AI tag suggestion failed' });
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
