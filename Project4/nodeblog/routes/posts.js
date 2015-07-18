var express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next){
  var categories = db.get('categories');

  categories.find({},{}, function(err, categories){
    res.render('addpost',{
        "title" : "Add Post",
        "categories" : categories
    });
  })
});

router.post('/add', function(req, res, next){
  //Get form values
  var title = req.body.title,
  category = req.body.category,
  body = req.body.body,
  author = req.body.author,
  date = new Date();

  if(req.files.mainimage){
    //save request lookup time
    var imgSrc = req.files.mainimage;

    var imgOrgName  = imgSrc.originalname,
        mainImgName = imgSrc.name,
        mainImgMime = imgSrc.mimeType,
        mainImgPath = imgSrc.path,
        mainImgExt  = imgSrc.extension,
        mainImgSize = imgSrc.size;
  }else{
      var mainImageName = 'noimage.png';
  }

  //form validation
  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('body', "Body field is required").notEmpty();

  //check errors
  var errors = req.validationErrors();

  if(errors){
    res.render('addpost',{
      "errors": errors,
      "title": title,
      "body" : body
    });
  }else{
    var post = db.get('posts');

    //submit to DB
    posts.insert({
      "title" : title,
      "body"  : body,
      "category" : category,
      "date" : date,
      "author" : author,
      "mainimage" : mainImgName
    }, function(err, post){
      if(err){
        res.send('There was an issue submitting the post');
      }else{
        req.flash('success', 'Post Submitted');
        res.location('/');
        res.redirect('/');
      }
    });
  }


});

module.exports = router;
