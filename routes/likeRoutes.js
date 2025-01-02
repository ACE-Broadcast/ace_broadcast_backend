const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Check if a user has liked a post
router.get('/checkLike/:postId/:email', likeController.checkLike);

// Toggle like status
router.post('/postLike', likeController.toggleLike);

// Get likes count for a post
router.get('/posts/:postId/likes', likeController.getLikesCount);

module.exports = router; 