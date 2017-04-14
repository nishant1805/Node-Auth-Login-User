var express = require('express');
var router = express.Router();

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

router.post('/user/register', function(req, res, next) {
  //Get Form Value
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
});

//Check for image field
if(req.files.profileimage){
  console.log('Uploading file...');

  var profileImageOriginalName = req.file.profileimage.originalname;
}

module.exports = router;
