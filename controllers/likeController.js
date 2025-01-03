const Like = require('../models/Like');

const likeController = {
  // Get likes info for a post
  getLikesInfo: async (req, res) => {
    try {
      const { postId } = req.params;
      const likes = await Like.find({ postId }).select('email -_id');
      const likesList = likes.map(like => like.email);
      
      res.json({
        success: true,
        likes: likesList,
        likesCount: likesList.length
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  // Toggle like status
  toggleLike: async (req, res) => {
    try {
      const { postId, email } = req.body;
      
      const existingLike = await Like.findOne({ postId, email });
      
      if (existingLike) {
        // Unlike: Remove the like
        await Like.deleteOne({ postId, email });
      } else {
        // Like: Add new like
        await Like.create({ postId, email });
      }

      // Get updated likes info
      const likes = await Like.find({ postId }).select('email -_id');
      const likesList = likes.map(like => like.email);
      
      res.json({
        success: true,
        isLiked: !existingLike,
        likes: likesList,
        likesCount: likesList.length,
        message: existingLike ? 'Post unliked' : 'Post liked'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  // Check if user has liked a post
  checkLike: async (req, res) => {
    try {
      const { postId, email } = req.params;
      const like = await Like.findOne({ postId, email });
      
      res.json({
        success: true,
        isLiked: !!like
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
};

module.exports = likeController; 