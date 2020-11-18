const express = require('express');
const Article = require('../models/Article');
const Articles = require('../models/Article');

const router = express.Router();

// Getting all the articles
router.route('/articles').get((req, res) => {
    Articles.find((err, foundArticles) => {
      if (!err) {
        return res.send(foundArticles);
      }
      return res.send(err);
    });
  });

// Getting a specific article
router.get('/articles/:id', function (req, res) {
    console.log('get req for single article');
    Article.findById(req.params.id)
    .exec(function(err, article){
        if (err){
            console.log("error");
        }else {
            res.send(article);
        }
        
    });
});

// Bookmarking an article

module.exports = router;






