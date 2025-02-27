const express = require('express');
const {message, getMessage} = require('../controller/message-controller');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/postMsg',  upload.array('images', 5) , message);
router.get('/getMsg' , getMessage);

module.exports = router;