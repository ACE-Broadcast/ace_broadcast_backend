const express = require('express');
const { like , getLikes, getLikedPostsByEmail} = require('../controller/like-controller');
const router = express.Router();

router.post('/postLike', like);
router.get('/posts/:postId/likes', getLikes);
router.get('/user-likes/:email', getLikedPostsByEmail);

module.exports = router;