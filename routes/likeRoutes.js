const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Get likes info for a post (count and list)
router.get('/posts/:postId', likeController.getLikesInfo);

// Toggle like status
router.post('/postLike', likeController.toggleLike);

// Check if user has liked a post
router.get('/checkLike/:postId/:email', likeController.checkLike);

module.exports = router; 