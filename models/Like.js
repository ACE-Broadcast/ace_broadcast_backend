const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    ref: 'Message'
  },
  email: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only like a post once
likeSchema.index({ postId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema); 