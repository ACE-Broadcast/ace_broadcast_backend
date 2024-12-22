const mongoose = require('mongoose');

const postMessage = mongoose.Schema({
    username : {
        type: String,
        required : true
    },
    message : {
        type :String,
        required : true
    },
    timestamp: {
        type: Date,
        default: Date.now
      }
});

const Post = mongoose.model("postMessage" , postMessage);
module.exports = Post;