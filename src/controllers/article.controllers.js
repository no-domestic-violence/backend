import Article from '../models/Article';

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    res.send(articles);
  } catch (e) {
    res.send(e);
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.send(article);
  } catch (e) {
    res.send(e);
  }
};

export const createArticle = async (req, res) => {
  const article = new Article({
    title: req.body.title,
    author: req.body.author,
    text: req.body.text,
    url_to_image: req.body.url_to_image,
    created_at: req.body.created_at,
  });
  try {
    await article.save();

    res.status(201).json({ success: true, data: article });
  } catch (e) {
    res.status(e);
  }
};
