const mongoose = require('mongoose');

async function recordInteraction(userId, articleId) {
  if (!userId || !articleId) return;
  const Interaction = mongoose.model('Interaction');
  await Interaction.findOneAndUpdate(
    { user: userId, article: articleId },
    { $setOnInsert: { user: userId, article: articleId } },
    { upsert: true, new: false }
  ).exec();
}

async function getRecommendedArticles(userId, limit = 10) {
  const Article = mongoose.model('Article');
  const Interaction = mongoose.model('Interaction');

  const exclude = userId
    ? await Interaction.find({ user: userId }).distinct('article').exec()
    : [];

  const matchStage = userId ? { user: { $ne: mongoose.Types.ObjectId(userId) } } : {};

  const counts = await Interaction.aggregate([
    { $match: matchStage },
    { $group: { _id: '$article', count: { $sum: 1 } } }
  ]).exec();

  const articleCounts = {};
  counts.forEach(c => {
    articleCounts[c._id.toString()] = c.count;
  });

  const excludeSet = new Set(exclude.map(id => id.toString()));
  const sortedIds = Object.entries(articleCounts)
    .filter(([id]) => !excludeSet.has(id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (!sortedIds.length) return [];

  const articles = await Article.find({ _id: { $in: sortedIds } })
    .populate('author')
    .exec();

  const orderMap = new Map(sortedIds.map((id, idx) => [id, idx]));
  articles.sort(
    (a, b) => orderMap.get(a._id.toString()) - orderMap.get(b._id.toString())
  );
  return articles;
}

module.exports = {
  recordInteraction,
  getRecommendedArticles,
};
