const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const marked = require('marked');

var Parse = require('parse/node');
Parse.initialize("universe", "cnhw2979");
Parse.serverURL = 'https://hewei.in/parse';

router.get('/:category/:article', function (req, res, next) {
  res.render('blog')
});

router.get('/', function (req, res, next) {

  console.log()

  fs.readFile(path.join(__dirname, '..', '1.csv'), 'utf8', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      let lines = data.split('\r\n'),
        startNumber = 9
      // malfunctional number:
      // 7, 9

      for (let i = startNumber; i < startNumber + 1; i++) {
        let result = lines[i].split(',')

        let createdAt = result[0],
          updatedAt = result[0] === result[1] ? '' : result[1],
          category = result[2].split('/')[0]

        let postPath = path.join(__dirname, '../docs', result[2])

        fs.readFile(postPath, 'utf8', (err, data) => {
          if (err) {
            console.log(`unable to read file ${postPath}`)
          } else {
            let lines = data.split('\n'),
              title = lines[0].replace('# ', '')

            // 去掉已赋值的标题行，及之后的空行
            lines.shift()
            lines.shift()

            let content = lines.join('\n')

            const Post = Parse.Object.extend("Post")

            const post = new Post()

            post.set('id', i + 1)
            post.set('title', title)
            post.set('category', category)
            post.set('content', content)
            post.set('createdAt', createdAt)
            post.set('updatedAt', updatedAt)

            post.save().then((post) => {
              console.log(`Post ${i + 1} saved with objectId: ${post.id}`)
            }, (err) => {
              console.log(`Failed to create post\n${postPath}\n\nwith error code:\n${err}`)
            })
            
            // const query = new Parse.Query(Post)

            // query.equalTo('title', title)
            // query.find().then((posts) => {
            //   posts.forEach((post) => {
            //     post.destroy().then((result) => {
            //       console.log(`post deleted:\n ${result}`)
            //     }, (error) => {
            //       console.log(error.message)
            //     })
            //   })
            // }, (err) => {
            //   console.log(err.message)
            // })
          }
        })
      }
    }
  })

  res.send('')
})

module.exports = router;