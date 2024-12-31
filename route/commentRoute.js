const express = require('express');
const {postComment, getComments} = require('../controller/comment-controller');
const router = express.Router();

router.post('/post/:postId', postComment);
router.get('/:postId', getComments);

module.exports = router;