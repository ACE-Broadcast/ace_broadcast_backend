const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    comment: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostMessage'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}
);

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
