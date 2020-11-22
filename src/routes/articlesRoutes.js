const express = require('express');
const Article = require('../models/Article');


const router = express.Router();

// Getting all the articles
router.route('/articles').get((req, res) => {
  Article.find((err, foundArticles) => {
    if (!err) {
      return res.send(foundArticles);
    }
    return res.send(err);
  });
});

// Getting a specific article
router.get('/articles/:id', function (req, res) {
  Article.findById(req.params.id).exec(function (err, article) {
    if (err) {
      console.log(err);
    } else {
      res.send(article);
    }
  });
});

// To Do : Bookmarking an article

module.exports = router;
