import Article from '../models/Article';

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    res.status(200).send(articles);
  } catch (e) {
    res.status(400).send({ success: false, error: e.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.send(article);
  } catch (e) {
    res.status(400).send({ success: false, error: e.message });
  }
};

export const createArticle = async (req, res) => {
  const article = new Article({
    title: req.body.title,
    author: req.body.author,
    text: req.body.text,
    violence_type: req.body.violence_type,
    url_to_image: req.body.url_to_image,
    created_at: new Date(),
  });
  try {
    await article.save();

    res.status(201).json({ success: true, data: article });
  } catch (e) {
    res.status(400).send({ success: false, error: e.message });
  }
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Article.findOneAndDelete({ _id: id });
    await res.status(202).json({ message: 'Article was deleted!' });
  } catch (e) {
    res.status(400).send({ success: false, error: e.message });
  }
};
