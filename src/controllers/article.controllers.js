const Article = require('../models/Article');

export const getArticles = async (req, res) => {
  try {
    const foundArticles = await Article.find({});
    res.send(foundArticles);
  } catch (error) {
    res.send(error);
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.send(article);
  } catch (error) {
    res.send(error);
  }
};
