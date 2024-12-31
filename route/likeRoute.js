const express = require('express');
const { like , getLikes} = require('../controller/like-controller');
const router = express.Router();

router.post('/postLike', like);
router.get('/posts/:postId/likes', getLikes);

module.exports = router;