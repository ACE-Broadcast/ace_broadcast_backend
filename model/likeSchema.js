const mongoose = require('mongoose');

const LikeSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true 
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostMessage' 
    }]
}, {
    timestamps: true 
});

LikeSchema.index({ email: 1, 'likedPosts': 1 }, { unique: true });

const Like = mongoose.model('Like', LikeSchema);
module.exports = Like;
