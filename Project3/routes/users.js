var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    title: 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});

router.post('/register',function(req,res,next){
  //Get form values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //Check for image field
  if(req.files.profileimage){
    console.log("Uploading File");

    //file info
    var profileImgOrgName = req.files.profileimage.originalname;
    var profImgName = req.files.profileimage.name;
    var profileImgMime = req.files.profileimage.mimetype;
    var profileImgPath = req.files.profileimage.path;
    var profileImgExt = req.files.profileimage.extension;
    var profileImgSize = req.files.profileimage.size;

  }else{
    var profileImgName = "noimage.png";
  }


  //form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(password);

  //Check for errors
  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors : errors,
      name : name,
      email : email,
      username: username,
      password : password,
      password2 : password2,
    })
  }else {
    var newUser = new User({
      name : name,
      email : email,
      username: username,
      password : password,
      profileimage : profileImgName
    });
    //Create User
    User.createUser(newUser, function(err, user){
      if(err) throw(err);
      console.log("this is the created User", user);
    });

    req.flash('success', 'You are now registered and may log in');

    res.location('/');
    res.redirect('/');
  }
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done){
    User.getUserByUsername(username, function(error, user){
      if(error) throw(error);
      if(!user){
        console.log("Unkown user")
        return done(null, false, {message: "Unkown user"});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw error
        if(isMatch){
          return done(null, user);
        }else{
          console.log("Invalid Password");
          return done(null, false, {message: "Invalid Password"});
        }

      });
    });
  }
));

router.post('/login', passport.authenticate('local',{
  failureRedirect: '/users/login',
  failureFlash: 'invalid username or password'
}
),function(req,res){
  console.log("authentication successful");
  req.flash('success', "You are logged in");
  res.redirect('/');
});
module.exports = router;
