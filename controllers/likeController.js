const Like = require('../models/Like');

const likeController = {
  // Check if a user has liked a post
  checkLike: async (req, res) => {
    try {
      const { postId, email } = req.params;
      const like = await Like.findOne({ postId, email });
      res.json({ liked: !!like });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Toggle like status
  toggleLike: async (req, res) => {
    try {
      const { postId, email } = req.body;
      
      const existingLike = await Like.findOne({ postId, email });
      
      if (existingLike) {
        await Like.deleteOne({ postId, email });
      } else {
        await Like.create({ postId, email });
      }

      // Get updated likes count
      const likesCount = await Like.countDocuments({ postId });
      
      res.json({
        liked: !existingLike,
        likesCount
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get likes count for a post
  getLikesCount: async (req, res) => {
    try {
      const { postId } = req.params;
      const likesCount = await Like.countDocuments({ postId });
      res.json({ likesCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = likeController; 