const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Compound index to ensure unique combinations of postId and email
likeSchema.index({ postId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema); 