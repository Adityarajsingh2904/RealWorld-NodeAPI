var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var { check, validationResult } = require('express-validator');
var User = mongoose.model('User');
var auth = require('../auth');

/**
 * @route   GET /api/user
 * @desc    Get current logged-in user's info
 * @access  Private (requires JWT token)
 * @return  { user: { email, token, username, bio, image } }
 */
router.get('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

/**
 * @route   PUT /api/user
 * @desc    Update current user's profile fields
 * @access  Private (requires JWT token)
 * @body    { user: { username?, email?, bio?, image?, password? } }
 * @return  { user: { email, token, username, bio, image } }
 */
router.put('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.user.username !== 'undefined'){
      user.username = req.body.user.username;
    }
    if(typeof req.body.user.email !== 'undefined'){
      user.email = req.body.user.email;
    }
    if(typeof req.body.user.bio !== 'undefined'){
      user.bio = req.body.user.bio;
    }
    if(typeof req.body.user.image !== 'undefined'){
      user.image = req.body.user.image;
    }
    if(typeof req.body.user.password !== 'undefined'){
      user.setPassword(req.body.user.password);
    }

    return user.save().then(function(){
      return res.json({user: user.toAuthJSON()});
    });
  }).catch(next);
});

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 * @body    { user: { email, password } }
 * @return  { user: { token, email, username, bio, image } }
 */
router.post('/users/login', function(req, res, next){
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

/**
 * @route   POST /api/users
 * @desc    Register a new user
 * @access  Public
 * @body    { user: { username, email, password } }
 * @return  { user: { token, email, username, bio?, image? } }
 */
router.post(
  '/users',
  [check('email').isEmail(), check('password').isLength({ min: 6 })],
  function (req, res, next) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    var user = new User();

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save()
      .then(function () {
        return res.json({ user: user.toAuthJSON() });
      })
      .catch(next);
  }
);

module.exports = router;
