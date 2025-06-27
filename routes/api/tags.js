var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');

/**
 * @route   GET /api/tags
 * @desc    Get all available article tags
 * @access  Public
 * @return  { tags: [] }
 */
router.get('/', function(req, res, next) {
  Article.find().distinct('tagList').then(function(tags){
    return res.json({tags: tags});
  }).catch(next);
});

module.exports = router;
