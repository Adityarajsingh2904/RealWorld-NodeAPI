var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var auth = require('../auth');

// Preload article objects on routes with ':article'
router.param('article', function(req, res, next, slug) {
  Article.findOne({ slug: slug })
    .populate('author')
    .then(function (article) {
      if (!article) return res.sendStatus(404);
      req.article = article;
      return next();
    }).catch(next);
});

router.param('comment', function(req, res, next, id) {
  Comment.findById(id).then(function(comment) {
    if (!comment) return res.sendStatus(404);
    req.comment = comment;
    return next();
  }).catch(next);
});

/**
 * @route   GET /api/articles
 * @desc    Get all articles with optional filters
 * @access  Public
 * @query   { tag?, author?, favorited?, limit?, offset? }
 * @return  { articles: [], articlesCount: Number }
 */
// GET /api/articles
router.get('/', auth.optional, function(req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== 'undefined') {
    offset = req.query.offset;
  }

  if (typeof req.query.tag !== 'undefined') {
    query.tagList = { "$in": [req.query.tag] };
  }

  Promise.all([
    req.query.author ? User.findOne({ username: req.query.author }) : null,
    req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
  ]).then(function(results) {
    var author = results[0];
    var favoriter = results[1];

    if (author) {
      query.author = author._id;
    }

    if (favoriter) {
      query._id = { $in: favoriter.favorites };
    } else if (req.query.favorited) {
      query._id = { $in: [] };
    }

    return Promise.all([
      Article.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({ createdAt: 'desc' })
        .populate('author')
        .exec(),
      Article.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]).then(function(results) {
      var articles = results[0];
      var articlesCount = results[1];
      var user = results[2];

      return res.json({
        articles: articles.map(function(article) {
          return article.toJSONFor(user);
        }),
        articlesCount: articlesCount
      });
    });
  }).catch(next);
});

/**
 * @route   GET /api/articles/feed
 * @desc    Get articles from followed users
 * @access  Private
 * @query   { limit?, offset? }
 * @return  { articles: [], articlesCount: Number }
 */
// GET /api/articles/feed
router.get('/feed', auth.required, function(req, res, next) {
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== 'undefined') {
    offset = req.query.offset;
  }

  User.findById(req.payload.id).then(function(user) {
    if (!user) return res.sendStatus(401);

    Promise.all([
      Article.find({ author: { $in: user.following } })
        .limit(Number(limit))
        .skip(Number(offset))
        .populate('author')
        .exec(),
      Article.count({ author: { $in: user.following } })
    ]).then(function(results) {
      var articles = results[0];
      var articlesCount = results[1];

      return res.json({
        articles: articles.map(function(article) {
          return article.toJSONFor(user);
        }),
        articlesCount: articlesCount
      });
    }).catch(next);
  });
});

/**
 * @route   POST /api/articles
 * @desc    Create a new article
 * @access  Private
 * @body    { article: { title, description, body, tagList? } }
 * @return  { article }
 */
// POST /api/articles
router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user) {
    if (!user) return res.sendStatus(401);

    var article = new Article(req.body.article);
    article.author = user;

    return article.save().then(function() {
      return res.json({ article: article.toJSONFor(user) });
    });
  }).catch(next);
});

/**
 * @route   GET /api/articles/:slug
 * @desc    Get an article by slug
 * @access  Public
 * @param   {slug} article
 * @return  { article }
 */
// GET /api/articles/:slug
router.get('/:article', auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.article.populate('author')
  ]).then(function(results) {
    var user = results[0];
    return res.json({ article: req.article.toJSONFor(user) });
  }).catch(next);
});

/**
 * @route   PUT /api/articles/:slug
 * @desc    Update an existing article
 * @access  Private
 * @param   {slug} article
 * @body    { article: { title?, description?, body?, tagList? } }
 * @return  { article }
 */
// PUT /api/articles/:slug
router.put('/:article', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user) {
    if (req.article.author._id.toString() === req.payload.id.toString()) {
      if (typeof req.body.article.title !== 'undefined') {
        req.article.title = req.body.article.title;
      }

      if (typeof req.body.article.description !== 'undefined') {
        req.article.description = req.body.article.description;
      }

      if (typeof req.body.article.body !== 'undefined') {
        req.article.body = req.body.article.body;
      }

      if (typeof req.body.article.tagList !== 'undefined') {
        req.article.tagList = req.body.article.tagList;
      }

      req.article.save().then(function(article) {
        return res.json({ article: article.toJSONFor(user) });
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

/**
 * @route   DELETE /api/articles/:slug
 * @desc    Delete an article
 * @access  Private
 * @param   {slug} article
 * @return  204 No Content
 */
// DELETE /api/articles/:slug
router.delete('/:article', auth.required, async function(req, res, next) {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) return res.sendStatus(401);

    if (req.article.author._id.toString() === req.payload.id.toString()) {
      await req.article.deleteOne();
      return res.sendStatus(204);
    } else {
      return res.sendStatus(403);
    }
  } catch (err) {
    return next(err);
  }
});

/**
 * @route   POST /api/articles/:slug/favorite
 * @desc    Favorite an article
 * @access  Private
 * @param   {slug} article
 * @return  { article }
 */
// POST /api/articles/:slug/favorite
router.post('/:article/favorite', auth.required, function(req, res, next) {
  var articleId = req.article._id;

  User.findById(req.payload.id).then(function(user) {
    if (!user) return res.sendStatus(401);

    return user.favorite(articleId).then(function() {
      return req.article.updateFavoriteCount().then(function(article) {
        return res.json({ article: article.toJSONFor(user) });
      });
    });
  }).catch(next);
});

/**
 * @route   DELETE /api/articles/:slug/favorite
 * @desc    Unfavorite an article
 * @access  Private
 * @param   {slug} article
 * @return  { article }
 */
// DELETE /api/articles/:slug/favorite
router.delete('/:article/favorite', auth.required, function(req, res, next) {
  var articleId = req.article._id;

  User.findById(req.payload.id).then(function(user) {
    if (!user) return res.sendStatus(401);

    return user.unfavorite(articleId).then(function() {
      return req.article.updateFavoriteCount().then(function(article) {
        return res.json({ article: article.toJSONFor(user) });
      });
    });
  }).catch(next);
});

/**
 * @route   GET /api/articles/:slug/comments
 * @desc    Get comments for an article
 * @access  Public
 * @param   {slug} article
 * @return  { comments: [] }
 */
// GET /api/articles/:slug/comments
router.get('/:article/comments', auth.optional, async function(req, res, next) {
  try {
    const user = req.payload ? await User.findById(req.payload.id) : null;
    await req.article.populate({
      path: 'comments',
      populate: { path: 'author' },
      options: { sort: { createdAt: 'desc' } }
    });

    return res.json({
      comments: req.article.comments.map(function(comment) {
        return comment.toJSONFor(user);
      })
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * @route   POST /api/articles/:slug/comments
 * @desc    Add a comment to an article
 * @access  Private
 * @param   {slug} article
 * @body    { comment: { body } }
 * @return  { comment }
 */
// POST /api/articles/:slug/comments
router.post('/:article/comments', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user) {
    if (!user) return res.sendStatus(401);

    var comment = new Comment(req.body.comment);
    comment.article = req.article;
    comment.author = user;

    return comment.save().then(function() {
      req.article.comments.push(comment);
      return req.article.save().then(function() {
        res.json({ comment: comment.toJSONFor(user) });
      });
    });
  }).catch(next);
});

/**
 * @route   DELETE /api/articles/:slug/comments/:id
 * @desc    Delete a comment
 * @access  Private
 * @param   {slug} article
 * @param   {id} comment
 * @return  204 No Content
 */
// DELETE /api/articles/:slug/comments/:id
router.delete('/:article/comments/:comment', auth.required, function(req, res, _next) {
  if (req.comment.author.toString() === req.payload.id.toString()) {
    req.article.comments.remove(req.comment._id);
    req.article.save()
      .then(() => Comment.deleteOne({ _id: req.comment._id }))
      .then(() => res.sendStatus(204));
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
