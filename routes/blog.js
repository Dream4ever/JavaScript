const fs = require('fs');
const express = require('express');
const router = express.Router();
const marked = require('marked');

router.get('/:category/:article', function (req, res, next) {
  let category = req.params.category,
    article = req.params.article

  fs.readFile(`docs/${category}/${article}.md`, 'utf8', (err, data) => {
    if (err) {
      res.render('blog', {
        content: err
      })
    } else {
      res.render('blog', {
        content: marked(data.toString())
      })
    }
  })
});

module.exports = router;