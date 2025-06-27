const mongoose = require('mongoose');

// In-memory storage of user interactions
// Map<userId, Set<articleId>>
const interactions = new Map();

function recordInteraction(userId, articleId) {
  if (!userId || !articleId) return;
  const id = userId.toString();
  const article = articleId.toString();
  if (!interactions.has(id)) {
    interactions.set(id, new Set());
  }
  interactions.get(id).add(article);
}

async function getRecommendedArticles(userId, limit = 10) {
  const Article = mongoose.model('Article');
  const targetId = userId ? userId.toString() : null;
  const articleCounts = {};
  for (const [uid, set] of interactions.entries()) {
    if (uid === targetId) continue;
    for (const art of set) {
      articleCounts[art] = (articleCounts[art] || 0) + 1;
    }
  }
  const exclude = interactions.get(targetId) || new Set();
  const sorted = Object.entries(articleCounts)
    .filter(([id]) => !exclude.has(id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
  if (!sorted.length) return [];
  const articles = await Article.find({ _id: { $in: sorted } })
    .populate('author')
    .exec();
  // preserve order from sorted array
  const orderMap = new Map(sorted.map((id, idx) => [id, idx]));
  articles.sort((a, b) => orderMap.get(a._id.toString()) - orderMap.get(b._id.toString()));
  return articles;
}

module.exports = {
  recordInteraction,
  getRecommendedArticles,
};
