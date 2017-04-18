var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    'title': 'Register'
  })
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    'title': 'Login'
  })
});

router.post('/register', function(req, res, next) {
  //Get Form Value
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  //Check for image field
  if(req.files.profileimage){
    console.log('Uploading file...');

    //File info
    var profileImageOriginalName = req.file.profileimage.originalname;
    var profileImageName = req.file.profileimage.name;
    var profileImageName = req.file.profileimage.mimetype;
    var profileImageName = req.file.profileimage.path;
    var profileImageName = req.file.profileimage.extension;
    var profileImageName = req.file.profileimage.size;
  }else{
    //set a default Image
    var profileImageName ='noimage.png';
  }

  //Form Validation
  req.checkBody('name','Name filed is required').notEmpty();
  req.checkBody('email','Email filed is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username filed is required').notEmpty();
  req.checkBody('password','Password filed is required').notEmpty();
  req.checkBody('password2','Password do not match').equals(req.body.password);

  // Check for errors
  var errors = req.validationErrors();
  if(errors){
    res.render('register',{
      errors:errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  }else{
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileImageName
    });

    //Create User
     User.createUser(newUser, function(err, user){
       if(err) throw err;
       console.log(user);
     });

    //Success Message
    req.flash('success','You are now register in main login');

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
  function(username, password, done) {
    User.getUserByUsername(username,function(err, user){
        if (err)throw err;
        if (!user) {
          console.log('Unknown User');
          return done(null, false,{message: 'Unknown User'});
        }
        User.comparePassword(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
            return done(null, user);
          }else{
            console.log('Invalid password');
            return done(null, false, {message:'Invalid Password'})
          }
        })
    });
  }
));

router.post('/login', passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid username and password'}), function(req, res){
  console.log('Authentication Successful');
  req.flash('success','You are logged in');
  res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success','You have logged out');
  res.redirect('/users/login');
});

module.exports = router;
