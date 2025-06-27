var mongoose = require('mongoose');

var InteractionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true }
}, { timestamps: true });

InteractionSchema.index({ user: 1, article: 1 }, { unique: true });

mongoose.model('Interaction', InteractionSchema);
