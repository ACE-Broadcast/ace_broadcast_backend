const express = require('express');
const {message, getMessage} = require('../controller/message-controller');
const router = express.Router();

router.post('/postMsg' , message);
router.get('/getMsg' , getMessage);

module.exports = router;